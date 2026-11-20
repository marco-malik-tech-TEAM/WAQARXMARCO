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
  name: "transcribe",
  aliases: ["speech2text", "audio2text", "whisper"],
  description: "Transcribe quoted audio or video to text",
  async execute(_0x2b4b8d, _0x12f1b7) {
    const _0xed1995 = _0x12f1b7["key"]["remoteJid"],
      _0x3e262b =
        _0xed1995["endsWith"]("@lid") && _0x12f1b7["key"]["remoteJidAlt"]
          ? _0x12f1b7["key"]["remoteJidAlt"]
          : _0xed1995,
      _0x4c9a6b =
        _0x12f1b7["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x1d53a0 = _0x4c9a6b?.["quotedMessage"],
      _0x3192ff = _0x1d53a0?.["audioMessage"],
      _0x210da2 = _0x1d53a0?.["videoMessage"];
    if (!_0x3192ff && !_0x210da2)
      return _0x2b4b8d["sendMessage"](
        _0x3e262b,
        { text: "📌 Reply to an audio or video message to transcribe it." },
        { quoted: _0x12f1b7 },
      );
    const _0x15652c = await _0x2b4b8d["sendMessage"](
      _0x3e262b,
      { text: "🎙️ *Transcribing audio...*" },
      { quoted: _0x12f1b7 },
    );
    let _0x2083e4, _0x581da0;
    try {
      const _0x13c79d = await downloadMediaMessage(
        {
          key: {
            remoteJid: _0x3e262b,
            id: _0x4c9a6b["stanzaId"],
            fromMe: ![],
            participant: _0x4c9a6b["participant"],
          },
          message: _0x1d53a0,
        },
        "buffer",
        {},
        { reuploadRequest: _0x2b4b8d["updateMediaMessage"] },
      );
      ((_0x2083e4 = path["join"](
        os["tmpdir"](),
        "transcribe_raw_" + Date["now"](),
      )),
        fs["writeFileSync"](_0x2083e4, _0x13c79d),
        (_0x581da0 = path["join"](
          os["tmpdir"](),
          "transcribe_" + Date["now"]() + ".flac",
        )),
        await new Promise((_0x517bf7, _0x4269a4) => {
          ffmpeg(_0x2083e4)
            ["audioChannels"](0x1)
            ["audioFrequency"](0x3e80)
            ["toFormat"]("flac")
            ["on"]("end", _0x517bf7)
            ["on"]("error", _0x4269a4)
            ["save"](_0x581da0);
        }));
      const _0x3f4f80 = fs["readFileSync"](_0x581da0),
        _0x392532 = await axios["post"](
          "https://www.google.com/speech-api/v2/recognize?output=json&lang=en-US&key=" +
            GOOGLE_KEY,
          _0x3f4f80,
          {
            headers: { "Content-Type": "audio/x-flac; rate=16000" },
            timeout: 0x7530,
          },
        ),
        _0x2f2d33 = String(_0x392532["data"])
          ["trim"]()
          ["split"]("\x0a")
          ["filter"]((_0x271759) => _0x271759["trim"]() && _0x271759 !== "{}");
      let _0x49c244 = "";
      for (const _0x1f76c9 of _0x2f2d33) {
        try {
          const _0x9a3784 = JSON["parse"](_0x1f76c9),
            _0x49910a =
              _0x9a3784?.["result"]?.[0x0]?.["alternative"]?.[0x0]?.[
                "transcript"
              ];
          if (_0x49910a) _0x49c244 += _0x49910a + "\x20";
        } catch (_0x5ac78b) {}
      }
      _0x49c244 = _0x49c244["trim"]();
      if (!_0x49c244)
        throw new Error(
          "Could not make out any speech. Audio may be too short or unclear.",
        );
      await _0x2b4b8d["sendMessage"](
        _0x3e262b,
        { text: "📝 *Transcription*\n\n" + _0x49c244, edit: _0x15652c["key"] },
        { quoted: _0x12f1b7 },
      );
    } catch (_0x198c75) {
      (console["error"]("[TRANSCRIBE ERROR]", _0x198c75["message"]),
        await _0x2b4b8d["sendMessage"](
          _0x3e262b,
          {
            text: "❌ Failed to transcribe: " + _0x198c75["message"],
            edit: _0x15652c["key"],
          },
          { quoted: _0x12f1b7 },
        ));
    } finally {
      for (const _0x3e2242 of [_0x2083e4, _0x581da0]) {
        if (_0x3e2242 && fs["existsSync"](_0x3e2242))
          try {
            fs["unlinkSync"](_0x3e2242);
          } catch (_0x4efba8) {}
      }
    }
  },
};
