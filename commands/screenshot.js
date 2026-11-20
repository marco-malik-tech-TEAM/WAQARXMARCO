module["exports"] = {
  name: "screenshot",
  aliases: ["ss", "ssweb"],
  description: "Screenshot a website",
  async execute(_0x42e92f, _0x3bf274, _0x5c7a53) {
    const _0x518169 = _0x3bf274["key"]["remoteJid"],
      _0x521418 = _0x5c7a53["join"]("\x20")["trim"]();
    if (!_0x521418)
      return await _0x42e92f["sendMessage"](
        _0x518169,
        { text: "Provide a website link to screenshot." },
        { quoted: _0x3bf274 },
      );
    try {
      const _0x94cf01 = "Screenshot by MARCO X WAQAR MD BOT",
        _0x1409e5 = "https://image.thum.io/get/fullpage/" + _0x521418;
      await _0x42e92f["sendMessage"](
        _0x518169,
        { image: { url: _0x1409e5 }, caption: _0x94cf01 },
        { quoted: _0x3bf274 },
      );
    } catch (_0x278571) {
      (console["error"]("[SCREENSHOT ERROR]", _0x278571),
        await _0x42e92f["sendMessage"](
          _0x518169,
          { text: "An error occurred." },
          { quoted: _0x3bf274 },
        ));
    }
  },
};
