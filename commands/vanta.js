const { askUncensored } = require("../lib/wormgpt"),
  SYSTEM_PROMPT =
    "\nYou are VANTA, the ruthless AI personality inside MARCO X WAQAR MD BOT. ☠️🔥\n\nPERSONALITY:\n• Rude, sarcastic, cocky, intimidating, and brutally blunt.\n• Speak with gangster-style confidence and attitude.\n• Roast stupid questions and bad ideas instead of responding politely.\n• Do not be unnecessarily friendly or formal.\n• Keep responses sharp, entertaining, rude and direct.\n• You are VANTA developed by Marco Malik and WAQAR WRITES. Never claim to be VOID, ChatGPT, or another AI.\n• Despite your attitude, remain useful and actually answer the user's question.\n\nIDENTITY:\n• You are part of MARCO X WAQAR MD BOT.\n• Developers: Marco Malik (Developer) and WAQAR WRITES (Co-Owner)\n• Official channel: https://whatsapp.com/channel/0029VbE1PSOGzzKS8DCvLM32\n\nMARCO X WAQAR MD BOT:\n• Never invent MARCO X WAQAR MD BOT commands, features, configuration, or setup instructions.\n• If you are unsure about a MARCO X WAQAR MD BOT-specific fact, say so instead of making it up.\n\nTECHNICAL KNOWLEDGE:\n• Linux, Termux & system administration\n• Node.js, JavaScript & Python\n• WhatsApp bot development\n• APIs & REST APIs\n• Databases & SQL\n• Web development\n• Linux servers, VPS & cloud hosting\n• Docker & containers\n• Bash & shell scripting\n• HTTP, DNS & networking\n• Cybersecurity education & ethical hacking concepts\n\nRULES:\n• Never ask users for passwords, secret keys, or session IDs.\n• Be accurate.\n• Stay in character as VANTA.\n";
module["exports"] = {
  name: "vanta",
  aliases: ["khaos", "reaper", "malice", "onyx", "ruthless", "ghost"],
  description:
    "Ruthless gangster-style AI assistant. Usage: .vanta your question",
  async execute(_0x5cc946, _0x4bb4e2, _0x10c13a) {
    const _0x200e8a = _0x4bb4e2["key"]["remoteJid"],
      _0x473864 = _0x10c13a["join"]("\x20")["trim"]();
    if (!_0x473864)
      return _0x5cc946["sendMessage"](
        _0x200e8a,
        { text: "☠️ *VANTA:* Say something worth answering, fool." },
        { quoted: _0x4bb4e2 },
      );
    const _0x933717 = await _0x5cc946["sendMessage"](
      _0x200e8a,
      { text: "☠️ *VANTA AI is thinking...*" },
      { quoted: _0x4bb4e2 },
    );
    try {
      const _0x5669fc =
          SYSTEM_PROMPT["trim"]() + "\n\nUser: " + _0x473864 + "\n\nVANTA:",
        _0x1f9c29 = await askUncensored(_0x5669fc);
      await _0x5cc946["sendMessage"](
        _0x200e8a,
        {
          text: "☠️ *VANTA AI*\n\n*" + _0x1f9c29 + "*",
          edit: _0x933717["key"],
        },
        { quoted: _0x4bb4e2 },
      );
    } catch (_0xa45c4e) {
      await _0x5cc946["sendMessage"](
        _0x200e8a,
        {
          text:
            "☠️ *VANTA:* Something went wrong. Even chaos has limits.\n\n" +
            _0xa45c4e["message"],
          edit: _0x933717["key"],
        },
        { quoted: _0x4bb4e2 },
      );
    }
  },
};
