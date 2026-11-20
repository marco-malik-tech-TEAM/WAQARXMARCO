const fs = require("fs"),
  path = require("path"),
  { isDev } = require("../utils/isDev"),
  PROJECT_ROOT = path["join"](__dirname, "..");
module["exports"] = {
  name: "getfile",
  aliases: ["sourcefile", "sendfile"],
  description: "Get any file from the project directory (developer only).",
  async execute(_0x1148cd, _0x41307a, _0x5910eb) {
    const _0x59a8a5 = _0x41307a["key"]["remoteJid"];
    if (!isDev(_0x41307a, _0x1148cd))
      return _0x1148cd["sendMessage"](
        _0x59a8a5,
        { text: "❌ This command is restricted to my developer fucker." },
        { quoted: _0x41307a },
      );
    const _0x5e9a43 = _0x5910eb["join"]("\x20");
    if (!_0x5e9a43)
      return _0x1148cd["sendMessage"](
        _0x59a8a5,
        { text: "❌ Usage: .getfile <relative/path>" },
        { quoted: _0x41307a },
      );
    const _0x134b19 = path["join"](PROJECT_ROOT, _0x5e9a43);
    if (!_0x134b19["startsWith"](PROJECT_ROOT))
      return _0x1148cd["sendMessage"](
        _0x59a8a5,
        { text: "❌ Invalid path." },
        { quoted: _0x41307a },
      );
    if (!fs["existsSync"](_0x134b19) || !fs["statSync"](_0x134b19)["isFile"]())
      return _0x1148cd["sendMessage"](
        _0x59a8a5,
        { text: "❌ File not found." },
        { quoted: _0x41307a },
      );
    await _0x1148cd["sendMessage"](
      _0x59a8a5,
      {
        document: fs["readFileSync"](_0x134b19),
        fileName: path["basename"](_0x134b19),
      },
      { quoted: _0x41307a },
    );
  },
};
