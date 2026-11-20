const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "ligue1",
  description: "Shows the current Ligue 1 standings.",
  async execute(_0x4ee955, _0x3b3e39) {
    const _0x33abe5 = _0x3b3e39["key"]["remoteJid"],
      _0x49989a = await _0x4ee955["sendMessage"](
        _0x33abe5,
        { text: "🇫🇷 Fetching Ligue 1 standings..." },
        { quoted: _0x3b3e39 },
      );
    try {
      const { data: _0x11d5fe } = await axios["get"](API + "/ligue1/standings");
      if (!_0x11d5fe["status"] || !_0x11d5fe["result"]?.["standings"])
        throw new Error("No standings available.");
      const _0x16981f = _0x11d5fe["result"]["standings"];
      let _0x32623f = "🇫🇷 *" + _0x11d5fe["result"]["competition"] + "*\x0a";
      ((_0x32623f += "```"),
        (_0x32623f += "\nPos Team               P  GD Pts\n"),
        (_0x32623f += "───────────────────────────────\n"),
        _0x16981f["forEach"]((_0x123202) => {
          const _0x186cc2 = String(_0x123202["position"])["padEnd"](0x3),
            _0x4551e0 = _0x123202["team"]
              ["replace"](" FC", "")
              ["replace"](" AFC", "")
              ["replace"](" CF", "")
              ["slice"](0x0, 0x12)
              ["padEnd"](0x12),
            _0x7e7fac = String(_0x123202["played"])["padEnd"](0x3),
            _0x169a8d = String(
              _0x123202["goalDifference"] >= 0x0
                ? "+" + _0x123202["goalDifference"]
                : _0x123202["goalDifference"],
            )["padEnd"](0x4),
            _0x161163 = String(_0x123202["points"])["padStart"](0x3);
          _0x32623f +=
            "" +
            _0x186cc2 +
            _0x4551e0 +
            _0x7e7fac +
            _0x169a8d +
            _0x161163 +
            "\x0a";
        }),
        (_0x32623f += "```"),
        await _0x4ee955["sendMessage"](_0x33abe5, {
          text: _0x32623f,
          edit: _0x49989a["key"],
        }));
    } catch (_0x4865af) {
      await _0x4ee955["sendMessage"](_0x33abe5, {
        text:
          "❌ Failed to fetch Ligue 1 standings.\n\n" + _0x4865af["message"],
        edit: _0x49989a["key"],
      });
    }
  },
};
