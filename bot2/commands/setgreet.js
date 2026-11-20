const groupSettingsStore = require("../utils/groupSettingsStore"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "setgreet",
  description:
    "Toggle the MARCO X WAQAR MD BOT greeting for new members. Usage: .setgreet on/off",
  async execute(_0x1ea044, _0x3e1e99, _0x50238e) {
    const _0xbfd4e6 = _0x3e1e99["key"]["remoteJid"];
    if (!_0xbfd4e6["endsWith"]("@g.us"))
      return _0x1ea044["sendMessage"](
        _0xbfd4e6,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x3e1e99 },
      );
    if (!isOwner(_0x3e1e99) && !isSudo(_0x3e1e99))
      return _0x1ea044["sendMessage"](
        _0xbfd4e6,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x3e1e99 },
      );
    const _0x4e65e9 = _0x50238e[0x0]?.["toLowerCase"]();
    if (_0x4e65e9 !== "on" && _0x4e65e9 !== "off")
      return _0x1ea044["sendMessage"](
        _0xbfd4e6,
        { text: "❌ *Usage: .setgreet on  or  .setgreet off*" },
        { quoted: _0x3e1e99 },
      );
    (groupSettingsStore["set"](_0xbfd4e6, "setgreet", _0x4e65e9 === "on"),
      await _0x1ea044["sendMessage"](
        _0xbfd4e6,
        { text: "👋 *Greeting turned " + _0x4e65e9["toUpperCase"]() + ".*" },
        { quoted: _0x3e1e99 },
      ));
  },
};
