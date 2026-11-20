module["exports"] = {
  name: "attp",
  description: "Animated text sticker. Usage: .attp <text>",
  async execute(_0x189477, _0x12963c, _0x58453e) {
    const _0x111fb7 = _0x12963c["key"]["remoteJid"],
      _0x19342e = _0x58453e["join"]("\x20")["trim"]();
    if (!_0x19342e)
      return _0x189477["sendMessage"](
        _0x111fb7,
        { text: "Provide text. E.g: .attp Hello World" },
        { quoted: _0x12963c },
      );
    try {
      await _0x189477["sendMessage"](
        _0x111fb7,
        {
          sticker: {
            url:
              "https://api.lolhuman.xyz/api/attp?apikey=cde5404984da80591a2692b6&text=" +
              encodeURIComponent(_0x19342e),
          },
        },
        { quoted: _0x12963c },
      );
    } catch (_0x4ddf60) {
      (console["error"]("[ATTP ERROR]", _0x4ddf60["message"]),
        await _0x189477["sendMessage"](
          _0x111fb7,
          { text: "❌ Failed to create sticker: " + _0x4ddf60["message"] },
          { quoted: _0x12963c },
        ));
    }
  },
};
