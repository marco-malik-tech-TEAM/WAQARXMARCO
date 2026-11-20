const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "bundesliga",
  description: "Shows the current Bundesliga standings.",
  async execute(_0x2ba217, _0x3f2dda) {
    const _0x4a4f3c = _0x3f2dda["key"]["remoteJid"],
      _0x58beb3 = await _0x2ba217["sendMessage"](
        _0x4a4f3c,
        { text: "🇩🇪 Fetching Bundesliga standings..." },
        { quoted: _0x3f2dda },
      );
    try {
      const { data: _0x7e02ea } = await axios["get"](
        API + "/bundesliga/standings",
      );
      if (!_0x7e02ea["status"] || !_0x7e02ea["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x2d836a = _0x7e02ea["result"]["standings"];
      let _0x56012e = "🇩🇪 *" + _0x7e02ea["result"]["competition"] + "*\x0a";
      ((_0x56012e += "```"),
        (_0x56012e += "\nPos Team               P  GD Pts\n"),
        (_0x56012e += "───────────────────────────────\n"),
        _0x2d836a["forEach"]((_0x72595e) => {
          const _0x504f2a = String(_0x72595e["position"])["padEnd"](0x3),
            _0x9a9ea1 = _0x72595e["team"]
              ["replace"](" FC", "")
              ["replace"](" AFC", "")
              ["slice"](0x0, 0x12)
              ["padEnd"](0x12),
            _0x3c7593 = String(_0x72595e["played"])["padEnd"](0x3),
            _0x3bf276 = String(
              _0x72595e["goalDifference"] >= 0x0
                ? "+" + _0x72595e["goalDifference"]
                : _0x72595e["goalDifference"],
            )["padEnd"](0x4),
            _0x591380 = String(_0x72595e["points"])["padStart"](0x3);
          _0x56012e +=
            "" +
            _0x504f2a +
            _0x9a9ea1 +
            _0x3c7593 +
            _0x3bf276 +
            _0x591380 +
            "\x0a";
        }),
        (_0x56012e += "```"),
        await _0x2ba217["sendMessage"](_0x4a4f3c, {
          text: _0x56012e,
          edit: _0x58beb3["key"],
        }));
    } catch (_0x356ad3) {
      await _0x2ba217["sendMessage"](_0x4a4f3c, {
        text:
          "❌ Failed to fetch Bundesliga standings.\n\n" + _0x356ad3["message"],
        edit: _0x58beb3["key"],
      });
    }
  },
};
