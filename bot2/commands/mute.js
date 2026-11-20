module["exports"] = {
  name: "mute",
  description:
    'Restricts the group to admins-only messaging. Use ".mute off" to unmute.',
  async execute(_0x1b1122, _0x260988, _0x515624) {
    const _0x5aa1bb = _0x260988["key"]["remoteJid"];
    if (!_0x5aa1bb["endsWith"]("@g.us")) {
      await _0x1b1122["sendMessage"](
        _0x5aa1bb,
        { text: "❌ This command only works in groups." },
        { quoted: _0x260988 },
      );
      return;
    }
    const _0x193d6c = await _0x1b1122["groupMetadata"](_0x5aa1bb),
      _0x20ad78 =
        _0x260988["key"]["participant"] || _0x260988["key"]["remoteJid"],
      {
        isBotAdmin: _0x4d4bf3,
        isSenderAdmin: _0x3827a8,
      } = require("../utils/isAdmin");
    if (!_0x3827a8(_0x193d6c, _0x20ad78)) {
      await _0x1b1122["sendMessage"](
        _0x5aa1bb,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x260988 },
      );
      return;
    }
    if (!_0x4d4bf3(_0x1b1122, _0x193d6c)) {
      await _0x1b1122["sendMessage"](
        _0x5aa1bb,
        { text: "❌ I need to be a group admin to change group settings." },
        { quoted: _0x260988 },
      );
      return;
    }
    const _0x1320ef = _0x515624[0x0]?.["toLowerCase"]() === "off";
    await _0x1b1122["groupSettingUpdate"](
      _0x5aa1bb,
      _0x1320ef ? "not_announcement" : "announcement",
    );
    const _0x4b6dac = _0x1320ef
      ? "🔓 Group unmuted — everyone can send messages again."
      : "🔒 Group muted — only admins can send messages now.";
    await _0x1b1122["sendMessage"](
      _0x5aa1bb,
      { text: _0x4b6dac },
      { quoted: _0x260988 },
    );
  },
};
