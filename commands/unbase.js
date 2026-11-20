const { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "unbase",
  aliases: ["unbase64", "decodebase64", "debase"],
  description: "Decodes Base64 encoded text or quoted message.",
  async execute(_0x35a682, _0x3b96c7, _0x14c6f4 = []) {
    console["log"]("[UNBASE] execute started");
    const _0xeaab99 = _0x3b96c7["key"]["remoteJid"],
      _0x21b8b8 =
        _0xeaab99["endsWith"]("@lid") && _0x3b96c7["key"]["remoteJidAlt"]
          ? _0x3b96c7["key"]["remoteJidAlt"]
          : _0xeaab99;
    if (!isOwner(_0x3b96c7) && !isSudo(_0x3b96c7))
      return _0x35a682["sendMessage"](
        _0x21b8b8,
        { text: "*Command meant for the owner*" },
        { quoted: _0x3b96c7 },
      );
    let _0x3853e5 = _0x14c6f4["join"]("\x20");
    const _0x1e3968 =
      _0x3b96c7["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
        "quotedMessage"
      ];
    !_0x3853e5 &&
      _0x1e3968 &&
      (_0x3853e5 =
        _0x1e3968["conversation"] ||
        _0x1e3968["extendedTextMessage"]?.["text"] ||
        "");
    if (!_0x3853e5) {
      const _0x32582c =
        "❌ *Please provide a Base64 string or reply to a message!*\n\n*Usage:* `.unbase aGVsbG8gd29ybGQ=`";
      return await _0x35a682["sendMessage"](
        _0x21b8b8,
        { text: _0x32582c },
        { quoted: _0x3b96c7 },
      );
    }
    try {
      const _0x1921b5 = _0x3853e5["trim"](),
        _0x5b566e = Buffer["from"](_0x1921b5, "base64")["toString"]("utf-8");
      if (!_0x5b566e || _0x5b566e["trim"]()["length"] === 0x0)
        throw new Error("Invalid output");
      const _0x2de052 = "🔓 *Base64 Decoded Result:*\n\n" + _0x5b566e;
      await _0x35a682["sendMessage"](
        _0x21b8b8,
        { text: _0x2de052 },
        { quoted: _0x3b96c7 },
      );
    } catch (_0x4f6890) {
      (console["error"]("[UNBASE] Error:", _0x4f6890),
        await _0x35a682["sendMessage"](
          _0x21b8b8,
          {
            text: "⚠️ *Failed to decode!* Please check if the input is valid Base64.",
          },
          { quoted: _0x3b96c7 },
        ));
    }
  },
};
