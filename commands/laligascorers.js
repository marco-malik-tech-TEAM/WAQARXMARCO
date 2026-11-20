const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "laligascorers",
  description: "Shows the current La Liga top scorers.",
  async execute(_0xfbf17a, _0x30cd59) {
    const _0x47785d = _0x30cd59["key"]["remoteJid"],
      _0x4776ad = await _0xfbf17a["sendMessage"](
        _0x47785d,
        { text: "🏆 Fetching La Liga top scorers..." },
        { quoted: _0x30cd59 },
      );
    try {
      const { data: _0x825c10 } = await axios["get"](
        KEITH_BASE + "/laliga/scorers",
      );
      if (!_0x825c10["status"] || !_0x825c10["result"]?.["scorers"])
        throw new Error("No scorers available.");
      const _0x1becb5 = _0x825c10["result"]["scorers"];
      let _0x1ef46e =
        "⚽ *" +
        (_0x825c10["result"]["competition"] || "La Liga") +
        " Top Scorers*\n\n";
      (_0x1becb5["forEach"]((_0x4f45c3, _0x68e850) => {
        _0x1ef46e +=
          _0x68e850 +
          0x1 +
          ".\x20" +
          (_0x4f45c3["player"] || _0x4f45c3["name"]) +
          "\x20(" +
          _0x4f45c3["team"] +
          ") — " +
          _0x4f45c3["goals"] +
          " goals\n";
      }),
        await _0xfbf17a["sendMessage"](_0x47785d, {
          text: _0x1ef46e,
          edit: _0x4776ad["key"],
        }));
    } catch (_0x1598ec) {
      await _0xfbf17a["sendMessage"](_0x47785d, {
        text: "❌ Failed to fetch top scorers.\n\n" + _0x1598ec["message"],
        edit: _0x4776ad["key"],
      });
    }
  },
};
