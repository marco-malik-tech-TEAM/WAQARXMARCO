module["exports"] = {
  name: "link",
  description: "Sends the group's invite link (admin only).",
  async execute(_0x58ed0a, _0x4a9b69) {
    const _0x50a190 = _0x4a9b69["key"]["remoteJid"];
    if (!_0x50a190["endsWith"]("@g.us")) {
      await _0x58ed0a["sendMessage"](
        _0x50a190,
        { text: "❌ This command only works in groups." },
        { quoted: _0x4a9b69 },
      );
      return;
    }
    const _0xe1c547 = await _0x58ed0a["groupMetadata"](_0x50a190),
      _0x4cffb8 =
        _0x4a9b69["key"]["participant"] || _0x4a9b69["key"]["remoteJid"],
      { isSenderAdmin: _0x1c6d9f } = require("../utils/isAdmin");
    if (!_0x1c6d9f(_0xe1c547, _0x4cffb8)) {
      await _0x58ed0a["sendMessage"](
        _0x50a190,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x4a9b69 },
      );
      return;
    }
    try {
      const _0x3deb33 = await _0x58ed0a["groupInviteCode"](_0x50a190);
      await _0x58ed0a["sendMessage"](
        _0x50a190,
        {
          text: "🔗 Group invite link:\nhttps://chat.whatsapp.com/" + _0x3deb33,
        },
        { quoted: _0x4a9b69 },
      );
    } catch (_0x19e565) {
      await _0x58ed0a["sendMessage"](
        _0x50a190,
        { text: "❌ Failed to get invite link: " + _0x19e565["message"] },
        { quoted: _0x4a9b69 },
      );
    }
  },
};
