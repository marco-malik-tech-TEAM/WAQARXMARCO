const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "play2",
  aliases: ["yta2"],
  description:
    "Download YouTube audio via alternate API. Usage: .play2 <song name or link>",
  async execute(_0x25e4e8, _0x237b73, _0x18e5b4) {
    const _0x535058 = _0x237b73["key"]["remoteJid"],
      _0x3b72d0 = _0x18e5b4["join"]("\x20")["trim"]();
    if (!_0x3b72d0)
      return _0x25e4e8["sendMessage"](
        _0x535058,
        {
          text: "🎧 Provide a song name or YouTube link!\nEg: .play2 Blinding Lights",
        },
        { quoted: _0x237b73 },
      );
    try {
      await _0x25e4e8["sendMessage"](_0x535058, {
        react: { text: "🎵", key: _0x237b73["key"] },
      });
      const _0x53eb72 = await _0x25e4e8["sendMessage"](
        _0x535058,
        { text: "🔍 Searching *" + _0x3b72d0 + "*..." },
        { quoted: _0x237b73 },
      );
      let _0x2a5658, _0x2bc9ca;
      if (/(youtube\.com|youtu\.be)/i["test"](_0x3b72d0))
        ((_0x2a5658 = _0x3b72d0), (_0x2bc9ca = "YouTube Audio"));
      else {
        const _0x3b5e57 = await axios["get"](
            API + "/search/yts?query=" + encodeURIComponent(_0x3b72d0),
          ),
          _0x5631c4 = _0x3b5e57["data"]?.["result"];
        if (!Array["isArray"](_0x5631c4) || _0x5631c4["length"] === 0x0)
          return _0x25e4e8["sendMessage"](_0x535058, {
            text: "❌ No results found for: *" + _0x3b72d0 + "*",
            edit: _0x53eb72["key"],
          });
        ((_0x2a5658 = _0x5631c4[0x0]["url"]),
          (_0x2bc9ca = _0x5631c4[0x0]["title"]));
      }
      await _0x25e4e8["sendMessage"](_0x535058, {
        text: "😍 Found: *" + _0x2bc9ca + "*\n⏳ Downloading...",
        edit: _0x53eb72["key"],
      });
      const _0x52bdcc = await axios["get"](
          "https://mcow.giftedtechnexus.workers.dev/api/yta?url=" +
            encodeURIComponent(_0x2a5658),
          { timeout: 0xea60 },
        ),
        _0x3dce3c = _0x52bdcc["data"];
      if (!_0x3dce3c["success"] || !_0x3dce3c["result"]?.["download_url"])
        return _0x25e4e8["sendMessage"](_0x535058, {
          text: "❌ Download failed. Try a different song.",
          edit: _0x53eb72["key"],
        });
      const _0xd34bf3 = _0x3dce3c["result"]["title"] || _0x2bc9ca,
        _0x29bed4 = _0x3dce3c["result"]["download_url"],
        _0x313f86 =
          _0xd34bf3["replace"](/[\/\\:*?"<>|]/g, "")["trim"]() + ".mp3";
      (await _0x25e4e8["sendMessage"](
        _0x535058,
        {
          audio: { url: _0x29bed4 },
          mimetype: "audio/mpeg",
          fileName: _0x313f86,
        },
        { quoted: _0x237b73 },
      ),
        await _0x25e4e8["sendMessage"](
          _0x535058,
          {
            document: { url: _0x29bed4 },
            mimetype: "audio/mpeg",
            caption: "*DOWNLOADED BY MARCO X WAQAR MD BOT*",
            fileName: _0x313f86,
          },
          { quoted: _0x237b73 },
        ),
        await _0x25e4e8["sendMessage"](_0x535058, {
          text: "✅ Successfully downloaded! *" + _0xd34bf3 + "*",
          edit: _0x53eb72["key"],
        }));
    } catch (_0x336bbe) {
      await _0x25e4e8["sendMessage"](
        _0x535058,
        { text: "❌ An error occurred. Try again." },
        { quoted: _0x237b73 },
      );
    }
  },
};
