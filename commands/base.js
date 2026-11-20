const { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "base",
  aliases: ["base64", "encodebase64"],
  description: "Encodes text or quoted message to Base64.",
  async execute(_0x497794, _0x8bd069, _0x438e4d = []) {
    console["log"]("[BASE] execute started");
    const _0x456473 = _0x8bd069["key"]["remoteJid"],
      _0x26c8b4 =
        _0x456473["endsWith"]("@lid") && _0x8bd069["key"]["remoteJidAlt"]
          ? _0x8bd069["key"]["remoteJidAlt"]
          : _0x456473;
    if (!isOwner(_0x8bd069) && !isSudo(_0x8bd069))
      return _0x497794["sendMessage"](
        _0x26c8b4,
        { text: "*Command meant for the owner*" },
        { quoted: _0x8bd069 },
      );
    let _0x5b5eea = _0x438e4d["join"]("\x20");
    const _0x54634f =
      _0x8bd069["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
        "quotedMessage"
      ];
    !_0x5b5eea &&
      _0x54634f &&
      (_0x5b5eea =
        _0x54634f["conversation"] ||
        _0x54634f["extendedTextMessage"]?.["text"] ||
        "");
    if (!_0x5b5eea) {
      const _0x2060ba =
        "❌ *Please provide text or reply to a message to encode!*\n\n*Usage:* `.base hello world`";
      return await _0x497794["sendMessage"](
        _0x26c8b4,
        { text: _0x2060ba },
        { quoted: _0x8bd069 },
      );
    }
    try {
      const _0x168059 = Buffer["from"](_0x5b5eea, "utf-8")["toString"](
          "base64",
        ),
        _0x538be0 = "🔒 *Base64 Encoded Result:*\n\n" + _0x168059;
      await _0x497794["sendMessage"](
        _0x26c8b4,
        { text: _0x538be0 },
        { quoted: _0x8bd069 },
      );
    } catch (_0x3b23d6) {
      (console["error"]("[BASE] Error:", _0x3b23d6),
        await _0x497794["sendMessage"](
          _0x26c8b4,
          { text: "⚠️ *Failed to encode text.*" },
          { quoted: _0x8bd069 },
        ));
    }
  },
};
