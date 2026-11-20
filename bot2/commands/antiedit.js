const settingsStore = require("../utils/settingsStore");
module["exports"] = {
  name: "antiedit",
  description:
    "Controls revealing edited messages. Usage: .antiedit on|off|g|p",
  async execute(_0x34fdc4, _0x775dff, _0x534bbb) {
    const _0x33cd84 = _0x775dff["key"]["remoteJid"],
      _0x4d75c9 = (_0x534bbb[0x0] || "")["toLowerCase"]();
    if (!["on", "off", "g", "p"]["includes"](_0x4d75c9)) {
      const _0x43e69e = settingsStore["get"]("antiedit", ![]),
        _0x333652 = settingsStore["get"]("antieditDest", "p");
      return _0x34fdc4["sendMessage"](
        _0x33cd84,
        {
          text:
            "✏️ Antiedit is currently *" +
            (_0x43e69e ? "ON" : "OFF") +
            "*, sending to *" +
            (_0x333652 === "g" ? "original chat" : "bot DM") +
            "*.\n\nUsage:\n.antiedit on | off\n.antiedit g (reveal in original chat)\n.antiedit p (reveal in bot DM)",
        },
        { quoted: _0x775dff },
      );
    }
    if (_0x4d75c9 === "on")
      return (
        settingsStore["set"]("antiedit", !![]),
        _0x34fdc4["sendMessage"](
          _0x33cd84,
          { text: "✏️ Antiedit is now *ON*." },
          { quoted: _0x775dff },
        )
      );
    if (_0x4d75c9 === "off")
      return (
        settingsStore["set"]("antiedit", ![]),
        _0x34fdc4["sendMessage"](
          _0x33cd84,
          { text: "✏️ Antiedit is now *OFF*." },
          { quoted: _0x775dff },
        )
      );
    if (_0x4d75c9 === "g" || _0x4d75c9 === "p") {
      (settingsStore["set"]("antiedit", !![]),
        settingsStore["set"]("antieditDest", _0x4d75c9));
      const _0x39a947 =
        _0x4d75c9 === "g" ? "the original chat" : "the bot's own DM";
      return _0x34fdc4["sendMessage"](
        _0x33cd84,
        { text: "✏️ Antiedit is now *ON*, sending to *" + _0x39a947 + "*." },
        { quoted: _0x775dff },
      );
    }
  },
};
