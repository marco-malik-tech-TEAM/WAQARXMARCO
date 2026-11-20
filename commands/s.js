const { downloadContentFromMessage } = require("@whiskeysockets/baileys"),
  { Sticker, StickerTypes } = require("wa-sticker-formatter"),
  fs = require("fs"),
  path = require("path"),
  { exec } = require("child_process"),
  sharp = require("sharp"),
  ffmpegPath = process.env.FFMPEG_PATH || require("ffmpeg-static") || "ffmpeg";
module["exports"] = {
  name: "s",
  aliases: ["sticker"],
  description: "Convert an image or short video into a sticker.",
  category: "media",
  async execute(_0x4c935e, _0x3e2598) {
    try {
      const _0x4202d3 =
        _0x3e2598["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "quotedMessage"
        ];
      if (!_0x4202d3)
        return await _0x4c935e["sendMessage"](
          _0x3e2598["key"]["remoteJid"],
          { text: "❌ Reply to an image or short video." },
          { quoted: _0x3e2598 },
        );
      let _0x1fd793, _0x310dc3;
      if (_0x4202d3["imageMessage"])
        ((_0x1fd793 = _0x4202d3["imageMessage"]), (_0x310dc3 = "image"));
      else {
        if (_0x4202d3["videoMessage"]) {
          _0x1fd793 = _0x4202d3["videoMessage"];
          if ((_0x1fd793["seconds"] || 0x0) > 0xa)
            return await _0x4c935e["sendMessage"](
              _0x3e2598["key"]["remoteJid"],
              { text: "❌ Video must be 10 seconds or shorter." },
              { quoted: _0x3e2598 },
            );
          _0x310dc3 = "video";
        } else
          return await _0x4c935e["sendMessage"](
            _0x3e2598["key"]["remoteJid"],
            { text: "❌ Reply to an image or short video." },
            { quoted: _0x3e2598 },
          );
      }
      const _0x4c786b = await downloadContentFromMessage(_0x1fd793, _0x310dc3);
      let _0x2564c3 = Buffer["alloc"](0x0);
      for await (const _0xb19dea of _0x4c786b) {
        _0x2564c3 = Buffer["concat"]([_0x2564c3, _0xb19dea]);
      }
      const _0x3c09b6 = _0x3e2598["pushName"] || "No Name";
      let _0x53c7b1;
      if (_0x310dc3 === "image") {
        const _0x18c7c8 = await sharp(_0x2564c3)
            ["resize"](0x200, 0x200, {
              fit: "contain",
              background: { r: 0x0, g: 0x0, b: 0x0, alpha: 0x0 },
            })
            ["png"]()
            ["toBuffer"](),
          _0x3523ba = new Sticker(_0x18c7c8, {
            pack: _0x3c09b6,
            author: "MARCO X WAQAR MD BOT",
            type: StickerTypes["DEFAULT"],
            quality: 0x64,
            background: "transparent",
          });
        _0x53c7b1 = await _0x3523ba["toBuffer"]();
      } else {
        const _0x3afc17 = path["join"](__dirname, "../temp_input.mp4"),
          _0x5c11c7 = path["join"](__dirname, "../temp_processed.mp4");
        (fs["writeFileSync"](_0x3afc17, _0x2564c3),
          await new Promise((_0x2d0036, _0x312e3c) => {
            exec(
              "\x22" +
                ffmpegPath +
                '" -y -i "' +
                _0x3afc17 +
                '" -t 10 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" -an -c:v libx264 -crf 28 -preset ultrafast "' +
                _0x5c11c7 +
                "\x22",
              (_0x3b10b0) => (_0x3b10b0 ? _0x312e3c(_0x3b10b0) : _0x2d0036()),
            );
          }));
        const _0x59eff5 = new Sticker(fs["readFileSync"](_0x5c11c7), {
          pack: _0x3c09b6,
          author: "MARCO X WAQAR MD BOT",
          type: StickerTypes["DEFAULT"],
          quality: 0x32,
        });
        _0x53c7b1 = await _0x59eff5["toBuffer"]();
        try {
          fs["unlinkSync"](_0x3afc17);
        } catch {}
        try {
          fs["unlinkSync"](_0x5c11c7);
        } catch {}
      }
      await _0x4c935e["sendMessage"](
        _0x3e2598["key"]["remoteJid"],
        { sticker: _0x53c7b1 },
        { quoted: _0x3e2598 },
      );
    } catch (_0x3bf494) {
      (console["error"](_0x3bf494),
        await _0x4c935e["sendMessage"](
          _0x3e2598["key"]["remoteJid"],
          { text: "❌ Failed to create sticker." },
          { quoted: _0x3e2598 },
        ));
    }
  },
};
