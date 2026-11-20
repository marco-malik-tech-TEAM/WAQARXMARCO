const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "song",
  description: "Download a song from YouTube. Usage: .song <song name>",
  async execute(_0x51ad0a, _0x2267f7, _0x3c7784) {
    const _0x2e1247 = _0x2267f7["key"]["remoteJid"],
      _0x46af39 = _0x3c7784["join"]("\x20")["trim"]();
    if (!_0x46af39)
      return _0x51ad0a["sendMessage"](
        _0x2e1247,
        { text: "❌ Usage: .song <song name>" },
        { quoted: _0x2267f7 },
      );
    let _0x477f5e;
    try {
      _0x477f5e = await _0x51ad0a["sendMessage"](
        _0x2e1247,
        { text: '🔍 Searching for "' + _0x46af39 + '"...' },
        { quoted: _0x2267f7 },
      );
      const _0x239e72 = await axios["get"](
          API + "/search/yts?query=" + encodeURIComponent(_0x46af39),
        ),
        _0x581014 = _0x239e72["data"]?.["result"];
      if (!Array["isArray"](_0x581014) || _0x581014["length"] === 0x0)
        return _0x51ad0a["sendMessage"](_0x2e1247, {
          text: "❌ No results found.",
          edit: _0x477f5e["key"],
        });
      const _0x1df13f = _0x581014[0x0]["url"],
        _0x33695a = _0x581014[0x0]["title"];
      await _0x51ad0a["sendMessage"](_0x2e1247, {
        text: "🎧 Downloading...\n\n*" + _0x33695a + "*",
        edit: _0x477f5e["key"],
      });
      const _0x47d0d2 = await axios["get"](
          API + "/download/audio?url=" + encodeURIComponent(_0x1df13f),
        ),
        _0x55e621 = _0x47d0d2["data"]?.["result"];
      if (!_0x55e621) throw new Error("Failed to retrieve audio.");
      const _0x5079b6 = (_0x33695a + ".mp3")["replace"](/[\\/:*?"<>|]/g, "");
      (await _0x51ad0a["sendMessage"](
        _0x2e1247,
        {
          audio: { url: _0x55e621 },
          mimetype: "audio/mpeg",
          fileName: _0x5079b6,
          ptt: ![],
        },
        { quoted: _0x2267f7 },
      ),
        await _0x51ad0a["sendMessage"](_0x2e1247, {
          text: "✅ Successfully downloaded\n\n🎵 *" + _0x33695a + "*",
          edit: _0x477f5e["key"],
        }));
    } catch (_0x44ca91) {
      console["error"]("[SONG ERROR]", _0x44ca91);
      const _0x59cac1 =
        "❌ Failed to download song.\n\n" + _0x44ca91["message"];
      _0x477f5e
        ? await _0x51ad0a["sendMessage"](_0x2e1247, {
            text: _0x59cac1,
            edit: _0x477f5e["key"],
          })
        : await _0x51ad0a["sendMessage"](
            _0x2e1247,
            { text: _0x59cac1 },
            { quoted: _0x2267f7 },
          );
    }
  },
};
