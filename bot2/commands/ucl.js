const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "ucl",
  description: "Shows the current UEFA Champions League standings.",
  async execute(_0x3ca3ae, _0x475848) {
    const _0x4ddbe8 = _0x475848["key"]["remoteJid"],
      _0x9fa884 = await _0x3ca3ae["sendMessage"](
        _0x4ddbe8,
        { text: "🏆 Fetching UEFA Champions League standings..." },
        { quoted: _0x475848 },
      );
    try {
      const { data: _0x1c9592 } = await axios["get"](API + "/ucl/standings");
      if (!_0x1c9592["status"] || !_0x1c9592["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x215500 = _0x1c9592["result"]["standings"];
      let _0x50e1fd = "🏆 *" + _0x1c9592["result"]["competition"] + "*\x0a";
      ((_0x50e1fd += "```"),
        (_0x50e1fd += "\nPos Team               P  GD Pts\n"),
        (_0x50e1fd += "───────────────────────────────\n"),
        _0x215500["forEach"]((_0x5170c5) => {
          const _0x2fe34b = String(_0x5170c5["position"])["padEnd"](0x3),
            _0x364a26 = _0x5170c5["team"]
              ["replace"](" FC", "")
              ["replace"](" AFC", "")
              ["replace"](" CF", "")
              ["replace"](" AC", "")
              ["slice"](0x0, 0x12)
              ["padEnd"](0x12),
            _0x108802 = String(_0x5170c5["played"])["padEnd"](0x3),
            _0x19972f = String(
              _0x5170c5["goalDifference"] >= 0x0
                ? "+" + _0x5170c5["goalDifference"]
                : _0x5170c5["goalDifference"],
            )["padEnd"](0x4),
            _0x2d5fa6 = String(_0x5170c5["points"])["padStart"](0x3);
          _0x50e1fd +=
            "" +
            _0x2fe34b +
            _0x364a26 +
            _0x108802 +
            _0x19972f +
            _0x2d5fa6 +
            "\x0a";
        }),
        (_0x50e1fd += "```"),
        await _0x3ca3ae["sendMessage"](_0x4ddbe8, {
          text: _0x50e1fd,
          edit: _0x9fa884["key"],
        }));
    } catch (_0x31b3fe) {
      await _0x3ca3ae["sendMessage"](_0x4ddbe8, {
        text:
          "❌ Failed to fetch UEFA Champions League standings.\n\n" +
          _0x31b3fe["message"],
        edit: _0x9fa884["key"],
      });
    }
  },
};
