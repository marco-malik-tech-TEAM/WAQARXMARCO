const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "fifa",
  description: "Shows current FIFA World Cup standings/groups.",
  async execute(_0xb6bcbd, _0x410fb3) {
    const _0x385521 = _0x410fb3["key"]["remoteJid"],
      _0x511cb6 = await _0xb6bcbd["sendMessage"](
        _0x385521,
        { text: "🏆 Fetching FIFA standings..." },
        { quoted: _0x410fb3 },
      );
    try {
      const { data: _0x3e9c5b } = await axios["get"](
        KEITH_BASE + "/fifa/standings",
      );
      if (!_0x3e9c5b["status"] || !_0x3e9c5b["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x26189e = _0x3e9c5b["result"]["standings"];
      let _0x24cad9 =
        "🏆 *" +
        (_0x3e9c5b["result"]["competition"] || "FIFA World Cup") +
        "*\x0a";
      ((_0x24cad9 +=
        "```\nPos Team               P  GD Pts\n───────────────────────────────\n"),
        _0x26189e["forEach"]((_0x1ba729) => {
          const _0x4c91b6 = String(_0x1ba729["position"])["padEnd"](0x3),
            _0x1b442c = _0x1ba729["team"]["slice"](0x0, 0x12)["padEnd"](0x12),
            _0x46f008 = String(_0x1ba729["played"])["padEnd"](0x3),
            _0x79b291 = String(
              _0x1ba729["goalDifference"] >= 0x0
                ? "+" + _0x1ba729["goalDifference"]
                : _0x1ba729["goalDifference"],
            )["padEnd"](0x4),
            _0x435496 = String(_0x1ba729["points"])["padStart"](0x3);
          _0x24cad9 +=
            "" +
            _0x4c91b6 +
            _0x1b442c +
            _0x46f008 +
            _0x79b291 +
            _0x435496 +
            "\x0a";
        }),
        (_0x24cad9 += "```"),
        await _0xb6bcbd["sendMessage"](_0x385521, {
          text: _0x24cad9,
          edit: _0x511cb6["key"],
        }));
    } catch (_0x2c0089) {
      await _0xb6bcbd["sendMessage"](_0x385521, {
        text: "❌ Failed to fetch FIFA standings.\n\n" + _0x2c0089["message"],
        edit: _0x511cb6["key"],
      });
    }
  },
};
