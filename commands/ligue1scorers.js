const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "ligue1scorers",
  description: "Shows the current Ligue 1 top scorers.",
  async execute(_0x2dff93, _0x2eab5e) {
    const _0x1a1aee = _0x2eab5e["key"]["remoteJid"],
      _0xd4c79f = await _0x2dff93["sendMessage"](
        _0x1a1aee,
        { text: "🏆 Fetching Ligue 1 top scorers..." },
        { quoted: _0x2eab5e },
      );
    try {
      const { data: _0xf50244 } = await axios["get"](
        KEITH_BASE + "/ligue1/scorers",
      );
      if (!_0xf50244["status"] || !_0xf50244["result"]?.["scorers"])
        throw new Error("No scorers available.");
      const _0x544d7e = _0xf50244["result"]["scorers"];
      let _0x4e50d4 =
        "⚽ *" +
        (_0xf50244["result"]["competition"] || "Ligue 1") +
        " Top Scorers*\n\n";
      (_0x544d7e["forEach"]((_0x17ff93, _0x5eaa7e) => {
        _0x4e50d4 +=
          _0x5eaa7e +
          0x1 +
          ".\x20" +
          (_0x17ff93["player"] || _0x17ff93["name"]) +
          "\x20(" +
          _0x17ff93["team"] +
          ") — " +
          _0x17ff93["goals"] +
          " goals\n";
      }),
        await _0x2dff93["sendMessage"](_0x1a1aee, {
          text: _0x4e50d4,
          edit: _0xd4c79f["key"],
        }));
    } catch (_0x3c3cf8) {
      await _0x2dff93["sendMessage"](_0x1a1aee, {
        text: "❌ Failed to fetch top scorers.\n\n" + _0x3c3cf8["message"],
        edit: _0xd4c79f["key"],
      });
    }
  },
};
