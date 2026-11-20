const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "pindl",
  aliases: ["pin", "pinterest"],
  description: "Download Pinterest image or video. Usage: .pindl <link>",
  async execute(_0x3530e4, _0x28728c, _0x25cac1) {
    const _0x3c7353 = _0x28728c["key"]["remoteJid"],
      _0x3512ed = _0x25cac1["join"]("\x20")["trim"]();
    if (!_0x3512ed || !_0x3512ed["startsWith"]("http"))
      return _0x3530e4["sendMessage"](
        _0x3c7353,
        { text: "📌 Provide a valid Pinterest link!" },
        { quoted: _0x28728c },
      );
    try {
      (await _0x3530e4["sendMessage"](
        _0x3c7353,
        { text: "⏳ Fetching Pinterest media..." },
        { quoted: _0x28728c },
      ),
        await _0x3530e4["sendMessage"](_0x3c7353, {
          react: { text: "📌", key: _0x28728c["key"] },
        }));
      const _0x30fdfc = await axios["get"](
          API + "/download/pindl2?url=" + encodeURIComponent(_0x3512ed),
          { timeout: 0x186a0 },
        ),
        _0x586c79 = _0x30fdfc["data"]?.["result"];
      if (!_0x586c79?.["success"] || !Array["isArray"](_0x586c79["medias"]))
        return _0x3530e4["sendMessage"](
          _0x3c7353,
          { text: "❌ Failed to fetch Pinterest media." },
          { quoted: _0x28728c },
        );
      const _0x264d66 = _0x586c79["title"] || "Pinterest Media";
      for (const _0xe0a7ac of _0x586c79["medias"]) {
        const {
          url: _0x1ef79a,
          extension: _0x2286b9,
          videoAvailable: _0x2b5442,
        } = _0xe0a7ac;
        if (!_0x1ef79a) continue;
        try {
          const _0x3457f7 = await axios["head"](_0x1ef79a, { timeout: 0x2710 })[
              "catch"
            ](() => null),
            _0xf97d84 = _0x3457f7?.["headers"]?.["content-length"];
          if (_0xf97d84 && parseInt(_0xf97d84) > 0x50 * 0x400 * 0x400) {
            await _0x3530e4["sendMessage"](
              _0x3c7353,
              { text: "⚠️ Skipped file (exceeds 80MB size limit)." },
              { quoted: _0x28728c },
            );
            continue;
          }
          const _0x528ed5 = (_0x264d66 + "." + (_0x2286b9 || "jpg"))["replace"](
            /[^\w\s.-]/gi,
            "",
          );
          _0x2b5442 || _0x2286b9 === "mp4"
            ? await _0x3530e4["sendMessage"](
                _0x3c7353,
                {
                  video: { url: _0x1ef79a },
                  mimetype: "video/mp4",
                  fileName: _0x528ed5,
                  caption: "📌 Pinterest Video",
                },
                { quoted: _0x28728c },
              )
            : await _0x3530e4["sendMessage"](
                _0x3c7353,
                {
                  image: { url: _0x1ef79a },
                  fileName: _0x528ed5,
                  caption: "📌 Pinterest Image",
                },
                { quoted: _0x28728c },
              );
        } catch (_0x2bb31d) {
          console["error"](
            "[PINDL] Error sending media item:",
            _0x2bb31d["message"],
          );
        }
      }
    } catch (_0xaa048f) {
      await _0x3530e4["sendMessage"](
        _0x3c7353,
        { text: "❌ Error downloading Pinterest media." },
        { quoted: _0x28728c },
      );
    }
  },
};
