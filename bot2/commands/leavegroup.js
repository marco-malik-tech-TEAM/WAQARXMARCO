const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "leavegroup",
  aliases: ["leavegc", "leavebylink"],
  description:
    "Makes the bot leave a group using its invite link (Owner only).",
  async execute(_0x348619, _0x42ebeb, _0x119771) {
    if (!isOwner(_0x42ebeb))
      return _0x348619["sendMessage"](
        _0x42ebeb["key"]["remoteJid"],
        { text: "❌ This command is owner only." },
        { quoted: _0x42ebeb },
      );
    if (!_0x119771[0x0])
      return _0x348619["sendMessage"](
        _0x42ebeb["key"]["remoteJid"],
        {
          text: "Usage:\n.leavegroup https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXXXX",
        },
        { quoted: _0x42ebeb },
      );
    const _0x29101a = _0x119771[0x0]["match"](
      /chat\.whatsapp\.com\/([A-Za-z0-9]+)/,
    );
    if (!_0x29101a)
      return _0x348619["sendMessage"](
        _0x42ebeb["key"]["remoteJid"],
        { text: "❌ Invalid WhatsApp group invite link." },
        { quoted: _0x42ebeb },
      );
    const _0x2cd402 = _0x29101a[0x1];
    try {
      const _0x364736 = await _0x348619["groupGetInviteInfo"](_0x2cd402),
        _0x443635 = _0x364736["id"],
        _0x4335ba = await _0x348619["groupFetchAllParticipating"]();
      if (!_0x4335ba[_0x443635])
        return _0x348619["sendMessage"](
          _0x42ebeb["key"]["remoteJid"],
          { text: "ℹ️ I am not a member of that group." },
          { quoted: _0x42ebeb },
        );
      (await _0x348619["sendMessage"](_0x443635, {
        text: "👋 I have been instructed by my owner to leave this group.\n\nThank you for having me!",
      }),
        await _0x348619["groupLeave"](_0x443635),
        await _0x348619["sendMessage"](
          _0x42ebeb["key"]["remoteJid"],
          { text: "✅ Successfully left *" + _0x364736["subject"] + "*." },
          { quoted: _0x42ebeb },
        ));
    } catch (_0x1c8093) {
      await _0x348619["sendMessage"](
        _0x42ebeb["key"]["remoteJid"],
        { text: "❌ Failed to leave the group.\n\n" + _0x1c8093["message"] },
        { quoted: _0x42ebeb },
      );
    }
  },
};
