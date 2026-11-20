module["exports"] = {
  name: "hidetag",
  description:
    "Notifies all members silently, without listing mentions (admin only).",
  async execute(_0x55d457, _0x8dcb1b, _0x5cda2a) {
    const _0x56efee = _0x8dcb1b["key"]["remoteJid"];
    if (!_0x56efee["endsWith"]("@g.us")) {
      await _0x55d457["sendMessage"](
        _0x56efee,
        { text: "❌ This command only works in groups." },
        { quoted: _0x8dcb1b },
      );
      return;
    }
    const _0x5557fa = await _0x55d457["groupMetadata"](_0x56efee),
      _0x393b94 =
        _0x8dcb1b["key"]["participant"] || _0x8dcb1b["key"]["remoteJid"],
      { isSenderAdmin: _0x899d28 } = require("../utils/isAdmin");
    if (!_0x899d28(_0x5557fa, _0x393b94)) {
      await _0x55d457["sendMessage"](
        _0x56efee,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x8dcb1b },
      );
      return;
    }
    const _0x319c31 = _0x5cda2a["join"]("\x20")["trim"]() || "📢",
      _0x1cfa29 = _0x5557fa["participants"]["map"](
        (_0x4933db) => _0x4933db["id"],
      );
    await _0x55d457["sendMessage"](
      _0x56efee,
      { text: _0x319c31, mentions: _0x1cfa29 },
      { quoted: _0x8dcb1b },
    );
  },
};
