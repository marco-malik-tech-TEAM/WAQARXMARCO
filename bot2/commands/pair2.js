const brand = require("../utils/brand");
const sm = require("../utils/sessionManager");
const lastUse = new Map();

module.exports = {
  name: "pair2",
  aliases: ["rent2"],
  description: "Pair a WhatsApp number to Bot 2 (unlimited, anyone can use). Usage: .pair2 <number>",
  async execute(sock, msg, args) {
    const chat = msg.key.remoteJid;
    const sender = msg.key.participant || chat;
    const number = (args.join(" ").match(/\d+/g) || []).join("");
    if (!number || number.length < 8 || number.length > 15)
      return sock.sendMessage(chat, { text: "🔗 *Pair your WhatsApp with Bot 2*\n\nSend your number with country code (no +):\n*.pair2 923001234567*" }, { quoted: msg });

    const now = Date.now();
    if (now - (lastUse.get(sender) || 0) < 20000)
      return sock.sendMessage(chat, { text: "⏳ Please wait a few seconds before the next request." }, { quoted: msg });
    lastUse.set(sender, now);

    const wait = await sock.sendMessage(chat, { text: "⏳ Generating your pairing code, please wait..." }, { quoted: msg });
    try {
      const code = await sm.requestPairing(2, number, "wa:" + sender);
      const pretty = code.match(/.{1,4}/g).join("-");
      await sock.sendMessage(chat, {
        text:
          `🔑 *Pairing code (Bot 2):*\n\n\`${pretty}\`\n\n` +
          `1️⃣ Open WhatsApp\n2️⃣ Settings → Linked Devices → Link a Device\n` +
          `3️⃣ Tap *Link with phone number instead*\n4️⃣ Enter this code\n\n` +
          `⚠️ Enter it *immediately* — it expires in about 60 seconds.\n` +
          `After linking, send *.menu* in any chat to use your bot.\n\n_${brand.FOOTER}_`,
        edit: wait.key,
      });
    } catch (e) {
      console.error("[pair2]", e.message);
      await sock.sendMessage(chat, { text: "⚠️ " + e.message, edit: wait.key });
    }
  },
};
