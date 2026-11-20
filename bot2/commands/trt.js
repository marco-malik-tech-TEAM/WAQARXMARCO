module["exports"] = {
  name: "trt",
  description:
    "Auto-detect and translate a replied message to English. Usage: reply to text with .trt",
  async execute(_0x2c0216, _0x137b88) {
    const _0x4034fe = _0x137b88["key"]["remoteJid"],
      _0x3c49ff =
        _0x137b88["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0xa36204 = _0x3c49ff?.["quotedMessage"],
      _0x225e0c =
        _0xa36204?.["conversation"] ||
        _0xa36204?.["extendedTextMessage"]?.["text"];
    if (!_0x225e0c)
      return _0x2c0216["sendMessage"](
        _0x4034fe,
        { text: "❌ Reply to a text message with .trt" },
        { quoted: _0x137b88 },
      );
    try {
      const { franc: _0x16089d } = require("franc-min"),
        _0x3a4fb3 = require("langs"),
        _0x15b800 = _0x16089d(_0x225e0c),
        _0x4b5eaa = _0x3a4fb3["where"]("3", _0x15b800),
        _0xf514bd = _0x4b5eaa ? _0x4b5eaa["name"] : "unknown",
        _0x577402 = await fetch(
          "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(_0x225e0c) +
            "&langpair=autodetect|en",
        ),
        _0x510d98 = await _0x577402["json"](),
        _0x9ca515 = _0x510d98?.["responseData"]?.["translatedText"];
      if (!_0x9ca515)
        return _0x2c0216["sendMessage"](
          _0x4034fe,
          { text: "❌ Translation failed." },
          { quoted: _0x137b88 },
        );
      const _0x194754 =
        "🌐 *Translation*\n" +
        ("🏳️ From: " + _0xf514bd + "\x0a") +
        "🏳️ To: english\n\n" +
        _0x9ca515;
      await _0x2c0216["sendMessage"](
        _0x4034fe,
        { text: _0x194754 },
        { quoted: _0x137b88 },
      );
    } catch (_0x3415a4) {
      (console["error"](_0x3415a4),
        await _0x2c0216["sendMessage"](
          _0x4034fe,
          { text: "❌ Error translating: " + _0x3415a4["message"] },
          { quoted: _0x137b88 },
        ));
    }
  },
};
