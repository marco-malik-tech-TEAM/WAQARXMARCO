const axios = require("axios");
module["exports"] = {
  name: "mix",
  description: "Mix two emojis into one image. Usage: .mix 😂 😭",
  async execute(_0x91fc32, _0x2eb70d, _0x5b24c4) {
    const _0x1a46ca = _0x2eb70d["key"]["remoteJid"],
      _0x195116 = _0x5b24c4["join"]("\x20")["trim"](),
      _0x3930e9 = [..._0x195116]["filter"]((_0x2a955e) =>
        /\p{Extended_Pictographic}/u["test"](_0x2a955e),
      );
    if (_0x3930e9["length"] < 0x2)
      return _0x91fc32["sendMessage"](
        _0x1a46ca,
        { text: "❌ Usage: .mix 😂 😭 (two emojis)" },
        { quoted: _0x2eb70d },
      );
    const [_0xa37f1, _0x30991d] = _0x3930e9,
      _0x58a9d6 = _0xa37f1["codePointAt"](0x0)["toString"](0x10),
      _0x5bccb7 = _0x30991d["codePointAt"](0x0)["toString"](0x10);
    try {
      const _0x18cd8c =
          "https://emojik.vercel.app/s/" +
          _0x58a9d6 +
          "_" +
          _0x5bccb7 +
          "?size=256",
        _0x6e0fad = await axios["head"](_0x18cd8c, {
          validateStatus: () => !![],
          timeout: 0x2710,
        });
      if (_0x6e0fad["status"] !== 0xc8)
        return _0x91fc32["sendMessage"](
          _0x1a46ca,
          {
            text:
              "❌ No mix found for " +
              _0xa37f1 +
              _0x30991d +
              ". Try a different pair.",
          },
          { quoted: _0x2eb70d },
        );
      await _0x91fc32["sendMessage"](
        _0x1a46ca,
        { image: { url: _0x18cd8c }, caption: _0xa37f1 + " + " + _0x30991d },
        { quoted: _0x2eb70d },
      );
    } catch (_0x3da565) {
      await _0x91fc32["sendMessage"](
        _0x1a46ca,
        { text: "❌ Could not mix emojis: " + _0x3da565["message"] },
        { quoted: _0x2eb70d },
      );
    }
  },
};
