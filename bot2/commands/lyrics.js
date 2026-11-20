const https = require("https");
function fetchJson(_0x13bd19) {
  return new Promise((_0x30903d, _0x22404c) => {
    https["get"](_0x13bd19, (_0x56ab15) => {
      let _0x1bbbb9 = "";
      (_0x56ab15["on"]("data", (_0x2e39e5) => (_0x1bbbb9 += _0x2e39e5)),
        _0x56ab15["on"]("end", () => {
          try {
            _0x30903d(JSON["parse"](_0x1bbbb9));
          } catch (_0x54b4d1) {
            _0x22404c(_0x54b4d1);
          }
        }));
    })["on"]("error", _0x22404c);
  });
}
module["exports"] = {
  name: "lyrics",
  description: "Get song lyrics.",
  async execute(_0x221ba9, _0x5cebbd, _0x5eb080) {
    const _0x1f9f1d = _0x5cebbd["key"]["remoteJid"],
      _0x3bbd7d = _0x5eb080["join"]("\x20");
    if (!_0x3bbd7d)
      return _0x221ba9["sendMessage"](
        _0x1f9f1d,
        { text: "❌ Provide a song name.\n\nUsage: *.lyrics <song name>*" },
        { quoted: _0x5cebbd },
      );
    try {
      const _0x4ebca2 =
          "https://api.popcat.xyz/v2/lyrics?song=" +
          encodeURIComponent(_0x3bbd7d),
        _0x38bae8 = await fetchJson(_0x4ebca2);
      if (_0x38bae8["error"] || !_0x38bae8["message"])
        return _0x221ba9["sendMessage"](
          _0x1f9f1d,
          { text: "😕 Lyrics not found." },
          { quoted: _0x5cebbd },
        );
      const _0xbd8c09 = _0x38bae8["message"],
        _0x4aef63 = [
          "🎵 *" + _0xbd8c09["title"] + "*",
          "👤 *Artist:* " + _0xbd8c09["artist"],
          "",
          _0xbd8c09["lyrics"]["slice"](0x0, 0xdac),
          "",
          _0xbd8c09["url"] ? "🔗 " + _0xbd8c09["url"] : null,
        ]
          ["filter"](Boolean)
          ["join"]("\x0a");
      await _0x221ba9["sendMessage"](
        _0x1f9f1d,
        { image: { url: _0xbd8c09["image"] }, caption: _0x4aef63 },
        { quoted: _0x5cebbd },
      );
    } catch (_0x460563) {
      await _0x221ba9["sendMessage"](
        _0x1f9f1d,
        { text: "⚠️ Couldn't fetch lyrics: " + _0x460563["message"] },
        { quoted: _0x5cebbd },
      );
    }
  },
};
