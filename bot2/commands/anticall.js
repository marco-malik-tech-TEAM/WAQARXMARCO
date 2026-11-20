const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "anticall",
  description: "Toggle automatically rejecting incoming calls.",
  async execute(_0x259711, _0x2666de, _0x4da8c6) {
    if (!isOwner(_0x2666de)) return;
    if (_0x4da8c6[0x0] === "on")
      return (
        settingsStore["set"]("anticall", !![]),
        await _0x259711["sendMessage"](_0x2666de["key"]["remoteJid"], {
          text: "📵 *Anticall:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x4da8c6[0x0] === "off")
        return (
          settingsStore["set"]("anticall", ![]),
          await _0x259711["sendMessage"](_0x2666de["key"]["remoteJid"], {
            text: "📵 *Anticall:* DISABLED [🔴]",
          })
        );
    }
    const _0x3fd7ad = settingsStore["get"]("anticall", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x259711["sendMessage"](_0x2666de["key"]["remoteJid"], {
      text:
        "📵 *Anticall Status:* " +
        _0x3fd7ad +
        "\n\n💡 Use `.anticall on` or `.anticall off` to change it.",
    });
  },
};
