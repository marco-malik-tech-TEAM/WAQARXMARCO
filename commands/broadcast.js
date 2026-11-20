const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "broadcast",
  description:
    "Send a message to all groups the bot is in (owner only). Usage: .broadcast <message>",
  async execute(_0x28920b, _0x53f1a0, _0x2fe232) {
    const _0x35dc6f = _0x53f1a0["key"]["remoteJid"];
    if (!isOwner(_0x53f1a0))
      return _0x28920b["sendMessage"](
        _0x35dc6f,
        { text: "❌ Only the bot owner can use this command." },
        { quoted: _0x53f1a0 },
      );
    const _0x1191fd = _0x2fe232["join"]("\x20");
    if (!_0x1191fd)
      return _0x28920b["sendMessage"](
        _0x35dc6f,
        { text: "❌ Usage: .broadcast <message>" },
        { quoted: _0x53f1a0 },
      );
    const _0x1552ef = await _0x28920b["groupFetchAllParticipating"](),
      _0x123e40 = Object["keys"](_0x1552ef);
    let _0x40e221 = 0x0;
    for (const _0x251843 of _0x123e40) {
      try {
        (await _0x28920b["sendMessage"](_0x251843, {
          text: "📢 *Broadcast:*\n\n" + _0x1191fd,
        }),
          _0x40e221++);
      } catch {}
      await new Promise((_0x470299) => setTimeout(_0x470299, 0x3e8));
    }
    await _0x28920b["sendMessage"](
      _0x35dc6f,
      {
        text:
          "✅ Broadcast sent to " +
          _0x40e221 +
          "/" +
          _0x123e40["length"] +
          " groups.",
      },
      { quoted: _0x53f1a0 },
    );
  },
};
