const { isOwner } = require("../utils/isOwner"),
  { isDev } = require("../utils/isDev"),
  { banUser, findBanEntry } = require("../utils/banList"),
  { resolveIds } = require("../utils/isSudo");
module["exports"] = {
  name: "ban",
  description: "Bans a user from using bot commands (owner only).",
  async execute(_0x21c3d9, _0x570bac, _0x4159d6) {
    const _0x4a6bc3 = _0x570bac["key"]["remoteJid"];
    if (!isOwner(_0x570bac))
      return _0x21c3d9["sendMessage"](
        _0x4a6bc3,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x570bac },
      );
    const _0x4e6e57 =
      _0x570bac["message"]?.["extendedTextMessage"]?.["contextInfo"];
    let _0x1ff53c = _0x4e6e57 ? resolveIds(_0x4e6e57) : [];
    !_0x1ff53c["length"] &&
      _0x4159d6[0x0] &&
      (_0x1ff53c = resolveIds({
        participant: _0x4159d6[0x0] + "@s.whatsapp.net",
      }));
    if (!_0x1ff53c["length"])
      return _0x21c3d9["sendMessage"](
        _0x4a6bc3,
        {
          text: "❌ *Reply to the user's message, or provide their number directly.*\n\nUsage: *.ban 923001234567*",
        },
        { quoted: _0x570bac },
      );
    const _0x3a99c2 =
        _0x1ff53c["find"]((_0x296bfe) => _0x296bfe["type"] === "pn")?.["id"] ||
        _0x1ff53c[0x0]["id"],
      _0x163740 =
        _0x1ff53c["find"]((_0x46745b) => _0x46745b["type"] === "pn")?.["jid"] ||
        _0x1ff53c[0x0]["jid"],
      _0x30bb22 = resolveIds(_0x570bac["key"]),
      _0x2452cc = _0x1ff53c["some"]((_0x5d1be8) =>
        _0x30bb22["some"]((_0x49220a) => _0x49220a["id"] === _0x5d1be8["id"]),
      );
    console["log"]("BAN TARGET IDS:", _0x1ff53c);
    const _0x12b869 = _0x1ff53c["some"]((_0x42be79) => {
      const _0x46ba54 = {
        key: {
          participant: _0x42be79["id"] + "@s.whatsapp.net",
          remoteJid: _0x42be79["id"] + "@s.whatsapp.net",
        },
      };
      return isOwner(_0x46ba54) || isDev(_0x46ba54, _0x21c3d9);
    });
    if (_0x2452cc || _0x12b869)
      return _0x21c3d9["sendMessage"](
        _0x4a6bc3,
        { text: "*❌ You can't ban the owner or a dev.*" },
        { quoted: _0x570bac },
      );
    const _0x5144f6 = findBanEntry(_0x1ff53c);
    if (_0x5144f6) {
      const _0x15bfa3 = _0x1ff53c["filter"](
        (_0x5e3daf) =>
          !_0x5144f6["ids"]["some"](
            (_0x57d18d) => _0x57d18d["id"] === _0x5e3daf["id"],
          ),
      );
      if (!_0x15bfa3["length"])
        return _0x21c3d9["sendMessage"](
          _0x4a6bc3,
          {
            text: "⚠️ @" + _0x3a99c2 + " is already banned.",
            mentions: [_0x163740],
          },
          { quoted: _0x570bac },
        );
      return (
        banUser(_0x1ff53c),
        _0x21c3d9["sendMessage"](
          _0x4a6bc3,
          {
            text:
              "🚫 @" + _0x3a99c2 + " has been banned from using bot commands.",
            mentions: [_0x163740],
          },
          { quoted: _0x570bac },
        )
      );
    }
    (banUser(_0x1ff53c),
      await _0x21c3d9["sendMessage"](
        _0x4a6bc3,
        {
          text:
            "🚫 @" + _0x3a99c2 + " has been banned from using bot commands.",
          mentions: [_0x163740],
        },
        { quoted: _0x570bac },
      ));
  },
};
