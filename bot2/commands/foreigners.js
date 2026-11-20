const { isBotAdmin, isSenderAdmin } = require("../utils/isAdmin"),
  LOCAL_CODE = "254";
module["exports"] = {
  name: "foreigners",
  description:
    "Lists (or removes) group members not on a Kenyan (+254) number.",
  async execute(_0x520ee3, _0x3b1f36, _0x5d05b2) {
    const _0x17d3ca = _0x3b1f36["key"]["remoteJid"];
    if (!_0x17d3ca["endsWith"]("@g.us"))
      return _0x520ee3["sendMessage"](
        _0x17d3ca,
        { text: "❌ This command only works in groups." },
        { quoted: _0x3b1f36 },
      );
    const _0x26a568 = await _0x520ee3["groupMetadata"](_0x17d3ca),
      _0x237096 = _0x26a568["participants"]["filter"]((_0x2df8ca) => {
        const _0x1d0688 = (_0x2df8ca["phoneNumber"] || _0x2df8ca["id"])[
          "split"
        ]("@")[0x0];
        return !_0x1d0688["startsWith"](LOCAL_CODE);
      });
    if (!_0x237096["length"])
      return _0x520ee3["sendMessage"](
        _0x17d3ca,
        { text: "✅ Everyone in this group is on a Kenyan number." },
        { quoted: _0x3b1f36 },
      );
    const _0xd4a3e5 = _0x5d05b2[0x0] === "-x";
    if (!_0xd4a3e5) {
      const _0x35f6f8 =
        "🌍 *Non-Kenyan members (" +
        _0x237096["length"] +
        "):*\n\n" +
        _0x237096["map"](
          (_0x485a9d) =>
            "• @" +
            (_0x485a9d["phoneNumber"] || _0x485a9d["id"])["split"]("@")[0x0],
        )["join"]("\x0a") +
        "\n\n💡 Use *.foreigners -x* to remove all of them.";
      return _0x520ee3["sendMessage"](
        _0x17d3ca,
        {
          text: _0x35f6f8,
          mentions: _0x237096["map"](
            (_0x34586c) => _0x34586c["phoneNumber"] || _0x34586c["id"],
          ),
        },
        { quoted: _0x3b1f36 },
      );
    }
    const _0x49a092 =
      _0x3b1f36["key"]["participant"] || _0x3b1f36["key"]["remoteJid"];
    if (!isSenderAdmin(_0x26a568, _0x49a092))
      return _0x520ee3["sendMessage"](
        _0x17d3ca,
        { text: "❌ Only group admins can remove members." },
        { quoted: _0x3b1f36 },
      );
    if (!isBotAdmin(_0x520ee3, _0x26a568))
      return _0x520ee3["sendMessage"](
        _0x17d3ca,
        { text: "❌ I need to be a group admin to remove members." },
        { quoted: _0x3b1f36 },
      );
    await _0x520ee3["sendMessage"](
      _0x17d3ca,
      {
        text: "🌍 Removing " + _0x237096["length"] + " non-Kenyan member(s)...",
      },
      { quoted: _0x3b1f36 },
    );
    let _0x5b8fc3 = 0x0,
      _0x182adb = 0x0;
    const _0x4f0dbf = 0x5,
      _0x188ea7 = _0x237096["map"]((_0x24b366) => _0x24b366["id"]);
    for (
      let _0x8b41d = 0x0;
      _0x8b41d < _0x188ea7["length"];
      _0x8b41d += _0x4f0dbf
    ) {
      const _0xb9c575 = _0x188ea7["slice"](_0x8b41d, _0x8b41d + _0x4f0dbf);
      try {
        (await _0x520ee3["groupParticipantsUpdate"](
          _0x17d3ca,
          _0xb9c575,
          "remove",
        ),
          (_0x5b8fc3 += _0xb9c575["length"]));
      } catch (_0x520af7) {
        _0x182adb += _0xb9c575["length"];
      }
      await new Promise((_0x4d1359) => setTimeout(_0x4d1359, 0x5dc));
    }
    await _0x520ee3["sendMessage"](
      _0x17d3ca,
      { text: "✅ Done.\nRemoved: " + _0x5b8fc3 + "\nFailed: " + _0x182adb },
      { quoted: _0x3b1f36 },
    );
  },
};
