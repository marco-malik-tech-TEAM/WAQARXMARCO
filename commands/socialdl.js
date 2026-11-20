"use strict";
const axios = require("axios");
const { fetchMedia, UA } = require("../utils/socialFetch");
const { sendVideo } = require("../utils/videoSend");

const MAX_IMG = 15 * 1024 * 1024;

async function sendImage(sock, chat, url, caption, quoted) {
  const r = await axios.get(url, { responseType: "arraybuffer", timeout: 60000, maxContentLength: MAX_IMG, headers: { "User-Agent": UA } });
  const buf = Buffer.from(r.data);
  if (buf.length < 1024 || buf[0] === 0x3c) throw new Error("image download failed");
  await sock.sendMessage(chat, { image: buf, caption }, { quoted });
}

function makeCmd({ name, aliases, description, platform, match, usage, icon, label }) {
  return {
    name, aliases, description,
    async execute(sock, msg, args) {
      const chat = msg.key.remoteJid;
      const link = (args.find((a) => /^https?:\/\//i.test(a)) || args[0] || "").trim();
      if (!link || !match.test(link))
        return sock.sendMessage(chat, { text: "❌ Usage: " + usage }, { quoted: msg });
      const status = await sock.sendMessage(chat, { text: "⏳ Downloading " + label + "..." }, { quoted: msg });
      const edit = (text) => sock.sendMessage(chat, { text, edit: status.key }).catch(() => {});
      try {
        const media = await fetchMedia(platform, link);
        const caption = icon + " *" + (media.title || label).slice(0, 200) + "*\n\n> _MARCO X WAQAR MD BOT_";
        let sent = 0, lastErr;
        if (media.videos.length) {
          // try each candidate video link until one is a real, playable video
          for (const v of media.videos.slice(0, 4)) {
            try { await sendVideo(sock, chat, v, { title: media.title || label, caption, quoted: msg }); sent = 1; break; }
            catch (e) { lastErr = e; console.error("[" + name + "] video candidate failed:", e.message); }
          }
        }
        if (!sent && media.images.length) {
          for (const im of media.images.slice(0, 10)) {
            try { await sendImage(sock, chat, im, caption, msg); sent++; } catch (e) { lastErr = e; }
          }
        }
        if (!sent) throw lastErr || new Error("no downloadable media found");
        return edit("✅ " + label + " downloaded successfully!");
      } catch (e) {
        console.error("[" + name + "] failed:", e.message);
        return edit("❌ " + label + " download failed: " + e.message);
      }
    },
  };
}

module.exports = [
  makeCmd({ name: "tiktok", aliases: ["tt"], description: "Download TikTok video. Usage: .tiktok <url>", platform: "tiktok", match: /tiktok\.com/i, usage: ".tiktok <TikTok URL>", icon: "🎵", label: "TikTok video" }),
  require("../utils/igCommand"),
  makeCmd({ name: "fb", aliases: ["facebook"], description: "Download Facebook video/reel. Usage: .fb <url>", platform: "facebook", match: /facebook\.com|fb\.watch|fb\.com/i, usage: ".fb <Facebook URL>", icon: "📘", label: "Facebook video" }),
  {
    name: "twitter",
    aliases: ["x", "tw"],
    description: "Download Twitter/X video or image. Usage: .twitter <url>",
    async execute(_0xf3f7d, _0x53f742, _0x174776) {
      const _0x14af29 = _0x53f742["key"]["remoteJid"],
        _0x376158 = _0x174776[0x0];
      if (
        !_0x376158 ||
        !/https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+\/status\/\d+/["test"](
          _0x376158,
        )
      )
        return _0xf3f7d["sendMessage"](
          _0x14af29,
          { text: "❌ Usage: .twitter <Twitter/X post URL>" },
          { quoted: _0x53f742 },
        );
      await _0xf3f7d["sendMessage"](
        _0x14af29,
        { text: "⏳ Downloading Twitter/X media..." },
        { quoted: _0x53f742 },
      );
      try {
        const _0x2eb23e = _0x376158["match"](/\/status\/(\d+)/)?.[0x1];
        if (!_0x2eb23e)
          throw new Error("Could not parse tweet ID from that link.");
        const _0x2d2069 = await axios["get"](
            "https://api.fxtwitter.com/i/status/" + _0x2eb23e,
            { timeout: 0x7530, headers: { "User-Agent": "Mozilla/5.0" } },
          ),
          _0x5c34bc = _0x2d2069["data"]?.["tweet"];
        if (!_0x5c34bc)
          throw new Error("Tweet not found or is from a private account.");
        const _0x535a5a =
            "🐦 *@" +
            (_0x5c34bc["author"]?.["screen_name"] || "Unknown") +
            "*\n\n" +
            (_0x5c34bc["text"] || ""),
          _0x366f77 = _0x5c34bc["media"];
        if (_0x366f77?.["videos"]?.["length"]) {
          const _0x55fc42 = _0x366f77["videos"][0x0];
          await _0xf3f7d["sendMessage"](
            _0x14af29,
            {
              video: { url: _0x55fc42["url"] },
              caption: _0x535a5a,
              gifPlayback: _0x55fc42["type"] === "gif",
            },
            { quoted: _0x53f742 },
          );
        } else {
          if (_0x366f77?.["photos"]?.["length"])
            for (const _0x2086fb of _0x366f77["photos"]) {
              await _0xf3f7d["sendMessage"](
                _0x14af29,
                { image: { url: _0x2086fb["url"] }, caption: _0x535a5a },
                { quoted: _0x53f742 },
              );
            }
          else
            await _0xf3f7d["sendMessage"](
              _0x14af29,
              { text: "🐦 *Tweet (no media)*\n\n" + _0x535a5a },
              { quoted: _0x53f742 },
            );
        }
      } catch (_0x96ba37) {
        const _0x4ca7fd =
          _0x96ba37?.["response"]?.["data"]?.["message"] ||
          _0x96ba37["message"] ||
          "Unknown error";
        await _0xf3f7d["sendMessage"](
          _0x14af29,
          { text: "❌ Twitter download failed: " + _0x4ca7fd },
          { quoted: _0x53f742 },
        );
      }
    },
  },
];
