const { isBotAdmin, isSenderAdmin } = require("../utils/isAdmin");
async function setEphemeral(_0x41ffed, _0x424cc5, _0x1e62d0, _0x3d9744) {
  const _0x3fe460 = _0x424cc5["key"]["remoteJid"];
  if (!_0x3fe460["endsWith"]("@g.us"))
    return _0x41ffed["sendMessage"](
      _0x3fe460,
      { text: "❌ This command only works in groups." },
      { quoted: _0x424cc5 },
    );
  const _0x1d0dbd = await _0x41ffed["groupMetadata"](_0x3fe460),
    _0x168b66 =
      _0x424cc5["key"]["participant"] || _0x424cc5["key"]["remoteJid"];
  if (!isSenderAdmin(_0x1d0dbd, _0x168b66))
    return _0x41ffed["sendMessage"](
      _0x3fe460,
      { text: "❌ Only group admins can use this command." },
      { quoted: _0x424cc5 },
    );
  if (!isBotAdmin(_0x41ffed, _0x1d0dbd))
    return _0x41ffed["sendMessage"](
      _0x3fe460,
      { text: "❌ I need to be a group admin to change this setting." },
      { quoted: _0x424cc5 },
    );
  try {
    (await _0x41ffed["groupToggleEphemeral"](_0x3fe460, _0x1e62d0),
      await _0x41ffed["sendMessage"](
        _0x3fe460,
        { text: "⏳ Disappearing messages set to *" + _0x3d9744 + "*." },
        { quoted: _0x424cc5 },
      ));
  } catch (_0x25c7e0) {
    await _0x41ffed["sendMessage"](
      _0x3fe460,
      { text: "❌ Failed to update: " + _0x25c7e0["message"] },
      { quoted: _0x424cc5 },
    );
  }
}
module["exports"] = [
  {
    name: "disp-1",
    description: "Set disappearing messages to 24 hours (admin only).",
    async execute(_0x5f26a3, _0x2142f9) {
      await setEphemeral(_0x5f26a3, _0x2142f9, 0x15180, "24 hours");
    },
  },
  {
    name: "disp-7",
    description: "Set disappearing messages to 7 days (admin only).",
    async execute(_0x4dcecb, _0x232110) {
      await setEphemeral(_0x4dcecb, _0x232110, 0x93a80, "7 days");
    },
  },
  {
    name: "disp-90",
    description: "Set disappearing messages to 90 days (admin only).",
    async execute(_0x3808c0, _0x5f1713) {
      await setEphemeral(_0x3808c0, _0x5f1713, 0x76a700, "90 days");
    },
  },
  {
    name: "disp-off",
    description: "Turn off disappearing messages (admin only).",
    async execute(_0x30a60a, _0x241c4a) {
      await setEphemeral(_0x30a60a, _0x241c4a, 0x0, "OFF");
    },
  },
];
