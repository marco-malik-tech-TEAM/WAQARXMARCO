const axios = require("axios"),
  yts = require("yt-search"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "spotify",
  description:
    "Search and download a track. Usage: .spotify <song name or link>",
  async execute(_0x17308c, _0x479b19, _0x4b6229) {
    const _0x3511a8 = _0x479b19["key"]["remoteJid"],
      _0x5b96a2 = _0x4b6229["join"]("\x20")["trim"]();
    if (!_0x5b96a2)
      return await _0x17308c["sendMessage"](
        _0x3511a8,
        { text: "🎵 *MARCO X WAQAR MD BOT SPOTIFY*\n\nExample:\n.spotify Shape of You" },
        { quoted: _0x479b19 },
      );
    let _0x437bc9;
    try {
      _0x437bc9 = await _0x17308c["sendMessage"](
        _0x3511a8,
        { text: "🔍 Searching..." },
        { quoted: _0x479b19 },
      );
      let _0xd624d3, _0x2e6bbf;
      if (/youtu\.be|youtube\.com/i["test"](_0x5b96a2)) {
        _0xd624d3 = _0x5b96a2;
        const _0x50a5c0 = await yts(_0x5b96a2);
        if (!_0x50a5c0)
          return await _0x17308c["sendMessage"](_0x3511a8, {
            text: "❌ Invalid link.",
            edit: _0x437bc9["key"],
          });
        _0x2e6bbf = _0x50a5c0["title"] || "Audio";
      } else {
        const _0x53d6a8 = await axios["get"](
            API + "/search/yts?query=" + encodeURIComponent(_0x5b96a2),
          ),
          _0x14aff6 = _0x53d6a8["data"]?.["result"];
        if (!Array["isArray"](_0x14aff6) || _0x14aff6["length"] === 0x0)
          return await _0x17308c["sendMessage"](_0x3511a8, {
            text: "❌ No results found.",
            edit: _0x437bc9["key"],
          });
        ((_0xd624d3 = _0x14aff6[0x0]["url"]),
          (_0x2e6bbf = _0x14aff6[0x0]["title"]));
      }
      await _0x17308c["sendMessage"](_0x3511a8, {
        text: "🎧 Downloading...\n\n*" + _0x2e6bbf + "*",
        edit: _0x437bc9["key"],
      });
      const _0x2a8adc = await axios["get"](
          API + "/download/audio?url=" + encodeURIComponent(_0xd624d3),
        ),
        _0x541023 = _0x2a8adc["data"]?.["result"];
      if (!_0x541023) throw new Error("Failed to retrieve audio.");
      const _0x246128 = (_0x2e6bbf + ".mp3")["replace"](/[\\/:*?"<>|]/g, "");
      (await _0x17308c["sendMessage"](
        _0x3511a8,
        {
          audio: { url: _0x541023 },
          mimetype: "audio/mpeg",
          fileName: _0x246128,
          ptt: ![],
        },
        { quoted: _0x479b19 },
      ),
        await _0x17308c["sendMessage"](_0x3511a8, {
          text: "✅ Successfully downloaded\n\n🎵 *" + _0x2e6bbf + "*",
          edit: _0x437bc9["key"],
        }));
    } catch (_0x17f5d2) {
      (console["error"]("[SPOTIFY ERROR]", _0x17f5d2),
        _0x437bc9
          ? await _0x17308c["sendMessage"](_0x3511a8, {
              text: "❌ Download failed.\n\n" + _0x17f5d2["message"],
              edit: _0x437bc9["key"],
            })
          : await _0x17308c["sendMessage"](
              _0x3511a8,
              { text: "❌ Download failed.\n\n" + _0x17f5d2["message"] },
              { quoted: _0x479b19 },
            ));
    }
  },
};
