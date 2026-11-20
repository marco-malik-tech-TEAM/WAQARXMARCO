const settingsStore = require("../utils/settingsStore"),
  groupSettingsStore = require("../utils/groupSettingsStore"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "chatbot",
  aliases: ["autoreply"],
  description:
    "Toggle auto-chatbot replies. In a group: per-group, replies when mentioned. In DM: global. Usage: .chatbot on/off",
  async execute(_0x27b936, _0x1b00c, _0x1c6a4c) {
    const _0x3170fa = _0x1b00c["key"]["remoteJid"],
      _0x5ea2f6 = _0x3170fa["endsWith"]("@g.us"),
      _0x2f317d = _0x1c6a4c[0x0]?.["toLowerCase"]();
    if (_0x5ea2f6) {
      const _0xa07fb9 = isOwner(_0x1b00c) || isSudo(_0x1b00c);
      if (!_0xa07fb9)
        return _0x27b936["sendMessage"](
          _0x3170fa,
          { text: "*❌ Only the bot owner can use this command!*" },
          { quoted: _0x1b00c },
        );
      if (!_0x2f317d) {
        const _0x5b52f5 = groupSettingsStore["get"](_0x3170fa, "chatbot", ![]);
        return _0x27b936["sendMessage"](
          _0x3170fa,
          {
            text:
              "*🤖 Chatbot Settings (this group)*\n\n" +
              ("🔹 *Status:* " +
                (_0x5b52f5 ? "✅ ENABLED" : "❌ DISABLED") +
                "\x0a") +
              "🔹 Replies only when the bot is mentioned.\n\n" +
              "*Usage:* .chatbot on/off",
          },
          { quoted: _0x1b00c },
        );
      }
      if (!["on", "off"]["includes"](_0x2f317d))
        return _0x27b936["sendMessage"](
          _0x3170fa,
          { text: "❌ Use: `.chatbot on/off`" },
          { quoted: _0x1b00c },
        );
      return (
        groupSettingsStore["set"](_0x3170fa, "chatbot", _0x2f317d === "on"),
        _0x27b936["sendMessage"](
          _0x3170fa,
          {
            text:
              "*✅ Chatbot " +
              (_0x2f317d === "on" ? "*ENABLED*" : "*DISABLED*") +
              " for this group.*",
          },
          { quoted: _0x1b00c },
        )
      );
    }
    if (!isOwner(_0x1b00c))
      return _0x27b936["sendMessage"](
        _0x3170fa,
        { text: "*❌ Owner Only Command!*" },
        { quoted: _0x1b00c },
      );
    if (!_0x2f317d) {
      const _0x1bef30 = settingsStore["get"]("chatbotDM", ![]);
      return _0x27b936["sendMessage"](
        _0x3170fa,
        {
          text:
            "*🤖 Chatbot Settings (DMs)*\n\n" +
            ("🔹 *Status:* " +
              (_0x1bef30 ? "✅ ENABLED" : "❌ DISABLED") +
              "\x0a\x0a") +
            "*Usage:* .chatbot on/off\n" +
            "ℹ️ Run this inside a group instead to toggle it for that group.",
        },
        { quoted: _0x1b00c },
      );
    }
    if (!["on", "off"]["includes"](_0x2f317d))
      return _0x27b936["sendMessage"](
        _0x3170fa,
        { text: "❌ Use: `.chatbot on/off`" },
        { quoted: _0x1b00c },
      );
    return (
      settingsStore["set"]("chatbotDM", _0x2f317d === "on"),
      _0x27b936["sendMessage"](
        _0x3170fa,
        {
          text:
            "*✅ Chatbot " +
            (_0x2f317d === "on" ? "*ENABLED*" : "*DISABLED*") +
            " for DMs only.*",
        },
        { quoted: _0x1b00c },
      )
    );
  },
};
