module["exports"] = {
  name: "open",
  description: "Reopens the group for all members to message (admin only).",
  async execute(_0x47bfc1, _0x55cf6c) {
    const _0x3b00dc = _0x55cf6c["key"]["remoteJid"];
    if (!_0x3b00dc["endsWith"]("@g.us")) {
      await _0x47bfc1["sendMessage"](
        _0x3b00dc,
        { text: "❌ This command only works in groups." },
        { quoted: _0x55cf6c },
      );
      return;
    }
    const _0x5543ae = await _0x47bfc1["groupMetadata"](_0x3b00dc),
      _0x571308 =
        _0x55cf6c["key"]["participant"] || _0x55cf6c["key"]["remoteJid"],
      {
        isBotAdmin: _0x3c27ef,
        isSenderAdmin: _0x11db47,
      } = require("../utils/isAdmin");
    if (!_0x11db47(_0x5543ae, _0x571308)) {
      await _0x47bfc1["sendMessage"](
        _0x3b00dc,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x55cf6c },
      );
      return;
    }
    if (!_0x3c27ef(_0x47bfc1, _0x5543ae)) {
      await _0x47bfc1["sendMessage"](
        _0x3b00dc,
        { text: "❌ I need to be a group admin to unlock the group." },
        { quoted: _0x55cf6c },
      );
      return;
    }
    try {
      (await _0x47bfc1["groupSettingUpdate"](_0x3b00dc, "not_announcement"),
        await _0x47bfc1["sendMessage"](
          _0x3b00dc,
          { text: "🔓 Group opened. Everyone can send messages now." },
          { quoted: _0x55cf6c },
        ));
    } catch (_0x49ce6f) {
      await _0x47bfc1["sendMessage"](
        _0x3b00dc,
        { text: "❌ Failed to open group: " + _0x49ce6f["message"] },
        { quoted: _0x55cf6c },
      );
    }
  },
};
