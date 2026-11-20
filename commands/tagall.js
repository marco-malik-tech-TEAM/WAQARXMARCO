module["exports"] = {
  name: "tagall",
  description: "Mentions every group member (admin only).",
  async execute(_0xc34831, _0x5dc7c4, _0x267e19) {
    const _0x3432bc = _0x5dc7c4["key"]["remoteJid"];
    if (!_0x3432bc["endsWith"]("@g.us")) {
      await _0xc34831["sendMessage"](
        _0x3432bc,
        { text: "❌ This command only works in groups." },
        { quoted: _0x5dc7c4 },
      );
      return;
    }
    const _0x518a97 = await _0xc34831["groupMetadata"](_0x3432bc),
      _0x533cb0 =
        _0x5dc7c4["key"]["participant"] || _0x5dc7c4["key"]["remoteJid"],
      { isSenderAdmin: _0x3c38e0 } = require("../utils/isAdmin");
    if (!_0x3c38e0(_0x518a97, _0x533cb0)) {
      await _0xc34831["sendMessage"](
        _0x3432bc,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x5dc7c4 },
      );
      return;
    }
    const _0x1fe4ff = _0x518a97["participants"]["map"](
        (_0x2c3b07) => _0x2c3b07["id"],
      ),
      _0x56acda = _0x267e19["join"]("\x20"),
      _0x4dd4e8 = _0x1fe4ff["map"](
        (_0x4841cb) => "@" + _0x4841cb["split"]("@")[0x0],
      )["join"]("\x0a"),
      _0x238cc0 = _0x56acda
        ? _0x56acda + "\x0a\x0a" + _0x4dd4e8
        : "📢 Attention everyone!\n\n" + _0x4dd4e8;
    await _0xc34831["sendMessage"](
      _0x3432bc,
      { text: _0x238cc0, mentions: _0x1fe4ff },
      { quoted: _0x5dc7c4 },
    );
  },
};
