const settingsStore = require("../utils/settingsStore"),
  config = require("../config/config"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "prefix",
  description: "Change the bot command prefix. Usage: .prefix <new prefix>",
  async execute(_0x1f66a3, _0x1fffa3, _0x82309) {
    const _0x481995 = _0x1fffa3["key"]["remoteJid"];
    if (!isOwner(_0x1fffa3))
      return _0x1f66a3["sendMessage"](
        _0x481995,
        { text: "❌ Only the owner can change the prefix." },
        { quoted: _0x1fffa3 },
      );
    const _0x5bf12e = settingsStore["get"]("prefix", config["prefix"]),
      _0x33005c = _0x82309[0x0];
    if (!_0x33005c)
      return _0x1f66a3["sendMessage"](
        _0x481995,
        {
          text:
            "⚡ *Current prefix:* `" +
            _0x5bf12e +
            "`\n\nUsage: " +
            _0x5bf12e +
            "prefix <new prefix>\nExample: " +
            _0x5bf12e +
            "prefix !",
        },
        { quoted: _0x1fffa3 },
      );
    if (_0x33005c["length"] > 0x3)
      return _0x1f66a3["sendMessage"](
        _0x481995,
        { text: "❌ Keep the prefix short — 1 to 3 characters works best." },
        { quoted: _0x1fffa3 },
      );
    (settingsStore["set"]("prefix", _0x33005c),
      await _0x1f66a3["sendMessage"](
        _0x481995,
        {
          text:
            "✅ Prefix changed from `" +
            _0x5bf12e +
            "` to `" +
            _0x33005c +
            "`.\n\nFrom now on, use commands like: " +
            _0x33005c +
            "menu",
        },
        { quoted: _0x1fffa3 },
      ));
  },
};
