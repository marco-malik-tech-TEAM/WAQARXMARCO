const groupSettingsStore = require("../utils/groupSettingsStore");
module["exports"] = {
  name: "pdm",
  description: "Toggle promote/demote notifications. Usage: .pdm on/off",
  async execute(_0x290bfe, _0x34f9c8, _0x688434) {
    const _0x3c5065 = _0x34f9c8["key"]["remoteJid"];
    if (!_0x3c5065["endsWith"]("@g.us"))
      return _0x290bfe["sendMessage"](
        _0x3c5065,
        { text: "❌ This command only works in groups." },
        { quoted: _0x34f9c8 },
      );
    const _0x199148 = _0x688434[0x0]?.["toLowerCase"]();
    if (_0x199148 !== "on" && _0x199148 !== "off")
      return _0x290bfe["sendMessage"](
        _0x3c5065,
        { text: "❌ Usage: .pdm on  or  .pdm off" },
        { quoted: _0x34f9c8 },
      );
    (groupSettingsStore["set"](_0x3c5065, "pdm", _0x199148 === "on"),
      await _0x290bfe["sendMessage"](
        _0x3c5065,
        { text: "📢 Promote/demote notifications turned " + _0x199148 + "." },
        { quoted: _0x34f9c8 },
      ));
  },
};
