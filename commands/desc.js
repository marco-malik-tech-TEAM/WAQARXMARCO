module["exports"] = {
  name: "desc",
  description: "Changes the group's description (admin only).",
  async execute(_0x4fb08c, _0xf52e68, _0x36a7f6) {
    const _0x54d4e9 = _0xf52e68["key"]["remoteJid"];
    if (!_0x54d4e9["endsWith"]("@g.us")) {
      await _0x4fb08c["sendMessage"](
        _0x54d4e9,
        { text: "❌ This command only works in groups." },
        { quoted: _0xf52e68 },
      );
      return;
    }
    const _0x420882 = _0x36a7f6["join"]("\x20")["trim"]();
    if (!_0x420882) {
      await _0x4fb08c["sendMessage"](
        _0x54d4e9,
        { text: "❌ Provide a new description. Usage: .desc New description" },
        { quoted: _0xf52e68 },
      );
      return;
    }
    const _0x53aae8 = await _0x4fb08c["groupMetadata"](_0x54d4e9),
      _0x269b4e =
        _0xf52e68["key"]["participant"] || _0xf52e68["key"]["remoteJid"],
      {
        isBotAdmin: _0x1f8d25,
        isSenderAdmin: _0x3e720b,
      } = require("../utils/isAdmin");
    if (!_0x3e720b(_0x53aae8, _0x269b4e)) {
      await _0x4fb08c["sendMessage"](
        _0x54d4e9,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0xf52e68 },
      );
      return;
    }
    if (!_0x1f8d25(_0x4fb08c, _0x53aae8)) {
      await _0x4fb08c["sendMessage"](
        _0x54d4e9,
        { text: "❌ I need to be a group admin to change the description." },
        { quoted: _0xf52e68 },
      );
      return;
    }
    try {
      (await _0x4fb08c["groupUpdateDescription"](_0x54d4e9, _0x420882),
        await _0x4fb08c["sendMessage"](
          _0x54d4e9,
          { text: "✅ Group description updated." },
          { quoted: _0xf52e68 },
        ));
    } catch (_0x46ecb6) {
      await _0x4fb08c["sendMessage"](
        _0x54d4e9,
        { text: "❌ Failed to change description: " + _0x46ecb6["message"] },
        { quoted: _0xf52e68 },
      );
    }
  },
};
