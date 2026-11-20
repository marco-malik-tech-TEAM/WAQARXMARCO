const axios = require("axios"),
  yts = require("yt-search"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "play",
  description: "Search and download audio from YouTube",
  async execute(_0x12897e, _0x51ab89, _0x68e29f) {
    const _0xc443b1 = _0x51ab89["key"]["remoteJid"],
      _0x514763 = _0x68e29f["join"]("\x20")["trim"]();
    if (!_0x514763)
      return await _0x12897e["sendMessage"](
        _0xc443b1,
        { text: "🎵 *MARCO X WAQAR MD BOT PLAY*\n\nExample:\n.play Shape of You" },
        { quoted: _0x51ab89 },
      );
    let _0x51b1d3;
    try {
      _0x51b1d3 = await _0x12897e["sendMessage"](
        _0xc443b1,
        { text: "🔍 Searching..." },
        { quoted: _0x51ab89 },
      );
      let _0x5012ff, _0x7fb979;
      if (/youtu\.be|youtube\.com/i["test"](_0x514763)) {
        _0x5012ff = _0x514763;
        const _0x566c0c = await yts(_0x514763);
        if (!_0x566c0c)
          return await _0x12897e["sendMessage"](_0xc443b1, {
            text: "❌ Invalid YouTube link.",
            edit: _0x51b1d3["key"],
          });
        _0x7fb979 = _0x566c0c["title"] || "YouTube Audio";
      } else {
        const _0x4128f8 = await axios["get"](
            API + "/search/yts?query=" + encodeURIComponent(_0x514763),
          ),
          _0x5b5e85 = _0x4128f8["data"]?.["result"];
        if (!Array["isArray"](_0x5b5e85) || _0x5b5e85["length"] === 0x0)
          return await _0x12897e["sendMessage"](_0xc443b1, {
            text: "❌ No results found.",
            edit: _0x51b1d3["key"],
          });
        ((_0x5012ff = _0x5b5e85[0x0]["url"]),
          (_0x7fb979 = _0x5b5e85[0x0]["title"]));
      }
      await _0x12897e["sendMessage"](_0xc443b1, {
        text: "🎧 Downloading...\n\n*" + _0x7fb979 + "*",
        edit: _0x51b1d3["key"],
      });
      const _0x31f42d = await axios["get"](
          API + "/download/audio?url=" + encodeURIComponent(_0x5012ff),
        ),
        _0x14a55a = _0x31f42d["data"]?.["result"];
      if (!_0x14a55a) throw new Error("Failed to retrieve audio.");
      const _0x11f4b9 = (_0x7fb979 + ".mp3")["replace"](/[\\/:*?"<>|]/g, "");
      (await _0x12897e["sendMessage"](
        _0xc443b1,
        {
          audio: { url: _0x14a55a },
          mimetype: "audio/mpeg",
          fileName: _0x11f4b9,
          ptt: ![],
        },
        { quoted: _0x51ab89 },
      ),
        await _0x12897e["sendMessage"](
          _0xc443b1,
          {
            document: { url: _0x14a55a },
            mimetype: "audio/mpeg",
            fileName: _0x11f4b9,
          },
          { quoted: _0x51ab89 },
        ),
        await _0x12897e["sendMessage"](_0xc443b1, {
          text: "✅ Successfully downloaded\n\n🎵 *" + _0x7fb979 + "*",
          edit: _0x51b1d3["key"],
        }));
    } catch (_0x372fdc) {
      (console["error"]("[PLAY ERROR]", _0x372fdc),
        _0x51b1d3
          ? await _0x12897e["sendMessage"](_0xc443b1, {
              text: "❌ Failed to play song.\n\n" + _0x372fdc["message"],
              edit: _0x51b1d3["key"],
            })
          : await _0x12897e["sendMessage"](
              _0xc443b1,
              { text: "❌ Failed to play song.\n\n" + _0x372fdc["message"] },
              { quoted: _0x51ab89 },
            ));
    }
  },
};
