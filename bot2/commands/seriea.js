const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "seriea",
  description: "Shows the current Serie A standings.",
  async execute(_0x4286ad, _0x31c593) {
    const _0x4bc61e = _0x31c593["key"]["remoteJid"],
      _0x3d86b2 = await _0x4286ad["sendMessage"](
        _0x4bc61e,
        { text: "🇮🇹 Fetching Serie A standings..." },
        { quoted: _0x31c593 },
      );
    try {
      const { data: _0x15119e } = await axios["get"](API + "/seriea/standings");
      if (!_0x15119e["status"] || !_0x15119e["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x3667af = _0x15119e["result"]["standings"];
      let _0x1557ab = "🇮🇹 *" + _0x15119e["result"]["competition"] + "*\x0a";
      ((_0x1557ab += "```"),
        (_0x1557ab += "\nPos Team               P  GD Pts\n"),
        (_0x1557ab += "───────────────────────────────\n"),
        _0x3667af["forEach"]((_0x5de689) => {
          const _0x17f460 = String(_0x5de689["position"])["padEnd"](0x3),
            _0x567644 = _0x5de689["team"]
              ["replace"](" FC", "")
              ["replace"](" AFC", "")
              ["replace"](" AC", "")
              ["replace"](" Calcio", "")
              ["slice"](0x0, 0x12)
              ["padEnd"](0x12),
            _0x439a11 = String(_0x5de689["played"])["padEnd"](0x3),
            _0x4bad78 = String(
              _0x5de689["goalDifference"] >= 0x0
                ? "+" + _0x5de689["goalDifference"]
                : _0x5de689["goalDifference"],
            )["padEnd"](0x4),
            _0x45a42f = String(_0x5de689["points"])["padStart"](0x3);
          _0x1557ab +=
            "" +
            _0x17f460 +
            _0x567644 +
            _0x439a11 +
            _0x4bad78 +
            _0x45a42f +
            "\x0a";
        }),
        (_0x1557ab += "```"),
        await _0x4286ad["sendMessage"](_0x4bc61e, {
          text: _0x1557ab,
          edit: _0x3d86b2["key"],
        }));
    } catch (_0x2cbb03) {
      await _0x4286ad["sendMessage"](_0x4bc61e, {
        text:
          "❌ Failed to fetch Serie A standings.\n\n" + _0x2cbb03["message"],
        edit: _0x3d86b2["key"],
      });
    }
  },
};
