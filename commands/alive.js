const fs = require("fs"),
  path = require("path");
module["exports"] = {
  name: "alive",
  description: "Shows that the bot is online.",
  async execute(_0x2b09e4, _0x198905) {
    const _0x582a4a = _0x198905["key"]["remoteJid"],
      _0x183296 = path["join"](__dirname, "../assets/thumb.jpg"),
      _0x37c505 = path["join"](__dirname, "../assets/alive.m4a");
    if (!fs["existsSync"](_0x37c505))
      return _0x2b09e4["sendMessage"](
        _0x582a4a,
        { text: "MARCO X WAQAR MD BOT is alive and kicking" },
        { quoted: _0x198905 },
      );
    const _0x209404 = fs["existsSync"](_0x183296)
      ? fs["readFileSync"](_0x183296)
      : undefined;
    await _0x2b09e4["sendMessage"](
      _0x582a4a,
      {
        audio: fs["readFileSync"](_0x37c505),
        mimetype: "audio/mp4",
        ptt: !![],
        contextInfo: {
          externalAdReply: {
            title: "MARCO X WAQAR MD BOT",
            body: "Together for Better Experience",
            thumbnail: _0x209404,
            mediaType: 0x1,
            renderLargerThumbnail: !![],
            showAdAttribution: ![],
          },
        },
      },
      { quoted: _0x198905 },
    );
  },
};
