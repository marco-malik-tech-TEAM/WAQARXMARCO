module["exports"] = {
  name: "demote",
  aliases: ["d"],
  description:
    "Demotes a mentioned admin back to a regular member (admin only).",
  async execute(_0xcf9805, _0x1186d5, _0x102b59) {
    const _0x471ccb = _0x1186d5["key"]["remoteJid"];
    if (!_0x471ccb["endsWith"]("@g.us")) {
      await _0xcf9805["sendMessage"](
        _0x471ccb,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x1186d5 },
      );
      return;
    }
    const _0x209b57 =
        _0x1186d5["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "mentionedJid"
        ] || [],
      _0x331dca =
        _0x1186d5["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "participant"
        ],
      _0x2b7037 = _0x209b57[0x0] || _0x331dca;
    if (!_0x2b7037) {
      await _0xcf9805["sendMessage"](
        _0x471ccb,
        {
          text: "❌ *Who should I demote,mention or tag someone with the command.*",
        },
        { quoted: _0x1186d5 },
      );
      return;
    }
    const _0x149e0e = await _0xcf9805["groupMetadata"](_0x471ccb),
      _0x298472 =
        _0x1186d5["key"]["participant"] || _0x1186d5["key"]["remoteJid"],
      {
        isBotAdmin: _0x206ca2,
        isSenderAdmin: _0x455b3a,
      } = require("../utils/isAdmin"),
      _0x4d7d79 = _0x455b3a(_0x149e0e, _0x298472),
      _0x58a522 = _0x206ca2(_0xcf9805, _0x149e0e);
    if (!_0x4d7d79) {
      await _0xcf9805["sendMessage"](
        _0x471ccb,
        { text: "❌ *Command reserved for group admins.*" },
        { quoted: _0x1186d5 },
      );
      return;
    }
    if (!_0x58a522) {
      await _0xcf9805["sendMessage"](
        _0x471ccb,
        { text: "❌ *I need to be an admin, crown me.*" },
        { quoted: _0x1186d5 },
      );
      return;
    }
    const _0x3d04d5 = _0x149e0e["participants"]["find"](
      (_0x2e01de) =>
        _0x2e01de["id"]["replace"](/:\d+@/, "@") ===
        _0x2b7037["replace"](/:\d+@/, "@"),
    );
    if (!_0x3d04d5?.["admin"]) {
      await _0xcf9805["sendMessage"](
        _0x471ccb,
        {
          text:
            "*⚠️ @" + _0x2b7037["split"]("@")[0x0] + " isn't an admin here.*",
          mentions: [_0x2b7037],
        },
        { quoted: _0x1186d5 },
      );
      return;
    }
    (await _0xcf9805["groupParticipantsUpdate"](
      _0x471ccb,
      [_0x2b7037],
      "demote",
    ),
      await _0xcf9805["sendMessage"](
        _0x471ccb,
        {
          text: "⬇️ *Demoted @" + _0x2b7037["split"]("@")[0x0] + " to member.*",
          mentions: [_0x2b7037],
        },
        { quoted: _0x1186d5 },
      ));
  },
};
