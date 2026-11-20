const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "lyrics2",
  description: "Search song lyrics. Usage: .lyrics2 <song name>",
  async execute(_0xebb52a, _0xcb9db2, _0xe7c1c8) {
    const _0x159308 = _0xcb9db2["key"]["remoteJid"],
      _0x2e087c = _0xe7c1c8["join"]("\x20")["trim"]();
    if (!_0x2e087c)
      return await _0xebb52a["sendMessage"](
        _0x159308,
        { text: "🎵 *LYRICS SEARCH*\n\nExample:\n.lyrics2 Faded" },
        { quoted: _0xcb9db2 },
      );
    let _0x54545d;
    try {
      _0x54545d = await _0xebb52a["sendMessage"](
        _0x159308,
        { text: "🔍 Searching lyrics..." },
        { quoted: _0xcb9db2 },
      );
      const { data: _0xb123c4 } = await axios["get"](
        API + "/search/lyrics?query=" + encodeURIComponent(_0x2e087c),
      );
      if (!_0xb123c4["status"] || !_0xb123c4["result"])
        return await _0xebb52a["sendMessage"](_0x159308, {
          text: "❌ Lyrics not found.",
          edit: _0x54545d["key"],
        });
      const _0x472f0d = _0xb123c4["result"];
      let _0x2c61a2 = "🎵 *SONG LYRICS*\n\n";
      if (_0x472f0d["title"])
        _0x2c61a2 += "🎧 *Title:* " + _0x472f0d["title"] + "\x0a";
      if (_0x472f0d["artist"])
        _0x2c61a2 += "👤 *Artist:* " + _0x472f0d["artist"] + "\x0a";
      if (_0x472f0d["album"])
        _0x2c61a2 += "💿 *Album:* " + _0x472f0d["album"] + "\x0a";
      ((_0x2c61a2 += "\n📜 *Lyrics:*\n\n"),
        (_0x2c61a2 +=
          _0x472f0d["lyrics"] || _0x472f0d["lyric"] || "No lyrics available."));
      if (_0x2c61a2["length"] <= 0xfa0)
        await _0xebb52a["sendMessage"](_0x159308, {
          text: _0x2c61a2,
          edit: _0x54545d["key"],
        });
      else {
        await _0xebb52a["sendMessage"](_0x159308, {
          text: _0x2c61a2["slice"](0x0, 0xfa0),
          edit: _0x54545d["key"],
        });
        for (
          let _0x2e1883 = 0xfa0;
          _0x2e1883 < _0x2c61a2["length"];
          _0x2e1883 += 0xfa0
        ) {
          await _0xebb52a["sendMessage"](_0x159308, {
            text: _0x2c61a2["slice"](_0x2e1883, _0x2e1883 + 0xfa0),
          });
        }
      }
    } catch (_0x15315a) {
      (console["error"]("[LYRICS ERROR]", _0x15315a),
        await _0xebb52a["sendMessage"](_0x159308, {
          text: "❌ Failed to fetch lyrics.",
          edit: _0x54545d?.["key"],
        }));
    }
  },
};
