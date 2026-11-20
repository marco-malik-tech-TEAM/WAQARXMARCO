const { isOwner } = require("../utils/isOwner"),
  { jidNormalizedUser } = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "kill2",
  aliases: ["kickall2", "kick-all2"],
  description: "Nuclear kick a remote group by invite link (Owner only)",
  async execute(_0x197e71, _0x45a6e7, _0x1b4509) {
    const _0x18e6d3 = _0x45a6e7["key"]["remoteJid"];
    if (!isOwner(_0x45a6e7))
      return _0x197e71["sendMessage"](
        _0x18e6d3,
        { text: "*Command meant for the owner*" },
        { quoted: _0x45a6e7 },
      );
    const _0x4e1c69 = _0x1b4509[0x0];
    if (!_0x4e1c69)
      return await _0x197e71["sendMessage"](
        _0x18e6d3,
        {
          text: "Provide a valid group link. Ensure the bot is in that group with admin privileges!",
        },
        { quoted: _0x45a6e7 },
      );
    let _0x1bc53e, _0x5d9b94;
    try {
      const _0x373e5e = _0x4e1c69["split"]("https://chat.whatsapp.com/")[0x1],
        _0x2569ae = await _0x197e71["groupGetInviteInfo"](_0x373e5e);
      ((_0x1bc53e = _0x2569ae["id"]), (_0x5d9b94 = _0x2569ae["subject"]));
    } catch {
      return await _0x197e71["sendMessage"](
        _0x18e6d3,
        { text: "Why are you giving me an invalid group link?" },
        { quoted: _0x45a6e7 },
      );
    }
    try {
      const _0x4410e6 = await _0x197e71["groupMetadata"](_0x1bc53e),
        _0x440af5 = jidNormalizedUser(_0x197e71["user"]["id"]),
        _0x29cdb7 = _0x4410e6["participants"]
          ["filter"]((_0x4b978e) => _0x4b978e["id"] !== _0x440af5)
          ["map"]((_0x379f41) => _0x379f41["id"]);
      (await _0x197e71["sendMessage"](
        _0x18e6d3,
        { text: "☠️ Initializing and preparing to kill ☠️ " + _0x5d9b94 },
        { quoted: _0x45a6e7 },
      ),
        await _0x197e71["groupSettingUpdate"](_0x1bc53e, "announcement"),
        await _0x197e71["removeProfilePicture"](_0x1bc53e),
        await _0x197e71["groupUpdateSubject"](
          _0x1bc53e,
          "This group is no longer available 🚫",
        ),
        await _0x197e71["groupUpdateDescription"](
          _0x1bc53e,
          "Removed by Marco X Waqar order.",
        ),
        await _0x197e71["groupRevokeInvite"](_0x1bc53e),
        await _0x197e71["sendMessage"](_0x1bc53e, {
          text:
            "My owner has initiated a remote kill command.\nThis has triggered removal of all " +
            _0x29cdb7["length"] +
            " group participants.\n\nGoodbye everyone! 👋",
          mentions: _0x29cdb7,
        }),
        await _0x197e71["groupParticipantsUpdate"](
          _0x1bc53e,
          _0x29cdb7,
          "remove",
        ),
        await _0x197e71["sendMessage"](_0x1bc53e, { text: "Goodbye group 👋" }),
        await _0x197e71["groupLeave"](_0x1bc53e),
        await _0x197e71["sendMessage"](
          _0x18e6d3,
          { text: "✅ Successfully killed the group." },
          { quoted: _0x45a6e7 },
        ));
    } catch (_0x1724ed) {
      (console["error"]("[KILL2 ERROR]", _0x1724ed),
        await _0x197e71["sendMessage"](
          _0x18e6d3,
          {
            text: "❌ Kill command failed — bot is either not in that group, or not an admin.",
          },
          { quoted: _0x45a6e7 },
        ));
    }
  },
};
