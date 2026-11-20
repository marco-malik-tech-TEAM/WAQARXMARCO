const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "menutype",
  description: "Set the menu display style. Usage: .menutype list|button",
  async execute(_0x178e1a, _0x18296f, _0x4aa399) {
    if (!isOwner(_0x18296f)) return;
    const _0x2f91a0 = _0x4aa399[0x0]?.["toLowerCase"]();
    if (_0x2f91a0 === "list" || _0x2f91a0 === "button")
      return (
        settingsStore["set"]("menutype", _0x2f91a0),
        await _0x178e1a["sendMessage"](_0x18296f["key"]["remoteJid"], {
          text: "📋 *Menu Type:* set to *" + _0x2f91a0 + "*",
        })
      );
    await _0x178e1a["sendMessage"](_0x18296f["key"]["remoteJid"], {
      text:
        "📋 *Current Menu Type:* " +
        settingsStore["get"]("menutype", "list") +
        "\n\n💡 Use `.menutype list` or `.menutype button` to change it.",
    });
  },
};
