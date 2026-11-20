const { node } = require("compile-run"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "compile-js",
  aliases: ["run-js"],
  description:
    "Run JavaScript code. Usage: .run-js <code> (or reply to a message containing code)",
  async execute(_0x3de891, _0x25f0e9, _0x3b114c) {
    const _0x66a9fe = _0x25f0e9["key"]["remoteJid"];
    if (!isOwner(_0x25f0e9) && !isSudo(_0x25f0e9))
      return _0x3de891["sendMessage"](
        _0x66a9fe,
        { text: "*Command meant for the owner*" },
        { quoted: _0x25f0e9 },
      );
    const _0x262d6c =
        _0x25f0e9["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x3c11b4 = _0x262d6c?.["quotedMessage"],
      _0x50cf0d =
        _0x3c11b4?.["conversation"] ||
        _0x3c11b4?.["extendedTextMessage"]?.["text"] ||
        null,
      _0x5dad74 = _0x50cf0d || _0x3b114c["join"]("\x20");
    if (!_0x5dad74)
      return _0x3de891["sendMessage"](
        _0x66a9fe,
        { text: "Quote/tag a Js code to compile." },
        { quoted: _0x25f0e9 },
      );
    try {
      const _0x35e34d = await node["runSource"](_0x5dad74);
      if (_0x35e34d["stdout"])
        await _0x3de891["sendMessage"](
          _0x66a9fe,
          { text: _0x35e34d["stdout"] },
          { quoted: _0x25f0e9 },
        );
      if (_0x35e34d["stderr"])
        await _0x3de891["sendMessage"](
          _0x66a9fe,
          { text: _0x35e34d["stderr"] },
          { quoted: _0x25f0e9 },
        );
      !_0x35e34d["stdout"] &&
        !_0x35e34d["stderr"] &&
        (await _0x3de891["sendMessage"](
          _0x66a9fe,
          { text: "_No output._" },
          { quoted: _0x25f0e9 },
        ));
    } catch (_0x2e6676) {
      await _0x3de891["sendMessage"](
        _0x66a9fe,
        { text: String(_0x2e6676) },
        { quoted: _0x25f0e9 },
      );
    }
  },
};
