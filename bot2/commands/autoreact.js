const { isOwner } = require("../utils/isOwner"),
  settingsStore = require("../utils/settingsStore"),
  groupSettingsStore = require("../utils/groupSettingsStore"),
  REACTION_EMOJIS = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🫡",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😈",
    "👿",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "❤️",
    "🩷",
    "🩵",
    "🩶",
    "💛",
    "🧡",
    "💯",
    "💢",
    "💥",
    "💫",
    "💦l",
    "💨",
    "🔥",
    "✨",
    "⭐",
    "🌟",
    "⚡",
    "☀️",
    "🌈",
    "🎉",
    "🎊",
    "👏",
    "🙌",
    "🫶",
    "🙏",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👊",
    "✊",
    "🤝",
    "💪",
    "🫵",
    "👀",
    "👁️",
    "🫂",
    "💋",
    "👑",
    "💎",
    "🚀",
    "🏆",
    "🥇",
    "🎵",
    "🎶",
    "✅",
    "❌",
    "❗",
    "❓",
    "‼️",
    "⁉️",
    "✔️",
    "☑️",
  ];
function resolveJid(_0x4a1f13) {
  const _0xc3a8b8 = _0x4a1f13["key"]["remoteJid"];
  return _0xc3a8b8["endsWith"]("@lid") && _0x4a1f13["key"]["remoteJidAlt"]
    ? _0x4a1f13["key"]["remoteJidAlt"]
    : _0xc3a8b8;
}
((module["exports"] = {
  name: "autoreact",
  aliases: ["autoreaction", "areact"],
  description:
    "Toggle auto-reacting to messages. In a DM this applies to all DMs; in a group it applies to that group only.",
  async execute(_0x123149, _0x457ee2, _0x155241) {
    const _0x3b9b2f = resolveJid(_0x457ee2),
      _0xda07ac = _0x3b9b2f["endsWith"]("@g.us"),
      _0x3b6b3d = _0x155241[0x0]?.["toLowerCase"]();
    if (!isOwner(_0x457ee2))
      return _0x123149["sendMessage"](
        _0x3b9b2f,
        { text: "❌ *Only the bot owner can execute this command.*" },
        { quoted: _0x457ee2 },
      );
    if (!_0x3b6b3d) {
      const _0x26f8a3 = _0xda07ac
        ? groupSettingsStore["get"](_0x3b9b2f, "autoreact", "off")
        : settingsStore["get"]("autoreactDM", "off");
      return _0x123149["sendMessage"](
        _0x3b9b2f,
        {
          text:
            "*⚙️ Auto-Reaction Settings " +
            (_0xda07ac ? "(This Group)" : "(DMs)") +
            "*\n\n" +
            ("🔹 *Status:* " +
              (_0x26f8a3 === "on" ? "✅ ENABLED" : "❌ DISABLED") +
              "\x0a") +
            "🔹 Reacts to incoming texts.\n\n" +
            "*Usage:* .autoreact on/off",
        },
        { quoted: _0x457ee2 },
      );
    }
    if (!["on", "off"]["includes"](_0x3b6b3d))
      return _0x123149["sendMessage"](
        _0x3b9b2f,
        { text: "❌ *Usage:* .autoreact on | off" },
        { quoted: _0x457ee2 },
      );
    if (_0xda07ac)
      return (
        groupSettingsStore["set"](_0x3b9b2f, "autoreact", _0x3b6b3d),
        _0x123149["sendMessage"](
          _0x3b9b2f,
          {
            text:
              "✅ Auto-reaction turned *" +
              _0x3b6b3d["toUpperCase"]() +
              "* for this group.",
          },
          { quoted: _0x457ee2 },
        )
      );
    return (
      settingsStore["set"]("autoreactDM", _0x3b6b3d),
      _0x123149["sendMessage"](
        _0x3b9b2f,
        {
          text:
            "✅ Auto-reaction turned *" +
            _0x3b6b3d["toUpperCase"]() +
            "* for all DMs.",
        },
        { quoted: _0x457ee2 },
      )
    );
  },
}),
  (module["exports"]["REACTION_EMOJIS"] = REACTION_EMOJIS));
