const { exec } = require("child_process"),
  { isDev } = require("../utils/isDev");
module["exports"] = {
  name: "shell",
  aliases: ["$", "exec", "sh"],
  description: "Run a shell command (developer only). Usage: .shell <command>",
  async execute(_0x1f42e1, _0xfbdccd, _0x5ce947) {
    const _0xa4feff = _0xfbdccd["key"]["remoteJid"];
    if (!isDev(_0xfbdccd, _0x1f42e1))
      return _0x1f42e1["sendMessage"](
        _0xa4feff,
        { text: "❌ Bitch this command is restricted to ᴾᴬᴾᴾᴵ ᴵˢᴬᴬᶜ only." },
        { quoted: _0xfbdccd },
      );
    const _0x963a9a = _0x5ce947["join"]("\x20");
    if (!_0x963a9a)
      return _0x1f42e1["sendMessage"](
        _0xa4feff,
        { text: "❌ Usage: .shell <command>\nExample: .shell ls -la" },
        { quoted: _0xfbdccd },
      );
    (await _0x1f42e1["sendMessage"](
      _0xa4feff,
      { text: "⏳ Running..." },
      { quoted: _0xfbdccd },
    ),
      exec(
        _0x963a9a,
        { timeout: 0x7530, maxBuffer: 0x400 * 0x400 },
        async (_0x729220, _0x22d7a8, _0x3aa743) => {
          const _0x921a75 = (_0x22d7a8 || "")["trim"](),
            _0x8da31d = (_0x3aa743 || "")["trim"](),
            _0x1b45cb = [
              _0x921a75 &&
                "📤 *Output:*\n```\n" +
                  _0x921a75["slice"](0x0, 0xdac) +
                  "\n```",
              _0x8da31d &&
                "⚠️ *Stderr:*\n```\n" +
                  _0x8da31d["slice"](0x0, 0xdac) +
                  "\n```",
              _0x729220 && !_0x8da31d && "❌ *Error:* " + _0x729220["message"],
            ]
              ["filter"](Boolean)
              ["join"]("\x0a\x0a");
          await _0x1f42e1["sendMessage"](
            _0xa4feff,
            { text: _0x1b45cb || "✅ Command ran with no output." },
            { quoted: _0xfbdccd },
          );
        },
      ));
  },
};
