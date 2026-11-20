const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "epl",
  description: "Shows the current English Premier League standings.",
  async execute(_0x2ae230, _0x4f7dcf) {
    const _0x1a25e5 = _0x4f7dcf["key"]["remoteJid"],
      _0x2095f1 = await _0x2ae230["sendMessage"](
        _0x1a25e5,
        { text: "🏆 Fetching Premier League standings..." },
        { quoted: _0x4f7dcf },
      );
    try {
      const { data: _0x1f61a8 } = await axios["get"](API + "/epl/standings");
      if (!_0x1f61a8["status"] || !_0x1f61a8["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x5a4d92 = _0x1f61a8["result"]["standings"];
      let _0xb951bf = "🏆 *" + _0x1f61a8["result"]["competition"] + "*\x0a";
      ((_0xb951bf += "```"),
        (_0xb951bf += "\nPos Team               P  GD Pts\n"),
        (_0xb951bf += "───────────────────────────────\n"),
        _0x5a4d92["forEach"]((_0xcc82ba) => {
          const _0x10e713 = String(_0xcc82ba["position"])["padEnd"](0x3),
            _0x55e282 = _0xcc82ba["team"]
              ["replace"](" FC", "")
              ["replace"](" AFC", "")
              ["slice"](0x0, 0x12)
              ["padEnd"](0x12),
            _0x5cffc0 = String(_0xcc82ba["played"])["padEnd"](0x3),
            _0x13be1b = String(
              _0xcc82ba["goalDifference"] >= 0x0
                ? "+" + _0xcc82ba["goalDifference"]
                : _0xcc82ba["goalDifference"],
            )["padEnd"](0x4),
            _0x16858e = String(_0xcc82ba["points"])["padStart"](0x3);
          _0xb951bf +=
            "" +
            _0x10e713 +
            _0x55e282 +
            _0x5cffc0 +
            _0x13be1b +
            _0x16858e +
            "\x0a";
        }),
        (_0xb951bf += "```"),
        await _0x2ae230["sendMessage"](_0x1a25e5, {
          text: _0xb951bf,
          edit: _0x2095f1["key"],
        }));
    } catch (_0x48166b) {
      await _0x2ae230["sendMessage"](_0x1a25e5, {
        text: "❌ Failed to fetch EPL standings.\n\n" + _0x48166b["message"],
        edit: _0x2095f1["key"],
      });
    }
  },
};
