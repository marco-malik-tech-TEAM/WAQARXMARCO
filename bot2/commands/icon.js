const { downloadMediaMessage } = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "icon",
  description: "Changes the group's photo from a replied image (admin only).",
  async execute(_0x5e0950, _0x5a9840) {
    const _0x992a03 = _0x5a9840["key"]["remoteJid"];
    if (!_0x992a03["endsWith"]("@g.us")) {
      await _0x5e0950["sendMessage"](
        _0x992a03,
        { text: "❌ This command only works in groups." },
        { quoted: _0x5a9840 },
      );
      return;
    }
    const _0x20f658 = await _0x5e0950["groupMetadata"](_0x992a03),
      _0x50818d =
        _0x5a9840["key"]["participant"] || _0x5a9840["key"]["remoteJid"],
      {
        isBotAdmin: _0xfc7a85,
        isSenderAdmin: _0x3fa5cf,
      } = require("../utils/isAdmin");
    if (!_0x3fa5cf(_0x20f658, _0x50818d)) {
      await _0x5e0950["sendMessage"](
        _0x992a03,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x5a9840 },
      );
      return;
    }
    if (!_0xfc7a85(_0x5e0950, _0x20f658)) {
      await _0x5e0950["sendMessage"](
        _0x992a03,
        { text: "❌ I need to be a group admin to change the group photo." },
        { quoted: _0x5a9840 },
      );
      return;
    }
    const _0xf9168f =
        _0x5a9840["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "quotedMessage"
        ],
      _0x49faa2 =
        _0xf9168f?.["imageMessage"] || _0x5a9840["message"]?.["imageMessage"];
    if (!_0x49faa2) {
      await _0x5e0950["sendMessage"](
        _0x992a03,
        { text: "❌ Reply to an image with .icon" },
        { quoted: _0x5a9840 },
      );
      return;
    }
    try {
      const _0x32d9a0 = await downloadMediaMessage(
        { message: { imageMessage: _0x49faa2 } },
        "buffer",
        {},
      );
      (await _0x5e0950["updateProfilePicture"](_0x992a03, _0x32d9a0),
        await _0x5e0950["sendMessage"](
          _0x992a03,
          { text: "✅ Group photo updated." },
          { quoted: _0x5a9840 },
        ));
    } catch (_0x5c32bd) {
      await _0x5e0950["sendMessage"](
        _0x992a03,
        { text: "❌ Failed to update photo: " + _0x5c32bd["message"] },
        { quoted: _0x5a9840 },
      );
    }
  },
};
