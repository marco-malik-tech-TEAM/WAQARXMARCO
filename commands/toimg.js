const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  { execFile } = require("child_process"),
  ffmpegPath = require("ffmpeg-static"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "toimg",
  aliases: ["photo", "toimage"],
  description: "Convert a sticker to an image. Reply to a sticker with .toimg",
  async execute(_0x1a1281, _0x3f64a8) {
    const _0xf3c80b = _0x3f64a8["key"]["remoteJid"],
      _0x3e99dc =
        _0x3f64a8["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x5c5a29 = _0x3e99dc?.["quotedMessage"];
    if (!_0x5c5a29?.["stickerMessage"])
      return _0x1a1281["sendMessage"](
        _0xf3c80b,
        { text: "Reply to a sticker with *.toimg*" },
        { quoted: _0x3f64a8 },
      );
    const _0x23fc32 = _0x5c5a29["stickerMessage"]["mimetype"] || "";
    if (!/webp/["test"](_0x23fc32))
      return _0x1a1281["sendMessage"](
        _0xf3c80b,
        { text: "Tag a sticker to convert to photo" },
        { quoted: _0x3f64a8 },
      );
    const _0x1cb8d7 = Date["now"](),
      _0x36ac75 = path["join"](os["tmpdir"](), "toimg_" + _0x1cb8d7 + ".webp"),
      _0xcaf024 = path["join"](os["tmpdir"](), "toimg_" + _0x1cb8d7 + ".png");
    try {
      const _0x3d2631 = await downloadMediaMessage(
        {
          message: _0x5c5a29,
          key: {
            remoteJid: _0xf3c80b,
            id: _0x3e99dc["stanzaId"],
            participant: _0x3e99dc["participant"],
          },
        },
        "buffer",
        {},
      );
      (fs["writeFileSync"](_0x36ac75, _0x3d2631),
        await new Promise((_0x5006ae, _0x565074) => {
          execFile(
            ffmpegPath,
            ["-y", "-i", _0x36ac75, _0xcaf024],
            (_0x32938d) => {
              if (_0x32938d) return _0x565074(_0x32938d);
              _0x5006ae();
            },
          );
        }));
      if (!fs["existsSync"](_0xcaf024))
        throw new Error("Output file not created");
      const _0xe16ed0 = fs["readFileSync"](_0xcaf024);
      await _0x1a1281["sendMessage"](
        _0xf3c80b,
        { image: _0xe16ed0, caption: "✅ *Converted successfully!*" },
        { quoted: _0x3f64a8 },
      );
    } catch (_0x4c1d34) {
      (console["error"]("[TOIMG ERROR]", _0x4c1d34["message"]),
        await _0x1a1281["sendMessage"](
          _0xf3c80b,
          { text: "❌ Conversion failed." },
          { quoted: _0x3f64a8 },
        ));
    } finally {
      for (const _0x6f8f0c of [_0x36ac75, _0xcaf024]) {
        if (fs["existsSync"](_0x6f8f0c))
          try {
            fs["unlinkSync"](_0x6f8f0c);
          } catch (_0x140bfd) {}
      }
    }
  },
};
