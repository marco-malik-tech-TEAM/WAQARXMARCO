const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "uclscorers",
  description: "Shows the current Champions League top scorers.",
  async execute(_0x13813e, _0x24df15) {
    const _0x3191e6 = _0x24df15["key"]["remoteJid"],
      _0x2ce75e = await _0x13813e["sendMessage"](
        _0x3191e6,
        { text: "🏆 Fetching Champions League top scorers..." },
        { quoted: _0x24df15 },
      );
    try {
      const { data: _0x40dfc9 } = await axios["get"](
        KEITH_BASE + "/ucl/scorers",
      );
      if (!_0x40dfc9["status"] || !_0x40dfc9["result"]?.["scorers"])
        throw new Error("No scorers available.");
      const _0xa1f7e4 = _0x40dfc9["result"]["scorers"];
      let _0x54b137 =
        "⚽ *" +
        (_0x40dfc9["result"]["competition"] || "Champions League") +
        " Top Scorers*\n\n";
      (_0xa1f7e4["forEach"]((_0x1cbc0e, _0x14f5c9) => {
        _0x54b137 +=
          _0x14f5c9 +
          0x1 +
          ".\x20" +
          (_0x1cbc0e["player"] || _0x1cbc0e["name"]) +
          "\x20(" +
          _0x1cbc0e["team"] +
          ") — " +
          _0x1cbc0e["goals"] +
          " goals\n";
      }),
        await _0x13813e["sendMessage"](_0x3191e6, {
          text: _0x54b137,
          edit: _0x2ce75e["key"],
        }));
    } catch (_0x7ebbe5) {
      await _0x13813e["sendMessage"](_0x3191e6, {
        text: "❌ Failed to fetch top scorers.\n\n" + _0x7ebbe5["message"],
        edit: _0x2ce75e["key"],
      });
    }
  },
};
