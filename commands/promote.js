module["exports"] = {
  name: "promote",
  aliases: ["crown", "p"],
  description: "Promotes a mentioned member to group admin (admin only).",
  async execute(_0x27a4c4, _0x1f4960) {
    const _0x32e97f = _0x1f4960["key"]["remoteJid"];
    if (!_0x32e97f["endsWith"]("@g.us")) {
      await _0x27a4c4["sendMessage"](
        _0x32e97f,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x1f4960 },
      );
      return;
    }
    const _0x150c49 =
        _0x1f4960["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "mentionedJid"
        ] || [],
      _0x28bde7 =
        _0x1f4960["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "participant"
        ],
      _0x130406 = _0x150c49[0x0] || _0x28bde7;
    if (!_0x130406) {
      await _0x27a4c4["sendMessage"](
        _0x32e97f,
        {
          text: "❌ *Who should I promote, mention or tag someone with the command.*",
        },
        { quoted: _0x1f4960 },
      );
      return;
    }
    const _0x351bba = await _0x27a4c4["groupMetadata"](_0x32e97f),
      _0x49850e =
        _0x1f4960["key"]["participant"] || _0x1f4960["key"]["remoteJid"],
      {
        isBotAdmin: _0x5c4e09,
        isSenderAdmin: _0x3513b7,
      } = require("../utils/isAdmin");
    if (!_0x3513b7(_0x351bba, _0x49850e)) {
      await _0x27a4c4["sendMessage"](
        _0x32e97f,
        { text: "❌ *Commands reserved for group admins.*" },
        { quoted: _0x1f4960 },
      );
      return;
    }
    if (!_0x5c4e09(_0x27a4c4, _0x351bba)) {
      await _0x27a4c4["sendMessage"](
        _0x32e97f,
        { text: "❌ *I need to be an admin, crown me.*" },
        { quoted: _0x1f4960 },
      );
      return;
    }
    const _0x24ef82 = _0x351bba["participants"]["find"](
      (_0x5988dd) =>
        _0x5988dd["id"]["replace"](/:\d+@/, "@") ===
        _0x130406["replace"](/:\d+@/, "@"),
    );
    if (_0x24ef82?.["admin"]) {
      await _0x27a4c4["sendMessage"](
        _0x32e97f,
        {
          text:
            "*⚠️ @" +
            _0x130406["split"]("@")[0x0] +
            " is already an admin here.*",
          mentions: [_0x130406],
        },
        { quoted: _0x1f4960 },
      );
      return;
    }
    (await _0x27a4c4["groupParticipantsUpdate"](
      _0x32e97f,
      [_0x130406],
      "promote",
    ),
      await _0x27a4c4["sendMessage"](
        _0x32e97f,
        {
          text:
            "⬆️ *Promoted @" + _0x130406["split"]("@")[0x0] + " to admin👑.*",
          mentions: [_0x130406],
        },
        { quoted: _0x1f4960 },
      ));
  },
};
