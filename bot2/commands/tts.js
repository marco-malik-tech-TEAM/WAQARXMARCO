const axios = require("axios"),
  fs = require("fs"),
  os = require("os"),
  path = require("path"),
  { execFile } = require("child_process"),
  { promisify } = require("util"),
  googleTTS = require("google-tts-api"),
  ffmpegPath = process.env.FFMPEG_PATH || require("ffmpeg-static") || "ffmpeg",
  execFileAsync = promisify(execFile);
module["exports"] = {
  name: "tts",
  aliases: ["say"],
  description: "Convert text to speech",
  async execute(_0x22607a, _0x7f2e82, _0x2be4f6) {
    const _0x3edec7 = _0x7f2e82["key"]["remoteJid"],
      _0x3f4fcb = _0x2be4f6["join"]("\x20")["trim"]();
    if (!_0x3f4fcb)
      return await _0x22607a["sendMessage"](
        _0x3edec7,
        { text: "Provide text for conversion!" },
        { quoted: _0x7f2e82 },
      );
    const _0x1c8521 = googleTTS["getAudioUrl"](_0x3f4fcb, {
      lang: "en-US",
      slow: ![],
      host: "https://translate.google.com",
    });
    let _0x224c9c, _0x5ac84e;
    try {
      const _0x1892bd = os["tmpdir"]();
      ((_0x224c9c = path["join"](_0x1892bd, "tts_" + Date["now"]() + ".mp3")),
        (_0x5ac84e = path["join"](_0x1892bd, "tts_" + Date["now"]() + ".ogg")));
      const { data: _0xaa7afa } = await axios["get"](_0x1c8521, {
        responseType: "arraybuffer",
      });
      (fs["writeFileSync"](_0x224c9c, Buffer["from"](_0xaa7afa)),
        await execFileAsync(ffmpegPath, [
          "-i",
          _0x224c9c,
          "-c:a",
          "libopus",
          "-ac",
          "1",
          "-ar",
          "16000",
          "-b:a",
          "32k",
          _0x5ac84e,
          "-y",
        ]));
      const _0x5bfa84 = fs["readFileSync"](_0x5ac84e);
      await _0x22607a["sendMessage"](
        _0x3edec7,
        { audio: _0x5bfa84, mimetype: "audio/ogg; codecs=opus", ptt: !![] },
        { quoted: _0x7f2e82 },
      );
    } catch (_0xefeea7) {
      (console["error"]("[TTS ERROR]", _0xefeea7),
        await _0x22607a["sendMessage"](
          _0x3edec7,
          { audio: { url: _0x1c8521 }, mimetype: "audio/mpeg", ptt: ![] },
          { quoted: _0x7f2e82 },
        ));
    } finally {
      [_0x224c9c, _0x5ac84e]["forEach"]((_0x19092e) => {
        if (_0x19092e && fs["existsSync"](_0x19092e))
          try {
            fs["unlinkSync"](_0x19092e);
          } catch {}
      });
    }
  },
};
