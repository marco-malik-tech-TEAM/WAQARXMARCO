const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "self",
  aliases: ["private"],
  description: "Set bot to private mode.",
  async execute(_0x4d3a4f, _0x5f0f3a) {
    if (!isOwner(_0x5f0f3a)) return;
    (settingsStore["set"]("mode", "private"),
      await _0x4d3a4f["sendMessage"](_0x5f0f3a["key"]["remoteJid"], {
        text: "🔒 *Work Mode updated:* Bot is now set to *private*",
      }));
  },
};
