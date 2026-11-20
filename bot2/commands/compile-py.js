const { python } = require("compile-run"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "compile-py",
  aliases: ["run-py"],
  description:
    "Run Python code. Usage: .run-py <code> (or reply to a message containing code)",
  async execute(_0x1299e2, _0xfe7106, _0x3a99aa) {
    const _0x36637b = _0xfe7106["key"]["remoteJid"];
    if (!isOwner(_0xfe7106) && !isSudo(_0xfe7106))
      return _0x1299e2["sendMessage"](
        _0x36637b,
        { text: "*Command meant for the owner*" },
        { quoted: _0xfe7106 },
      );
    const _0x235d77 =
        _0xfe7106["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x3d2e16 = _0x235d77?.["quotedMessage"],
      _0x3a1a5a =
        _0x3d2e16?.["conversation"] ||
        _0x3d2e16?.["extendedTextMessage"]?.["text"] ||
        null,
      _0x5df292 = _0x3a1a5a || _0x3a99aa["join"]("\x20");
    if (!_0x5df292)
      return _0x1299e2["sendMessage"](
        _0x36637b,
        { text: "Quote/tag a python code to compile." },
        { quoted: _0xfe7106 },
      );
    try {
      const _0x549662 = await python["runSource"](_0x5df292);
      if (_0x549662["stdout"])
        await _0x1299e2["sendMessage"](
          _0x36637b,
          { text: _0x549662["stdout"] },
          { quoted: _0xfe7106 },
        );
      if (_0x549662["stderr"])
        await _0x1299e2["sendMessage"](
          _0x36637b,
          { text: _0x549662["stderr"] },
          { quoted: _0xfe7106 },
        );
      !_0x549662["stdout"] &&
        !_0x549662["stderr"] &&
        (await _0x1299e2["sendMessage"](
          _0x36637b,
          { text: "_No output._" },
          { quoted: _0xfe7106 },
        ));
    } catch (_0x2f2cc3) {
      await _0x1299e2["sendMessage"](
        _0x36637b,
        { text: String(_0x2f2cc3) },
        { quoted: _0xfe7106 },
      );
    }
  },
};
