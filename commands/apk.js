"use strict";
/**
 * .apk <app name | package id>
 * Searches Aptoide (public API, no captcha / Cloudflare) and sends the real
 * APK file to WhatsApp - up to 2000 MB (2 GB).
 * (APKMirror was removed: it blocks servers with Cloudflare, which caused the 403 errors.)
 */
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const kit = require("../utils/mediaKit");
const { downloadToFile, sendDocumentFile } = require("../utils/videoSend");

const MB = 1024 * 1024;
const MAX_APK_BYTES = 2000 * MB; // 2 GB limit requested
const HOSTS = ["https://ws75.aptoide.com", "https://ws2.aptoide.com"];
const UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";

const fmtSize = (b) => (b >= 1024 * MB ? (b / 1024 / MB).toFixed(2) + " GB" : (b / MB).toFixed(1) + " MB");
const fmtNum = (n) => (typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "N/A");

async function searchAptoide(query) {
  let lastErr;
  for (const host of HOSTS) {
    try {
      const r = await axios.get(host + "/api/7/apps/search", {
        params: { query, limit: 7 },
        timeout: 20000,
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
      const list = r.data && r.data.datalist && r.data.datalist.list;
      if (Array.isArray(list) && list.length) return list.filter((a) => a && a.file && (a.file.path || a.file.path_alt));
      lastErr = new Error("no results");
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("Aptoide is not reachable");
}

function pickBest(list, query) {
  const q = query.toLowerCase();
  return list.find((a) => String(a.package).toLowerCase() === q)
    || list.find((a) => String(a.name).toLowerCase() === q)
    || list[0];
}

module.exports = {
  name: "apk",
  aliases: ["app", "apkdl"],
  description: "Download an Android APK (up to 2GB). Usage: .apk <app name or package id>",
  async execute(sock, msg, args) {
    const chat = msg.key.remoteJid;
    const query = args.join(" ").trim();
    if (!query)
      return sock.sendMessage(chat, { text: "📱 *APK Downloader*\n\nUsage: `.apk <app name>`\nExample: `.apk whatsapp`\nExact app: `.apk com.whatsapp`" }, { quoted: msg });

    await sock.sendMessage(chat, { react: { text: "📱", key: msg.key } }).catch(() => {});
    const status = await sock.sendMessage(chat, { text: '🔍 Searching APK for "' + query + '"...' }, { quoted: msg });
    const edit = (text) => sock.sendMessage(chat, { text, edit: status.key }).catch(() => {});
    const dir = kit.makeDir("apk");

    try {
      const list = await searchAptoide(query).catch((e) => { throw new Error("APK search failed: " + (e.message || e)); });
      if (!list.length) return await edit("❌ No APK found for *" + query + "*.\nTry the exact app name or its package id.");

      const app = pickBest(list, query);
      const url = app.file.path || app.file.path_alt;
      const size = Number(app.file.filesize || app.size || 0);
      const version = (app.file.vername || "").toString();
      const name = String(app.name || query);
      const rating = app.stats && app.stats.rating && app.stats.rating.avg;

      const card = [
        "📱 *" + name + "*", "",
        "📦 *Package:* " + app.package,
        "🆚 *Version:* " + (version || "N/A"),
        "💾 *Size:* " + (size ? fmtSize(size) : "N/A"),
        "⬇️ *Downloads:* " + fmtNum(app.stats && app.stats.downloads),
        ...(rating ? ["⭐ *Rating:* " + Number(rating).toFixed(1)] : []),
        ...(app.updated ? ["📅 *Updated:* " + String(app.updated).slice(0, 10)] : []),
      ];
      const others = list.filter((a) => a !== app).slice(0, 4);
      if (others.length) card.push("", "🔎 *Other results* (use `.apk <package>`):", ...others.map((a) => "• " + a.name + " — " + a.package));
      card.push("", "⏳ _Downloading the APK, please wait..._", "", "> _MARCO X WAQAR MD BOT_");

      if (app.icon) {
        try { await sock.sendMessage(chat, { image: { url: app.icon }, caption: card.join("\n") }, { quoted: msg }); }
        catch (_) { await sock.sendMessage(chat, { text: card.join("\n") }, { quoted: msg }); }
      } else {
        await sock.sendMessage(chat, { text: card.join("\n") }, { quoted: msg });
      }

      if (size && size > MAX_APK_BYTES)
        return await edit("⚠️ *" + name + "* is " + fmtSize(size) + " - bigger than the 2 GB limit.\n🔗 Direct link:\n" + url);

      await edit("⬇️ Downloading *" + name + "* (" + (size ? fmtSize(size) : "size unknown") + ")...");
      const file = path.join(dir, "app.apk");
      await downloadToFile(url, file, { maxBytes: MAX_APK_BYTES, timeout: 45 * 60 * 1000, headers: { "User-Agent": UA } });

      const bytes = fs.statSync(file).size;
      await edit("📤 Uploading to WhatsApp (" + fmtSize(bytes) + ")...");
      const safe = (name + (version ? "_v" + version : "")).replace(/[^\w.\-]+/g, "_").slice(0, 80);
      await sendDocumentFile(sock, chat, file, {
        fileName: safe + ".apk",
        mimetype: "application/vnd.android.package-archive",
        caption: "📱 *" + name + "*\n🆚 " + (version || "latest") + "  •  💾 " + fmtSize(bytes) + "\n\n> _MARCO X WAQAR MD BOT_",
        quoted: msg,
      });
      await sock.sendMessage(chat, { react: { text: "✅", key: msg.key } }).catch(() => {});
      return await edit("✅ APK sent successfully: *" + name + "*");
    } catch (e) {
      console.error("[APK ERROR]", e.response && e.response.status, e.message);
      return await edit("❌ APK download failed: " + e.message);
    } finally {
      kit.rmDir(dir);
    }
  },
};
