const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "antidelete",
  description:
    "Controls resending deleted/edited messages. Usage: .antidelete on|off|g|p",
  async execute(_0x75363, _0x2e0522, _0x439b37) {
    const _0x21fb75 = _0x2e0522["key"]["remoteJid"];
    if (!isOwner(_0x2e0522))
      return _0x75363["sendMessage"](
        _0x21fb75,
        { text: "❌ Only the bot owner can execute this command dickhead." },
        { quoted: _0x2e0522 },
      );
    const _0x8a5e2f = (_0x439b37[0x0] || "")["toLowerCase"]();
    if (!["on", "off", "g", "p"]["includes"](_0x8a5e2f)) {
      const _0xf090d5 = settingsStore["get"]("antidelete", ![]),
        _0x5d1af7 = settingsStore["get"]("antideleteDest", "p");
      return _0x75363["sendMessage"](
        _0x21fb75,
        {
          text:
            "🗑️ Antidelete is currently *" +
            (_0xf090d5 ? "ON" : "OFF") +
            "*, sending to *" +
            (_0x5d1af7 === "g" ? "original chat" : "bot DM") +
            "*.\n\nUsage:\n.antidelete on | off\n.antidelete g (resend to original chat)\n.antidelete p (resend to bot DM)",
        },
        { quoted: _0x2e0522 },
      );
    }
    if (_0x8a5e2f === "on")
      return (
        settingsStore["set"]("antidelete", !![]),
        _0x75363["sendMessage"](
          _0x21fb75,
          { text: "🗑️ Antidelete is now *ON*." },
          { quoted: _0x2e0522 },
        )
      );
    if (_0x8a5e2f === "off")
      return (
        settingsStore["set"]("antidelete", ![]),
        _0x75363["sendMessage"](
          _0x21fb75,
          { text: "🗑️ Antidelete is now *OFF*." },
          { quoted: _0x2e0522 },
        )
      );
    if (_0x8a5e2f === "g" || _0x8a5e2f === "p") {
      (settingsStore["set"]("antidelete", !![]),
        settingsStore["set"]("antideleteDest", _0x8a5e2f));
      const _0x1f4c0f =
        _0x8a5e2f === "g" ? "the original chat" : "the bot's own DM";
      return _0x75363["sendMessage"](
        _0x21fb75,
        {
          text: "🗑️ Antidelete is now *ON*, resending to *" + _0x1f4c0f + "*.",
        },
        { quoted: _0x2e0522 },
      );
    }
  },
};
