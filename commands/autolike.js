const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "autolike",
  description: "Toggle auto-reacting to contacts' status updates.",
  async execute(_0x49698c, _0x222ef5, _0xa44a58) {
    if (!isOwner(_0x222ef5)) return;
    if (_0xa44a58[0x0] === "on")
      return (
        settingsStore["set"]("autolike", !![]),
        await _0x49698c["sendMessage"](_0x222ef5["key"]["remoteJid"], {
          text: "❤️ *Auto Like Status:* ENABLED [🟢]",
        })
      );
    else {
      if (_0xa44a58[0x0] === "off")
        return (
          settingsStore["set"]("autolike", ![]),
          await _0x49698c["sendMessage"](_0x222ef5["key"]["remoteJid"], {
            text: "❤️ *Auto Like Status:* DISABLED [🔴]",
          })
        );
    }
    const _0x2af4d8 = settingsStore["get"]("autolike", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x49698c["sendMessage"](_0x222ef5["key"]["remoteJid"], {
      text:
        "❤️ *Auto Like Status:* " +
        _0x2af4d8 +
        "\n\n💡 Use `.autolike on` or `.autolike off` to change it.",
    });
  },
};
