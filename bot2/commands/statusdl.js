"use strict";
const settingsStore = require("../utils/settingsStore");
const { isOwner } = require("../utils/isOwner");
const statusManager = require("../utils/statusManager");
const { jidNormalizedUser } = require("@whiskeysockets/baileys");

module.exports = {
  name: "statusdl",
  aliases: ["sdl", "savestatus", "statusdownloader"],
  description: "Status downloader. React to any status with an emoji (or reply to it with .statusdl) and it is sent to your chat. Usage: .statusdl on | off",
  async execute(sock, msg, args) {
    if (!isOwner(msg)) return;
    const chat = msg.key.remoteJid;
    const a = (args[0] || "").toLowerCase();
    if (a === "on" || a === "off") {
      settingsStore.set("statusdl", a === "on");
      return sock.sendMessage(chat, { text: "📥 *Status Downloader:* " + (a === "on" ? "ENABLED [🟢]\nReact to any status with an emoji and it will be sent to your chat." : "DISABLED [🔴]") }, { quoted: msg });
    }
    // reply to a status with .statusdl
    const ctx = (msg.message && (msg.message.extendedTextMessage || {}).contextInfo) || {};
    if (ctx.stanzaId && ctx.remoteJid === "status@broadcast") {
      const r = await statusManager.sendStatusTo(sock, ctx.stanzaId, jidNormalizedUser(sock.user.id));
      if (!r.ok) return sock.sendMessage(chat, { text: "❌ " + r.reason }, { quoted: msg });
      return;
    }
    const cur = settingsStore.get("statusdl", true);
    return sock.sendMessage(chat, { text: "📥 *Status Downloader:* " + (cur ? "ENABLED [🟢]" : "DISABLED [🔴]") + "\n\n💡 React to any status with ANY emoji → it is downloaded to your chat.\n💡 Or reply to a status with `.statusdl`.\n💡 `.statusdl on` / `.statusdl off`" }, { quoted: msg });
  },
};
