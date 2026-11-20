const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "muslimai",
  aliases: ["muslim", "quranai"],
  description: "Query MuslimAI API for Qur'anic references",
  async execute(_0x44656a, _0x4f49e5, _0x3dfadd) {
    const _0x306041 = _0x4f49e5["key"]["remoteJid"],
      _0x21c334 =
        _0x306041["endsWith"]("@lid") && _0x4f49e5["key"]["remoteJidAlt"]
          ? _0x4f49e5["key"]["remoteJidAlt"]
          : _0x306041,
      _0x1789ef = _0x3dfadd["join"]("\x20")["trim"]();
    if (!_0x1789ef)
      return _0x44656a["sendMessage"](
        _0x21c334,
        { text: "❌ Provide a query, e.g. `.muslimai who is Allah`" },
        { quoted: _0x4f49e5 },
      );
    const _0x3f88f8 = await _0x44656a["sendMessage"](
      _0x21c334,
      { text: "📖 *Searching Qur'anic references...*" },
      { quoted: _0x4f49e5 },
    );
    try {
      const { data: _0x1ab3f2 } = await axios["get"](
        API + "/ai/muslim?q=" + encodeURIComponent(_0x1789ef),
        { timeout: 0x1d4c0 },
      );
      if (!_0x1ab3f2?.["status"] || !_0x1ab3f2?.["result"])
        throw new Error("MuslimAI API returned an invalid response.");
      const _0xc38085 = _0x1ab3f2["result"]["results"];
      if (!_0xc38085 || _0xc38085["length"] === 0x0)
        return _0x44656a["sendMessage"](
          _0x21c334,
          { text: "ℹ️ No relevant verses found.", edit: _0x3f88f8["key"] },
          { quoted: _0x4f49e5 },
        );
      let _0x945550 =
        "📖 *MuslimAI Results for:* " +
        (_0x1ab3f2["result"]["query"] || _0x1789ef) +
        "\x0a\x0a";
      (_0xc38085["slice"](0x0, 0x3)["forEach"]((_0x4f1294, _0x27720f) => {
        _0x945550 +=
          "*" +
          (_0x27720f + 0x1) +
          ". Surah " +
          _0x4f1294["surah_title"] +
          "*\x0a" +
          _0x4f1294["content"]["trim"]() +
          "\n🔗 " +
          _0x4f1294["surah_url"] +
          "\x0a\x0a";
      }),
        await _0x44656a["sendMessage"](
          _0x21c334,
          { text: _0x945550["trim"](), edit: _0x3f88f8["key"] },
          { quoted: _0x4f49e5 },
        ));
    } catch (_0x49f51f) {
      (console["error"]("[MUSLIMAI ERROR]", _0x49f51f),
        await _0x44656a["sendMessage"](
          _0x21c334,
          {
            text: "❌ Failed to fetch response: " + _0x49f51f["message"],
            edit: _0x3f88f8["key"],
          },
          { quoted: _0x4f49e5 },
        ));
    }
  },
};
