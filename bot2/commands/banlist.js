const { isOwner } = require("../utils/isOwner"),
  { getBannedList } = require("../utils/banList");
module["exports"] = {
  name: "banlist",
  description: "Lists all banned users (owner only).",
  async execute(_0x222826, _0x23f186) {
    const _0x325294 = _0x23f186["key"]["remoteJid"];
    if (!isOwner(_0x23f186))
      return _0x222826["sendMessage"](
        _0x325294,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x23f186 },
      );
    const _0x5086b4 = getBannedList();
    if (!_0x5086b4["length"])
      return _0x222826["sendMessage"](
        _0x325294,
        {
          text: "📋 *No users are currently banned.*\n\nUse .ban @user to ban one.",
        },
        { quoted: _0x23f186 },
      );
    const _0x4c4386 = [],
      _0x12229a = _0x5086b4["map"]((_0x34451e, _0x5d5972) => {
        const _0x4cb2a4 =
          _0x34451e["ids"]["find"]((_0x12dcf3) => _0x12dcf3["type"] === "pn") ||
          _0x34451e["ids"][0x0];
        return (
          _0x4c4386["push"](
            _0x4cb2a4["id"] +
              "@" +
              (_0x4cb2a4["type"] === "lid" ? "lid" : "s.whatsapp.net"),
          ),
          _0x5d5972 + 0x1 + ". @" + _0x4cb2a4["id"]
        );
      });
    await _0x222826["sendMessage"](
      _0x325294,
      {
        text:
          "══════════════════\n" +
          "  *BANNED USERS*\n" +
          "══════════════════\n\n" +
          (_0x12229a["join"]("\x0a") + "\x0a\x0a") +
          ("*Total: " + _0x5086b4["length"] + "*"),
        mentions: _0x4c4386,
      },
      { quoted: _0x23f186 },
    );
  },
};
