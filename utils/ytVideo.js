"use strict";
/**
 * Shared implementation of .video / .video2
 *  1. search YouTube (or use the given link)
 *  2. send thumbnail + title, channel, duration, views, upload date
 *  3. download the FULL video (yt-dlp first, API links as fallback), up to 2 GB
 *  4. send it to WhatsApp (playable video, or document when it is large)
 */
const path = require("path");
const yts = require("yt-search");
const kit = require("./mediaKit");
const ytdlp = require("./ytdlp");
const { sendVideoFile, downloadToFile, MAX_BYTES } = require("./videoSend");
const { searchVideo, resolveMp4, isYouTubeUrl } = require("./ytSearch");

const MB = 1024 * 1024;
const QUALITIES = [2160, 1440, 1080, 720, 480, 360, 240, 144];
const DEFAULT_HEIGHT = 720;

const nf = new Intl.NumberFormat("en-US");
const fmtViews = (n) => (typeof n === "number" ? nf.format(n) : "N/A");
const fmtMB = (b) => (b >= 1024 * MB ? (b / 1024 / MB).toFixed(2) + " GB" : (b / MB).toFixed(1) + " MB");

async function getInfo(query) {
  const idMatch = query.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  try {
    if (isYouTubeUrl(query) && idMatch) {
      const v = await yts({ videoId: idMatch[1] });
      if (v && v.title) return { ...v, url: v.url || "https://www.youtube.com/watch?v=" + idMatch[1] };
    } else if (!isYouTubeUrl(query)) {
      const r = await yts(query);
      const v = r && r.videos && r.videos[0];
      if (v) return v;
    }
  } catch (e) { console.error("[VIDEO] yt-search failed:", e.message); }
  // fallback: Keith search / bare link
  const found = await searchVideo(query);
  return found ? { url: found.url, title: found.title } : null;
}

function infoCaption(v, heightLabel) {
  const lines = ["🎬 *" + (v.title || "YouTube Video") + "*", ""];
  if (v.author && v.author.name) lines.push("📺 *Channel:* " + v.author.name);
  if (v.timestamp || v.duration) lines.push("⏱️ *Duration:* " + (v.timestamp || (v.duration && v.duration.timestamp) || "N/A"));
  if (typeof v.views === "number") lines.push("👁️ *Views:* " + fmtViews(v.views));
  if (v.ago) lines.push("📅 *Uploaded:* " + v.ago);
  lines.push("🎞️ *Quality:* up to " + heightLabel + "p");
  lines.push("🔗 " + v.url);
  lines.push("", "⏳ _Downloading the full video, please wait..._", "", "> _MARCO X WAQAR MD BOT_");
  return lines.join("\n");
}

function parseArgs(args) {
  const list = [...args];
  let height = DEFAULT_HEIGHT;
  const last = list[list.length - 1] || "";
  const m = last.match(/^(\d{3,4})p?$/i);
  if (list.length > 1 && m && QUALITIES.includes(Number(m[1]))) { height = Number(m[1]); list.pop(); }
  return { query: list.join(" ").trim(), height };
}

async function viaYtDlp(v, height, dir, onProgress) {
  const ladder = [height, ...[480, 360, 240, 144].filter((h) => h < height)];
  let lastErr;
  for (const h of ladder) {
    try {
      return await ytdlp.download(v.url, { dir, kind: "youtube", format: ytdlp.formatFor(h), onProgress });
    } catch (e) {
      lastErr = e;
      if (e.message !== "FILE_TOO_LARGE") break; // only retry with lower quality when the file is too big
      console.error("[VIDEO] " + h + "p is over 2 GB, trying a lower quality");
    }
  }
  throw lastErr || new Error("yt-dlp failed");
}

async function viaApi(v, dir) {
  const { downloadUrl } = await resolveMp4(v.url);
  const file = path.join(dir, "api_video.bin");
  await downloadToFile(downloadUrl, file, { maxBytes: MAX_BYTES, timeout: 45 * 60 * 1000, headers: { Referer: "https://www.youtube.com/" } });
  return file;
}

