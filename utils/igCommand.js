"use strict";
/** .ig - Instagram reel / post / carousel downloader */
const fs = require("fs");
const axios = require("axios");
const kit = require("./mediaKit");
const ytdlp = require("./ytdlp");
const { resolveInstagram } = require("./igFetch");
const { sendVideo, sendVideoFile } = require("./videoSend");

const IG_RE = /instagram\.com|instagr\.am/i;
const IG_HEADERS = { Referer: "https://www.instagram.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" };

async function sendImage(sock, chat, url, caption, quoted) {
  const r = await axios.get(url, { responseType: "arraybuffer", timeout: 60000, maxContentLength: 25 * 1024 * 1024, headers: IG_HEADERS });
  const buf = Buffer.from(r.data);
  if (buf.length < 1024 || buf[0] === 0x3c) throw new Error("image download failed");
  await sock.sendMessage(chat, { image: buf, caption }, { quoted });
}

module.exports = {
  name: "ig",
  aliases: ["insta", "instagram"],
  description: "Download Instagram reel/video/post. Usage: .ig <instagram link>",
  async execute(sock, msg, args) {
    const chat = msg.key.remoteJid;
    const link = (args.find((a) => /^https?:\/\//i.test(a)) || args[0] || "").trim();
    if (!link || !IG_RE.test(link))
      return sock.sendMessage(chat, { text: "❌ Usage: .ig <Instagram link>\nExample: .ig https://www.instagram.com/reel/xxxxx/" }, { quoted: msg });

    await sock.sendMessage(chat, { react: { text: "⏳", key: msg.key } }).catch(() => {});
    const status = await sock.sendMessage(chat, { text: "⏳ Loading Instagram media..." }, { quoted: msg });
    const edit = (text) => sock.sendMessage(chat, { text, edit: status.key }).catch(() => {});
    const dir = kit.makeDir("ig");
    const errors = [];

    try {
      let title = "Instagram media";
      let sent = false;

      // ---- 1) direct links (APIs / embed / mirrors) --------------------------
      let media = null;
      try { media = await resolveInstagram(link); }
      catch (e) { errors.push(e.message); console.error("[IG] resolve failed:", e.message); }

      if (media) {
        title = (media.title || title).replace(/\s+/g, " ").slice(0, 200);
        const caption = "📸 *" + title + "*\n\n> _MARCO X WAQAR MD BOT_";
        await edit("⬇️ Downloading video...");
        for (const v of media.videos.slice(0, 4)) {
          try { await sendVideo(sock, chat, v, { title, caption, quoted: msg, headers: IG_HEADERS }); sent = true; break; }
          catch (e) { errors.push(e.message); console.error("[IG] candidate failed (" + (media.source || "?") + "):", e.message); }
        }
        if (!sent && media.images.length) {
          await edit("⬇️ Downloading photos...");
          let n = 0;
          for (const im of media.images.slice(0, 10)) {
            try { await sendImage(sock, chat, im, caption, msg); n++; } catch (e) { errors.push(e.message); }
          }
          sent = n > 0;
        }
      }

      // ---- 2) yt-dlp fallback ---------------------------------------------------
      if (!sent) {
        await edit("🔄 Trying another method...");
        try {
          const file = await ytdlp.download(link, { dir, kind: "instagram", format: "b[ext=mp4]/bv*+ba/b" });
          const size = fs.statSync(file).size;
          await edit("📤 Uploading (" + (size / 1048576).toFixed(1) + " MB)...");
          await sendVideoFile(sock, chat, file, { title, caption: "📸 *" + title + "*\n\n> _MARCO X WAQAR MD BOT_", quoted: msg });
          sent = true;
        } catch (e) { errors.push(e.message); console.error("[IG] yt-dlp failed:", e.message); }
      }

      if (!sent) throw new Error(errors.filter(Boolean).pop() || "no downloadable media found");
      await sock.sendMessage(chat, { react: { text: "✅", key: msg.key } }).catch(() => {});
      return edit("✅ Instagram media downloaded successfully!");
    } catch (e) {
      console.error("[ig] failed:", e.message, "|", errors.join(" || ").slice(0, 400));
      await sock.sendMessage(chat, { react: { text: "❌", key: msg.key } }).catch(() => {});
      return edit("❌ Instagram download failed: " + e.message + "\n\nMake sure the post is *public*. If it keeps failing, add an Instagram cookies.txt (see README_DOWNLOADS.md).");
    } finally {
      kit.rmDir(dir);
    }
  },
};
