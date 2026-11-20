module["exports"] = {
  name: "take",
  aliases: ["steal"],
  description:
    "Retake/rewatermark a sticker, image, or short video as an MARCO X WAQAR MD BOT sticker.",
  async execute(_0x3551f7, _0x4dca29, _0x367e33) {
    const _0x589b17 = _0x4dca29["key"]["remoteJid"],
      {
        Sticker: _0xe6e32e,
        StickerTypes: _0xaa7d84,
      } = require("wa-sticker-formatter"),
      _0x56d3ef = require("sharp"),
      _0x37384a = require("fs"),
      _0x3aef7f = require("os"),
      _0x467294 = require("path"),
      _0x49b00f = _0x4dca29["pushName"] || "No Name",
      _0x15763f =
        _0x4dca29["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x376f09 = _0x15763f?.["quotedMessage"];
    if (!_0x376f09)
      return _0x3551f7["sendMessage"](
        _0x589b17,
        {
          text: "❌ Quote an image, a short video, or a sticker to change the watermark.",
        },
        { quoted: _0x4dca29 },
      );
    let _0x3d7c6b,
      _0x54d7fd = ![],
      _0x44b3b2 = ![];
    if (_0x376f09["imageMessage"]) _0x3d7c6b = _0x376f09["imageMessage"];
    else {
      if (_0x376f09["videoMessage"])
        ((_0x3d7c6b = _0x376f09["videoMessage"]), (_0x54d7fd = !![]));
      else {
        if (_0x376f09["stickerMessage"])
          ((_0x3d7c6b = _0x376f09["stickerMessage"]),
            (_0x44b3b2 = !!_0x376f09["stickerMessage"]["isAnimated"]));
        else
          return _0x3551f7["sendMessage"](
            _0x589b17,
            { text: "❌ This is neither a sticker, image, nor a video." },
            { quoted: _0x4dca29 },
          );
      }
    }
    const {
        downloadMediaMessage: _0xbf4415,
      } = require("@whiskeysockets/baileys"),
      _0x2eac03 = {
        remoteJid: _0x589b17,
        id: _0x15763f["stanzaId"],
        participant: _0x15763f["participant"],
        fromMe: ![],
      },
      _0x3b1e89 = await _0xbf4415(
        { message: _0x376f09, key: _0x2eac03 },
        "buffer",
        {},
      ),
      _0x55f3b8 = _0x467294["join"](
        _0x3aef7f["tmpdir"](),
        "take_in_" + Date["now"](),
      );
    _0x37384a["writeFileSync"](_0x55f3b8, _0x3b1e89);
    try {
      let _0x1bf71b;
      if (_0x54d7fd) {
        const { execSync: _0x4d35f9 } = require("child_process");
        let _0x179467;
        try {
          _0x179467 = require("ffmpeg-static");
        } catch {
          _0x179467 = "ffmpeg";
        }
        const _0x44e378 = Date["now"](),
          _0x37a2a6 = _0x3aef7f["tmpdir"](),
          _0x25cb4c = async (_0x57857d, _0x4aeb45) => {
            const _0x168c7d = _0x467294["join"](
              _0x37a2a6,
              "take_" + _0x44e378 + "_" + _0x57857d + "fps.mp4",
            );
            try {
              _0x4d35f9(
                "\x22" +
                  _0x179467 +
                  '" -y -i "' +
                  _0x55f3b8 +
                  '" -t 6 ' +
                  ('-vf "scale=512:512:force_original_aspect_ratio=decrease,fps=' +
                    _0x57857d +
                    ",") +
                  'pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" ' +
                  ('-an -c:v libx264 -crf 28 -preset ultrafast "' +
                    _0x168c7d +
                    "\x22"),
                { timeout: 0x7530, stdio: "pipe" },
              );
            } catch (_0x1a7607) {
              _0x37384a["copyFileSync"](_0x55f3b8, _0x168c7d);
            }
            const _0x283b32 = new _0xe6e32e(
                _0x37384a["readFileSync"](_0x168c7d),
                {
                  pack: _0x49b00f,
                  author: "MARCO X WAQAR MD BOT",
                  type: _0xaa7d84["DEFAULT"],
                  quality: _0x4aeb45,
                },
              ),
              _0x349dda = await _0x283b32["toBuffer"]();
            try {
              _0x37384a["unlinkSync"](_0x168c7d);
            } catch {}
            return _0x349dda;
          };
        _0x1bf71b = await _0x25cb4c(0xa, 0x28);
        if (!_0x1bf71b || _0x1bf71b["length"] < 0x1f4)
          return _0x3551f7["sendMessage"](
            _0x589b17,
            {
              text: "❌ Video sticker failed — ffmpeg may be unavailable on this server.",
            },
            { quoted: _0x4dca29 },
          );
        if (_0x1bf71b["length"] > 0x3b6 * 0x400) {
          const _0x2dbc40 = await _0x25cb4c(0x5, 0x19);
          if (_0x2dbc40 && _0x2dbc40["length"] >= 0x1f4) _0x1bf71b = _0x2dbc40;
        }
        if (_0x1bf71b["length"] > 0x400 * 0x400)
          return _0x3551f7["sendMessage"](
            _0x589b17,
            {
              text:
                "❌ Sticker still too large (" +
                (_0x1bf71b["length"] / 0x400 / 0x400)["toFixed"](0x2) +
                " MB) after compression.\n💡 Tip: Try a shorter clip (< 4s) or send an image instead.",
            },
            { quoted: _0x4dca29 },
          );
      } else {
        if (_0x44b3b2) {
          const _0x131b09 = new _0xe6e32e(_0x3b1e89, {
            pack: _0x49b00f,
            author: "MARCO X WAQAR MD BOT",
            type: _0xaa7d84["FULL"],
            quality: 0x46,
          });
          _0x1bf71b = await _0x131b09["toBuffer"]();
          if (!_0x1bf71b || _0x1bf71b["length"] < 0x1f4)
            return _0x3551f7["sendMessage"](
              _0x589b17,
              { text: "❌ Failed to re-pack animated sticker." },
              { quoted: _0x4dca29 },
            );
          if (_0x1bf71b["length"] > 0x400 * 0x400)
            return _0x3551f7["sendMessage"](
              _0x589b17,
              {
                text:
                  "❌ Animated sticker too large (" +
                  (_0x1bf71b["length"] / 0x400 / 0x400)["toFixed"](0x2) +
                  " MB).\n💡 Tip: WhatsApp stickers must be under 1 MB.",
              },
              { quoted: _0x4dca29 },
            );
        } else {
          const _0x38ac2d = await _0x56d3ef(_0x3b1e89)
              ["resize"](0x200, 0x200, {
                fit: "contain",
                background: { r: 0x0, g: 0x0, b: 0x0, alpha: 0x0 },
              })
              ["png"]()
              ["toBuffer"](),
            _0x4a1d5a = new _0xe6e32e(_0x38ac2d, {
              pack: _0x49b00f,
              author: "MARCO X WAQAR MD BOT",
              type: _0xaa7d84["DEFAULT"],
              categories: ["🤩", "🎉"],
              quality: 0x64,
              background: "transparent",
            });
          _0x1bf71b = await _0x4a1d5a["toBuffer"]();
        }
      }
      await _0x3551f7["sendMessage"](
        _0x589b17,
        { sticker: _0x1bf71b },
        { quoted: _0x4dca29 },
      );
    } catch (_0x14c98b) {
      await _0x3551f7["sendMessage"](
        _0x589b17,
        { text: "❌ Error: " + _0x14c98b["message"] },
        { quoted: _0x4dca29 },
      );
    } finally {
      try {
        _0x37384a["unlinkSync"](_0x55f3b8);
      } catch {}
    }
  },
};
