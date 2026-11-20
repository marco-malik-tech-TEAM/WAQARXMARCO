const { cpp } = require("compile-run"),
  { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "compile-c++",
  aliases: ["run-c++"],
  description:
    "Compile and run C++ code. Usage: .run-c++ <code> (or reply to a message containing code)",
  async execute(_0x47f90b, _0x3547bf, _0x234eaf) {
    const _0x393346 = _0x3547bf["key"]["remoteJid"];
    if (!isOwner(_0x3547bf) && !isSudo(_0x3547bf))
      return _0x47f90b["sendMessage"](
        _0x393346,
        { text: "*Command meant for the owner*" },
        { quoted: _0x3547bf },
      );
    const _0x4f6f13 =
        _0x3547bf["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x3b5778 = _0x4f6f13?.["quotedMessage"],
      _0x3be278 =
        _0x3b5778?.["conversation"] ||
        _0x3b5778?.["extendedTextMessage"]?.["text"] ||
        null,
      _0x513e6d = _0x3be278 || _0x234eaf["join"]("\x20");
    if (!_0x513e6d)
      return _0x47f90b["sendMessage"](
        _0x393346,
        { text: "Quote/tag a C++ code to compile" },
        { quoted: _0x3547bf },
      );
    try {
      const _0x586926 = await cpp["runSource"](_0x513e6d);
      if (_0x586926["stdout"])
        await _0x47f90b["sendMessage"](
          _0x393346,
          { text: _0x586926["stdout"] },
          { quoted: _0x3547bf },
        );
      if (_0x586926["stderr"])
        await _0x47f90b["sendMessage"](
          _0x393346,
          { text: _0x586926["stderr"] },
          { quoted: _0x3547bf },
        );
      !_0x586926["stdout"] &&
        !_0x586926["stderr"] &&
        (await _0x47f90b["sendMessage"](
          _0x393346,
          { text: "_No output._" },
          { quoted: _0x3547bf },
        ));
    } catch (_0x40ba84) {
      await _0x47f90b["sendMessage"](
        _0x393346,
        { text: String(_0x40ba84) },
        { quoted: _0x3547bf },
      );
    }
  },
};
