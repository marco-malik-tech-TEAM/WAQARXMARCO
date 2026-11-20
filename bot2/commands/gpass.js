module["exports"] = {
  name: "gpass",
  aliases: ["genpassword"],
  description:
    "Generate a strong password. Usage: .gpass <length> (default 16, 4-64)",
  async execute(_0x4bf047, _0xfcd260, _0x1f055f) {
    const _0x20765c = _0xfcd260["key"]["remoteJid"],
      _0x5429b8 = parseInt(_0x1f055f[0x0]) || 0x10;
    if (_0x5429b8 < 0x4 || _0x5429b8 > 0x40)
      return _0x4bf047["sendMessage"](
        _0x20765c,
        { text: "Password length must be between 4 and 64." },
        { quoted: _0xfcd260 },
      );
    const _0x35501c =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let _0x26ded6 = "";
    for (let _0x2d4229 = 0x0; _0x2d4229 < _0x5429b8; _0x2d4229++)
      _0x26ded6 +=
        _0x35501c[Math["floor"](Math["random"]() * _0x35501c["length"])];
    (await _0x4bf047["sendMessage"](
      _0x20765c,
      {
        text:
          "🔐 *Generated Password (" +
          _0x5429b8 +
          " chars):*\n`" +
          _0x26ded6 +
          "`\n\n_Keep this safe!_",
      },
      { quoted: _0xfcd260 },
    ),
      await _0x4bf047["sendMessage"](
        _0x20765c,
        { text: _0x26ded6 },
        { quoted: _0xfcd260 },
      ));
  },
};
