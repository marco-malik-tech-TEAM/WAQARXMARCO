const groupSettingsStore = require("../utils/groupSettingsStore"),
  { isOwner } = require("../utils/isOwner");
function makeToggleCommand(_0x557eef, _0x4b1a23, _0x18499c, _0x87d94f) {
  return {
    name: _0x557eef,
    description: "Toggle " + _0x18499c + ". Usage: ." + _0x557eef + " on/off",
    async execute(_0x2fe480, _0x116a41, _0x435c84) {
      const _0x55e7a3 = _0x116a41["key"]["remoteJid"];
      if (!_0x55e7a3["endsWith"]("@g.us"))
        return _0x2fe480["sendMessage"](
          _0x55e7a3,
          { text: "❌ This command only works in groups." },
          { quoted: _0x116a41 },
        );
      const _0x49c69c = _0x435c84[0x0]?.["toLowerCase"]();
      if (_0x49c69c !== "on" && _0x49c69c !== "off")
        return _0x2fe480["sendMessage"](
          _0x55e7a3,
          {
            text: "❌ Usage: ." + _0x557eef + " on  or  ." + _0x557eef + " off",
          },
          { quoted: _0x116a41 },
        );
      (groupSettingsStore["set"](_0x55e7a3, _0x4b1a23, _0x49c69c === "on"),
        await _0x2fe480["sendMessage"](
          _0x55e7a3,
          {
            text: _0x87d94f + "\x20" + _0x18499c + " turned " + _0x49c69c + ".",
          },
          { quoted: _0x116a41 },
        ));
    },
  };
}
module["exports"] = [
  {
    name: "antigm",
    aliases: ["antistatusmention", "nostatus"],
    description:
      "Anti-group-mention protection. Usage: .antigm off/on/kick/warn",
    async execute(_0xec05b6, _0x520143, _0x2d64ae) {
      const _0x58933c = _0x520143["key"]["remoteJid"];
      if (!_0x58933c["endsWith"]("@g.us"))
        return _0xec05b6["sendMessage"](
          _0x58933c,
          { text: "❌ Is this a group ? This command only works in groups." },
          { quoted: _0x520143 },
        );
      const _0x15c76c = _0x2d64ae[0x0]?.["toLowerCase"]();
      if (!_0x15c76c) {
        const _0x5385af = groupSettingsStore["get"](_0x58933c, "antigm", ![]);
        return _0xec05b6["sendMessage"](
          _0x58933c,
          {
            text:
              "🛡️ *Antigm Settings*\n\n" +
              ("🔹 *Action:* " +
                (_0x5385af ? String(_0x5385af)["toUpperCase"]() : "❌ OFF") +
                "\x0a\x0a") +
              "*Usage:* *.antigm off / on / delete / kick / warn*",
          },
          { quoted: _0x520143 },
        );
      }
      if (!["off", "on", "delete", "kick", "warn"]["includes"](_0x15c76c))
        return _0xec05b6["sendMessage"](
          _0x58933c,
          { text: "*❌ Usage: .antigm off / on / delete / kick / warn*" },
          { quoted: _0x520143 },
        );
      (groupSettingsStore["set"](_0x58933c, "antigm", _0x15c76c),
        await _0xec05b6["sendMessage"](
          _0x58933c,
          { text: "🛡️ Antigm set to *" + _0x15c76c["toUpperCase"]() + "*." },
          { quoted: _0x520143 },
        ));
    },
  },
  {
    name: "antilink",
    aliases: ["nolinks"],
    description:
      "Anti-link protection. Usage: .antilink off/on/delete/kick/warn (delete/on = delete only, warn = delete + warn, kick = delete + kick)",
    async execute(_0xf7b451, _0x10a2ea, _0x412d70) {
      const _0x1ef8e1 = _0x10a2ea["key"]["remoteJid"];
      if (!_0x1ef8e1["endsWith"]("@g.us"))
        return _0xf7b451["sendMessage"](
          _0x1ef8e1,
          { text: "*❌ This command only works in groups.*" },
          { quoted: _0x10a2ea },
        );
      const _0x19e99b = _0x412d70[0x0]?.["toLowerCase"]();
      if (!_0x19e99b) {
        const _0x79fb11 = groupSettingsStore["get"](_0x1ef8e1, "antilink", ![]);
        return _0xf7b451["sendMessage"](
          _0x1ef8e1,
          {
            text:
              "🔗 *Antilink Settings*\n\n" +
              ("🔹 *Action:* " +
                (_0x79fb11 ? String(_0x79fb11)["toUpperCase"]() : "❌ OFF") +
                "\x0a\x0a") +
              "*Usage:* *.antilink off / on / delete / kick / warn*",
          },
          { quoted: _0x10a2ea },
        );
      }
      if (!["off", "on", "delete", "kick", "warn"]["includes"](_0x19e99b))
        return _0xf7b451["sendMessage"](
          _0x1ef8e1,
          { text: "*❌ Usage: .antilink off / on / delete / kick / warn*" },
          { quoted: _0x10a2ea },
        );
      (groupSettingsStore["set"](_0x1ef8e1, "antilink", _0x19e99b),
        await _0xf7b451["sendMessage"](
          _0x1ef8e1,
          { text: "🔗 Antilink set to *" + _0x19e99b["toUpperCase"]() + "*." },
          { quoted: _0x10a2ea },
        ));
    },
  },
  makeToggleCommand(
    "antigstatus",
    "antigstatus",
    "Anti-group-status spam protection",
    "🛡️",
  ),
  makeToggleCommand("antispam", "antispam", "Anti-spam protection", "🚫"),
  makeToggleCommand("antiword", "antiword", "Banned word filter", "🤬"),
  {
    name: "common",
    description: "Show current group protection settings.",
    async execute(_0x5ec915, _0x593e2d) {
      const _0x2c0577 = _0x593e2d["key"]["remoteJid"];
      if (!_0x2c0577["endsWith"]("@g.us"))
        return _0x5ec915["sendMessage"](
          _0x2c0577,
          { text: "❌ This command only works in groups." },
          { quoted: _0x593e2d },
        );
      const _0x5b2d5a = groupSettingsStore["getAll"](_0x2c0577),
        _0xf2da84 = (_0x79596c) => (_0x79596c ? "✅ ON" : "❌ OFF"),
        _0x31fc29 = ("\n╭──〔 🛡️ GROUP SETTINGS 〕──╮\n🔗 Antilink: " +
          (_0x5b2d5a["antilink"]
            ? String(_0x5b2d5a["antilink"])["toUpperCase"]()
            : "❌ OFF") +
          "\n🚫 Antispam: " +
          _0xf2da84(_0x5b2d5a["antispam"]) +
          "\n🤬 Antiword: " +
          _0xf2da84(_0x5b2d5a["antiword"]) +
          "\n🛡️ Antigm: " +
          (_0x5b2d5a["antigm"]
            ? String(_0x5b2d5a["antigm"])["toUpperCase"]()
            : "❌ OFF") +
          "\n🛡️ Antigstatus: " +
          _0xf2da84(_0x5b2d5a["antigstatus"]) +
          "\n👋 Welcome: " +
          _0xf2da84(_0x5b2d5a["welcome"]) +
          "\n👋 Goodbye: " +
          _0xf2da84(_0x5b2d5a["goodbye"]) +
          "\n╰──────────────────╯")["trim"]();
      await _0x5ec915["sendMessage"](
        _0x2c0577,
        { text: _0x31fc29 },
        { quoted: _0x593e2d },
      );
    },
  },
  {
    name: "gpp",
    description: "Get the group's profile picture.",
    async execute(_0x563ec2, _0x9f172d) {
      const _0x3d6f13 = _0x9f172d["key"]["remoteJid"];
      if (!_0x3d6f13["endsWith"]("@g.us"))
        return _0x563ec2["sendMessage"](
          _0x3d6f13,
          { text: "❌ This command only works in groups." },
          { quoted: _0x9f172d },
        );
      try {
        const _0x342a81 = await _0x563ec2["profilePictureUrl"](
            _0x3d6f13,
            "image",
          ),
          _0x1dbcf7 = require("https"),
          _0x155bce = await new Promise((_0x4649ca, _0x1b1c03) => {
            _0x1dbcf7["get"](_0x342a81, (_0x31410c) => {
              const _0x14c50b = [];
              (_0x31410c["on"]("data", (_0x14f692) =>
                _0x14c50b["push"](_0x14f692),
              ),
                _0x31410c["on"]("end", () =>
                  _0x4649ca(Buffer["concat"](_0x14c50b)),
                ),
                _0x31410c["on"]("error", _0x1b1c03));
            })["on"]("error", _0x1b1c03);
          });
        await _0x563ec2["sendMessage"](
          _0x3d6f13,
          { image: _0x155bce, caption: "🖼 Group Profile Picture" },
          { quoted: _0x9f172d },
        );
      } catch (_0x3df1be) {
        await _0x563ec2["sendMessage"](
          _0x3d6f13,
          { text: "❌ This group has no profile picture set." },
          { quoted: _0x9f172d },
        );
      }
    },
  },
  {
    name: "gstatus",
    aliases: ["gas", "gps"],
    description:
      "Post a replied photo/video into this group's chat (not the bot's WhatsApp status). Usage: reply to media with .gstatus",
    async execute(_0xd8fa51, _0x3b4d2e) {
      const _0x2b58ac = _0x3b4d2e["key"]["remoteJid"];
      if (!_0x2b58ac["endsWith"]("@g.us"))
        return _0xd8fa51["sendMessage"](
          _0x2b58ac,
          { text: "❌ This command only works in groups." },
          { quoted: _0x3b4d2e },
        );
      const _0x2560cb =
          _0x3b4d2e["message"]?.["extendedTextMessage"]?.["contextInfo"],
        _0x512636 = _0x2560cb?.["quotedMessage"];
      if (!_0x512636?.["imageMessage"] && !_0x512636?.["videoMessage"])
        return _0xd8fa51["sendMessage"](
          _0x2b58ac,
          { text: "❌ Reply to a photo or video with .gstatus" },
          { quoted: _0x3b4d2e },
        );
      try {
        const {
            downloadMediaMessage: _0xa9aa3a,
          } = require("@whiskeysockets/baileys"),
          _0x213c6a = await _0xa9aa3a(
            {
              message: _0x512636,
              key: {
                remoteJid: _0x2b58ac,
                id: _0x2560cb["stanzaId"],
                participant: _0x2560cb["participant"],
              },
            },
            "buffer",
            {},
          ),
          _0x58025e = _0x512636["imageMessage"] ? "image" : "video",
          _0x45ec1f = _0x512636[_0x58025e + "Message"]?.["caption"] || "";
        await _0xd8fa51["sendMessage"](
          _0x2b58ac,
          { [_0x58025e]: _0x213c6a, caption: _0x45ec1f },
          { quoted: _0x3b4d2e },
        );
      } catch (_0x3580ce) {
        await _0xd8fa51["sendMessage"](
          _0x2b58ac,
          { text: "❌ Failed to post: " + _0x3580ce["message"] },
          { quoted: _0x3b4d2e },
        );
      }
    },
  },
];
