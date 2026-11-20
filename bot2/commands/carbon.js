const https = require("https");
function httpsPostJson(_0x15b290, _0x338c6e, _0x252940) {
  return new Promise((_0x1221b3, _0x274a88) => {
    const _0x18b273 = JSON["stringify"](_0x252940),
      _0x43a63c = https["request"](
        {
          hostname: _0x15b290,
          path: _0x338c6e,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer["byteLength"](_0x18b273),
          },
        },
        (_0x3c7b4d) => {
          const _0x2228ba = [];
          (_0x3c7b4d["on"]("data", (_0x3df477) => _0x2228ba["push"](_0x3df477)),
            _0x3c7b4d["on"]("end", () =>
              _0x1221b3({
                status: _0x3c7b4d["statusCode"],
                buffer: Buffer["concat"](_0x2228ba),
              }),
            ));
        },
      );
    (_0x43a63c["on"]("error", _0x274a88),
      _0x43a63c["write"](_0x18b273),
      _0x43a63c["end"]());
  });
}
module["exports"] = {
  name: "carbon",
  description:
    "Turns a code snippet into a styled code image. Usage: .carbon <code>",
  async execute(_0x304252, _0x184af7, _0x469aa8) {
    const _0x4e9463 = _0x184af7["key"]["remoteJid"],
      _0x17d5f4 = _0x469aa8["join"]("\x20")["replace"](/\\n/g, "\x0a");
    if (!_0x17d5f4)
      return _0x304252["sendMessage"](
        _0x4e9463,
        {
          text: '❌ Usage: .carbon <code>\nExample: .carbon const hello = "world";',
        },
        { quoted: _0x184af7 },
      );
    await _0x304252["sendMessage"](_0x4e9463, {
      react: { text: "🎨", key: _0x184af7["key"] },
    });
    try {
      const { status: _0xd36e8c, buffer: _0x166f5b } = await httpsPostJson(
        "carbonara.solopov.dev",
        "/api/cook",
        { code: _0x17d5f4, backgroundColor: "#1E1E1E", theme: "seti" },
      );
      if (_0xd36e8c !== 0xc8)
        throw new Error("API returned status " + _0xd36e8c);
      (await _0x304252["sendMessage"](
        _0x4e9463,
        { image: _0x166f5b, caption: "🎨 *Carbon Snippet*" },
        { quoted: _0x184af7 },
      ),
        await _0x304252["sendMessage"](_0x4e9463, {
          react: { text: "", key: _0x184af7["key"] },
        }));
    } catch (_0xf38c9) {
      await _0x304252["sendMessage"](
        _0x4e9463,
        { text: "❌ Error generating carbon image: " + _0xf38c9["message"] },
        { quoted: _0x184af7 },
      );
    }
  },
};
