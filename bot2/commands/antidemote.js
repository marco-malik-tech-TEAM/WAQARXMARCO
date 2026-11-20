const groupSettingsStore = require("../utils/groupSettingsStore"),
  { isOwner } = require("../utils/isOwner"),
  { isSenderAdmin } = require("../utils/isAdmin"),
  KEY = "antidemote",
  DEFAULTS = { enabled: ![], action: "promote" };
function getSettings(_0x4b9f8b) {
  return { ...DEFAULTS, ...groupSettingsStore["get"](_0x4b9f8b, KEY, {}) };
}
function setSettings(_0x4d0ab4, _0x5a71db) {
  const _0xb2bb11 = { ...getSettings(_0x4d0ab4), ..._0x5a71db };
  return (groupSettingsStore["set"](_0x4d0ab4, KEY, _0xb2bb11), _0xb2bb11);
}
const ACTION_LABELS = {
  promote: "⬆️ Re-promote victim + demote demoter",
  remove: "🚫 Remove both",
};
module["exports"] = {
  name: "antidemote",
  aliases: ["antidem", "nodemote"],
  description: "Prevent unauthorized demotions in group",
  async execute(_0x3a7d9b, _0x5b77e0, _0xc0119) {
    const _0x2bdbb2 = _0x5b77e0["key"]["remoteJid"];
    if (!_0x2bdbb2["endsWith"]("@g.us"))
      return _0x3a7d9b["sendMessage"](
        _0x2bdbb2,
        { text: "❌ This command can only be used in groups!" },
        { quoted: _0x5b77e0 },
      );
    const _0x2f29b1 =
        _0x5b77e0["key"]["participant"] || _0x5b77e0["key"]["remoteJid"],
      _0x3813a5 = await _0x3a7d9b["groupMetadata"](_0x2bdbb2),
      _0x43477f = isOwner(_0x5b77e0) || isSenderAdmin(_0x3813a5, _0x2f29b1);
    if (!_0x43477f)
      return _0x3a7d9b["sendMessage"](
        _0x2bdbb2,
        {
          text: "❌ Only the bot owner or a group admin can use this command!",
        },
        { quoted: _0x5b77e0 },
      );
    const _0x25b09e = _0xc0119[0x0]?.["toLowerCase"](),
      _0x1af66a = _0xc0119[0x1],
      _0x2a178a = getSettings(_0x2bdbb2);
    if (!_0x25b09e) {
      const _0x1408c3 = _0x2a178a["enabled"] ? "✅ ENABLED" : "❌ DISABLED",
        _0x1ea71d =
          "*🔄 Anti-Demote Settings for this Group*\n\n" +
          ("📍 *JID:* `" + _0x2bdbb2 + "`\n\n") +
          ("🔹 *Status:* " + _0x1408c3 + "\x0a") +
          ("🔹 *Action:* " +
            (ACTION_LABELS[_0x2a178a["action"]] || ACTION_LABELS["promote"]) +
            "\x0a\x0a") +
          "*Actions:*\n" +
          "▸ *promote* - Re-promote victim + demote demoter\n" +
          "▸ *remove* - Remove both users from group\n\n" +
          "*Commands:*\n" +
          "▸ *.antidemote on* - Enable\n" +
          "▸ *.antidemote off* - Disable\n" +
          "▸ *.antidemote action promote/remove* - Set action";
      return _0x3a7d9b["sendMessage"](
        _0x2bdbb2,
        { text: _0x1ea71d },
        { quoted: _0x5b77e0 },
      );
    }
    switch (_0x25b09e) {
      case "on":
      case "enable": {
        const _0xaf5d04 = setSettings(_0x2bdbb2, { enabled: !![] });
        return _0x3a7d9b["sendMessage"](
          _0x2bdbb2,
          {
            text:
              "✅ Anti-Demote has been *ENABLED* for this group!\nAction: *" +
              (_0xaf5d04["action"] || "promote")["toUpperCase"]() +
              "*",
          },
          { quoted: _0x5b77e0 },
        );
      }
      case "off":
      case "disable": {
        return (
          setSettings(_0x2bdbb2, { enabled: ![] }),
          _0x3a7d9b["sendMessage"](
            _0x2bdbb2,
            { text: "❌ Anti-Demote has been *DISABLED* for this group!" },
            { quoted: _0x5b77e0 },
          )
        );
      }
      case "action": {
        if (!_0x1af66a || !["promote", "remove"]["includes"](_0x1af66a))
          return _0x3a7d9b["sendMessage"](
            _0x2bdbb2,
            { text: "❌ Use: `.antidemote action promote/remove`" },
            { quoted: _0x5b77e0 },
          );
        return (
          setSettings(_0x2bdbb2, {
            action: _0x1af66a,
            enabled: _0x2a178a["enabled"],
          }),
          _0x3a7d9b["sendMessage"](
            _0x2bdbb2,
            {
              text:
                "✅ Anti-Demote action set to: *" +
                _0x1af66a["toUpperCase"]() +
                "*\x0a" +
                ACTION_LABELS[_0x1af66a],
            },
            { quoted: _0x5b77e0 },
          )
        );
      }
      default:
        return _0x3a7d9b["sendMessage"](
          _0x2bdbb2,
          {
            text:
              "❌ Invalid command!\n\n" +
              "▸ *.antidemote on* - Enable\n" +
              "▸ *.antidemote off* - Disable\n" +
              "▸ *.antidemote action promote/remove* - Set action",
          },
          { quoted: _0x5b77e0 },
        );
    }
  },
};
