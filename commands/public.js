const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "public",
  description: "Set bot to public mode.",
  async execute(_0x37f1a5, _0x21db5f) {
    if (!isOwner(_0x21db5f)) return;
    (settingsStore["set"]("mode", "public"),
      await _0x37f1a5["sendMessage"](_0x21db5f["key"]["remoteJid"], {
        text: "🌐 *Work Mode updated:* Bot is now set to *public*",
      }));
  },
};
