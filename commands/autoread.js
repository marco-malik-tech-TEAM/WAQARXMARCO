const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "autoread",
  description: "Toggle automatic read receipts for incoming messages.",
  async execute(_0xb0553a, _0x4b1de9, _0x3bbdc8) {
    if (!isOwner(_0x4b1de9)) return;
    if (_0x3bbdc8[0x0] === "on")
      return (
        settingsStore["set"]("autoread", !![]),
        await _0xb0553a["sendMessage"](_0x4b1de9["key"]["remoteJid"], {
          text: "📖 *Auto Read:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x3bbdc8[0x0] === "off")
        return (
          settingsStore["set"]("autoread", ![]),
          await _0xb0553a["sendMessage"](_0x4b1de9["key"]["remoteJid"], {
            text: "📖 *Auto Read:* DISABLED [🔴]",
          })
        );
    }
    const _0x369bad = settingsStore["get"]("autoread", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0xb0553a["sendMessage"](_0x4b1de9["key"]["remoteJid"], {
      text:
        "📖 *Auto Read Status:* " +
        _0x369bad +
        "\n\n💡 Use `.autoread on` or `.autoread off` to change it.",
    });
  },
};
