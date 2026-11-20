"use strict";
const settingsStore = require("../utils/settingsStore");
const { isOwner } = require("../utils/isOwner");

module.exports = {
  name: "autostatusreply",
  aliases: ["statusreply", "asr"],
  description: "Auto-reply to every contact status (\"Seen your status by MARCO X WAQAR MD BOT\"). Usage: .autostatusreply on | off",
  async execute(sock, msg, args) {
    if (!isOwner(msg)) return;
    const chat = msg.key.remoteJid;
    const a = (args[0] || "").toLowerCase();
    if (a === "on" || a === "off") {
      settingsStore.set("autostatusreply", a === "on");
      return sock.sendMessage(chat, { text: "💬 *Auto Status Reply:* " + (a === "on" ? "ENABLED [🟢]" : "DISABLED [🔴]") }, { quoted: msg });
    }
    const cur = settingsStore.get("autostatusreply", false);
    return sock.sendMessage(chat, { text: "💬 *Auto Status Reply:* " + (cur ? "ENABLED [🟢]" : "DISABLED [🔴]") + "\n\n💡 Use `.autostatusreply on` or `.autostatusreply off`" }, { quoted: msg });
  },
};