/**
 * @param {{prefer?: "ytdlp"|"api"}} opt
 */
async function handleVideo(sock, msg, args, opt = {}) {
  const raw = msg.key.remoteJid;
  const chat = raw.endsWith("@lid") && msg.key.remoteJidAlt ? msg.key.remoteJidAlt : raw;
  const { query, height } = parseArgs(args);
  if (!query)
    return sock.sendMessage(chat, { text: "🎬 Provide a video name or YouTube link!\n\nExamples:\n`.video Blinding Lights`\n`.video Blinding Lights 480`  (quality)\n`.video https://youtu.be/xxxx`" }, { quoted: msg });

  let status;
  try {
    await sock.sendMessage(chat, { react: { text: "🎬", key: msg.key } }).catch(() => {});
    status = await sock.sendMessage(chat, { text: "🔍 Searching *" + query + "*..." }, { quoted: msg });
  } catch (e) { console.error("[VIDEO] init failed:", e.message); return; }
  const edit = (text) => sock.sendMessage(chat, { text, edit: status.key }).catch(() => {});

  const dir = kit.makeDir("yt");
  try {
    const v = await getInfo(query);
    if (!v) return await edit("❌ No results found for: *" + query + "*\nTry a different name or send the YouTube link.");

    // Title / views / thumbnail card
    const card = infoCaption(v, height);
    const thumb = v.thumbnail || v.image;
    let sentCard = false;
    if (thumb) {
      try { await sock.sendMessage(chat, { image: { url: thumb }, caption: card }, { quoted: msg }); sentCard = true; }
      catch (e) { console.error("[VIDEO] thumbnail send failed:", e.message); }
    }
    if (!sentCard) await sock.sendMessage(chat, { text: card }, { quoted: msg }).catch(() => {});

    let lastEdit = 0;
    const onProgress = ({ percent, speed, eta }) => {
      const now = Date.now();
      if (now - lastEdit < 7000) return;
      lastEdit = now;
      const bar = "█".repeat(Math.round(percent / 10)) + "░".repeat(10 - Math.round(percent / 10));
      edit("⬇️ Downloading *" + v.title + "*\n" + bar + " " + percent.toFixed(0) + "%\n⚡ " + speed + "  •  ⏳ " + eta);
    };
    await edit("⬇️ Downloading *" + v.title + "*\n⏳ Starting...");

    const order = opt.prefer === "api" ? ["api", "ytdlp"] : ["ytdlp", "api"];
    let file, errs = [];
    for (const way of order) {
      try {
        file = way === "ytdlp" ? await viaYtDlp(v, height, dir, onProgress) : await viaApi(v, dir);
        if (file) break;
      } catch (e) {
        console.error("[VIDEO] " + way + " failed:", e.message);
        errs.push(e.message);
      }
    }
    if (!file) return await edit("❌ Video download failed.\n" + [...new Set(errs)].slice(0, 2).join("\n") + "\n\nTry again in a minute, or try *.video2*.");

    const size = require("fs").statSync(file).size;
    await edit("📤 Uploading to WhatsApp (" + fmtMB(size) + ")...\n_Large files can take a few minutes._");
    const caption = "🎬 *" + (v.title || "Video") + "*\n📦 " + fmtMB(size) + "\n\n> _MARCO X WAQAR MD BOT_";
    const res = await sendVideoFile(sock, chat, file, { title: v.title, caption, quoted: msg });
    await sock.sendMessage(chat, { react: { text: "✅", key: msg.key } }).catch(() => {});
    return await edit("✅ Successfully sent *" + v.title + "*" + (res.asDocument ? "\n📎 Sent as a file because it is large - tap it to download and play." : ""));
  } catch (e) {
    console.error("[VIDEO] failed:", e.message);
    return await edit("❌ Video failed: " + e.message);
  } finally {
    kit.rmDir(dir);
  }
}

module.exports = { handleVideo };
