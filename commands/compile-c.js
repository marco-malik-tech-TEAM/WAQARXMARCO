const { c } = require("compile-run"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "compile-c",
  aliases: ["run-c"],
  description:
    "Compile and run C code. Usage: .run-c <code> (or reply to a message containing code)",
  async execute(_0x59c93a, _0xd155e0, _0x914302) {
    const _0x3785de = _0xd155e0["key"]["remoteJid"];
    if (!isOwner(_0xd155e0) && !isSudo(_0xd155e0))
      return _0x59c93a["sendMessage"](
        _0x3785de,
        { text: "*Command meant for the owner*" },
        { quoted: _0xd155e0 },
      );
    const _0x105d22 =
        _0xd155e0["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x59b8b5 = _0x105d22?.["quotedMessage"],
      _0x297734 =
        _0x59b8b5?.["conversation"] ||
        _0x59b8b5?.["extendedTextMessage"]?.["text"] ||
        null,
      _0x2e7128 = _0x297734 || _0x914302["join"]("\x20");
    if (!_0x2e7128)
      return _0x59c93a["sendMessage"](
        _0x3785de,
        { text: "Quote/tag a C code to compile" },
        { quoted: _0xd155e0 },
      );
    try {
      const _0x20acb3 = await c["runSource"](_0x2e7128);
      if (_0x20acb3["stdout"])
        await _0x59c93a["sendMessage"](
          _0x3785de,
          { text: _0x20acb3["stdout"] },
          { quoted: _0xd155e0 },
        );
      if (_0x20acb3["stderr"])
        await _0x59c93a["sendMessage"](
          _0x3785de,
          { text: _0x20acb3["stderr"] },
          { quoted: _0xd155e0 },
        );
      !_0x20acb3["stdout"] &&
        !_0x20acb3["stderr"] &&
        (await _0x59c93a["sendMessage"](
          _0x3785de,
          { text: "_No output._" },
          { quoted: _0xd155e0 },
        ));
    } catch (_0x1842c5) {
      await _0x59c93a["sendMessage"](
        _0x3785de,
        { text: String(_0x1842c5) },
        { quoted: _0xd155e0 },
      );
    }
  },
};
