const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "wapresence",
  description: "Toggle always-online WhatsApp presence.",
  async execute(_0x21c7a3, _0x15a8f9, _0x4fe1f8) {
    if (!isOwner(_0x15a8f9)) return;
    if (_0x4fe1f8[0x0] === "on")
      return (
        settingsStore["set"]("wapresence", !![]),
        await _0x21c7a3["sendPresenceUpdate"]("available"),
        await _0x21c7a3["sendMessage"](_0x15a8f9["key"]["remoteJid"], {
          text: "🟢 *Always Online:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x4fe1f8[0x0] === "off")
        return (
          settingsStore["set"]("wapresence", ![]),
          await _0x21c7a3["sendPresenceUpdate"]("unavailable"),
          await _0x21c7a3["sendMessage"](_0x15a8f9["key"]["remoteJid"], {
            text: "🟢 *Always Online:* DISABLED [🔴]",
          })
        );
    }
    const _0x27848a = settingsStore["get"]("wapresence", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x21c7a3["sendMessage"](_0x15a8f9["key"]["remoteJid"], {
      text:
        "🟢 *Always Online Status:* " +
        _0x27848a +
        "\n\n💡 Use `.wapresence on` or `.wapresence off` to change it.",
    });
  },
};
