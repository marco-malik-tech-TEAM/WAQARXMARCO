const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "autobio",
  description: "Toggle automatic bio/about text updates.",
  async execute(_0x2115cf, _0x1d1df7, _0x3da7e7) {
    if (!isOwner(_0x1d1df7)) return;
    if (_0x3da7e7[0x0] === "on")
      return (
        settingsStore["set"]("autobio", !![]),
        await _0x2115cf["sendMessage"](_0x1d1df7["key"]["remoteJid"], {
          text: "📝 *Auto Bio:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x3da7e7[0x0] === "off")
        return (
          settingsStore["set"]("autobio", ![]),
          await _0x2115cf["sendMessage"](_0x1d1df7["key"]["remoteJid"], {
            text: "📝 *Auto Bio:* DISABLED [🔴]",
          })
        );
    }
    const _0x3297c9 = settingsStore["get"]("autobio", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x2115cf["sendMessage"](_0x1d1df7["key"]["remoteJid"], {
      text:
        "📝 *Auto Bio Status:* " +
        _0x3297c9 +
        "\n\n💡 Use `.autobio on` or `.autobio off` to change it.",
    });
  },
};
