const brand = require("../utils/brand");

module.exports = {
  name: "zip",
  aliases: ["botzip", "sourcecode", "getzip"],
  description: "Where to get the bot.",
  async execute(sock, msg) {
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text:
          `📦 *${brand.BOT_NAME}*\n\n` +
          `Join our official channel for the latest bot files and updates:\n${brand.CHANNEL_URL}\n\n` +
          `_Powered by ${brand.TEAM}_`,
      },
      { quoted: msg },
    );
  },
};
