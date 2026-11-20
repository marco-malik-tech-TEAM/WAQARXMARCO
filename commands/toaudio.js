const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  { execFile } = require("child_process"),
  { promisify } = require("util"),
  execFileAsync = promisify(execFile);
function getRepliedVideo(_0x464dea) {
  const _0x2d93eb = _0x464dea["message"];
  if (_0x2d93eb?.["videoMessage"])
    return { message: _0x2d93eb, key: _0x464dea["key"] };
  const _0x516db9 = _0x2d93eb?.["extendedTextMessage"]?.["contextInfo"],
    _0x1e8571 = _0x516db9?.["quotedMessage"];
  if (_0x1e8571?.["videoMessage"])
    return {
      message: _0x1e8571,
      key: {
        remoteJid: _0x464dea["key"]["remoteJid"],
        id: _0x516db9["stanzaId"],
        fromMe: ![],
        participant: _0x516db9["participant"],
      },
    };
  return null;
}
module["exports"] = {
  name: "toaudio",
  description:
    "Extracts the audio track from a video. Reply to a video with .toaudio",
  async execute(_0x1f9436, _0x3d6294) {
    const _0x480340 = _0x3d6294["key"]["remoteJid"],
      _0x4efba1 = getRepliedVideo(_0x3d6294);
    if (!_0x4efba1)
      return _0x1f9436["sendMessage"](
        _0x480340,
        { text: "❌ Reply to a video with .toaudio to extract its audio." },
        { quoted: _0x3d6294 },
      );
    await _0x1f9436["sendMessage"](_0x480340, {
      react: { text: "🎬", key: _0x3d6294["key"] },
    });
    let _0x18d86c, _0x1b0c54;
    try {
      const {
          downloadMediaMessage: _0x41c2a2,
        } = require("@whiskeysockets/baileys"),
        _0x4be2ad = await _0x41c2a2(
          { key: _0x4efba1["key"], message: _0x4efba1["message"] },
          "buffer",
          {},
          { reuploadRequest: _0x1f9436["updateMediaMessage"] },
        ),
        _0x207910 = os["tmpdir"]();
      ((_0x18d86c = path["join"](
        _0x207910,
        "toaudio_in_" + Date["now"]() + ".mp4",
      )),
        (_0x1b0c54 = path["join"](
          _0x207910,
          "toaudio_out_" + Date["now"]() + ".m4a",
        )),
        fs["writeFileSync"](_0x18d86c, _0x4be2ad));
      const _0x59330f =
        process.env.FFMPEG_PATH || require("ffmpeg-static") || "ffmpeg";
      (await execFileAsync(_0x59330f, [
        "-y",
        "-i",
        _0x18d86c,
        "-vn",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        _0x1b0c54,
      ]),
        await _0x1f9436["sendMessage"](
          _0x480340,
          {
            audio: fs["readFileSync"](_0x1b0c54),
            mimetype: "audio/mp4",
            ptt: ![],
          },
          { quoted: _0x3d6294 },
        ),
        await _0x1f9436["sendMessage"](_0x480340, {
          react: { text: "", key: _0x3d6294["key"] },
        }));
    } catch (_0x287d46) {
      await _0x1f9436["sendMessage"](
        _0x480340,
        { text: "❌ Error extracting audio: " + _0x287d46["message"] },
        { quoted: _0x3d6294 },
      );
    } finally {
      [_0x18d86c, _0x1b0c54]["forEach"]((_0x20faa2) => {
        if (_0x20faa2 && fs["existsSync"](_0x20faa2))
          try {
            fs["unlinkSync"](_0x20faa2);
          } catch {}
      });
    }
  },
};
