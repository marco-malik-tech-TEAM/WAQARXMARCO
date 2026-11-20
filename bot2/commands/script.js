const fs = require("fs");
const path = require("path");
const brand = require("../utils/brand");
const channel = require("../utils/channel");

module.exports = {
  name: "script",
  aliases: ["repo", "github"],
  description: "Shows information about the bot.",
  async execute(sock, msg) {
    const chat = msg.key.remoteJid;
    const jid =
      chat.endsWith("@lid") && msg.key.remoteJidAlt ? msg.key.remoteJidAlt : chat;
    const name = msg.pushName || msg.verifiedBizName || "User";
    const imgPath = path.join(__dirname, "../assets/script.jpg");

    const caption =
      `Hello 👋 *${name}*,\n\n` +
      `╔═══〔 🔥 ${brand.TEAM.toUpperCase()} 🔥 〕═══╗\n` +
      `║    Official WhatsApp MD Bot\n` +
      `╚═══════════════════════════╝\n\n` +
      `╭───────────────────\n` +
      `│🤖 *Bot:* ${brand.BOT_NAME}\n` +
      `│👨‍💻 *Developer:* ${brand.DEVELOPER}\n` +
      `│👑 *Co-Owner:* ${brand.CO_OWNER}\n` +
      `╰───────────────────\n\n` +
      `📢 *Official Channel:*\n↳ ${brand.CHANNEL_URL}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `❤️ Powered by *${brand.TEAM}*`;

    const contextInfo = await channel.forwardContext(sock);
    if (fs.existsSync(imgPath))
      await sock.sendMessage(
        jid,
        { image: fs.readFileSync(imgPath), caption, contextInfo },
        { quoted: msg },
      );
    else
      await sock.sendMessage(jid, { text: caption, contextInfo }, { quoted: msg });
  },
};
