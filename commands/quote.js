module["exports"] = {
  name: "quote",
  description: "Sends a random famous quote.",
  async execute(_0x2eafa5, _0x326c00, _0x1d8437) {
    const _0x24ddea = _0x326c00["key"]["remoteJid"];
    try {
      const _0x2780dc = await fetch("https://zenquotes.io/api/random"),
        _0x24a99b = await _0x2780dc["json"](),
        _0x2e0de7 =
          "\x22" + _0x24a99b[0x0]["q"] + '"\n\n— ' + _0x24a99b[0x0]["a"];
      await _0x2eafa5["sendMessage"](
        _0x24ddea,
        { text: _0x2e0de7 },
        { quoted: _0x326c00 },
      );
    } catch (_0x1dd418) {
      await _0x2eafa5["sendMessage"](
        _0x24ddea,
        {
          text: "❌ Could not fetch a quote right now, try again in a moment.",
        },
        { quoted: _0x326c00 },
      );
    }
  },
};
