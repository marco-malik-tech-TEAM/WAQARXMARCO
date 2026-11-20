const { isBotAdmin, isSenderAdmin } = require("../utils/isAdmin");
module["exports"] = {
  name: "approve",
  aliases: ["approveall", "approve-all"],
  description: "Approves all pending join requests (admin only).",
  async execute(_0x52ce4e, _0x372f3b) {
    const _0x43b5dd = _0x372f3b["key"]["remoteJid"];
    if (!_0x43b5dd["endsWith"]("@g.us"))
      return _0x52ce4e["sendMessage"](
        _0x43b5dd,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x372f3b },
      );
    const _0x13d0a7 = await _0x52ce4e["groupMetadata"](_0x43b5dd),
      _0x3c2929 =
        _0x372f3b["key"]["participant"] || _0x372f3b["key"]["remoteJid"];
    if (!isSenderAdmin(_0x13d0a7, _0x3c2929))
      return _0x52ce4e["sendMessage"](
        _0x43b5dd,
        { text: "❌ *Only group admins can use this command.*" },
        { quoted: _0x372f3b },
      );
    if (!isBotAdmin(_0x52ce4e, _0x13d0a7))
      return _0x52ce4e["sendMessage"](
        _0x43b5dd,
        { text: "❌ *I need admin privileges.*" },
        { quoted: _0x372f3b },
      );
    try {
      const _0x4250cc =
        await _0x52ce4e["groupRequestParticipantsList"](_0x43b5dd);
      if (!_0x4250cc["length"])
        return _0x52ce4e["sendMessage"](
          _0x43b5dd,
          { text: "ℹ️ *No pending join requests.*" },
          { quoted: _0x372f3b },
        );
      const _0x5b2b24 = _0x4250cc["map"]((_0x1a1146) => _0x1a1146["jid"]);
      (await _0x52ce4e["groupRequestParticipantsUpdate"](
        _0x43b5dd,
        _0x5b2b24,
        "approve",
      ),
        await _0x52ce4e["sendMessage"](
          _0x43b5dd,
          {
            text: "✅ *Approved " + _0x5b2b24["length"] + " join request(s).*",
          },
          { quoted: _0x372f3b },
        ));
    } catch (_0x3212fd) {
      await _0x52ce4e["sendMessage"](
        _0x43b5dd,
        {
          text: "❌ *Failed to approve requests: " + _0x3212fd["message"] + "*",
        },
        { quoted: _0x372f3b },
      );
    }
  },
};
