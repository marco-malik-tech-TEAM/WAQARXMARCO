const { addWarning, getWarnings } = require("../utils/warnings");
module["exports"] = {
  name: "warn",
  description:
    "Warns a member; auto-removes them after 3 warnings (admin only).",
  async execute(_0x4aaece, _0x5a6300, _0x1eff7e) {
    const _0x4ddb5a = _0x5a6300["key"]["remoteJid"];
    if (!_0x4ddb5a["endsWith"]("@g.us")) {
      await _0x4aaece["sendMessage"](
        _0x4ddb5a,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x5a6300 },
      );
      return;
    }
    const _0x486385 =
        _0x5a6300["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "mentionedJid"
        ] || [],
      _0x18a0e2 =
        _0x5a6300["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "participant"
        ],
      _0x4df055 = _0x486385[0x0] || _0x18a0e2;
    if (!_0x4df055) {
      await _0x4aaece["sendMessage"](
        _0x4ddb5a,
        {
          text: "❌ *Who should I warn, mention or tag someone with the command.*",
        },
        { quoted: _0x5a6300 },
      );
      return;
    }
    const _0xf8ef11 = await _0x4aaece["groupMetadata"](_0x4ddb5a),
      _0x1f832a =
        _0x5a6300["key"]["participant"] || _0x5a6300["key"]["remoteJid"],
      {
        isBotAdmin: _0x1a9348,
        isSenderAdmin: _0x5e3dda,
      } = require("../utils/isAdmin");
    if (!_0x5e3dda(_0xf8ef11, _0x1f832a)) {
      await _0x4aaece["sendMessage"](
        _0x4ddb5a,
        { text: "❌ *Only group admins can use this command.*" },
        { quoted: _0x5a6300 },
      );
      return;
    }
    const _0x44b3ed = addWarning(_0x4ddb5a, _0x4df055),
      _0x6eb369 = 0x3 - _0x44b3ed;
    if (_0x44b3ed >= 0x3) {
      _0x1a9348(_0x4aaece, _0xf8ef11)
        ? (await _0x4aaece["groupParticipantsUpdate"](
            _0x4ddb5a,
            [_0x4df055],
            "remove",
          ),
          await _0x4aaece["sendMessage"](
            _0x4ddb5a,
            {
              text:
                "🚫 *@" +
                _0x4df055["split"]("@")[0x0] +
                " reached 3 warnings and has been removed.*",
              mentions: [_0x4df055],
            },
            { quoted: _0x5a6300 },
          ))
        : await _0x4aaece["sendMessage"](
            _0x4ddb5a,
            {
              text:
                "⚠️ *@" +
                _0x4df055["split"]("@")[0x0] +
                " has reached 3 warnings, but I need admin rights to remove them.*",
              mentions: [_0x4df055],
            },
            { quoted: _0x5a6300 },
          );
      return;
    }
    await _0x4aaece["sendMessage"](
      _0x4ddb5a,
      {
        text:
          "⚠️ *@" +
          _0x4df055["split"]("@")[0x0] +
          " has been warned (" +
          _0x44b3ed +
          "/3).*\n" +
          "*Reason:* Going against group rules\n" +
          ("*" + _0x6eb369 + " warning(s) until removal.*"),
        mentions: [_0x4df055],
      },
      { quoted: _0x5a6300 },
    );
  },
};
