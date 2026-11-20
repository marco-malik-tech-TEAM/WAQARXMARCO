const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "mygroups",
  aliases: ["groups", "botgroups", "glist"],
  description: "List all groups the bot is in (owner only).",
  async execute(_0x115cce, _0x571373) {
    console["log"]("[MYGROUPS] execute started");
    const _0x209b7e = _0x571373["key"]["remoteJid"],
      _0xa877ae =
        _0x209b7e["endsWith"]("@lid") && _0x571373["key"]["remoteJidAlt"]
          ? _0x571373["key"]["remoteJidAlt"]
          : _0x209b7e;
    if (!isOwner(_0x571373))
      return await _0x115cce["sendMessage"](
        _0xa877ae,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x571373 },
      );
    try {
      const _0x855a6f = await _0x115cce["groupFetchAllParticipating"](),
        _0x5ba00d = Object["values"](_0x855a6f);
      if (!_0x5ba00d["length"])
        return await _0x115cce["sendMessage"](
          _0xa877ae,
          { text: "⚠️ *Bot is not in any groups.*" },
          { quoted: _0x571373 },
        );
      let _0x36f85e = "📋 *My Groups (" + _0x5ba00d["length"] + ")*\n\n";
      (_0x5ba00d["forEach"]((_0x3c756e, _0x3c4f35) => {
        ((_0x36f85e +=
          "*" +
          (_0x3c4f35 + 0x1) +
          ".\x20" +
          (_0x3c756e["subject"] || "Unnamed Group") +
          "*\x0a"),
          (_0x36f85e +=
            "👥 *Members:* " +
            (_0x3c756e["participants"]?.["length"] || 0x0) +
            "\x0a"),
          (_0x36f85e += "🆔 *JID:* `" + _0x3c756e["id"] + "`\n\n"));
      }),
        await _0x115cce["sendMessage"](
          _0xa877ae,
          { text: _0x36f85e["trim"]() },
          { quoted: _0x571373 },
        ));
    } catch (_0x333eaf) {
      (console["error"]("[MYGROUPS ERROR]", _0x333eaf),
        await _0x115cce["sendMessage"](
          _0xa877ae,
          {
            text:
              "❌ *Error while accessing bot groups:*\n" + _0x333eaf["message"],
          },
          { quoted: _0x571373 },
        ));
    }
  },
};
