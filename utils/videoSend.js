"use strict";
/**
 * Reliable video / file sending - up to ~2 GB.
 *
 * - Files are streamed to disk (never held fully in RAM) and sent to
 *   WhatsApp from the file path, so big downloads do not crash the bot.
 * - Videos up to INLINE_MAX are sent as normal playable video messages
 *   (re-encoded to H.264/AAC only when needed and the file is small enough).
 * - Bigger videos are sent as an .mp4 document (WhatsApp allows up to 2 GB for
 *   documents); the person taps it to download and play it.
 */
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { pipeline } = require("stream/promises");
const kit = require("./mediaKit");

const MB = 1024 * 1024;
const MAX_BYTES = 2000 * MB; // 2 GB hard limit
const INLINE_MAX = 100 * MB; // above this: send as document
const REENCODE_MAX = 300 * MB; // never re-encode files bigger than this (too slow)

async function downloadToFile(url, file, { maxBytes = MAX_BYTES, headers = {}, timeout = 0 } = {}) {
  const res = await axios.get(url, {
    responseType: "stream",
    timeout: 60000, // connect / first byte
    maxRedirects: 8,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: { "User-Agent": kit.UA, Accept: "*/*", ...headers },
  });
  const declared = parseInt(res.headers["content-length"] || "0", 10);
  if (declared && declared > maxBytes) {
    res.data.destroy();
    throw new Error("file is too large (" + (declared / MB).toFixed(0) + " MB, limit " + (maxBytes / MB).toFixed(0) + " MB)");
  }
  const ctype = String(res.headers["content-type"] || "");
  if (/text\/html|application\/json/i.test(ctype)) {
    res.data.destroy();
    throw new Error("source returned a web page instead of a file");
  }
  let got = 0;
  res.data.on("data", (c) => {
    got += c.length;
    if (got > maxBytes) res.data.destroy(new Error("file exceeds the " + (maxBytes / MB).toFixed(0) + " MB limit"));
  });
  let timer;
  if (timeout) timer = setTimeout(() => res.data.destroy(new Error("download timed out")), timeout);
  try { await pipeline(res.data, fs.createWriteStream(file)); }
  finally { if (timer) clearTimeout(timer); }
  if (got < 1024) throw new Error("downloaded file is too small / invalid");
  return got;
}

async function makeCompatible(input, output) {
  await kit.ff(
    [
      "-y", "-i", input,
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
      "-pix_fmt", "yuv420p",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
      "-movflags", "+faststart",
      output,
    ],
    30 * 60 * 1000,
  );
}

function isMp4File(f) {
  const fd = fs.openSync(f, "r");
  try {
    const b = Buffer.alloc(12);
    fs.readSync(fd, b, 0, 12, 0);
    return b.subarray(4, 8).toString("latin1") === "ftyp";
  } finally { fs.closeSync(fd); }
}

const safeName = (t, fb) => String(t || fb).replace(/[\/\\:*?"<>|\n\r]/g, "").trim().slice(0, 120) || fb;

/**
 * Send a local video file. Does not delete the file (caller owns it).
 * @returns {Promise<{asDocument:boolean, bytes:number}>}
 */
async function sendVideoFile(sock, jid, file, { title = "Video", caption, quoted, forceDocument = false } = {}) {
  let size = fs.statSync(file).size;
  if (size < 1024) throw new Error("downloaded file is empty");
  if (size > MAX_BYTES) throw new Error("video is bigger than 2 GB (" + (size / MB).toFixed(0) + " MB)");

  let info = null;
  try { info = await kit.probe(file); } catch (_) {}
  if (!info || !info.hasVideo) throw new Error("the downloaded file is not a valid video");

  let finalFile = file;
  const alreadyOk = isMp4File(file) && info.vcodec === "h264" && info.yuv420 && (!info.hasAudio || info.acodec === "aac");
  if (!alreadyOk && size <= REENCODE_MAX) {
    const out = path.join(path.dirname(file), "compat_" + path.basename(file, path.extname(file)) + ".mp4");
    try {
      await makeCompatible(file, out);
      if (fs.existsSync(out) && fs.statSync(out).size > 10 * 1024) { finalFile = out; size = fs.statSync(out).size; }
    } catch (e) { console.error("[VIDEO] re-encode failed:", e.message); }
  }

  const name = safeName(title, "video") + ".mp4";
  const text = caption || "🎬 *" + title + "*";
  const opts = quoted ? { quoted } : {};
  const asDocument = forceDocument || size > INLINE_MAX || (finalFile === file && !isMp4File(file));

  if (asDocument) {
    await sock.sendMessage(jid, { document: { url: finalFile }, mimetype: "video/mp4", fileName: name, caption: text }, opts);
  } else {
    await sock.sendMessage(jid, {
      video: { url: finalFile },
      mimetype: "video/mp4",
      fileName: name,
      ...(info.w ? { width: info.w, height: info.h } : {}),
      ...(info.seconds ? { seconds: Math.round(info.seconds) } : {}),
      caption: text,
    }, opts);
  }
  return { asDocument, bytes: size };
}

/** Download a direct media URL (streamed, up to 2 GB) and send it. */
async function sendVideo(sock, jid, url, { title = "Video", caption, quoted, headers, maxBytes } = {}) {
  const dir = kit.makeDir("vid");
  try {
    const raw = path.join(dir, "raw.bin");
    await downloadToFile(url, raw, { headers, maxBytes, timeout: 45 * 60 * 1000 });
    return await sendVideoFile(sock, jid, raw, { title, caption, quoted });
  } finally {
    kit.rmDir(dir);
  }
}

/** Send any local file as a WhatsApp document (APKs, zips, ...). */
async function sendDocumentFile(sock, jid, file, { fileName, mimetype, caption, quoted } = {}) {
  const size = fs.statSync(file).size;
  if (size > MAX_BYTES) throw new Error("file is bigger than 2 GB (" + (size / MB).toFixed(0) + " MB)");
  await sock.sendMessage(
    jid,
    { document: { url: file }, mimetype: mimetype || "application/octet-stream", fileName: fileName || path.basename(file), caption },
    quoted ? { quoted } : {},
  );
  return size;
}

module.exports = { sendVideo, sendVideoFile, sendDocumentFile, downloadToFile, MAX_BYTES, INLINE_MAX };
