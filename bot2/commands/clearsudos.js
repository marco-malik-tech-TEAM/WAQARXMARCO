const { isOwner } = require("../utils/isOwner"),
  { clearSudo, listSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "clearsudos",
  aliases: ["removeallsudos", "delsudos", "rsudos"],
  description: "Removes all sudo users at once (owner only).",
  async execute(_0x56bfbd, _0x438212) {
    const _0x6f4b7a = _0x438212["key"]["remoteJid"];
    if (!isOwner(_0x438212))
      return _0x56bfbd["sendMessage"](
        _0x6f4b7a,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x438212 },
      );
    const _0x1d4f0e = listSudo()["length"];
    if (_0x1d4f0e === 0x0)
      return _0x56bfbd["sendMessage"](
        _0x6f4b7a,
        { text: "📋 *No sudo users to remove.*" },
        { quoted: _0x438212 },
      );
    try {
      clearSudo();
    } catch (_0xd97275) {
      return _0x56bfbd["sendMessage"](
        _0x6f4b7a,
        { text: "❌ *Failed to clear sudos. Check the sudo store.*" },
        { quoted: _0x438212 },
      );
    }
    await _0x56bfbd["sendMessage"](
      _0x6f4b7a,
      {
        text:
          "✅ *All sudo users have been removed.*\n🗑️ *" +
          _0x1d4f0e +
          " user(s) cleared.*",
      },
      { quoted: _0x438212 },
    );
  },
};
