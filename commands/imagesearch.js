const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "imagesearch",
  aliases: ["imgsearch", "photosearch", "gis", "image"],
  description: "Search for images using query. Usage: .imagesearch <query>",
  async execute(_0x5910e8, _0x349327, _0x2f710b) {
    const _0x308fa4 = _0x349327["key"]["remoteJid"],
      _0x526856 =
        _0x308fa4["endsWith"]("@lid") && _0x349327["key"]["remoteJidAlt"]
          ? _0x349327["key"]["remoteJidAlt"]
          : _0x308fa4,
      _0x12a11d = _0x2f710b["join"]("\x20")["trim"]();
    if (!_0x12a11d)
      return await _0x5910e8["sendMessage"](
        _0x526856,
        {
          text: "📌 *Image Search*\n\n*Usage:* `.imagesearch dog`\n*Aliases:* `.imgsearch`, `.photosearch`",
        },
        { quoted: _0x349327 },
      );
    const _0x281e31 = await _0x5910e8["sendMessage"](
      _0x526856,
      { text: '🔍 Searching for "' + _0x12a11d + '"...' },
      { quoted: _0x349327 },
    );
    try {
      const { data: _0x454224 } = await axios["get"](
        KEITH_BASE + "/search/images?query=" + encodeURIComponent(_0x12a11d),
        { timeout: 0xea60 },
      );
      if (!_0x454224?.["status"] || !_0x454224?.["result"]?.["length"])
        return await _0x5910e8["sendMessage"](
          _0x526856,
          { text: "❌ No images found.", edit: _0x281e31["key"] },
          { quoted: _0x349327 },
        );
      await _0x5910e8["sendMessage"](_0x526856, { delete: _0x281e31["key"] })[
        "catch"
      ](() => {});
      const _0x17a6fe = _0x454224["result"]["slice"](0x0, 0x5);
      for (let _0x306920 = 0x0; _0x306920 < _0x17a6fe["length"]; _0x306920++) {
        const _0x45776a = _0x17a6fe[_0x306920],
          _0x2ef4c7 = _0x45776a["thumbnail"] || _0x45776a["url"];
        _0x2ef4c7 &&
          (await _0x5910e8["sendMessage"](
            _0x526856,
            {
              image: { url: _0x2ef4c7 },
              caption:
                _0x306920 === 0x0
                  ? "🔎 *" +
                    _0x12a11d +
                    "*\n📸 " +
                    _0x17a6fe["length"] +
                    " results found"
                  : undefined,
            },
            { quoted: _0x349327 },
          ));
      }
    } catch (_0x3fc08e) {
      (console["error"]("[IMAGESEARCH ERROR]", _0x3fc08e),
        await _0x5910e8["sendMessage"](
          _0x526856,
          { text: "❌ Error: " + _0x3fc08e["message"], edit: _0x281e31["key"] },
          { quoted: _0x349327 },
        ));
    }
  },
};
