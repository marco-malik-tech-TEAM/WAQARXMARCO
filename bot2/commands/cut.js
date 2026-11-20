const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  { execSync } = require("child_process");
module["exports"] = {
  name: "cut",
  description:
    "Cut a segment from audio/video. Usage: .cut <start> <duration> (reply to media)",
  async execute(_0x4b2493, _0x42c18d, _0x1a7993) {
    const _0x4ffcf6 = _0x42c18d["key"]["remoteJid"],
      _0x529088 =
        _0x42c18d["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x520f9c = _0x529088?.["quotedMessage"];
    if (!_0x520f9c)
      return _0x4b2493["sendMessage"](
        _0x4ffcf6,
        {
          text: "❌ Reply to an audio or video message with .cut <start> <duration>\nExample: .cut 00:00:10 15",
        },
        { quoted: _0x42c18d },
      );
    const _0x7644c7 = _0x1a7993[0x0],
      _0x236411 = _0x1a7993[0x1];
    if (!_0x7644c7 || !_0x236411)
      return _0x4b2493["sendMessage"](
        _0x4ffcf6,
        {
          text: "❌ Usage: .cut <start> <duration>\nExample: .cut 00:00:10 15",
        },
        { quoted: _0x42c18d },
      );
    const _0x139d2d = _0x520f9c["videoMessage"]
      ? "video"
      : _0x520f9c["audioMessage"]
        ? "audio"
        : null;
    if (!_0x139d2d)
      return _0x4b2493["sendMessage"](
        _0x4ffcf6,
        { text: "❌ Reply to an audio or video message." },
        { quoted: _0x42c18d },
      );
    await _0x4b2493["sendMessage"](
      _0x4ffcf6,
      { text: "✂️ Cutting..." },
      { quoted: _0x42c18d },
    );
    const _0x2618e0 = os["tmpdir"](),
      _0x2b705f = _0x139d2d === "video" ? "mp4" : "mp3",
      _0x592166 = path["join"](
        _0x2618e0,
        "cut_in_" + Date["now"]() + "." + _0x2b705f,
      ),
      _0x559ba2 = path["join"](
        _0x2618e0,
        "cut_out_" + Date["now"]() + "." + _0x2b705f,
      );
    try {
      const _0x4cf1c4 = await _0x4b2493["downloadMediaMessage"]({
        message: _0x520f9c,
        key: {
          remoteJid: _0x4ffcf6,
          id: _0x529088["stanzaId"],
          participant: _0x529088["participant"],
        },
      });
      (fs["writeFileSync"](_0x592166, _0x4cf1c4),
        execSync(
          'ffmpeg -y -i "' +
            _0x592166 +
            '" -ss ' +
            _0x7644c7 +
            " -t " +
            _0x236411 +
            ' -c copy "' +
            _0x559ba2 +
            "\x22",
        ));
      const _0x2a0363 = fs["readFileSync"](_0x559ba2);
      await _0x4b2493["sendMessage"](
        _0x4ffcf6,
        {
          [_0x139d2d]: _0x2a0363,
          mimetype: _0x139d2d === "video" ? "video/mp4" : "audio/mpeg",
          caption: "✂️ Cut: " + _0x7644c7 + " for " + _0x236411 + "s",
        },
        { quoted: _0x42c18d },
      );
    } catch (_0x3946b0) {
      await _0x4b2493["sendMessage"](
        _0x4ffcf6,
        { text: "❌ Cut failed: " + _0x3946b0["message"] },
        { quoted: _0x42c18d },
      );
    } finally {
      [_0x592166, _0x559ba2]["forEach"]((_0x170d13) => {
        try {
          fs["unlinkSync"](_0x170d13);
        } catch {}
      });
    }
  },
};
