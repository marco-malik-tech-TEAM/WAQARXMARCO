"use strict";
const axios = require("axios");
const { jidNormalizedUser } = require("@whiskeysockets/baileys");

const digits = (j) => String(j || "").split("@")[0].split(":")[0].replace(/\D/g, "");

/** Collect every possible JID of the target (phone-number JID first, then LID). */
function candidates(sock, msg, args) {
  const chat = msg.key.remoteJid;
  const k = msg.key;
  const ctx =
    (msg.message &&
      (msg.message.extendedTextMessage ||
        msg.message.imageMessage ||
        msg.message.videoMessage ||
        {}).contextInfo) ||
    {};
  const list = [];
  const raw = (args[0] || "").replace(/[^0-9]/g, "");
  if (raw.length >= 7) list.push(raw + "@s.whatsapp.net");
  if (ctx.mentionedJid && ctx.mentionedJid[0]) list.push(ctx.mentionedJid[0]);
  if (ctx.participantPn || ctx.participantAlt || ctx.participant) {
    list.push(ctx.participantPn, ctx.participantAlt, ctx.participant);
  }
  const me = sock.user && sock.user.id ? jidNormalizedUser(sock.user.id) : null;
  const meLid = sock.user && sock.user.lid ? jidNormalizedUser(sock.user.lid) : null;
  if (!list.filter(Boolean).length) {
    if (chat.endsWith("@g.us")) {
      // group: the person who wrote the command
      if (k.fromMe) list.push(me, meLid);
      else list.push(k.participantPn, k.participantAlt, k.participant);
    } else if (k.fromMe) {
      // your own DM: the other person (or yourself in "message yourself")
      list.push(k.remoteJidAlt, chat);
    } else {
      list.push(k.remoteJidAlt, k.participantPn, chat);
    }
  }
  return [...new Set(list.filter(Boolean).map((j) => jidNormalizedUser(j)))];
}

async function fetchPicture(sock, jid) {
  for (const type of ["image", "preview"]) {
    try {
      const url = await sock.profilePictureUrl(jid, type, 15000);
      if (url) return url;
    } catch (_) {}
  }
  return null;
}

module.exports = {
  name: "getpfp",
  aliases: ["pp", "dp", "profilepic"],
  description: "Get a profile picture. Usage: .pp (yourself/the sender) | .pp 923001234567 | .pp @user | reply to a message with .pp",
  async execute(sock, msg, args) {
    const chat = msg.key.remoteJid;
    const jids = candidates(sock, msg, args);
    let url = null, used = null;
    for (const j of jids) {
      url = await fetchPicture(sock, j);
      if (url) { used = j; break; }
    }
    if (!url) {
      return sock.sendMessage(chat, { text: "❌ No profile picture found.\nThe user has no photo, or hides it from everyone." }, { quoted: msg });
    }
    const caption = "🖼 *Profile picture*" + (used ? " of @" + digits(used) : "") + "\n\n> _MARCO X WAQAR MD BOT_";
    try {
      const r = await axios.get(url, { responseType: "arraybuffer", timeout: 20000, headers: { "User-Agent": "Mozilla/5.0" } });
      await sock.sendMessage(chat, { image: Buffer.from(r.data), caption, mentions: used ? [used] : [] }, { quoted: msg });
    } catch (_) {
      // fall back to letting WhatsApp fetch the URL itself
      await sock.sendMessage(chat, { image: { url }, caption, mentions: used ? [used] : [] }, { quoted: msg });
    }
  },
};
