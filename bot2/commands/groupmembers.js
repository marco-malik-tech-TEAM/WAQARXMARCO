const { isBotAdmin, isSenderAdmin } = require("../utils/isAdmin"),
  groupSettingsStore = require("../utils/groupSettingsStore");
function parseDuration(_0x1b8eb1) {
  const _0x3a89f1 = /^(\d+)\s*(s|sec|secs|m|min|mins|h|hr|hrs)?$/i["exec"](
    (_0x1b8eb1 || "")["trim"](),
  );
  if (!_0x3a89f1) return null;
  const _0x5f0193 = parseInt(_0x3a89f1[0x1], 0xa);
  if (!_0x5f0193 || _0x5f0193 <= 0x0) return null;
  const _0x410a04 = (_0x3a89f1[0x2] || "s")["toLowerCase"]();
  let _0x4af586, _0xa4ff32;
  if (_0x410a04["startsWith"]("h"))
    ((_0x4af586 = _0x5f0193 * 0x36ee80),
      (_0xa4ff32 = _0x5f0193 === 0x1 ? "hour" : "hours"));
  else
    _0x410a04["startsWith"]("m")
      ? ((_0x4af586 = _0x5f0193 * 0xea60),
        (_0xa4ff32 = _0x5f0193 === 0x1 ? "minute" : "minutes"))
      : ((_0x4af586 = _0x5f0193 * 0x3e8),
        (_0xa4ff32 = _0x5f0193 === 0x1 ? "second" : "seconds"));
  return { ms: _0x4af586, label: _0x5f0193 + "\x20" + _0xa4ff32 };
}
async function checkAdminPerms(_0x2ac528, _0x2aea5a) {
  const _0x28138b = _0x2aea5a["key"]["remoteJid"],
    _0x4fe7c1 = await _0x2ac528["groupMetadata"](_0x28138b),
    _0x3482b7 =
      _0x2aea5a["key"]["participant"] || _0x2aea5a["key"]["remoteJid"];
  if (!isSenderAdmin(_0x4fe7c1, _0x3482b7))
    return (
      await _0x2ac528["sendMessage"](
        _0x28138b,
        { text: "❌ Only group admins can use this command." },
        { quoted: _0x2aea5a },
      ),
      ![]
    );
  if (!isBotAdmin(_0x2ac528, _0x4fe7c1))
    return (
      await _0x2ac528["sendMessage"](
        _0x28138b,
        { text: "❌ I need to be a group admin to change group settings." },
        { quoted: _0x2aea5a },
      ),
      ![]
    );
  return !![];
}
module["exports"] = [
  {
    name: "invite",
    description: "Get the group invite link.",
    async execute(_0x1304e6, _0x8877cc) {
      const _0x2ecc2b = _0x8877cc["key"]["remoteJid"];
      if (!_0x2ecc2b["endsWith"]("@g.us"))
        return _0x1304e6["sendMessage"](
          _0x2ecc2b,
          { text: "❌ This command only works in groups." },
          { quoted: _0x8877cc },
        );
      try {
        const _0x33ca9f = await _0x1304e6["groupInviteCode"](_0x2ecc2b);
        await _0x1304e6["sendMessage"](
          _0x2ecc2b,
          {
            text:
              "🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/" + _0x33ca9f,
          },
          { quoted: _0x8877cc },
        );
      } catch (_0x34388d) {
        await _0x1304e6["sendMessage"](
          _0x2ecc2b,
          { text: "❌ Could not get invite link: " + _0x34388d["message"] },
          { quoted: _0x8877cc },
        );
      }
    },
  },
  {
    name: "join",
    description:
      "Make the bot join a group via invite link. Usage: .join <link> or reply .join",
    async execute(_0x286f95, _0x1d5881, _0x1254c9) {
      const _0xf1b927 = _0x1d5881["key"]["remoteJid"];
      let _0x5436fd = _0x1254c9[0x0];
      if (!_0x5436fd) {
        const _0x17e345 =
          _0x1d5881["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
            "quotedMessage"
          ];
        _0x17e345 &&
          (_0x5436fd =
            _0x17e345["conversation"] ||
            _0x17e345["extendedTextMessage"]?.["text"] ||
            _0x17e345["imageMessage"]?.["caption"] ||
            _0x17e345["videoMessage"]?.["caption"] ||
            "");
      }
      const _0x15d9ce = _0x5436fd?.["match"](
        /https?:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/,
      );
      if (!_0x15d9ce)
        return _0x286f95["sendMessage"](
          _0xf1b927,
          {
            text: "❌ Usage:\n.join <WhatsApp group invite link>\n\nor reply to a message containing a WhatsApp group link with *.join*",
          },
          { quoted: _0x1d5881 },
        );
      try {
        (await _0x286f95["groupAcceptInvite"](_0x15d9ce[0x1]),
          await _0x286f95["sendMessage"](
            _0xf1b927,
            { text: "✅ Bot joined the group successfully!" },
            { quoted: _0x1d5881 },
          ));
      } catch (_0x3d1e33) {
        await _0x286f95["sendMessage"](
          _0xf1b927,
          { text: "❌ Could not join group: " + _0x3d1e33["message"] },
          { quoted: _0x1d5881 },
        );
      }
    },
  },
  {
    name: "welcome",
    description:
      "Toggle welcome messages for new members. Usage: .welcome on/off",
    async execute(_0x43263f, _0x38c3e7, _0x2df3dd) {
      const _0x4ce23d = _0x38c3e7["key"]["remoteJid"];
      if (!_0x4ce23d["endsWith"]("@g.us"))
        return _0x43263f["sendMessage"](
          _0x4ce23d,
          { text: "❌ This command only works in groups." },
          { quoted: _0x38c3e7 },
        );
      const _0x234695 = _0x2df3dd[0x0]?.["toLowerCase"]();
      if (_0x234695 !== "on" && _0x234695 !== "off")
        return _0x43263f["sendMessage"](
          _0x4ce23d,
          { text: "❌ Usage: .welcome on  or  .welcome off" },
          { quoted: _0x38c3e7 },
        );
      (groupSettingsStore["set"](_0x4ce23d, "welcome", _0x234695 === "on"),
        await _0x43263f["sendMessage"](
          _0x4ce23d,
          { text: "✅ Welcome messages turned " + _0x234695 + "." },
          { quoted: _0x38c3e7 },
        ));
    },
  },
  {
    name: "goodbye",
    description:
      "Toggle goodbye messages for leaving members. Usage: .goodbye on/off",
    async execute(_0x1a790a, _0x57fe5a, _0x573462) {
      const _0x504b7b = _0x57fe5a["key"]["remoteJid"];
      if (!_0x504b7b["endsWith"]("@g.us"))
        return _0x1a790a["sendMessage"](
          _0x504b7b,
          { text: "❌ This command only works in groups." },
          { quoted: _0x57fe5a },
        );
      const _0x35100c = _0x573462[0x0]?.["toLowerCase"]();
      if (_0x35100c !== "on" && _0x35100c !== "off")
        return _0x1a790a["sendMessage"](
          _0x504b7b,
          { text: "❌ Usage: .goodbye on  or  .goodbye off" },
          { quoted: _0x57fe5a },
        );
      (groupSettingsStore["set"](_0x504b7b, "goodbye", _0x35100c === "on"),
        await _0x1a790a["sendMessage"](
          _0x504b7b,
          { text: "✅ Goodbye messages turned " + _0x35100c + "." },
          { quoted: _0x57fe5a },
        ));
    },
  },
  {
    name: "unmute",
    description: "Unmute the group, allowing all members to send messages.",
    async execute(_0x35b06d, _0x6ceb59) {
      const _0x212884 = _0x6ceb59["key"]["remoteJid"];
      if (!_0x212884["endsWith"]("@g.us"))
        return _0x35b06d["sendMessage"](
          _0x212884,
          { text: "❌ This command only works in groups." },
          { quoted: _0x6ceb59 },
        );
      try {
        (await _0x35b06d["groupSettingUpdate"](_0x212884, "not_announcement"),
          await _0x35b06d["sendMessage"](
            _0x212884,
            { text: "🔓 Group unmuted. Everyone can send messages now." },
            { quoted: _0x6ceb59 },
          ));
      } catch (_0x9d1243) {
        await _0x35b06d["sendMessage"](
          _0x212884,
          { text: "❌ Could not unmute group: " + _0x9d1243["message"] },
          { quoted: _0x6ceb59 },
        );
      }
    },
  },
  {
    name: "amute",
    description:
      "Schedule the group to be muted after a delay. Usage: .amute 50s | .amute 2m | .amute 1h",
    async execute(_0x54e390, _0x23eb76, _0x2ef638) {
      const _0xef48ef = _0x23eb76["key"]["remoteJid"];
      if (!_0xef48ef["endsWith"]("@g.us"))
        return _0x54e390["sendMessage"](
          _0xef48ef,
          { text: "❌ This command only works in groups." },
          { quoted: _0x23eb76 },
        );
      const _0x4f91e8 = parseDuration(_0x2ef638[0x0]);
      if (!_0x4f91e8)
        return _0x54e390["sendMessage"](
          _0xef48ef,
          {
            text: "❌ Usage: .amute <duration>\nExamples: .amute 50s | .amute 2m | .amute 1h",
          },
          { quoted: _0x23eb76 },
        );
      if (!(await checkAdminPerms(_0x54e390, _0x23eb76))) return;
      (await _0x54e390["sendMessage"](
        _0xef48ef,
        { text: "⏳ Group will be muted in " + _0x4f91e8["label"] + "." },
        { quoted: _0x23eb76 },
      ),
        setTimeout(async () => {
          try {
            (await _0x54e390["groupSettingUpdate"](_0xef48ef, "announcement"),
              await _0x54e390["sendMessage"](_0xef48ef, {
                text: "🔇 Group has been muted — only admins can send messages now.",
              }));
          } catch (_0x45b6d7) {
            await _0x54e390["sendMessage"](_0xef48ef, {
              text: "❌ Scheduled mute failed: " + _0x45b6d7["message"],
            });
          }
        }, _0x4f91e8["ms"]));
    },
  },
  {
    name: "aunmute",
    description:
      "Schedule the group to be unmuted after a delay. Usage: .aunmute 50s | .aunmute 2m | .aunmute 1h",
    async execute(_0x5cbbbb, _0x32c7c9, _0x4d3859) {
      const _0x41d524 = _0x32c7c9["key"]["remoteJid"];
      if (!_0x41d524["endsWith"]("@g.us"))
        return _0x5cbbbb["sendMessage"](
          _0x41d524,
          { text: "❌ This command only works in groups." },
          { quoted: _0x32c7c9 },
        );
      const _0x3a8fa8 = parseDuration(_0x4d3859[0x0]);
      if (!_0x3a8fa8)
        return _0x5cbbbb["sendMessage"](
          _0x41d524,
          {
            text: "❌ Usage: .aunmute <duration>\nExamples: .aunmute 50s | .aunmute 2m | .aunmute 1h",
          },
          { quoted: _0x32c7c9 },
        );
      if (!(await checkAdminPerms(_0x5cbbbb, _0x32c7c9))) return;
      (await _0x5cbbbb["sendMessage"](
        _0x41d524,
        { text: "⏳ Group will be unmuted in " + _0x3a8fa8["label"] + "." },
        { quoted: _0x32c7c9 },
      ),
        setTimeout(async () => {
          try {
            (await _0x5cbbbb["groupSettingUpdate"](
              _0x41d524,
              "not_announcement",
            ),
              await _0x5cbbbb["sendMessage"](_0x41d524, {
                text: "🔊 Group has been unmuted — everyone can send messages now.",
              }));
          } catch (_0x46fd0e) {
            await _0x5cbbbb["sendMessage"](_0x41d524, {
              text: "❌ Scheduled unmute failed: " + _0x46fd0e["message"],
            });
          }
        }, _0x3a8fa8["ms"]));
    },
  },
];
