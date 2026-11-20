const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  { execSync } = require("child_process"),
  ffmpegPath = require("ffmpeg-static"),
  sharp = require("sharp"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "tovideo",
  aliases: ["mp4", "tovid"],
  description:
    "Convert a quoted animated sticker to video. Reply to an animated sticker with .tovideo",
  async execute(_0x3f6d39, _0x31080c) {
    const _0x2fd601 = _0x31080c["key"]["remoteJid"],
      _0x348fcd =
        _0x31080c["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x32c43d = _0x348fcd?.["quotedMessage"];
    if (!_0x32c43d?.["stickerMessage"])
      return _0x3f6d39["sendMessage"](
        _0x2fd601,
        { text: "📎 Reply to an *animated sticker* with *.tovideo*" },
        { quoted: _0x31080c },
      );
    const _0x5ef86d = _0x32c43d["stickerMessage"]["mimetype"] || "";
    if (!/webp/["test"](_0x5ef86d))
      return _0x3f6d39["sendMessage"](
        _0x2fd601,
        { text: "⚠️ That's not a sticker." },
        { quoted: _0x31080c },
      );
    const _0x4eef79 = Date["now"](),
      _0x4503c9 = os["tmpdir"](),
      _0x25cdcf = path["join"](_0x4503c9, "frames_" + _0x4eef79),
      _0x14f347 = path["join"](_0x4503c9, "video_" + _0x4eef79 + ".mp4");
    try {
      await _0x3f6d39["sendMessage"](
        _0x2fd601,
        { text: "🎬 _Converting sticker to video..._" },
        { quoted: _0x31080c },
      );
      const _0x544957 = await downloadMediaMessage(
        {
          message: _0x32c43d,
          key: {
            remoteJid: _0x2fd601,
            id: _0x348fcd["stanzaId"],
            participant: _0x348fcd["participant"],
          },
        },
        "buffer",
        {},
      );
      fs["mkdirSync"](_0x25cdcf, { recursive: !![] });
      const _0x246abe = sharp(_0x544957, { animated: !![] }),
        _0x223f46 = await _0x246abe["metadata"](),
        _0x1ca4d9 = _0x223f46["pages"] || 0x1;
      if (_0x1ca4d9 <= 0x1)
        return _0x3f6d39["sendMessage"](
          _0x2fd601,
          { text: "⚠️ This is a *static* sticker, not animated!" },
          { quoted: _0x31080c },
        );
      for (let _0x8a38e8 = 0x0; _0x8a38e8 < _0x1ca4d9; _0x8a38e8++) {
        const _0x516f16 = await sharp(_0x544957, {
            animated: ![],
            page: _0x8a38e8,
          })
            ["png"]()
            ["toBuffer"](),
          _0x23844d = path["join"](
            _0x25cdcf,
            "frame_" + String(_0x8a38e8)["padStart"](0x4, "0") + ".png",
          );
        fs["writeFileSync"](_0x23844d, _0x516f16);
      }
      try {
        execSync(
          "\x22" +
            ffmpegPath +
            '" -y -framerate 15 -i "' +
            _0x25cdcf +
            '/frame_%04d.png" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -movflags faststart "' +
            _0x14f347 +
            "\x22",
          { timeout: 0xea60, stdio: "pipe" },
        );
      } catch (_0x4363db) {
        return _0x3f6d39["sendMessage"](
          _0x2fd601,
          {
            text:
              "❌ ffmpeg error: " +
              (_0x4363db["stderr"]?.["toString"]()?.["slice"](0x0, 0xc8) ||
                _0x4363db["message"]),
          },
          { quoted: _0x31080c },
        );
      }
      if (!fs["existsSync"](_0x14f347))
        return _0x3f6d39["sendMessage"](
          _0x2fd601,
          { text: "❌ Output file not created" },
          { quoted: _0x31080c },
        );
      const _0x3f948f = fs["readFileSync"](_0x14f347);
      await _0x3f6d39["sendMessage"](
        _0x2fd601,
        {
          video: _0x3f948f,
          caption: "*Sticker converted successfully to Video*",
        },
        { quoted: _0x31080c },
      );
    } catch (_0x40b09a) {
      (console["error"]("[TOVIDEO ERROR]", _0x40b09a["message"]),
        await _0x3f6d39["sendMessage"](
          _0x2fd601,
          { text: "❌ Error: " + _0x40b09a["message"] },
          { quoted: _0x31080c },
        ));
    } finally {
      try {
        fs["rmSync"](_0x25cdcf, { recursive: !![], force: !![] });
      } catch (_0x20c07a) {}
      try {
        fs["unlinkSync"](_0x14f347);
      } catch (_0x24c06e) {}
    }
  },
};
