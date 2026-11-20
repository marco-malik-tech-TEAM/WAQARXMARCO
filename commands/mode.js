const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "mode",
  description: "Toggle bot work mode between public and private.",
  async execute(_0x35bee6, _0x17d88d, _0x5a8d85) {
    if (!isOwner(_0x17d88d)) return;
    if (_0x5a8d85[0x0] === "public" || _0x5a8d85[0x0] === "private")
      return (
        settingsStore["set"]("mode", _0x5a8d85[0x0]),
        await _0x35bee6["sendMessage"](_0x17d88d["key"]["remoteJid"], {
          text:
            "🔒 *Work Mode updated:* Bot is now set to *" +
            _0x5a8d85[0x0] +
            "*",
        })
      );
    const _0x4d4aa4 = settingsStore["get"]("mode", "public");
    await _0x35bee6["sendMessage"](_0x17d88d["key"]["remoteJid"], {
      text:
        "🔒 *Current Mode:* `" +
        _0x4d4aa4["toUpperCase"]() +
        "`\n\n💡 Use `.mode public` or `.mode private` to change it.",
    });
  },
};
