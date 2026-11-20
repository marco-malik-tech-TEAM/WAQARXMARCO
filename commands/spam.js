module["exports"] = {
  name: "spam",
  aliases: ["spammsg", "bomb"],
  description:
    "Spam a message N times (max 20, anti-ban delay). Usage: .spam 10 hello",
  execute: async (_0x12f5d8, _0x38d929, _0x40b89b, _0x51cedb, _0x4785c3) => {
    const _0x1ee720 = _0x38d929["key"]["remoteJid"],
      _0x2d3e23 =
        _0x1ee720["endsWith"]("@lid") && _0x38d929["key"]["remoteJidAlt"]
          ? _0x38d929["key"]["remoteJidAlt"]
          : _0x1ee720;
    if (_0x40b89b["length"] === 0x0)
      return _0x4785c3(
        "*❌ Usage: spam <count> <message>\nExample: spam 10 hello\nOr reply to a message: spam 5*",
      );
    let _0x15e6d1 = 0x5,
      _0x18624c = "";
    if (!isNaN(_0x40b89b[0x0])) {
      ((_0x15e6d1 = parseInt(_0x40b89b[0x0])),
        (_0x18624c = _0x40b89b["slice"](0x1)["join"]("\x20")));
      if (!_0x18624c) {
        const _0x26d6d8 =
          _0x38d929["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
            "quotedMessage"
          ];
        _0x26d6d8 &&
          (_0x18624c =
            _0x26d6d8["conversation"] ||
            _0x26d6d8["extendedTextMessage"]?.["text"] ||
            _0x26d6d8["imageMessage"]?.["caption"] ||
            "");
      }
    } else ((_0x18624c = _0x40b89b["join"]("\x20")), (_0x15e6d1 = 0x5));
    if (!_0x18624c)
      return _0x4785c3(
        "*❌ No message to spam. Provide text or reply to a message.*",
      );
    if (_0x15e6d1 < 0x1) _0x15e6d1 = 0x1;
    if (_0x15e6d1 > 0x14)
      return _0x4785c3("*⚠️ Limit is 20 to avoid ban. Use count <=20.*");
    const _0x2ad3fa = 0x5dc;
    await _0x4785c3(
      "💥 Spamming " +
        _0x15e6d1 +
        'x: "' +
        _0x18624c +
        '"\n⏳ Anti-ban delay active...',
    );
    for (let _0x57ed3e = 0x0; _0x57ed3e < _0x15e6d1; _0x57ed3e++) {
      await _0x12f5d8["sendMessage"](_0x2d3e23, { text: _0x18624c });
      if (_0x57ed3e < _0x15e6d1 - 0x1) {
        const _0x1541b2 =
          _0x2ad3fa + Math["floor"](Math["random"]() * 0x258 - 0x12c);
        await new Promise((_0x5b3b3f) => setTimeout(_0x5b3b3f, _0x1541b2));
      }
    }
    await _0x12f5d8["sendMessage"](_0x2d3e23, {
      text: "*✅ Done spamming " + _0x15e6d1 + "x.*",
    });
  },
};
