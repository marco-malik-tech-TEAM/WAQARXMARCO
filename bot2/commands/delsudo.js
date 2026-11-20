const { isOwner } = require("../utils/isOwner"),
  { removeSudo, findSudoEntry, resolveIds } = require("../utils/isSudo");
module["exports"] = {
  name: "delsudo",
  aliases: ["removesudo", "rmsudo", "rsudo"],
  description: "Revokes a user's sudo access (owner only).",
  async execute(_0x5890a8, _0x1358a6, _0x1ebb81) {
    const _0x238453 = _0x1358a6["key"]["remoteJid"];
    if (!isOwner(_0x1358a6))
      return _0x5890a8["sendMessage"](
        _0x238453,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x1358a6 },
      );
    const _0xe06701 =
        _0x1358a6["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0xb6c3d1 = _0xe06701?.["mentionedJid"]?.[0x0];
    let _0x21ed4b = _0xe06701 ? resolveIds(_0xe06701) : [];
    if (!_0x21ed4b["length"] && _0xb6c3d1)
      _0x21ed4b = resolveIds({ participant: _0xb6c3d1 });
    if (!_0x21ed4b["length"] && _0x1ebb81[0x0])
      _0x21ed4b = resolveIds({
        participant: _0x1ebb81[0x0] + "@s.whatsapp.net",
      });
    if (!_0x21ed4b["length"])
      return _0x5890a8["sendMessage"](
        _0x238453,
        {
          text: "❌ *Mention a user, reply to their message, or provide a number.*\n\nUsage: *.delsudo @user*",
        },
        { quoted: _0x1358a6 },
      );
    const _0x9a9b30 =
        _0x21ed4b["find"]((_0x29749b) => _0x29749b["type"] === "pn")?.["id"] ||
        _0x21ed4b[0x0]["id"],
      _0x2af94c =
        _0x21ed4b["find"]((_0x461036) => _0x461036["type"] === "pn")?.["jid"] ||
        _0x21ed4b[0x0]["jid"],
      _0x3f31a6 = findSudoEntry(_0x21ed4b);
    if (!_0x3f31a6)
      return _0x5890a8["sendMessage"](
        _0x238453,
        {
          text: "⚠️ @" + _0x9a9b30 + " is not a sudo user.",
          mentions: [_0x2af94c],
        },
        { quoted: _0x1358a6 },
      );
    (removeSudo(_0x21ed4b),
      await _0x5890a8["sendMessage"](
        _0x238453,
        {
          text: "✅ @" + _0x9a9b30 + " has been removed from sudo.",
          mentions: [_0x2af94c],
        },
        { quoted: _0x1358a6 },
      ));
  },
};
