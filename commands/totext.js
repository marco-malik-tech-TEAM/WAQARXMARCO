const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  axios = require("axios"),
  ffmpeg = require("fluent-ffmpeg"),
  ffmpegPath = require("ffmpeg-static"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys");
ffmpeg["setFfmpegPath"](ffmpegPath);
const GOOGLE_KEY =
  process.env.GOOGLE_STT_KEY || "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
module["exports"] = {
  name: "totext",
  aliases: ["stt", "listen", "scribe", "audiotxt"],
  description:
    "Convert a quoted voice/audio message to text. Reply to a voice note with .totext",
  async execute(_0x343cf7, _0x71ae88) {
    const _0xaa97cf = _0x71ae88["key"]["remoteJid"],
      _0x114bc8 =
        _0x71ae88["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x4c807b = _0x114bc8?.["quotedMessage"];
    if (!_0x4c807b)
      return _0x343cf7["sendMessage"](
        _0xaa97cf,
        { text: "🎙️ Reply to a voice note or audio message with *.totext*" },
        { quoted: _0x71ae88 },
      );
    const _0x1d2919 =
      _0x4c807b["audioMessage"] || _0x4c807b["videoMessage"] || null;
    if (!_0x1d2919)
      return _0x343cf7["sendMessage"](
        _0xaa97cf,
        { text: "❌ Quoted message is not audio. Reply to a voice note." },
        { quoted: _0x71ae88 },
      );
    let _0x281c90, _0x588051;
    try {
      await _0x343cf7["sendMessage"](
        _0xaa97cf,
        { text: "⏳ Converting audio to text..." },
        { quoted: _0x71ae88 },
      );
      const _0x4d6566 = await downloadMediaMessage(
        {
          message: _0x4c807b,
          key: {
            remoteJid: _0xaa97cf,
            id: _0x114bc8["stanzaId"],
            participant: _0x114bc8["participant"],
          },
        },
        "buffer",
        {},
      );
      ((_0x281c90 = path["join"](os["tmpdir"](), "stt_raw_" + Date["now"]())),
        fs["writeFileSync"](_0x281c90, _0x4d6566),
        (_0x588051 = path["join"](
          os["tmpdir"](),
          "stt_" + Date["now"]() + ".flac",
        )),
        await new Promise((_0x1855fb, _0x50c515) => {
          ffmpeg(_0x281c90)
            ["audioChannels"](0x1)
            ["audioFrequency"](0x3e80)
            ["toFormat"]("flac")
            ["on"]("end", _0x1855fb)
            ["on"]("error", _0x50c515)
            ["save"](_0x588051);
        }));
      const _0x933d45 = fs["readFileSync"](_0x588051),
        _0x3587fa = await axios["post"](
          "https://www.google.com/speech-api/v2/recognize?output=json&lang=en-US&key=" +
            GOOGLE_KEY,
          _0x933d45,
          {
            headers: { "Content-Type": "audio/x-flac; rate=16000" },
            timeout: 0x7530,
          },
        ),
        _0x38b0c0 = String(_0x3587fa["data"])
          ["trim"]()
          ["split"]("\x0a")
          ["filter"]((_0x9b7f79) => _0x9b7f79["trim"]() && _0x9b7f79 !== "{}");
      let _0x3fd1ad = "";
      for (const _0x9fbe72 of _0x38b0c0) {
        try {
          const _0x2f8951 = JSON["parse"](_0x9fbe72),
            _0x354269 =
              _0x2f8951?.["result"]?.[0x0]?.["alternative"]?.[0x0]?.[
                "transcript"
              ];
          if (_0x354269) _0x3fd1ad += _0x354269 + "\x20";
        } catch (_0x416326) {}
      }
      _0x3fd1ad = _0x3fd1ad["trim"]();
      if (!_0x3fd1ad)
        return _0x343cf7["sendMessage"](
          _0xaa97cf,
          {
            text: "🤷 Could not make out any speech. Try a clearer audio message.",
          },
          { quoted: _0x71ae88 },
        );
      await _0x343cf7["sendMessage"](
        _0xaa97cf,
        { text: "🎙️ *Transcription:*\n\n" + _0x3fd1ad },
        { quoted: _0x71ae88 },
      );
    } catch (_0x2a630f) {
      (console["error"]("[TOTEXT ERROR]", _0x2a630f["message"]),
        await _0x343cf7["sendMessage"](
          _0xaa97cf,
          {
            text: "❌ Transcription failed. Audio may be too long (max ~60s) or too noisy.",
          },
          { quoted: _0x71ae88 },
        ));
    } finally {
      for (const _0x12e7ad of [_0x281c90, _0x588051]) {
        if (_0x12e7ad && fs["existsSync"](_0x12e7ad))
          try {
            fs["unlinkSync"](_0x12e7ad);
          } catch (_0x171f8f) {}
      }
    }
  },
};
