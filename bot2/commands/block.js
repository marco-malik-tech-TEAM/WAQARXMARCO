const { jidNormalizedUser } = require("@whiskeysockets/baileys"),
  { isOwner } = require("../utils/isOwner"),
  OWNER_NUMBERS = [];
module["exports"] = {
  name: "block",
  description:
    "Block a user (owner only). Usage: .block @user / .block (reply) / .block 2547xxxxxxxx",
  async execute(_0x4be1a8, _0x4fbdb7, _0x23efc4) {
    const _0x383ae5 = _0x4fbdb7["key"]["remoteJid"];
    if (!isOwner(_0x4fbdb7))
      return _0x4be1a8["sendMessage"](
        _0x383ae5,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x4fbdb7 },
      );
    const _0x104231 =
      _0x4fbdb7["message"]?.["extendedTextMessage"]?.["contextInfo"];
    let _0x235e35 =
      _0x104231?.["mentionedJid"]?.[0x0] || _0x104231?.["participant"] || null;
    if (!_0x235e35 && _0x23efc4[0x0]) {
      const _0x4ffc46 = _0x23efc4[0x0]["replace"](/[^0-9]/g, "");
      if (_0x4ffc46) _0x235e35 = _0x4ffc46 + "@s.whatsapp.net";
    }
    if (!_0x235e35)
      return _0x4be1a8["sendMessage"](
        _0x383ae5,
        {
          text: "❌ *Tag someone, reply to their message, or provide a number.*\nUsage: .block @user / .block 2547xxxxxxxx",
        },
        { quoted: _0x4fbdb7 },
      );
    const _0x1c065e = jidNormalizedUser(_0x4be1a8["user"]["id"]);
    if (OWNER_NUMBERS["includes"](_0x235e35))
      return _0x4be1a8["sendMessage"](
        _0x383ae5,
        { text: "*I cannot block my Owner 😡*" },
        { quoted: _0x4fbdb7 },
      );
    if (_0x235e35 === _0x1c065e)
      return _0x4be1a8["sendMessage"](
        _0x383ae5,
        { text: "*I cannot block myself 😡*" },
        { quoted: _0x4fbdb7 },
      );
    try {
      (await _0x4be1a8["updateBlockStatus"](_0x235e35, "block"),
        await _0x4be1a8["sendMessage"](
          _0x383ae5,
          {
            text:
              "✅ *+" + _0x235e35["split"]("@")[0x0] + "* has been blocked.",
          },
          { quoted: _0x4fbdb7 },
        ));
    } catch (_0x29f283) {
      await _0x4be1a8["sendMessage"](
        _0x383ae5,
        { text: "❌ *Error: " + _0x29f283["message"] + "*" },
        { quoted: _0x4fbdb7 },
      );
    }
  },
};
