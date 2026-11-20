const config = require("../config/config");
const brand = require("../utils/brand");

module.exports = {
  name: "owner",
  aliases: ["master", "dev", "developer"],
  description: "Shows the bot owner's contact info.",
  async execute(sock, msg) {
    const chat = msg.key.remoteJid;
    const display = `${brand.DEVELOPER} & ${brand.CO_OWNER}`;
    // OWNER_NUMBER may hold one number or several separated by commas.
    const numbers = String(config.ownerNumber || "")
      .split(",")
      .map((n) => n.replace(/\D/g, ""))
      .filter(Boolean);

    const text =
      `╭──〔 👑 OWNER INFO 〕──╮\n` +
      `🤖 *Bot:* ${brand.BOT_NAME}\n` +
      `👨‍💻 *Developer:* ${brand.DEVELOPER}\n` +
      `👑 *Co-Owner:* ${brand.CO_OWNER}\n` +
      numbers.map((n) => `📱 *Contact:* +${n}\n`).join("") +
      `🌐 *Website:* ${brand.WEBSITE_URL}\n` +
      `📢 *Channel:* ${brand.CHANNEL_URL}\n` +
      `_${brand.FOOTER}_\n` +
      `╰──────────────────╯`;
    await sock.sendMessage(chat, { text }, { quoted: msg });

    if (numbers.length) {
      const vcard =
        "BEGIN:VCARD\nVERSION:3.0\n" +
        `FN:${display}\nORG:${brand.BOT_NAME};\n` +
        numbers.map((n) => `TEL;type=CELL;type=VOICE;waid=${n}:+${n}`).join("\n") +
        "\nEND:VCARD";
      await sock.sendMessage(
        chat,
        { contacts: { displayName: display, contacts: [{ vcard }] } },
        { quoted: msg },
      );
    }
  },
};
