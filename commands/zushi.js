const fs = require("fs"),
  path = require("path"),
  allowedPath = path["join"](require("../utils/paths").ROOT, "config", "allowedCommands.json");
function load() {
  if (fs["existsSync"](allowedPath))
    return JSON["parse"](fs["readFileSync"](allowedPath, "utf8"));
  return {};
}
function save(_0x52bea3) {
  fs["writeFileSync"](allowedPath, JSON["stringify"](_0x52bea3, null, 0x2));
}
module["exports"] = {
  name: "zushi",
  description:
    "Allow specific commands for everyone in this chat. Usage: .zushi add|remove|list <command>",
  async execute(_0x36e6b8, _0x5e98ad, _0x2a3f38) {
    const _0x16343e = _0x5e98ad["key"]["remoteJid"],
      _0x5a66d9 = _0x2a3f38[0x0]?.["toLowerCase"](),
      _0x110df8 = _0x2a3f38[0x1]?.["toLowerCase"](),
      _0x30f65b = load();
    if (!_0x30f65b[_0x16343e]) _0x30f65b[_0x16343e] = [];
    if (_0x5a66d9 === "add") {
      if (!_0x110df8)
        return _0x36e6b8["sendMessage"](
          _0x16343e,
          { text: "❌ Usage: .zushi add <command>" },
          { quoted: _0x5e98ad },
        );
      if (!_0x30f65b[_0x16343e]["includes"](_0x110df8))
        _0x30f65b[_0x16343e]["push"](_0x110df8);
      return (
        save(_0x30f65b),
        _0x36e6b8["sendMessage"](
          _0x16343e,
          {
            text:
              '✅ "' +
              _0x110df8 +
              '" is now allowed for everyone in this chat.',
          },
          { quoted: _0x5e98ad },
        )
      );
    }
    if (_0x5a66d9 === "remove") {
      if (!_0x110df8)
        return _0x36e6b8["sendMessage"](
          _0x16343e,
          { text: "❌ Usage: .zushi remove <command>" },
          { quoted: _0x5e98ad },
        );
      return (
        (_0x30f65b[_0x16343e] = _0x30f65b[_0x16343e]["filter"](
          (_0x356332) => _0x356332 !== _0x110df8,
        )),
        save(_0x30f65b),
        _0x36e6b8["sendMessage"](
          _0x16343e,
          { text: '✅ "' + _0x110df8 + '" removed from allowed list.' },
          { quoted: _0x5e98ad },
        )
      );
    }
    if (_0x5a66d9 === "list") {
      const _0x5d3494 = _0x30f65b[_0x16343e];
      return _0x36e6b8["sendMessage"](
        _0x16343e,
        {
          text: _0x5d3494["length"]
            ? "📋 *Allowed commands in this chat:*\n" +
              _0x5d3494["join"](",\x20")
            : "📋 No extra commands allowed in this chat yet.",
        },
        { quoted: _0x5e98ad },
      );
    }
    await _0x36e6b8["sendMessage"](
      _0x16343e,
      { text: "❌ Usage: .zushi add|remove|list <command>" },
      { quoted: _0x5e98ad },
    );
  },
};
