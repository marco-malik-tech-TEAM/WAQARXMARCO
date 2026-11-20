const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "antibot",
  description:
    "Toggle kicking messages that look like bot commands from non-admins.",
  async execute(_0x58ac9f, _0x2676db, _0x593d42) {
    if (!isOwner(_0x2676db)) return;
    if (_0x593d42[0x0] === "on")
      return (
        settingsStore["set"]("antibot", !![]),
        await _0x58ac9f["sendMessage"](_0x2676db["key"]["remoteJid"], {
          text: "🤖 *Antibot:* ENABLED [🟢]",
        })
      );
    else {
      if (_0x593d42[0x0] === "off")
        return (
          settingsStore["set"]("antibot", ![]),
          await _0x58ac9f["sendMessage"](_0x2676db["key"]["remoteJid"], {
            text: "🤖 *Antibot:* DISABLED [🔴]",
          })
        );
    }
    const _0x3e7605 = settingsStore["get"]("antibot", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x58ac9f["sendMessage"](_0x2676db["key"]["remoteJid"], {
      text:
        "🤖 *Antibot Status:* " +
        _0x3e7605 +
        "\n\n💡 Use `.antibot on` or `.antibot off` to change it.",
    });
  },
};
