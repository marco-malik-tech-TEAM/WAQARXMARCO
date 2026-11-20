module["exports"] = {
  name: "calc",
  description: "Evaluates a basic math expression. Usage: !calc 2 + 2",
  async execute(_0x1c8afd, _0x4ee6f1, _0x3fc885) {
    const _0x444044 = _0x4ee6f1["key"]["remoteJid"],
      _0x41913d = _0x3fc885["join"]("\x20");
    if (!_0x41913d) {
      await _0x1c8afd["sendMessage"](
        _0x444044,
        { text: "Usage: !calc 2 + 2 * (3 - 1)" },
        { quoted: _0x4ee6f1 },
      );
      return;
    }
    const _0xcf18e2 = /^[0-9+\-*/().%\s]+$/["test"](_0x41913d);
    if (!_0xcf18e2) {
      await _0x1c8afd["sendMessage"](
        _0x444044,
        { text: "❌ Only numbers and + - * / ( ) % are allowed." },
        { quoted: _0x4ee6f1 },
      );
      return;
    }
    try {
      const _0x553f55 = Function('"use strict"; return (' + _0x41913d + ");")();
      if (typeof _0x553f55 !== "number" || !Number["isFinite"](_0x553f55))
        throw new Error("Invalid result");
      await _0x1c8afd["sendMessage"](
        _0x444044,
        { text: "🧮 " + _0x41913d + " = " + _0x553f55 },
        { quoted: _0x4ee6f1 },
      );
    } catch (_0x3b8a8d) {
      await _0x1c8afd["sendMessage"](
        _0x444044,
        { text: "❌ That expression is not valid." },
        { quoted: _0x4ee6f1 },
      );
    }
  },
};
