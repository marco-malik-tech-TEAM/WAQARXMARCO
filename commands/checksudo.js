const { isOwner } = require("../utils/isOwner"),
  { listSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "checksudo",
  aliases: ["sudos"],
  description: "Lists all sudo users (owner only).",
  async execute(_0x2964c9, _0x5a2546) {
    const _0x4f1932 = _0x5a2546["key"]["remoteJid"];
    if (!isOwner(_0x5a2546))
      return _0x2964c9["sendMessage"](
        _0x4f1932,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x5a2546 },
      );
    const _0x31d3c3 = listSudo();
    if (!_0x31d3c3["length"])
      return _0x2964c9["sendMessage"](
        _0x4f1932,
        { text: "📋 *No sudo users set.*\n\nUse .addsudo @user to add one." },
        { quoted: _0x5a2546 },
      );
    const _0x2c1979 = [],
      _0x1ba51b = _0x31d3c3["map"]((_0x14c56e, _0x3bd25d) => {
        const _0x5b6d1d =
          _0x14c56e["ids"]["find"]((_0x4fad31) => _0x4fad31["type"] === "pn") ||
          _0x14c56e["ids"][0x0];
        return (
          _0x2c1979["push"](
            _0x5b6d1d["id"] +
              "@" +
              (_0x5b6d1d["type"] === "lid" ? "lid" : "s.whatsapp.net"),
          ),
          _0x3bd25d + 0x1 + ". @" + _0x5b6d1d["id"]
        );
      });
    await _0x2964c9["sendMessage"](
      _0x4f1932,
      {
        text:
          "══════════════════\n" +
          "  *CURRENT SUDO USERS*\n" +
          "══════════════════\n\n" +
          (_0x1ba51b["join"]("\x0a") + "\x0a\x0a") +
          ("*Total: " + _0x31d3c3["length"] + "*"),
        mentions: _0x2c1979,
      },
      { quoted: _0x5a2546 },
    );
  },
};
