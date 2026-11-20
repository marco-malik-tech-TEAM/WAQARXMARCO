const groupSettingsStore = require("../utils/groupSettingsStore"),
  { isOwner } = require("../utils/isOwner"),
  { isSenderAdmin } = require("../utils/isAdmin"),
  KEY = "antipromote",
  DEFAULTS = { enabled: ![], action: "demote" };
function getSettings(_0x5cecb3) {
  return { ...DEFAULTS, ...groupSettingsStore["get"](_0x5cecb3, KEY, {}) };
}
function setSettings(_0x50569b, _0x21362d) {
  const _0x7ffc4a = { ...getSettings(_0x50569b), ..._0x21362d };
  return (groupSettingsStore["set"](_0x50569b, KEY, _0x7ffc4a), _0x7ffc4a);
}
const ACTION_LABELS = { demote: "⬇️ Demote both", remove: "🚫 Remove both" };
module["exports"] = {
  name: "antipromote",
  aliases: ["antiprom", "nopromote"],
  description: "Prevent unauthorized promotions in group",
  async execute(_0x20a4ed, _0x3c1bea, _0x561002) {
    const _0x492dcc = _0x3c1bea["key"]["remoteJid"];
    if (!_0x492dcc["endsWith"]("@g.us"))
      return _0x20a4ed["sendMessage"](
        _0x492dcc,
        { text: "❌ This command can only be used in groups!" },
        { quoted: _0x3c1bea },
      );
    const _0x1d4439 =
        _0x3c1bea["key"]["participant"] || _0x3c1bea["key"]["remoteJid"],
      _0x1b0a39 = await _0x20a4ed["groupMetadata"](_0x492dcc),
      _0x44625a = isOwner(_0x3c1bea) || isSenderAdmin(_0x1b0a39, _0x1d4439);
    if (!_0x44625a)
      return _0x20a4ed["sendMessage"](
        _0x492dcc,
        {
          text: "❌ Only the bot owner or a group admin can use this command!",
        },
        { quoted: _0x3c1bea },
      );
    const _0x321ff8 = _0x561002[0x0]?.["toLowerCase"](),
      _0x58e49a = _0x561002[0x1],
      _0xd9cf9c = getSettings(_0x492dcc);
    if (!_0x321ff8) {
      const _0x1f4d80 = _0xd9cf9c["enabled"] ? "✅ ENABLED" : "❌ DISABLED",
        _0x37f214 =
          "*🚫 Anti-Promote Settings for this Group*\n\n" +
          ("📍 *JID:* `" + _0x492dcc + "`\n\n") +
          ("🔹 *Status:* " + _0x1f4d80 + "\x0a") +
          ("🔹 *Action:* " +
            (ACTION_LABELS[_0xd9cf9c["action"]] || ACTION_LABELS["demote"]) +
            "\x0a\x0a") +
          "*Actions:*\n" +
          "▸ *demote* - Demote both users\n" +
          "▸ *remove* - Remove both users from group\n\n" +
          "*Commands:*\n" +
          "▸ *.antipromote on* - Enable\n" +
          "▸ *.antipromote off* - Disable\n" +
          "▸ *.antipromote action demote/remove* - Set action";
      return _0x20a4ed["sendMessage"](
        _0x492dcc,
        { text: _0x37f214 },
        { quoted: _0x3c1bea },
      );
    }
    switch (_0x321ff8) {
      case "on":
      case "enable": {
        const _0x2953ba = setSettings(_0x492dcc, { enabled: !![] });
        return _0x20a4ed["sendMessage"](
          _0x492dcc,
          {
            text:
              "✅ Anti-Promote has been *ENABLED* for this group!\nAction: *" +
              (_0x2953ba["action"] || "demote")["toUpperCase"]() +
              "*",
          },
          { quoted: _0x3c1bea },
        );
      }
      case "off":
      case "disable": {
        return (
          setSettings(_0x492dcc, { enabled: ![] }),
          _0x20a4ed["sendMessage"](
            _0x492dcc,
            { text: "❌ Anti-Promote has been *DISABLED* for this group!" },
            { quoted: _0x3c1bea },
          )
        );
      }
      case "action": {
        if (!_0x58e49a || !["demote", "remove"]["includes"](_0x58e49a))
          return _0x20a4ed["sendMessage"](
            _0x492dcc,
            { text: "❌ Use: `.antipromote action demote/remove`" },
            { quoted: _0x3c1bea },
          );
        return (
          setSettings(_0x492dcc, {
            action: _0x58e49a,
            enabled: _0xd9cf9c["enabled"],
          }),
          _0x20a4ed["sendMessage"](
            _0x492dcc,
            {
              text:
                "✅ Anti-Promote action set to: *" +
                _0x58e49a["toUpperCase"]() +
                "*\x0a" +
                ACTION_LABELS[_0x58e49a],
            },
            { quoted: _0x3c1bea },
          )
        );
      }
      default:
        return _0x20a4ed["sendMessage"](
          _0x492dcc,
          {
            text:
              "❌ Invalid command!\n\n" +
              "▸ *.antipromote on* - Enable\n" +
              "▸ *.antipromote off* - Disable\n" +
              "▸ *.antipromote action demote/remove* - Set action",
          },
          { quoted: _0x3c1bea },
        );
    }
  },
};
