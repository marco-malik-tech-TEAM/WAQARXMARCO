const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "serieascorers",
  description: "Shows the current Serie A top scorers.",
  async execute(_0x28dc24, _0xfdc031) {
    const _0x2b0616 = _0xfdc031["key"]["remoteJid"],
      _0x480960 = await _0x28dc24["sendMessage"](
        _0x2b0616,
        { text: "🏆 Fetching Serie A top scorers..." },
        { quoted: _0xfdc031 },
      );
    try {
      const { data: _0x41f3c5 } = await axios["get"](
        KEITH_BASE + "/seriea/scorers",
      );
      if (!_0x41f3c5["status"] || !_0x41f3c5["result"]?.["scorers"])
        throw new Error("No scorers available.");
      const _0x4b3c8a = _0x41f3c5["result"]["scorers"];
      let _0x51e4b1 =
        "⚽ *" +
        (_0x41f3c5["result"]["competition"] || "Serie A") +
        " Top Scorers*\n\n";
      (_0x4b3c8a["forEach"]((_0x1c3b61, _0x31c3fd) => {
        _0x51e4b1 +=
          _0x31c3fd +
          0x1 +
          ".\x20" +
          (_0x1c3b61["player"] || _0x1c3b61["name"]) +
          "\x20(" +
          _0x1c3b61["team"] +
          ") — " +
          _0x1c3b61["goals"] +
          " goals\n";
      }),
        await _0x28dc24["sendMessage"](_0x2b0616, {
          text: _0x51e4b1,
          edit: _0x480960["key"],
        }));
    } catch (_0x1f7941) {
      await _0x28dc24["sendMessage"](_0x2b0616, {
        text: "❌ Failed to fetch top scorers.\n\n" + _0x1f7941["message"],
        edit: _0x480960["key"],
      });
    }
  },
};
