const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "welcomegoodbye",
  description: "Master toggle for welcome/goodbye messages bot-wide.",
  async execute(_0x347555, _0x153949, _0x549466) {
    if (!isOwner(_0x153949)) return;
    if (_0x549466[0x0] === "on")
      return (
        settingsStore["set"]("welcomegoodbye", !![]),
        await _0x347555["sendMessage"](_0x153949["key"]["remoteJid"], {
          text: "👋 *Welcome/Goodbye:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x549466[0x0] === "off")
        return (
          settingsStore["set"]("welcomegoodbye", ![]),
          await _0x347555["sendMessage"](_0x153949["key"]["remoteJid"], {
            text: "👋 *Welcome/Goodbye:* DISABLED [🔴]",
          })
        );
    }
    const _0x590f69 = settingsStore["get"]("welcomegoodbye", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x347555["sendMessage"](_0x153949["key"]["remoteJid"], {
      text:
        "👋 *Welcome/Goodbye Status:* " +
        _0x590f69 +
        "\n\n💡 Use `.welcomegoodbye on` or `.welcomegoodbye off` to change it.",
    });
  },
};
