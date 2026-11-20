const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "laliga",
  description: "Shows the current La Liga standings.",
  async execute(_0x5d5ab2, _0x240f0f) {
    const _0x2fa68e = _0x240f0f["key"]["remoteJid"],
      _0x5a4f8a = await _0x5d5ab2["sendMessage"](
        _0x2fa68e,
        { text: "🇪🇸 Fetching La Liga standings..." },
        { quoted: _0x240f0f },
      );
    try {
      const { data: _0x1bfe56 } = await axios["get"](API + "/laliga/standings");
      if (!_0x1bfe56["status"] || !_0x1bfe56["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x2d023c = _0x1bfe56["result"]["standings"];
      let _0x24d217 = "🇪🇸 *" + _0x1bfe56["result"]["competition"] + "*\x0a";
      ((_0x24d217 += "```"),
        (_0x24d217 += "\nPos Team               P  GD Pts\n"),
        (_0x24d217 += "───────────────────────────────\n"),
        _0x2d023c["forEach"]((_0x1f72c) => {
          const _0x3ed7e4 = String(_0x1f72c["position"])["padEnd"](0x3),
            _0x57158d = _0x1f72c["team"]
              ["replace"](" FC", "")
              ["replace"](" AFC", "")
              ["replace"](" CF", "")
              ["slice"](0x0, 0x12)
              ["padEnd"](0x12),
            _0x5bf9f3 = String(_0x1f72c["played"])["padEnd"](0x3),
            _0x25516c = String(
              _0x1f72c["goalDifference"] >= 0x0
                ? "+" + _0x1f72c["goalDifference"]
                : _0x1f72c["goalDifference"],
            )["padEnd"](0x4),
            _0x5dfac1 = String(_0x1f72c["points"])["padStart"](0x3);
          _0x24d217 +=
            "" +
            _0x3ed7e4 +
            _0x57158d +
            _0x5bf9f3 +
            _0x25516c +
            _0x5dfac1 +
            "\x0a";
        }),
        (_0x24d217 += "```"),
        await _0x5d5ab2["sendMessage"](_0x2fa68e, {
          text: _0x24d217,
          edit: _0x5a4f8a["key"],
        }));
    } catch (_0x58b4cc) {
      await _0x5d5ab2["sendMessage"](_0x2fa68e, {
        text:
          "❌ Failed to fetch La Liga standings.\n\n" + _0x58b4cc["message"],
        edit: _0x5a4f8a["key"],
      });
    }
  },
};
