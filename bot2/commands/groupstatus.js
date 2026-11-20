const groupSettingsStore = require("../utils/groupSettingsStore");
module["exports"] = {
  name: "groupstatus",
  description: "Shows this group's current settings.",
  async execute(_0x241bf7, _0x4c34b9) {
    const _0x5dd5b0 = _0x4c34b9["key"]["remoteJid"];
    if (!_0x5dd5b0["endsWith"]("@g.us"))
      return _0x241bf7["sendMessage"](
        _0x5dd5b0,
        { text: "❌ This command only works in groups." },
        { quoted: _0x4c34b9 },
      );
    const _0x2d3c74 = groupSettingsStore["getAll"](_0x5dd5b0),
      _0x4b33a1 = (_0x31bd25) => (_0x31bd25 ? "✅ ON" : "❌ OFF"),
      _0x5a1de1 =
        "⚙️ *Group Settings*\n\n" +
        ("┣ Antilink: " + _0x4b33a1(_0x2d3c74["antilink"]) + "\x0a") +
        ("┣ Welcome: " + _0x4b33a1(_0x2d3c74["welcome"]) + "\x0a") +
        ("┣ Goodbye: " + _0x4b33a1(_0x2d3c74["goodbye"]) + "\x0a") +
        ("┣ Anticall: " + _0x4b33a1(_0x2d3c74["anticall"]) + "\x0a") +
        ("┗ Antiword: " + _0x4b33a1(_0x2d3c74["antiword"]));
    await _0x241bf7["sendMessage"](
      _0x5dd5b0,
      { text: _0x5a1de1 },
      { quoted: _0x4c34b9 },
    );
  },
};
