const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "eplscorers",
  description: "Shows the current EPL top scorers.",
  async execute(_0x4fddb9, _0x658c76) {
    const _0x1bcdee = _0x658c76["key"]["remoteJid"],
      _0x1441f7 = await _0x4fddb9["sendMessage"](
        _0x1bcdee,
        { text: "🏆 Fetching EPL top scorers..." },
        { quoted: _0x658c76 },
      );
    try {
      const { data: _0x66e5a5 } = await axios["get"](
        KEITH_BASE + "/epl/scorers",
      );
      if (!_0x66e5a5["status"] || !_0x66e5a5["result"]?.["scorers"])
        throw new Error("No scorers available.");
      const _0x29615a = _0x66e5a5["result"]["scorers"];
      let _0x249155 =
        "⚽ *" +
        (_0x66e5a5["result"]["competition"] || "EPL") +
        " Top Scorers*\n\n";
      (_0x29615a["forEach"]((_0x202262, _0x4ae53f) => {
        _0x249155 +=
          _0x4ae53f +
          0x1 +
          ".\x20" +
          (_0x202262["player"] || _0x202262["name"]) +
          "\x20(" +
          _0x202262["team"] +
          ") — " +
          _0x202262["goals"] +
          " goals\n";
      }),
        await _0x4fddb9["sendMessage"](_0x1bcdee, {
          text: _0x249155,
          edit: _0x1441f7["key"],
        }));
    } catch (_0xe4860e) {
      await _0x4fddb9["sendMessage"](_0x1bcdee, {
        text: "❌ Failed to fetch top scorers.\n\n" + _0xe4860e["message"],
        edit: _0x1441f7["key"],
      });
    }
  },
};
