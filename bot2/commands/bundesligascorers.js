const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "bundesligascorers",
  description: "Shows the current Bundesliga top scorers.",
  async execute(_0x372422, _0x2fea86) {
    const _0x56a132 = _0x2fea86["key"]["remoteJid"],
      _0x53c3be = await _0x372422["sendMessage"](
        _0x56a132,
        { text: "🏆 Fetching Bundesliga top scorers..." },
        { quoted: _0x2fea86 },
      );
    try {
      const { data: _0x45d2fc } = await axios["get"](
        KEITH_BASE + "/bundesliga/scorers",
      );
      if (!_0x45d2fc["status"] || !_0x45d2fc["result"]?.["scorers"])
        throw new Error("No scorers available.");
      const _0x36f0b1 = _0x45d2fc["result"]["scorers"];
      let _0x22b5c5 =
        "⚽ *" +
        (_0x45d2fc["result"]["competition"] || "Bundesliga") +
        " Top Scorers*\n\n";
      (_0x36f0b1["forEach"]((_0x1a8eb6, _0x2d88e8) => {
        _0x22b5c5 +=
          _0x2d88e8 +
          0x1 +
          ".\x20" +
          (_0x1a8eb6["player"] || _0x1a8eb6["name"]) +
          "\x20(" +
          _0x1a8eb6["team"] +
          ") — " +
          _0x1a8eb6["goals"] +
          " goals\n";
      }),
        await _0x372422["sendMessage"](_0x56a132, {
          text: _0x22b5c5,
          edit: _0x53c3be["key"],
        }));
    } catch (_0xc3757e) {
      await _0x372422["sendMessage"](_0x56a132, {
        text: "❌ Failed to fetch top scorers.\n\n" + _0xc3757e["message"],
        edit: _0x53c3be["key"],
      });
    }
  },
};
