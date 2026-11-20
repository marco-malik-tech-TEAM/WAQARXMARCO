const { isBotAdmin, isSenderAdmin } = require("../utils/isAdmin");
module["exports"] = {
  name: "add",
  description:
    "Adds a participant to the group by number, or by replying to their message (admin only).",
  async execute(_0x5875bc, _0x4e0e2a, _0x311bcc) {
    const _0x20a4e4 = _0x4e0e2a["key"]["remoteJid"];
    if (!_0x20a4e4["endsWith"]("@g.us")) {
      await _0x5875bc["sendMessage"](
        _0x20a4e4,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x4e0e2a },
      );
      return;
    }
    const _0x592fcd =
        _0x4e0e2a["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x534da4 = _0x592fcd?.["participant"],
      _0x356871 = _0x592fcd?.["participantAlt"] || _0x592fcd?.["participantPn"],
      _0x2d4513 = (_0x311bcc[0x0] || "")["replace"](/[^0-9]/g, "");
    let _0x17aad7, _0xb8f7d0;
    if (_0x356871) ((_0x17aad7 = _0x356871), (_0xb8f7d0 = _0x534da4));
    else {
      if (_0x534da4) ((_0x17aad7 = _0x534da4), (_0xb8f7d0 = _0x534da4));
      else {
        if (_0x2d4513) _0x17aad7 = _0x2d4513 + "@s.whatsapp.net";
        else {
          await _0x5875bc["sendMessage"](
            _0x20a4e4,
            {
              text: "❌ *Who should I add, provide a number or reply to their mesage*",
            },
            { quoted: _0x4e0e2a },
          );
          return;
        }
      }
    }
    const _0x5d34fe = await _0x5875bc["groupMetadata"](_0x20a4e4),
      _0x223e53 =
        _0x4e0e2a["key"]["participant"] || _0x4e0e2a["key"]["remoteJid"];
    if (!isSenderAdmin(_0x5d34fe, _0x223e53)) {
      await _0x5875bc["sendMessage"](
        _0x20a4e4,
        { text: "❌ *Only group admins can use this command.*" },
        { quoted: _0x4e0e2a },
      );
      return;
    }
    if (!isBotAdmin(_0x5875bc, _0x5d34fe)) {
      await _0x5875bc["sendMessage"](
        _0x20a4e4,
        { text: "❌ *I need to be a group admin to add members.*" },
        { quoted: _0x4e0e2a },
      );
      return;
    }
    const _0x5520ea = _0x5d34fe["participants"]["some"](
      (_0x348cf2) =>
        _0x348cf2["id"] === _0x17aad7 ||
        (_0xb8f7d0 && _0x348cf2["id"] === _0xb8f7d0) ||
        _0x348cf2["phoneNumber"] === _0x17aad7,
    );
    if (_0x5520ea) {
      await _0x5875bc["sendMessage"](
        _0x20a4e4,
        {
          text:
            "ℹ️ *@" + _0x17aad7["split"]("@")[0x0] + " is already a member.*",
          mentions: [_0x17aad7],
        },
        { quoted: _0x4e0e2a },
      );
      return;
    }
    try {
      const _0x573e42 = await _0x5875bc["groupParticipantsUpdate"](
          _0x20a4e4,
          [_0x17aad7],
          "add",
        ),
        _0x551e50 = _0x573e42?.[0x0];
      if (_0x551e50?.["status"] === "409") {
        await _0x5875bc["sendMessage"](
          _0x20a4e4,
          {
            text:
              "ℹ️ *@" + _0x17aad7["split"]("@")[0x0] + " is already a member.*",
            mentions: [_0x17aad7],
          },
          { quoted: _0x4e0e2a },
        );
        return;
      }
      if (_0x551e50 && _0x551e50["status"] !== "200") {
        await sendInviteFallback(
          _0x5875bc,
          _0x20a4e4,
          _0x17aad7,
          _0x5d34fe,
          _0x4e0e2a,
        );
        return;
      }
      await _0x5875bc["sendMessage"](
        _0x20a4e4,
        {
          text:
            "✅ *Added @" + _0x17aad7["split"]("@")[0x0] + " to the group.*",
          mentions: [_0x17aad7],
        },
        { quoted: _0x4e0e2a },
      );
    } catch (_0x2e3094) {
      try {
        await sendInviteFallback(
          _0x5875bc,
          _0x20a4e4,
          _0x17aad7,
          _0x5d34fe,
          _0x4e0e2a,
        );
      } catch (_0x15a49b) {
        await _0x5875bc["sendMessage"](
          _0x20a4e4,
          { text: "❌ *Failed to add member: " + _0x2e3094["message"] + "*" },
          { quoted: _0x4e0e2a },
        );
      }
    }
  },
};
async function sendInviteFallback(
  _0x1ccc4d,
  _0x3dc0e6,
  _0x4fb6c1,
  _0x17e144,
  _0x29beea,
) {
  try {
    const _0x33ad45 = await _0x1ccc4d["groupInviteCode"](_0x3dc0e6),
      _0x53b330 = "https://chat.whatsapp.com/" + _0x33ad45;
    let _0x207cfb;
    try {
      const _0x568ae6 = await _0x1ccc4d["profilePictureUrl"](
          _0x3dc0e6,
          "image",
        ),
        _0x5e1681 = require("https");
      _0x207cfb = await new Promise((_0x545d5f, _0x4a26c9) => {
        _0x5e1681["get"](_0x568ae6, (_0x3357ea) => {
          const _0x2ecb3f = [];
          (_0x3357ea["on"]("data", (_0x4857fe) => _0x2ecb3f["push"](_0x4857fe)),
            _0x3357ea["on"]("end", () =>
              _0x545d5f(Buffer["concat"](_0x2ecb3f)),
            ),
            _0x3357ea["on"]("error", _0x4a26c9));
        })["on"]("error", _0x4a26c9);
      });
    } catch {
      _0x207cfb = null;
    }
    const _0xb171a0 =
      "╭━━━〔 📨 GROUP INVITATION 〕━━━╮\n\n🏷️ *Group:* " +
      _0x17e144["subject"] +
      "\n\n👥 *Members:* " +
      _0x17e144["participants"]["length"] +
      "\n\n🤖 *Sent by:* MARCO X WAQAR MD BOT\n\n━━━━━━━━━━━━━━━━━━\n\nYou couldn't be added directly because of your WhatsApp privacy settings.\n\nTap the link below to join the group:\n\n🔗 " +
      _0x53b330 +
      "\n\n━━━━━━━━━━━━━━━━━━\n\nHope to see you there! 🎉";
    (_0x207cfb
      ? await _0x1ccc4d["sendMessage"](_0x4fb6c1, {
          image: _0x207cfb,
          caption: _0xb171a0,
        })
      : await _0x1ccc4d["sendMessage"](_0x4fb6c1, { text: _0xb171a0 }),
      await _0x1ccc4d["sendMessage"](
        _0x3dc0e6,
        {
          text:
            "📨 *Couldn't add @" +
            _0x4fb6c1["split"]("@")[0x0] +
            " directly, so I've sent them a private invitation.*",
          mentions: [_0x4fb6c1],
        },
        { quoted: _0x29beea },
      ));
  } catch (_0x31945f) {
    await _0x1ccc4d["sendMessage"](
      _0x3dc0e6,
      {
        text:
          "❌ *Couldn't add @" +
          _0x4fb6c1["split"]("@")[0x0] +
          " directly, and couldn't send an invite either:*\n" +
          _0x31945f["message"],
        mentions: [_0x4fb6c1],
      },
      { quoted: _0x29beea },
    );
  }
}
