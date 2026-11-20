const { isBotAdmin, isSenderAdmin } = require("../utils/isAdmin");
module["exports"] = {
  name: "reject",
  aliases: ["rejectall", "reject-all"],
  description: "Rejects all pending join requests (admin only).",
  async execute(_0x1db8bd, _0x3d38ed) {
    const _0xfaa5c6 = _0x3d38ed["key"]["remoteJid"];
    if (!_0xfaa5c6["endsWith"]("@g.us"))
      return _0x1db8bd["sendMessage"](
        _0xfaa5c6,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x3d38ed },
      );
    const _0x37f49d = await _0x1db8bd["groupMetadata"](_0xfaa5c6),
      _0x190c0b =
        _0x3d38ed["key"]["participant"] || _0x3d38ed["key"]["remoteJid"];
    if (!isSenderAdmin(_0x37f49d, _0x190c0b))
      return _0x1db8bd["sendMessage"](
        _0xfaa5c6,
        { text: "❌ *Only group admins can use this command.*" },
        { quoted: _0x3d38ed },
      );
    if (!isBotAdmin(_0x1db8bd, _0x37f49d))
      return _0x1db8bd["sendMessage"](
        _0xfaa5c6,
        { text: "❌ *I need admin privileges.*" },
        { quoted: _0x3d38ed },
      );
    try {
      const _0x18428f =
        await _0x1db8bd["groupRequestParticipantsList"](_0xfaa5c6);
      if (!_0x18428f["length"])
        return _0x1db8bd["sendMessage"](
          _0xfaa5c6,
          { text: "ℹ️ *No pending join requests.*" },
          { quoted: _0x3d38ed },
        );
      const _0x56d1a2 = _0x18428f["map"]((_0x19f268) => _0x19f268["jid"]);
      (await _0x1db8bd["groupRequestParticipantsUpdate"](
        _0xfaa5c6,
        _0x56d1a2,
        "reject",
      ),
        await _0x1db8bd["sendMessage"](
          _0xfaa5c6,
          {
            text: "✅ *Rejected " + _0x56d1a2["length"] + " join request(s).*",
          },
          { quoted: _0x3d38ed },
        ));
    } catch (_0x2c0a39) {
      await _0x1db8bd["sendMessage"](
        _0xfaa5c6,
        {
          text: "❌ *Failed to reject requests: " + _0x2c0a39["message"] + "*",
        },
        { quoted: _0x3d38ed },
      );
    }
  },
};
