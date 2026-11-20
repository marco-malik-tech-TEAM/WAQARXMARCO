const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "antilinkall",
  description: "Toggle group-wide link deletion across all groups.",
  async execute(_0x503f24, _0x5fbe08, _0x3ab03f) {
    if (!isOwner(_0x5fbe08)) return;
    if (_0x3ab03f[0x0] === "on")
      return (
        settingsStore["set"]("antilinkall", !![]),
        await _0x503f24["sendMessage"](_0x5fbe08["key"]["remoteJid"], {
          text: "🔗 *Antilink (All Groups):* ENABLED [🟢]",
        })
      );
    else {
      if (_0x3ab03f[0x0] === "off")
        return (
          settingsStore["set"]("antilinkall", ![]),
          await _0x503f24["sendMessage"](_0x5fbe08["key"]["remoteJid"], {
            text: "🔗 *Antilink (All Groups):* DISABLED [🔴]",
          })
        );
    }
    const _0xaf7683 = settingsStore["get"]("antilinkall", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x503f24["sendMessage"](_0x5fbe08["key"]["remoteJid"], {
      text:
        "🔗 *Antilink (All Groups) Status:* " +
        _0xaf7683 +
        "\n\n💡 Use `.antilinkall on` or `.antilinkall off` to change it.",
    });
  },
};
