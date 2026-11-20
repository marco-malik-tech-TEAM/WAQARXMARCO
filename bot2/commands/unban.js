const { isOwner } = require("../utils/isOwner"),
  { unbanUser, findBanEntry } = require("../utils/banList"),
  { resolveIds } = require("../utils/isSudo");
module["exports"] = {
  name: "unban",
  description:
    "Unbans a user, restoring their access to bot commands (owner only).",
  async execute(_0x2718ca, _0x2e1147, _0x18dfce) {
    const _0x3c2355 = _0x2e1147["key"]["remoteJid"];
    if (!isOwner(_0x2e1147))
      return _0x2718ca["sendMessage"](
        _0x3c2355,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x2e1147 },
      );
    const _0x47281b =
        _0x2e1147["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x5457d7 = _0x47281b?.["mentionedJid"]?.[0x0];
    let _0x3eb24a = _0x47281b ? resolveIds(_0x47281b) : [];
    if (!_0x3eb24a["length"] && _0x5457d7)
      _0x3eb24a = resolveIds({ participant: _0x5457d7 });
    if (!_0x3eb24a["length"] && _0x18dfce[0x0])
      _0x3eb24a = resolveIds({
        participant: _0x18dfce[0x0] + "@s.whatsapp.net",
      });
    if (!_0x3eb24a["length"])
      return _0x2718ca["sendMessage"](
        _0x3c2355,
        {
          text: "❌ *Mention a user, reply to their message, or provide a number.*\n\nUsage: *.unban @user*",
        },
        { quoted: _0x2e1147 },
      );
    const _0x4422ea =
        _0x3eb24a["find"]((_0x501e66) => _0x501e66["type"] === "pn")?.["id"] ||
        _0x3eb24a[0x0]["id"],
      _0x2a472b =
        _0x3eb24a["find"]((_0x80c974) => _0x80c974["type"] === "pn")?.["jid"] ||
        _0x3eb24a[0x0]["jid"],
      _0x4e828f = findBanEntry(_0x3eb24a);
    if (!_0x4e828f)
      return _0x2718ca["sendMessage"](
        _0x3c2355,
        { text: "⚠️ @" + _0x4422ea + " is not banned.", mentions: [_0x2a472b] },
        { quoted: _0x2e1147 },
      );
    (unbanUser(_0x3eb24a),
      await _0x2718ca["sendMessage"](
        _0x3c2355,
        {
          text: "✅ @" + _0x4422ea + " has been unbanned.",
          mentions: [_0x2a472b],
        },
        { quoted: _0x2e1147 },
      ));
  },
};
