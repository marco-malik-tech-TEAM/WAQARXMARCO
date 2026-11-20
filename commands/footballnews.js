const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE + "/football/news";
module["exports"] = {
  name: "news",
  description: "Get the latest football news.",
  async execute(_0x5d9eb7, _0x238a77) {
    const _0x2de0fd = _0x238a77["key"]["remoteJid"];
    try {
      const _0x33a1ea = await _0x5d9eb7["sendMessage"](
          _0x2de0fd,
          { text: "📰 Fetching latest football news..." },
          { quoted: _0x238a77 },
        ),
        { data: _0x3b04b8 } = await axios["get"](API);
      if (
        !_0x3b04b8["status"] ||
        !Array["isArray"](_0x3b04b8["result"]) ||
        _0x3b04b8["result"]["length"] === 0x0
      )
        return await _0x5d9eb7["sendMessage"](
          _0x2de0fd,
          { text: "❌ No football news found." },
          { quoted: _0x238a77 },
        );
      const _0x16a2f9 = _0x3b04b8["result"]["slice"](0x0, 0xa);
      let _0x492206 = "📰 *LATEST FOOTBALL NEWS*\n\n";
      (_0x16a2f9["forEach"]((_0x18934b, _0x49a7dc) => {
        _0x492206 +=
          "*" + (_0x49a7dc + 0x1) + ".\x20" + _0x18934b["title"] + "*\x0a";
        if (_0x18934b["date"]) _0x492206 += "📅 " + _0x18934b["date"] + "\x0a";
        if (_0x18934b["source"])
          _0x492206 += "📰 " + _0x18934b["source"] + "\x0a";
        if (_0x18934b["link"]) _0x492206 += "🔗 " + _0x18934b["link"] + "\x0a";
        _0x492206 += "\x0a";
      }),
        await _0x5d9eb7["sendMessage"](_0x2de0fd, {
          text: _0x492206,
          edit: _0x33a1ea["key"],
        }));
    } catch (_0x3cb38d) {
      (console["error"](_0x3cb38d),
        await _0x5d9eb7["sendMessage"](_0x2de0fd, {
          text: "❌ Failed to fetch football news.",
          edit: loading?.["key"],
        }));
    }
  },
};
