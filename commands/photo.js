const fs = require("fs"),
  path = require("path"),
  os = require("os"),
  { exec } = require("child_process"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  ffmpegPath = process.env.FFMPEG_PATH || require("ffmpeg-static") || "ffmpeg";
module["exports"] = {
  name: "photo",
  description:
    "Convert a replied sticker into a photo. Usage: reply to a sticker with .photo",
  async execute(_0x5b28cb, _0x1908ac) {
    const _0x288881 = _0x1908ac["key"]["remoteJid"],
      _0xa18504 =
        _0x1908ac["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0xc0a646 = _0xa18504?.["quotedMessage"];
    if (!_0xc0a646?.["stickerMessage"])
      return _0x5b28cb["sendMessage"](
        _0x288881,
        { text: "❌ Reply to a sticker with .photo" },
        { quoted: _0x1908ac },
      );
    const _0x46ff90 = path["join"](
        os["tmpdir"](),
        "photo_in_" + Date["now"]() + ".webp",
      ),
      _0x4d2001 = path["join"](
        os["tmpdir"](),
        "photo_out_" + Date["now"]() + ".png",
      );
    try {
      const _0x34ebbc = await downloadMediaMessage(
        {
          message: _0xc0a646,
          key: {
            remoteJid: _0x288881,
            id: _0xa18504["stanzaId"],
            participant: _0xa18504["participant"],
          },
        },
        "buffer",
        {},
      );
      (fs["writeFileSync"](_0x46ff90, _0x34ebbc),
        await new Promise((_0x25d745, _0x45f692) => {
          exec(
            "\x22" +
              ffmpegPath +
              '" -y -i "' +
              _0x46ff90 +
              '" "' +
              _0x4d2001 +
              "\x22",
            (_0x1ca0a9) => {
              if (_0x1ca0a9) _0x45f692(_0x1ca0a9);
              else _0x25d745();
            },
          );
        }));
      if (!fs["existsSync"](_0x4d2001)) throw new Error("Conversion failed.");
      await _0x5b28cb["sendMessage"](
        _0x288881,
        {
          image: fs["readFileSync"](_0x4d2001),
          caption: "🖼️ Converted to photo",
        },
        { quoted: _0x1908ac },
      );
    } catch (_0x1bf08b) {
      await _0x5b28cb["sendMessage"](
        _0x288881,
        { text: "❌ Could not convert sticker: " + _0x1bf08b["message"] },
        { quoted: _0x1908ac },
      );
    } finally {
      if (fs["existsSync"](_0x46ff90)) fs["unlinkSync"](_0x46ff90);
      if (fs["existsSync"](_0x4d2001)) fs["unlinkSync"](_0x4d2001);
    }
  },
};
