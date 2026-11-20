const QRCode = require("qrcode"),
  jsQR = require("jsqr"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  jimpModule = require("jimp"),
  Jimp = jimpModule["Jimp"] || jimpModule["default"] || jimpModule;
module["exports"] = {
  name: "qr",
  description:
    "Create a QR code from text, or read one from an image. Usage: .qr <text>",
  async execute(_0xf2842d, _0xb16563, _0x3f8635) {
    const _0x1d20ac = _0xb16563["key"]["remoteJid"],
      _0x4f84cc =
        _0xb16563["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x29baa9 = _0x4f84cc?.["quotedMessage"],
      _0x5e909c = _0x3f8635["join"]("\x20");
    if (_0x29baa9?.["imageMessage"] && !_0x5e909c) {
      try {
        if (typeof Jimp?.["read"] !== "function")
          throw new Error(
            "Jimp.read is unavailable — check the installed jimp version (npm ls jimp).",
          );
        const _0x3a788d = await downloadMediaMessage(
            {
              message: _0x29baa9,
              key: {
                remoteJid: _0x1d20ac,
                id: _0x4f84cc["stanzaId"],
                participant: _0x4f84cc["participant"],
              },
            },
            "buffer",
            {},
          ),
          _0x549671 = await Jimp["read"](_0x3a788d),
          {
            data: _0x3c16f7,
            width: _0x53f388,
            height: _0x5529c0,
          } = _0x549671["bitmap"],
          _0x70380b = jsQR(
            new Uint8ClampedArray(_0x3c16f7),
            _0x53f388,
            _0x5529c0,
          );
        if (!_0x70380b)
          return _0xf2842d["sendMessage"](
            _0x1d20ac,
            { text: "❌ No QR code found in that image." },
            { quoted: _0xb16563 },
          );
        await _0xf2842d["sendMessage"](
          _0x1d20ac,
          { text: "📷 *QR Content:*\n" + _0x70380b["data"] },
          { quoted: _0xb16563 },
        );
      } catch (_0x41d353) {
        (console["error"]("[QR READ ERROR]", _0x41d353),
          await _0xf2842d["sendMessage"](
            _0x1d20ac,
            { text: "❌ Could not read QR code: " + _0x41d353["message"] },
            { quoted: _0xb16563 },
          ));
      }
      return;
    }
    if (!_0x5e909c)
      return _0xf2842d["sendMessage"](
        _0x1d20ac,
        {
          text: "❌ Usage: .qr <text>\nOr reply to an image containing a QR code with .qr",
        },
        { quoted: _0xb16563 },
      );
    try {
      const _0x1236a9 = await QRCode["toBuffer"](_0x5e909c, { width: 0x200 });
      await _0xf2842d["sendMessage"](
        _0x1d20ac,
        { image: _0x1236a9, caption: "✅ QR code for: " + _0x5e909c },
        { quoted: _0xb16563 },
      );
    } catch (_0x2cf2f4) {
      (console["error"]("[QR GENERATE ERROR]", _0x2cf2f4),
        await _0xf2842d["sendMessage"](
          _0x1d20ac,
          { text: "❌ Could not generate QR code: " + _0x2cf2f4["message"] },
          { quoted: _0xb16563 },
        ));
    }
  },
};
