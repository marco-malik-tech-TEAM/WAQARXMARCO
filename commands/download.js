const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "download",
  description: "Downloads audio from a YouTube link. Usage: .download <url>",
  async execute(_0x1f1b0e, _0x58fbdc, _0x2a7d53) {
    const _0x1da5af = _0x58fbdc["key"]["remoteJid"],
      _0x27e8bb = _0x2a7d53[0x0];
    if (
      !_0x27e8bb ||
      !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//["test"](_0x27e8bb)
    )
      return await _0x1f1b0e["sendMessage"](
        _0x1da5af,
        {
          text: "Usage: .download <YouTube URL>\nExample: .download https://youtube.com/watch?v=...",
        },
        { quoted: _0x58fbdc },
      );
    await _0x1f1b0e["sendMessage"](
      _0x1da5af,
      { text: "⏳ Downloading audio, this may take a moment..." },
      { quoted: _0x58fbdc },
    );
    try {
      const _0x3a5816 = await axios["get"](
          KEITH_BASE + "/download/audio?url=" + encodeURIComponent(_0x27e8bb),
        ),
        _0x3155a0 = _0x3a5816["data"];
      if (!_0x3155a0?.["status"] || !_0x3155a0?.["result"])
        throw new Error(_0x3155a0?.["error"] || "API request failed");
      const _0x2733a4 = _0x3155a0["result"],
        _0x1a1983 = _0x3155a0["title"] || "audio";
      await _0x1f1b0e["sendMessage"](
        _0x1da5af,
        {
          audio: { url: _0x2733a4 },
          mimetype: "audio/mpeg",
          ptt: ![],
          fileName: _0x1a1983 + ".mp3",
        },
        { quoted: _0x58fbdc },
      );
    } catch (_0x4e28f2) {
      (console["error"]("[DOWNLOAD ERROR]", _0x4e28f2),
        await _0x1f1b0e["sendMessage"](
          _0x1da5af,
          {
            text: "❌ Could not download that video. Try again later or check the link.",
          },
          { quoted: _0x58fbdc },
        ));
    }
  },
};
