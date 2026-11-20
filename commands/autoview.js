const settingsStore = require("../utils/settingsStore");
module["exports"] = {
  name: "autoview",
  description:
    "Toggles auto-viewing of statuses (default: on). Usage: .autoview on | off",
  async execute(_0x477cd0, _0x46cf99, _0x677588) {
    const _0x5a4efd = _0x46cf99["key"]["remoteJid"],
      _0xc23d26 = (_0x677588[0x0] || "")["toLowerCase"]();
    if (_0xc23d26 !== "on" && _0xc23d26 !== "off") {
      const _0x401c8e = settingsStore["get"]("autoview", !![]);
      return _0x477cd0["sendMessage"](
        _0x5a4efd,
        {
          text:
            "👀 Auto-view statuses is currently *" +
            (_0x401c8e ? "ON" : "OFF") +
            "*.\nUsage: .autoview on | off",
        },
        { quoted: _0x46cf99 },
      );
    }
    (settingsStore["set"]("autoview", _0xc23d26 === "on"),
      await _0x477cd0["sendMessage"](
        _0x5a4efd,
        {
          text:
            "👀 Auto-view statuses is now *" +
            _0xc23d26["toUpperCase"]() +
            "*.",
        },
        { quoted: _0x46cf99 },
      ));
  },
};
