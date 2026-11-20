module["exports"] = {
  name: "define",
  description: "Get the definition of a word. Usage: .define <word>",
  async execute(_0xc9a24a, _0x4c8f74, _0x4018c4) {
    const _0x3d6c24 = _0x4c8f74["key"]["remoteJid"],
      _0x5f1f76 = _0x4018c4["join"]("\x20")["trim"]();
    if (!_0x5f1f76)
      return _0xc9a24a["sendMessage"](
        _0x3d6c24,
        { text: "❌ Usage: .define <word>" },
        { quoted: _0x4c8f74 },
      );
    await _0xc9a24a["sendMessage"](
      _0x3d6c24,
      { text: '📖 Looking up "' + _0x5f1f76 + '"...' },
      { quoted: _0x4c8f74 },
    );
    try {
      const _0x273546 = await fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" +
            _0x5f1f76["toLowerCase"](),
        ),
        _0x321004 = await _0x273546["json"]();
      if (!_0x321004[0x0])
        return _0xc9a24a["sendMessage"](
          _0x3d6c24,
          { text: '❌ "' + _0x5f1f76 + '" not found in dictionary.' },
          { quoted: _0x4c8f74 },
        );
      const _0x3ad1dc = _0x321004[0x0],
        _0xd9340c = _0x3ad1dc["meanings"][0x0];
      let _0x332bb4 = "📖 *" + _0x3ad1dc["word"]["toUpperCase"]() + "*\n\n";
      ((_0x332bb4 +=
        "🔤 *Part of Speech:* " + _0xd9340c["partOfSpeech"] + "\x0a\x0a"),
        (_0x332bb4 += "💡 *Definition:*\n"),
        _0xd9340c["definitions"]
          ["slice"](0x0, 0x2)
          ["forEach"]((_0x372662, _0x8a5540) => {
            _0x332bb4 +=
              _0x8a5540 + 0x1 + ".\x20" + _0x372662["definition"] + "\x0a";
          }),
        _0xd9340c["synonyms"]?.["length"] &&
          (_0x332bb4 +=
            "\n🔗 *Synonyms:* " +
            _0xd9340c["synonyms"]["slice"](0x0, 0x3)["join"](",\x20") +
            "\x0a"),
        _0x3ad1dc["phonetic"] &&
          (_0x332bb4 +=
            "\n🔊 *Pronunciation:* " + _0x3ad1dc["phonetic"] + "\x0a"),
        await _0xc9a24a["sendMessage"](_0x3d6c24, { text: _0x332bb4 }));
    } catch (_0x4f1168) {
      await _0xc9a24a["sendMessage"](
        _0x3d6c24,
        { text: "❌ Error: " + _0x4f1168["message"] },
        { quoted: _0x4c8f74 },
      );
    }
  },
};
