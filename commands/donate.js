const brand = require("../utils/brand");

module.exports = {
  name: "donate",
  aliases: ["support", "fund"],
  description: "Support the development of the bot.",
  async execute(sock, msg) {
    const text =
      `╭━━〔 ❤️ SUPPORT ${brand.BOT_NAME} 〕━━⬣\n\n` +
      `Thank you for using *${brand.BOT_NAME}*!\n\n` +
      `To support the project, stay connected with us and share the bot with your friends.\n\n` +
      `📢 *Official Channel*\n${brand.CHANNEL_URL}\n\n` +
      `_Powered by ${brand.TEAM}_`;
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  },
};
