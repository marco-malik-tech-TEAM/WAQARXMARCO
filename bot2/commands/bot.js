module["exports"] = {
  name: "bot",
  aliases: ["b"],
  description: "Checks whether MARCO X WAQAR MD BOT is active.",
  async execute(_0x1bb35a, _0x375f25) {
    const _0x5b0038 = _0x375f25["key"]["remoteJid"],
      _0x33de85 =
        _0x375f25["pushName"] || _0x375f25["verifiedBizName"] || "User",
      _0xe5a360 = [
        "╭━━━━━━━━━━━━━━━╮",
        "│   ✅ *ʙᴏᴛ ɪꜱ ᴀᴄᴛɪᴠᴇ*",
        "╰━━━━━━━━━━━━━━━╯",
        "",
        "ʜᴇʟʟᴏ, *" + _0x33de85 + "*! 😁🙌",
        "",
        "ɪ ᴀᴍ ᴀ ꜰᴀꜱᴛ & ᴘᴏᴡᴇʀꜰᴜʟ",
        "ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴡɪᴛʜ ᴀᴍᴀᴢɪɴɢ",
        "ꜰᴇᴀᴛᴜʀᴇꜱ 🔥",
        "",
        "╭─❏ *ᴄᴏᴍᴍᴀɴᴅꜱ* ❏",
        "│",
        "│ ◈ ᴛʏᴘᴇ *.ᴍᴇɴᴜ* ➜ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ",
        "│ ◈ ᴛʏᴘᴇ *.ᴘɪɴɢ* ➜ ᴄʜᴇᴄᴋ ꜱᴘᴇᴇᴅ",
        "│ ◈ ᴛʏᴘᴇ *.ᴜᴘᴅᴀᴛᴇ* ➜ ʟᴀᴛᴇꜱᴛ ᴠᴇʀꜱɪᴏɴ",
        "│",
        "╰─────────────────",
        "",
        "> *ᴛʏᴘᴇ .ᴍᴇɴᴜ ᴛᴏ ꜱᴛᴀʀᴛ* 🎉",
      ];
    try {
      let _0x4f7e9d = "";
      const _0x15e5b0 = await _0x1bb35a["sendMessage"](
        _0x5b0038,
        { text: "" },
        { quoted: _0x375f25 },
      );
      for (const _0x3d9c2d of _0xe5a360) {
        ((_0x4f7e9d += (_0x4f7e9d ? "\x0a" : "") + _0x3d9c2d),
          await _0x1bb35a["sendMessage"](_0x5b0038, {
            text: _0x4f7e9d,
            edit: _0x15e5b0["key"],
          }),
          await new Promise((_0x136e71) => setTimeout(_0x136e71, 0x12c)));
      }
    } catch (_0x20419a) {
      (console["error"]("[BOT ERROR]", _0x20419a),
        await _0x1bb35a["sendMessage"](
          _0x5b0038,
          { text: "❌ Failed to check bot status." },
          { quoted: _0x375f25 },
        ));
    }
  },
};
