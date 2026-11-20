const { resetWarnings, getWarnings } = require("../utils/warnings");
module["exports"] = {
  name: "resetwarn",
  description: "Clears all warnings for a member (admin only).",
  async execute(_0x5ac5eb, _0x468b9a, _0x586b0c) {
    const _0x31d32e = _0x468b9a["key"]["remoteJid"];
    if (!_0x31d32e["endsWith"]("@g.us")) {
      await _0x5ac5eb["sendMessage"](
        _0x31d32e,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x468b9a },
      );
      return;
    }
    const _0x42d972 =
        _0x468b9a["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "mentionedJid"
        ] || [],
      _0x47fd9f =
        _0x468b9a["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "participant"
        ],
      _0x32109d = _0x42d972[0x0] || _0x47fd9f;
    if (!_0x32109d) {
      await _0x5ac5eb["sendMessage"](
        _0x31d32e,
        { text: "❌ *Whose warnings should I reset, mention or tag someone.*" },
        { quoted: _0x468b9a },
      );
      return;
    }
    const _0x2b9f4b = await _0x5ac5eb["groupMetadata"](_0x31d32e),
      _0x1fe601 =
        _0x468b9a["key"]["participant"] || _0x468b9a["key"]["remoteJid"],
      { isSenderAdmin: _0x1f904b } = require("../utils/isAdmin");
    if (!_0x1f904b(_0x2b9f4b, _0x1fe601)) {
      await _0x5ac5eb["sendMessage"](
        _0x31d32e,
        { text: "❌ *Only group admins can use this command.*" },
        { quoted: _0x468b9a },
      );
      return;
    }
    const _0x51ad3f = getWarnings(_0x31d32e, _0x32109d);
    if (_0x51ad3f === 0x0) {
      await _0x5ac5eb["sendMessage"](
        _0x31d32e,
        {
          text:
            "ℹ️ *@" +
            _0x32109d["split"]("@")[0x0] +
            " has no warnings to reset.*",
          mentions: [_0x32109d],
        },
        { quoted: _0x468b9a },
      );
      return;
    }
    (resetWarnings(_0x31d32e, _0x32109d),
      await _0x5ac5eb["sendMessage"](
        _0x31d32e,
        {
          text:
            "✅ *@" +
            _0x32109d["split"]("@")[0x0] +
            "'s warnings have been reset (was " +
            _0x51ad3f +
            "/3).*",
          mentions: [_0x32109d],
        },
        { quoted: _0x468b9a },
      ));
  },
};
