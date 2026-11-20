const settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "antitag",
  description: "Toggle deleting mass-tag spam messages from non-admins.",
  async execute(_0x8dba9c, _0x58c82a, _0x421b4b) {
    const _0xa0f41f = _0x58c82a["key"]["remoteJid"];
    if (!isOwner(_0x58c82a) && !isSudo(_0x58c82a))
      return _0x8dba9c["sendMessage"](
        _0xa0f41f,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x58c82a },
      );
    if (_0x421b4b[0x0] === "on")
      return (
        settingsStore["set"]("antitag", !![]),
        await _0x8dba9c["sendMessage"](
          _0xa0f41f,
          { text: "🏷️ *Antitag:* ENABLED [🟢]" },
          { quoted: _0x58c82a },
        )
      );
    else {
      if (_0x421b4b[0x0] === "off")
        return (
          settingsStore["set"]("antitag", ![]),
          await _0x8dba9c["sendMessage"](
            _0xa0f41f,
            { text: "🏷️ *Antitag:* DISABLED [🔴]" },
            { quoted: _0x58c82a },
          )
        );
    }
    const _0x316236 = settingsStore["get"]("antitag", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x8dba9c["sendMessage"](
      _0xa0f41f,
      {
        text:
          "🏷️ *Antitag Status:* " +
          _0x316236 +
          "\n\n💡 Use `.antitag on` or `.antitag off` to change it.",
      },
      { quoted: _0x58c82a },
    );
  },
};
