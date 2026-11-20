const config = require("../config/config"),
  settingsStore = require("../utils/settingsStore"),
  { isDev } = require("../utils/isDev");
module["exports"] = {
  name: "getprefix",
  aliases: ["getp", "prefix"],
  description: "Shows the current bot prefix.",
  noprefix: ["getprefix", "getp", "prefix"],
  async execute(_0x561f06, _0x5c2ac7) {
    const _0x5148ba = _0x5c2ac7["key"]["remoteJid"];
    if (_0x5c2ac7["key"]["fromMe"]) return;
    if (!isDev(_0x5c2ac7, _0x561f06)) return;
    const _0x490559 = settingsStore["get"]("prefix", config["prefix"]);
    await _0x561f06["sendMessage"](
      _0x5148ba,
      { text: "Prefix: " + _0x490559 },
      { quoted: _0x5c2ac7 },
    );
  },
};
