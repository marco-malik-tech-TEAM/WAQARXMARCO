const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "autotyping",
  description: "Toggle automatic typing status for incoming messages.",
  async execute(_0x49ff77, _0xd1c9d, _0x5dbccf) {
    if (!isOwner(_0xd1c9d)) return;
    if (_0x5dbccf[0x0] === "on")
      return (
        settingsStore["set"]("autotyping", !![]),
        await _0x49ff77["sendMessage"](_0xd1c9d["key"]["remoteJid"], {
          text: "💬 *Auto-Typing:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x5dbccf[0x0] === "off")
        return (
          settingsStore["set"]("autotyping", ![]),
          await _0x49ff77["sendMessage"](_0xd1c9d["key"]["remoteJid"], {
            text: "💬 *Auto-Typing:* DISABLED [🔴]",
          })
        );
    }
    const _0x45ad9f = settingsStore["get"]("autotyping", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x49ff77["sendMessage"](_0xd1c9d["key"]["remoteJid"], {
      text:
        "💬 *Auto-Typing Status:* " +
        _0x45ad9f +
        "\n\n💡 Use `.autotyping on` or `.autotyping off` to change it.",
    });
  },
};
