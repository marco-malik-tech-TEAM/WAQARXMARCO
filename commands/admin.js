module["exports"] = {
  name: "admin",
  aliases: ["admins"],
  description: "Lists the group's admins.",
  async execute(_0xd619b9, _0x3f9549) {
    const _0x1db2bb = _0x3f9549["key"]["remoteJid"];
    if (!_0x1db2bb["endsWith"]("@g.us"))
      return _0xd619b9["sendMessage"](
        _0x1db2bb,
        {
          text: "*❌ Is this a group asshole ?, this command is meant for groups.*",
        },
        { quoted: _0x3f9549 },
      );
    const _0x49281f = await _0xd619b9["groupMetadata"](_0x1db2bb),
      _0x15799f = _0x49281f["participants"]["filter"](
        (_0xe1f4ad) =>
          _0xe1f4ad["admin"] === "admin" || _0xe1f4ad["admin"] === "superadmin",
      );
    if (!_0x15799f["length"])
      return _0xd619b9["sendMessage"](
        _0x1db2bb,
        { text: "ℹ️ No admins found." },
        { quoted: _0x3f9549 },
      );
    const _0x5bea10 = _0x15799f["some"](
        (_0x24c263) => _0x24c263["admin"] === "superadmin",
      ),
      _0x532e9c = _0x5bea10 ? null : _0x49281f["owner"],
      _0x29635a =
        "👑 *Group Admins:*\n\n" +
        _0x15799f["map"]((_0x58b598) => {
          const _0x472eb3 =
            _0x58b598["admin"] === "superadmin" ||
            _0x58b598["id"] === _0x532e9c;
          return (
            "@" +
            _0x58b598["id"]["split"]("@")[0x0] +
            (_0x472eb3 ? " - superadmin" : "")
          );
        })["join"]("\x0a");
    await _0xd619b9["sendMessage"](
      _0x1db2bb,
      {
        text: _0x29635a,
        mentions: _0x15799f["map"]((_0x1adc76) => _0x1adc76["id"]),
      },
      { quoted: _0x3f9549 },
    );
  },
};
