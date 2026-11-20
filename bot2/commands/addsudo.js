const { isOwner } = require("../utils/isOwner"),
  { addSudo, findSudoEntry, resolveIds } = require("../utils/isSudo");
module["exports"] = {
  name: "addsudo",
  aliases: ["sudo", "asudo"],
  description: "Grants a user sudo access (owner only).",
  async execute(_0x413910, _0x2b2428, _0x326b1e) {
    const _0x5963c3 = _0x2b2428["key"]["remoteJid"];
    if (!isOwner(_0x2b2428))
      return _0x413910["sendMessage"](
        _0x5963c3,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x2b2428 },
      );
    const _0x43dfc3 =
      _0x2b2428["message"]?.["extendedTextMessage"]?.["contextInfo"];
    let _0x386ad0 = _0x43dfc3 ? resolveIds(_0x43dfc3) : [];
    !_0x386ad0["length"] &&
      _0x326b1e[0x0] &&
      (_0x386ad0 = resolveIds({
        participant: _0x326b1e[0x0] + "@s.whatsapp.net",
      }));
    if (!_0x386ad0["length"])
      return _0x413910["sendMessage"](
        _0x5963c3,
        {
          text: "❌ *Reply to the user's message, or provide their number directly.*\n\nUsage: *.addsudo 923001234567*",
        },
        { quoted: _0x2b2428 },
      );
    const _0x93cbfd =
        _0x386ad0["find"]((_0x3f10e9) => _0x3f10e9["type"] === "pn")?.["id"] ||
        _0x386ad0[0x0]["id"],
      _0x5036ba =
        _0x386ad0["find"]((_0x52aa2f) => _0x52aa2f["type"] === "pn")?.["jid"] ||
        _0x386ad0[0x0]["jid"],
      _0x4f7c76 = findSudoEntry(_0x386ad0);
    if (_0x4f7c76) {
      const _0x36ed49 = _0x386ad0["filter"](
        (_0x37da9d) =>
          !_0x4f7c76["ids"]["some"](
            (_0x10b3f5) => _0x10b3f5["id"] === _0x37da9d["id"],
          ),
      );
      if (!_0x36ed49["length"])
        return _0x413910["sendMessage"](
          _0x5963c3,
          {
            text: "⚠️ @" + _0x93cbfd + " is already a sudo user.",
            mentions: [_0x5036ba],
          },
          { quoted: _0x2b2428 },
        );
      return (
        addSudo(_0x386ad0),
        _0x413910["sendMessage"](
          _0x5963c3,
          {
            text: "✅ @" + _0x93cbfd + " has been granted sudo access.",
            mentions: [_0x5036ba],
          },
          { quoted: _0x2b2428 },
        )
      );
    }
    (addSudo(_0x386ad0),
      await _0x413910["sendMessage"](
        _0x5963c3,
        {
          text: "✅ @" + _0x93cbfd + " has been granted sudo access.",
          mentions: [_0x5036ba],
        },
        { quoted: _0x2b2428 },
      ));
  },
};
