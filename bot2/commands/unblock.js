const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "unblock",
  description:
    "Unblock a user (owner only). Usage: .unblock @user / .unblock (reply) / .unblock 2547xxxxxxxx",
  async execute(_0x58e20f, _0x5417b7, _0x44d8d2) {
    const _0x211a2a = _0x5417b7["key"]["remoteJid"];
    if (!isOwner(_0x5417b7))
      return _0x58e20f["sendMessage"](
        _0x211a2a,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x5417b7 },
      );
    const _0x1802b8 =
      _0x5417b7["message"]?.["extendedTextMessage"]?.["contextInfo"];
    let _0x4b2145 =
      _0x1802b8?.["mentionedJid"]?.[0x0] || _0x1802b8?.["participant"] || null;
    if (!_0x4b2145 && _0x44d8d2[0x0]) {
      const _0x2b6f47 = _0x44d8d2[0x0]["replace"](/[^0-9]/g, "");
      if (_0x2b6f47) _0x4b2145 = _0x2b6f47 + "@s.whatsapp.net";
    }
    if (!_0x4b2145)
      return _0x58e20f["sendMessage"](
        _0x211a2a,
        {
          text: "❌ *Tag someone, reply to their message, or provide a number.*\nUsage: .unblock @user / .unblock 2547xxxxxxxx",
        },
        { quoted: _0x5417b7 },
      );
    try {
      (await _0x58e20f["updateBlockStatus"](_0x4b2145, "unblock"),
        await _0x58e20f["sendMessage"](
          _0x211a2a,
          {
            text:
              "✅ *+" + _0x4b2145["split"]("@")[0x0] + "* has been unblocked.",
          },
          { quoted: _0x5417b7 },
        ));
    } catch (_0x28caa8) {
      await _0x58e20f["sendMessage"](
        _0x211a2a,
        { text: "❌ *Error: " + _0x28caa8["message"] + "*" },
        { quoted: _0x5417b7 },
      );
    }
  },
};
