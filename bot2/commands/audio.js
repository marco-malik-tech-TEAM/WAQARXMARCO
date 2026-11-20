const axios = require("axios"),
  yts = require("yt-search"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "audio",
  description:
    "Search and download audio from YouTube. Usage: .audio <song name or link>",
  async execute(_0x17725e, _0x3f5258, _0x17e250) {
    const _0x356731 = _0x3f5258["key"]["remoteJid"],
      _0x5f46ec = _0x17e250["join"]("\x20")["trim"]();
    if (!_0x5f46ec)
      return await _0x17725e["sendMessage"](
        _0x356731,
        { text: "🎵 *MARCO X WAQAR MD BOT AUDIO*\n\nExample:\n.audio Shape of You" },
        { quoted: _0x3f5258 },
      );
    let _0x4f76e1;
    try {
      _0x4f76e1 = await _0x17725e["sendMessage"](
        _0x356731,
        { text: "🔍 Searching..." },
        { quoted: _0x3f5258 },
      );
      let _0x586720, _0x1f146a;
      if (/youtu\.be|youtube\.com/i["test"](_0x5f46ec)) {
        _0x586720 = _0x5f46ec;
        const _0x115e7b = await yts(_0x5f46ec);
        if (!_0x115e7b)
          return await _0x17725e["sendMessage"](_0x356731, {
            text: "❌ Invalid YouTube link.",
            edit: _0x4f76e1["key"],
          });
        _0x1f146a = _0x115e7b["title"] || "YouTube Audio";
      } else {
        const _0x1ff644 = await axios["get"](
            API + "/search/yts?query=" + encodeURIComponent(_0x5f46ec),
          ),
          _0x19a057 = _0x1ff644["data"]?.["result"];
        if (!Array["isArray"](_0x19a057) || _0x19a057["length"] === 0x0)
          return await _0x17725e["sendMessage"](_0x356731, {
            text: "❌ No results found.",
            edit: _0x4f76e1["key"],
          });
        ((_0x586720 = _0x19a057[0x0]["url"]),
          (_0x1f146a = _0x19a057[0x0]["title"]));
      }
      await _0x17725e["sendMessage"](_0x356731, {
        text: "🎧 Downloading...\n\n*" + _0x1f146a + "*",
        edit: _0x4f76e1["key"],
      });
      const _0x48b573 = await axios["get"](
          API + "/download/audio?url=" + encodeURIComponent(_0x586720),
        ),
        _0x11bf09 = _0x48b573["data"]?.["result"];
      if (!_0x11bf09) throw new Error("Failed to retrieve audio.");
      const _0x52238b = (_0x1f146a + ".mp3")["replace"](/[\\/:*?"<>|]/g, "");
      (await _0x17725e["sendMessage"](
        _0x356731,
        {
          audio: { url: _0x11bf09 },
          mimetype: "audio/mpeg",
          fileName: _0x52238b,
          ptt: ![],
        },
        { quoted: _0x3f5258 },
      ),
        await _0x17725e["sendMessage"](_0x356731, {
          text: "✅ Successfully downloaded\n\n🎵 *" + _0x1f146a + "*",
          edit: _0x4f76e1["key"],
        }));
    } catch (_0x56d6a0) {
      (console["error"]("[AUDIO ERROR]", _0x56d6a0),
        _0x4f76e1
          ? await _0x17725e["sendMessage"](_0x356731, {
              text: "❌ Audio download failed.\n\n" + _0x56d6a0["message"],
              edit: _0x4f76e1["key"],
            })
          : await _0x17725e["sendMessage"](
              _0x356731,
              { text: "❌ Audio download failed.\n\n" + _0x56d6a0["message"] },
              { quoted: _0x3f5258 },
            ));
    }
  },
};
