const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "euro",
  description: "Shows current Euro Championship standings.",
  async execute(_0x53b493, _0x4a668e) {
    const _0x10db74 = _0x4a668e["key"]["remoteJid"],
      _0x1de946 = await _0x53b493["sendMessage"](
        _0x10db74,
        { text: "🏆 Fetching Euro standings..." },
        { quoted: _0x4a668e },
      );
    try {
      const { data: _0x6dd169 } = await axios["get"](
        KEITH_BASE + "/euro/standings",
      );
      if (!_0x6dd169["status"] || !_0x6dd169["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x5a0ee6 = _0x6dd169["result"]["standings"];
      let _0x511551 =
        "🏆 *" +
        (_0x6dd169["result"]["competition"] || "Euro Championship") +
        "*\x0a";
      ((_0x511551 +=
        "```\nPos Team               P  GD Pts\n───────────────────────────────\n"),
        _0x5a0ee6["forEach"]((_0x58f780) => {
          const _0x39985d = String(_0x58f780["position"])["padEnd"](0x3),
            _0x3070ad = _0x58f780["team"]["slice"](0x0, 0x12)["padEnd"](0x12),
            _0x36a881 = String(_0x58f780["played"])["padEnd"](0x3),
            _0x2c15d0 = String(
              _0x58f780["goalDifference"] >= 0x0
                ? "+" + _0x58f780["goalDifference"]
                : _0x58f780["goalDifference"],
            )["padEnd"](0x4),
            _0x34fd54 = String(_0x58f780["points"])["padStart"](0x3);
          _0x511551 +=
            "" +
            _0x39985d +
            _0x3070ad +
            _0x36a881 +
            _0x2c15d0 +
            _0x34fd54 +
            "\x0a";
        }),
        (_0x511551 += "```"),
        await _0x53b493["sendMessage"](_0x10db74, {
          text: _0x511551,
          edit: _0x1de946["key"],
        }));
    } catch (_0x2e323d) {
      await _0x53b493["sendMessage"](_0x10db74, {
        text: "❌ Failed to fetch Euro standings.\n\n" + _0x2e323d["message"],
        edit: _0x1de946["key"],
      });
    }
  },
};
