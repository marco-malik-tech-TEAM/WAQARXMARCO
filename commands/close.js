module["exports"] = {
  name: "close",
  description: "Locks the group to admins-only messaging (admin only).",
  async execute(_0x4ef447, _0x4bff42) {
    const _0x3dcf0e = _0x4bff42["key"]["remoteJid"];
    if (!_0x3dcf0e["endsWith"]("@g.us")) {
      await _0x4ef447["sendMessage"](
        _0x3dcf0e,
        { text: "❌ This command only works in groups." },
        { quoted: _0x4bff42 },
      );
      return;
    }
    const _0x1cbbca = await _0x4ef447["groupMetadata"](_0x3dcf0e),
      _0x44a25f =
        _0x4bff42["key"]["participant"] || _0x4bff42["key"]["remoteJid"],
      {
        isBotAdmin: _0x8c51d9,
        isSenderAdmin: _0x587552,
      } = require("../utils/isAdmin");
    if (!_0x587552(_0x1cbbca, _0x44a25f)) {
      await _0x4ef447["sendMessage"](
        _0x3dcf0e,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x4bff42 },
      );
      return;
    }
    if (!_0x8c51d9(_0x4ef447, _0x1cbbca)) {
      await _0x4ef447["sendMessage"](
        _0x3dcf0e,
        { text: "❌ I need to be a group admin to lock the group." },
        { quoted: _0x4bff42 },
      );
      return;
    }
    try {
      (await _0x4ef447["groupSettingUpdate"](_0x3dcf0e, "announcement"),
        await _0x4ef447["sendMessage"](
          _0x3dcf0e,
          { text: "🔒 Group locked. Only admins can send messages now." },
          { quoted: _0x4bff42 },
        ));
    } catch (_0x2ca6d6) {
      await _0x4ef447["sendMessage"](
        _0x3dcf0e,
        { text: "❌ Failed to lock group: " + _0x2ca6d6["message"] },
        { quoted: _0x4bff42 },
      );
    }
  },
};
