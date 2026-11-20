module["exports"] = {
  name: "subject",
  description: "Changes the group's name (admin only).",
  async execute(_0x371272, _0x4f836a, _0xf74fe3) {
    const _0x3be4bc = _0x4f836a["key"]["remoteJid"];
    if (!_0x3be4bc["endsWith"]("@g.us")) {
      await _0x371272["sendMessage"](
        _0x3be4bc,
        { text: "❌ This command only works in groups." },
        { quoted: _0x4f836a },
      );
      return;
    }
    const _0x513be3 = _0xf74fe3["join"]("\x20")["trim"]();
    if (!_0x513be3) {
      await _0x371272["sendMessage"](
        _0x3be4bc,
        { text: "❌ Provide a new group name. Usage: .subject New Name" },
        { quoted: _0x4f836a },
      );
      return;
    }
    const _0x341928 = await _0x371272["groupMetadata"](_0x3be4bc),
      _0x55d8ae =
        _0x4f836a["key"]["participant"] || _0x4f836a["key"]["remoteJid"],
      {
        isBotAdmin: _0x1e0313,
        isSenderAdmin: _0x4bc3ad,
      } = require("../utils/isAdmin");
    if (!_0x4bc3ad(_0x341928, _0x55d8ae)) {
      await _0x371272["sendMessage"](
        _0x3be4bc,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x4f836a },
      );
      return;
    }
    if (!_0x1e0313(_0x371272, _0x341928)) {
      await _0x371272["sendMessage"](
        _0x3be4bc,
        { text: "❌ I need to be a group admin to change the group name." },
        { quoted: _0x4f836a },
      );
      return;
    }
    try {
      (await _0x371272["groupUpdateSubject"](_0x3be4bc, _0x513be3),
        await _0x371272["sendMessage"](
          _0x3be4bc,
          { text: "✅ Group name changed to: *" + _0x513be3 + "*" },
          { quoted: _0x4f836a },
        ));
    } catch (_0x38225d) {
      await _0x371272["sendMessage"](
        _0x3be4bc,
        { text: "❌ Failed to change group name: " + _0x38225d["message"] },
        { quoted: _0x4f836a },
      );
    }
  },
};
