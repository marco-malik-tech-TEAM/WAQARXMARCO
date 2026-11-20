const fs = require("fs"),
  path = require("path"),
  { isDev } = require("../utils/isDev"),
  PROJECT_ROOT = path["join"](__dirname, "..");
module["exports"] = {
  name: "cat",
  aliases: ["readfile"],
  description: "Print a file's text content (developer only).",
  async execute(_0x10c761, _0x456066, _0x460333) {
    const _0x1cd811 = _0x456066["key"]["remoteJid"];
    if (!isDev(_0x456066, _0x10c761))
      return _0x10c761["sendMessage"](
        _0x1cd811,
        { text: "❌ This command is restricted to ᴾᴬᴾᴾᴵ ᴵˢᴬᴬᶜ only." },
        { quoted: _0x456066 },
      );
    const _0x3929b6 = _0x460333["join"]("\x20");
    if (!_0x3929b6)
      return _0x10c761["sendMessage"](
        _0x1cd811,
        { text: "❌ Usage: .cat <relative/path>" },
        { quoted: _0x456066 },
      );
    const _0x1e2e8e = path["join"](PROJECT_ROOT, _0x3929b6);
    if (!_0x1e2e8e["startsWith"](PROJECT_ROOT))
      return _0x10c761["sendMessage"](
        _0x1cd811,
        { text: "❌ Invalid path." },
        { quoted: _0x456066 },
      );
    if (!fs["existsSync"](_0x1e2e8e) || !fs["statSync"](_0x1e2e8e)["isFile"]())
      return _0x10c761["sendMessage"](
        _0x1cd811,
        { text: "❌ File not found." },
        { quoted: _0x456066 },
      );
    const _0x59718e = fs["readFileSync"](_0x1e2e8e, "utf8");
    if (!_0x59718e["trim"]())
      return _0x10c761["sendMessage"](
        _0x1cd811,
        { text: "⚠️ File is empty." },
        { quoted: _0x456066 },
      );
    await _0x10c761["sendMessage"](
      _0x1cd811,
      { text: _0x59718e },
      { quoted: _0x456066 },
    );
  },
};
