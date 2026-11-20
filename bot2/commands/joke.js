module["exports"] = {
  name: "joke",
  description: "Sends a random joke.",
  async execute(_0x3f7b39, _0x3190fb, _0x44ff75) {
    const _0x508f46 = _0x3190fb["key"]["remoteJid"];
    try {
      const _0x2204d9 = await fetch(
          "https://official-joke-api.appspot.com/random_joke",
        ),
        _0x465813 = await _0x2204d9["json"](),
        _0x33a5d5 =
          _0x465813["setup"] + "\x0a\x0a" + _0x465813["punchline"] + " 😂";
      await _0x3f7b39["sendMessage"](
        _0x508f46,
        { text: _0x33a5d5 },
        { quoted: _0x3190fb },
      );
    } catch (_0x559ce5) {
      await _0x3f7b39["sendMessage"](
        _0x508f46,
        { text: "❌ Could not fetch a joke right now, try again in a moment." },
        { quoted: _0x3190fb },
      );
    }
  },
};
