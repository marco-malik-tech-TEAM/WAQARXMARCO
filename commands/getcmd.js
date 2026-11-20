const fs = require("fs"),
  path = require("path"),
  { isDev } = require("../utils/isDev");
module["exports"] = {
  name: "getcmd",
  aliases: ["getcode"],
  description: "Get a command file's source code (developer only).",
  async execute(_0x566a82, _0x4d06fa, _0xc84417) {
    const _0x70c648 = _0x4d06fa["key"]["remoteJid"];
    if (!isDev(_0x4d06fa, _0x566a82))
      return _0x566a82["sendMessage"](
        _0x70c648,
        { text: "❌ This command is restricted to ᴾᴬᴾᴾᴵ ᴵˢᴬᴬᶜ dumbass." },
        { quoted: _0x4d06fa },
      );
    const _0x341f67 = _0xc84417[0x0];
    if (!_0x341f67)
      return _0x566a82["sendMessage"](
        _0x70c648,
        { text: "❌ Usage: .getcmd <commandName>" },
        { quoted: _0x4d06fa },
      );
    const _0x2e2475 = path["join"](__dirname, _0x341f67 + ".js");
    if (!fs["existsSync"](_0x2e2475))
      return _0x566a82["sendMessage"](
        _0x70c648,
        { text: '❌ No command file named "' + _0x341f67 + '.js".' },
        { quoted: _0x4d06fa },
      );
    await _0x566a82["sendMessage"](
      _0x70c648,
      {
        document: fs["readFileSync"](_0x2e2475),
        mimetype: "text/javascript",
        fileName: _0x341f67 + ".js",
      },
      { quoted: _0x4d06fa },
    );
  },
};
