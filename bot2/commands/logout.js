const { isOwner } = require("../utils/isOwner"),
  { isDev } = require("../utils/isDev");
module["exports"] = {
  name: "logout",
  aliases: ["disconnect", "logoff"],
  description:
    "Logs the bot out of WhatsApp, requiring re-pairing (owner/developer only, destructive).",
  async execute(_0x476c33, _0x31816e, _0x240091) {
    const _0x3edb26 = _0x31816e["key"]["remoteJid"];
    if (!isOwner(_0x31816e) && !isDev(_0x31816e))
      return _0x476c33["sendMessage"](
        _0x3edb26,
        { text: "❌ Only the bot owner can use this command." },
        { quoted: _0x31816e },
      );
    if (_0x240091[0x0]?.["toLowerCase"]() !== "ok")
      return _0x476c33["sendMessage"](
        _0x3edb26,
        {
          text: "⚠️ This will log the bot out of WhatsApp completely. You will need to re-pair.\n\nType *.logout ok* to proceed.",
        },
        { quoted: _0x31816e },
      );
    (await _0x476c33["sendMessage"](
      _0x3edb26,
      { text: "👋 Logging out..." },
      { quoted: _0x31816e },
    ),
      await _0x476c33["logout"]());
  },
};
