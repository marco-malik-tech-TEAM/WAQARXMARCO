const fs = require("fs"),
  path = require("path"),
  settingsStore = require("../utils/settingsStore"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo"),
  listPath = path["join"](__dirname, "../config/badwords.json");
function load() {
  if (fs["existsSync"](listPath))
    return JSON["parse"](fs["readFileSync"](listPath, "utf8"));
  return [];
}
function save(_0xf4c61f) {
  fs["writeFileSync"](listPath, JSON["stringify"](_0xf4c61f, null, 0x2));
}
module["exports"] = {
  name: "badword",
  description:
    "Manage the bad word filter. Usage: .badword on|off|add <word>|remove <word>|list",
  async execute(_0x3f4b72, _0x566f29, _0x6db1e3) {
    if (!isOwner(_0x566f29) && !isSudo(_0x566f29)) return;
    const _0x14f6df = _0x566f29["key"]["remoteJid"],
      _0x1ce924 = _0x6db1e3[0x0]?.["toLowerCase"]();
    if (_0x1ce924 === "on")
      return (
        settingsStore["set"]("badword", !![]),
        _0x3f4b72["sendMessage"](_0x14f6df, {
          text: "🚫 *Bad Word Filter:* ENABLED [🟢]",
        })
      );
    if (_0x1ce924 === "off")
      return (
        settingsStore["set"]("badword", ![]),
        _0x3f4b72["sendMessage"](_0x14f6df, {
          text: "🚫 *Bad Word Filter:* DISABLED [🔴]",
        })
      );
    if (_0x1ce924 === "add") {
      const _0x4e26b5 = _0x6db1e3[0x1]?.["toLowerCase"]();
      if (!_0x4e26b5)
        return _0x3f4b72["sendMessage"](
          _0x14f6df,
          { text: "❌ Usage: .badword add <word>" },
          { quoted: _0x566f29 },
        );
      const _0x404ad4 = load();
      if (!_0x404ad4["includes"](_0x4e26b5)) _0x404ad4["push"](_0x4e26b5);
      return (
        save(_0x404ad4),
        _0x3f4b72["sendMessage"](
          _0x14f6df,
          { text: '✅ Added "' + _0x4e26b5 + '" to the bad word list.' },
          { quoted: _0x566f29 },
        )
      );
    }
    if (_0x1ce924 === "remove") {
      const _0x1d2acb = _0x6db1e3[0x1]?.["toLowerCase"]();
      if (!_0x1d2acb)
        return _0x3f4b72["sendMessage"](
          _0x14f6df,
          { text: "❌ Usage: .badword remove <word>" },
          { quoted: _0x566f29 },
        );
      return (
        save(load()["filter"]((_0x46c7dc) => _0x46c7dc !== _0x1d2acb)),
        _0x3f4b72["sendMessage"](
          _0x14f6df,
          { text: '✅ Removed "' + _0x1d2acb + '" from the bad word list.' },
          { quoted: _0x566f29 },
        )
      );
    }
    if (_0x1ce924 === "list") {
      const _0x37616d = load();
      return _0x3f4b72["sendMessage"](
        _0x14f6df,
        {
          text: _0x37616d["length"]
            ? "📋 *Bad words:*\n" + _0x37616d["join"](",\x20")
            : "📋 List is empty.",
        },
        { quoted: _0x566f29 },
      );
    }
    const _0x4c2d8a = settingsStore["get"]("badword", ![])
      ? "ENABLED [🟢]"
      : "DISABLED [🔴]";
    await _0x3f4b72["sendMessage"](_0x14f6df, {
      text:
        "🚫 *Bad Word Filter Status:* " +
        _0x4c2d8a +
        "\n\n💡 Use .badword on|off|add <word>|remove <word>|list",
    });
  },
};
