const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "autorecording",
  description: "Toggle automatic recording status for incoming messages.",
  async execute(_0x2fb3e4, _0xbe0f8c, _0x5d99a2) {
    if (!isOwner(_0xbe0f8c)) return;
    if (_0x5d99a2[0x0] === "on")
      return (
        settingsStore["set"]("autorecording", !![]),
        await _0x2fb3e4["sendMessage"](_0xbe0f8c["key"]["remoteJid"], {
          text: "🎙️ *Auto-Recording:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x5d99a2[0x0] === "off")
        return (
          settingsStore["set"]("autorecording", ![]),
          await _0x2fb3e4["sendMessage"](_0xbe0f8c["key"]["remoteJid"], {
            text: "🎙️ *Auto-Recording:* DISABLED [🔴]",
          })
        );
    }
    const _0x124dea = settingsStore["get"]("autorecording", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x2fb3e4["sendMessage"](_0xbe0f8c["key"]["remoteJid"], {
      text:
        "🎙️ *Auto-Recording Status:* " +
        _0x124dea +
        "\n\n💡 Use `.autorecording on` or `.autorecording off` to change it.",
    });
  },
};
