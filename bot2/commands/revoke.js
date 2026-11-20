module["exports"] = {
  name: "revoke",
  description: "Revokes and regenerates the group's invite link (admin only).",
  async execute(_0x116b3b, _0x27e06f) {
    const _0x55d929 = _0x27e06f["key"]["remoteJid"];
    if (!_0x55d929["endsWith"]("@g.us")) {
      await _0x116b3b["sendMessage"](
        _0x55d929,
        { text: "❌ This command only works in groups." },
        { quoted: _0x27e06f },
      );
      return;
    }
    const _0xec6f12 = await _0x116b3b["groupMetadata"](_0x55d929),
      _0x3a404e =
        _0x27e06f["key"]["participant"] || _0x27e06f["key"]["remoteJid"],
      {
        isBotAdmin: _0x418487,
        isSenderAdmin: _0xd9058f,
      } = require("../utils/isAdmin");
    if (!_0xd9058f(_0xec6f12, _0x3a404e)) {
      await _0x116b3b["sendMessage"](
        _0x55d929,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x27e06f },
      );
      return;
    }
    if (!_0x418487(_0x116b3b, _0xec6f12)) {
      await _0x116b3b["sendMessage"](
        _0x55d929,
        { text: "❌ I need to be a group admin to revoke the invite link." },
        { quoted: _0x27e06f },
      );
      return;
    }
    try {
      const _0xd0afcb = await _0x116b3b["groupRevokeInvite"](_0x55d929);
      await _0x116b3b["sendMessage"](
        _0x55d929,
        { text: "♻️ New invite link:\nhttps://chat.whatsapp.com/" + _0xd0afcb },
        { quoted: _0x27e06f },
      );
    } catch (_0x2befe2) {
      await _0x116b3b["sendMessage"](
        _0x55d929,
        { text: "❌ Failed to revoke invite link: " + _0x2befe2["message"] },
        { quoted: _0x27e06f },
      );
    }
  },
};
