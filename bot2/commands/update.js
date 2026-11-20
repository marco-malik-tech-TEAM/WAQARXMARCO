const brand = require("../utils/brand");

// The original update command downloaded code from the previous developer's
// GitHub repository, which would overwrite this bot's branding. Updates are
// now done by replacing the bot files yourself, so both commands just report that.
const notice =
  `ℹ️ *${brand.BOT_NAME}*\n\n` +
  `Automatic updates are turned off for this bot.\n` +
  `Follow our channel for news about new versions:\n${brand.CHANNEL_URL}`;

const makeCmd = (name, aliases, description) => ({
  name,
  aliases,
  description,
  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, { text: notice }, { quoted: msg });
  },
});

module.exports = [
  makeCmd("update", ["upgrade"], "Shows update information."),
  makeCmd("updatenow", ["upgradenow"], "Shows update information."),
];
