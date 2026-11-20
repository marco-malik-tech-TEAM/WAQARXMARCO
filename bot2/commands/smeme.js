const Jimp = require("jimp"),
  { Sticker, StickerTypes } = require("wa-sticker-formatter");
async function drawCaption(_0xb6bc1b, _0x1da3ef, _0x2c2ce5, _0xc3c2b8) {
  if (!_0x1da3ef) return;
  const _0x46444f = _0xb6bc1b["bitmap"]["width"],
    _0x1c03d6 = Jimp["measureText"](_0x2c2ce5, _0x1da3ef["toUpperCase"]()),
    _0x3e4086 = Math["max"]((_0x46444f - _0x1c03d6) / 0x2, 0x4);
  _0xb6bc1b["print"](
    _0x2c2ce5,
    _0x3e4086,
    _0xc3c2b8,
    _0x1da3ef["toUpperCase"](),
  );
}
module["exports"] = {
  name: "smeme",
  description:
    "Make a meme sticker. Usage: reply to an image with .smeme top text|bottom text",
  async execute(_0x5b8727, _0x5a18b5, _0x2e8aee) {
    const _0x2deef3 = _0x5a18b5["key"]["remoteJid"],
      _0xea8d70 =
        _0x5a18b5["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x31a2c5 = _0xea8d70?.["quotedMessage"];
    if (!_0x31a2c5?.["imageMessage"])
      return _0x5b8727["sendMessage"](
        _0x2deef3,
        { text: "❌ Reply to an image with .smeme top text|bottom text" },
        { quoted: _0x5a18b5 },
      );
    const _0x27b2b2 = _0x2e8aee["join"]("\x20"),
      [_0x851a67, _0x150060] = _0x27b2b2["split"]("|")["map"]((_0xc4d7a7) =>
        _0xc4d7a7?.["trim"](),
      );
    if (!_0x851a67 && !_0x150060)
      return _0x5b8727["sendMessage"](
        _0x2deef3,
        { text: "❌ Usage: .smeme top text|bottom text" },
        { quoted: _0x5a18b5 },
      );
    try {
      const _0x29c4d3 = await _0x5b8727["downloadMediaMessage"]({
          message: _0x31a2c5,
          key: {
            remoteJid: _0x2deef3,
            id: _0xea8d70["stanzaId"],
            participant: _0xea8d70["participant"],
          },
        }),
        _0x13b8c0 = await Jimp["read"](_0x29c4d3);
      _0x13b8c0["resize"](0x200, Jimp["AUTO"]);
      const _0x8407aa = await Jimp["loadFont"](Jimp["FONT_SANS_32_WHITE"]);
      if (_0x851a67) await drawCaption(_0x13b8c0, _0x851a67, _0x8407aa, 0x8);
      if (_0x150060)
        await drawCaption(
          _0x13b8c0,
          _0x150060,
          _0x8407aa,
          _0x13b8c0["bitmap"]["height"] - 0x30,
        );
      const _0x3dfad9 = await _0x13b8c0["getBufferAsync"](Jimp["MIME_PNG"]),
        _0x66c726 = new Sticker(_0x3dfad9, {
          pack: "MARCO X WAQAR MD BOT",
          author: "MARCO X WAQAR MD BOT",
          type: StickerTypes["FULL"],
          quality: 0x46,
        });
      await _0x5b8727["sendMessage"](
        _0x2deef3,
        { sticker: await _0x66c726["toBuffer"]() },
        { quoted: _0x5a18b5 },
      );
    } catch (_0x497752) {
      await _0x5b8727["sendMessage"](
        _0x2deef3,
        { text: "❌ Could not create meme sticker: " + _0x497752["message"] },
        { quoted: _0x5a18b5 },
      );
    }
  },
};
