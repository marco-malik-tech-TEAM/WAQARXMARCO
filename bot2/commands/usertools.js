const https = require("https"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { isOwner } = require("../utils/isOwner");
function downloadBuffer(_0x564c81) {
  return new Promise((_0x3a71a0, _0x28ec26) => {
    https["get"](_0x564c81, (_0x41e646) => {
      if (
        _0x41e646["statusCode"] >= 0x12c &&
        _0x41e646["statusCode"] < 0x190 &&
        _0x41e646["headers"]["location"]
      )
        return downloadBuffer(_0x41e646["headers"]["location"])
          ["then"](_0x3a71a0)
          ["catch"](_0x28ec26);
      const _0x1748c7 = [];
      (_0x41e646["on"]("data", (_0x5ce4b8) => _0x1748c7["push"](_0x5ce4b8)),
        _0x41e646["on"]("end", () => _0x3a71a0(Buffer["concat"](_0x1748c7))),
        _0x41e646["on"]("error", _0x28ec26));
    })["on"]("error", _0x28ec26);
  });
}
function formatTimestamp(_0x4e2eb4) {
  const _0x69365d = new Date(_0x4e2eb4 * 0x3e8),
    _0x14dbd5 = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    _0x37227c = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  return {
    day: _0x14dbd5[_0x69365d["getDay"]()],
    date: _0x69365d["getDate"](),
    month: _0x37227c[_0x69365d["getMonth"]()],
    year: _0x69365d["getFullYear"](),
    time: _0x69365d["toLocaleTimeString"]("en-US"),
  };
}
module["exports"] = [
  {
    name: "fullpp",
    aliases: ["setpp"],
    description:
      "Set your WhatsApp profile picture from a replied image. Usage: reply to an image with .fullpp",
    async execute(_0x4e7200, _0x26969a) {
      const _0x33d8f6 = _0x26969a["key"]["remoteJid"];
      if (!isOwner(_0x26969a))
        return _0x4e7200["sendMessage"](
          _0x33d8f6,
          { text: "❌ *Only the owner can change the profile picture.*" },
          { quoted: _0x26969a },
        );
      const _0x38fc20 =
          _0x26969a["message"]?.["extendedTextMessage"]?.["contextInfo"],
        _0x4a9bd8 = _0x38fc20?.["quotedMessage"];
      if (!_0x4a9bd8?.["imageMessage"])
        return _0x4e7200["sendMessage"](
          _0x33d8f6,
          { text: "❌ *Reply to an image with .fullpp*" },
          { quoted: _0x26969a },
        );
      try {
        const _0x2dc96a = await downloadMediaMessage(
          {
            message: _0x4a9bd8,
            key: {
              remoteJid: _0x33d8f6,
              id: _0x38fc20["stanzaId"],
              participant: _0x38fc20["participant"],
            },
          },
          "buffer",
          {},
        );
        (await _0x4e7200["updateProfilePicture"](
          _0x4e7200["user"]["id"],
          _0x2dc96a,
        ),
          await _0x4e7200["sendMessage"](
            _0x33d8f6,
            { text: "✅ *Profile picture updated.*" },
            { quoted: _0x26969a },
          ));
      } catch (_0x59867a) {
        await _0x4e7200["sendMessage"](
          _0x33d8f6,
          {
            text:
              "❌ *Could not update profile picture: " +
              _0x59867a["message"] +
              "*",
          },
          { quoted: _0x26969a },
        );
      }
    },
  },
  {
    name: "jid",
    description:
      "Get your own or a tagged user's JID. Usage: .jid or .jid @user",
    async execute(_0x56c976, _0x419f5d) {
      const _0x5015cf = _0x419f5d["key"]["remoteJid"],
        _0x77986 =
          _0x419f5d["message"]?.["extendedTextMessage"]?.["contextInfo"],
        _0x2a857d =
          _0x77986?.["mentionedJid"]?.[0x0] ||
          _0x77986?.["participant"] ||
          _0x419f5d["key"]["participant"] ||
          _0x419f5d["key"]["remoteJid"];
      await _0x56c976["sendMessage"](
        _0x5015cf,
        { text: "🆔 *JID:*\n" + _0x2a857d },
        { quoted: _0x419f5d },
      );
    },
  },
  {
    name: "gjid",
    description: "Get the current group's JID.",
    async execute(_0x490b05, _0x38e954) {
      const _0x56e64b = _0x38e954["key"]["remoteJid"];
      if (!_0x56e64b["endsWith"]("@g.us"))
        return _0x490b05["sendMessage"](
          _0x56e64b,
          { text: "❌ *This command only works in groups.*" },
          { quoted: _0x38e954 },
        );
      await _0x490b05["sendMessage"](
        _0x56e64b,
        { text: "🆔 *Group JID:*\n" + _0x56e64b },
        { quoted: _0x38e954 },
      );
    },
  },
  {
    name: "left",
    description: "Make the bot leave the current group.",
    async execute(_0x26f904, _0x2a6e28) {
      const _0x15165b = _0x2a6e28["key"]["remoteJid"];
      if (!_0x15165b["endsWith"]("@g.us"))
        return _0x26f904["sendMessage"](
          _0x15165b,
          { text: "❌ *This command only works in groups.*" },
          { quoted: _0x2a6e28 },
        );
      if (!isOwner(_0x2a6e28))
        return _0x26f904["sendMessage"](
          _0x15165b,
          { text: "❌ *Only the bot owner can use this command.*" },
          { quoted: _0x2a6e28 },
        );
      (await _0x26f904["sendMessage"](
        _0x15165b,
        { text: "😡 *Goodbye idiots! MARCO X WAQAR MD BOT is leaving this group now.*" },
        { quoted: _0x2a6e28 },
      ),
        await _0x26f904["groupLeave"](_0x15165b));
    },
  },
];
