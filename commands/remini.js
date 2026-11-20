const axios = require("axios"),
  fs = require("fs"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  os = require("os"),
  path = require("path");
async function uploadToUguu(_0x186dac) {
  const _0x1ae73e = new FormData();
  _0x1ae73e["append"]("files[]", fs["createReadStream"](_0x186dac));
  const _0x4eade4 = await axios["post"]("https://uguu.se/upload", _0x1ae73e, {
      headers: _0x1ae73e["getHeaders"](),
      timeout: 0x7530,
    }),
    _0x1a823e = _0x4eade4["data"];
  if (_0x1a823e?.["success"] && _0x1a823e["files"]?.[0x0]?.["url"])
    return _0x1a823e["files"][0x0]["url"];
  throw new Error("Uguu upload failed or malformed response");
}
module["exports"] = {
  name: "remini",
  aliases: ["enhance", "hd"],
  description: "Enhance a quoted image using AI (Remini)",
  async execute(_0x3807c0, _0x5a1d69) {
    const _0x37a077 = _0x5a1d69["key"]["remoteJid"],
      _0x1fdebc =
        _0x5a1d69["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0xf6d598 = _0x1fdebc?.["quotedMessage"];
    if (!_0xf6d598?.["imageMessage"])
      return await _0x3807c0["sendMessage"](
        _0x37a077,
        { text: "📌 Reply to an image with *.remini* to enhance it." },
        { quoted: _0x5a1d69 },
      );
    let _0x3dc3e8;
    try {
      await _0x3807c0["sendMessage"](
        _0x37a077,
        { text: "⏳ Enhancing your image with AI... Please wait." },
        { quoted: _0x5a1d69 },
      );
      const _0x36a0bb = await downloadMediaMessage(
        {
          key: {
            remoteJid: _0x37a077,
            id: _0x1fdebc["stanzaId"],
            fromMe: ![],
            participant: _0x1fdebc["participant"],
          },
          message: _0xf6d598,
        },
        "buffer",
        {},
        { reuploadRequest: _0x3807c0["updateMediaMessage"] },
      );
      ((_0x3dc3e8 = path["join"](
        os["tmpdir"](),
        "remini_" + Date["now"]() + ".jpg",
      )),
        fs["writeFileSync"](_0x3dc3e8, _0x36a0bb));
      const _0x643ea8 = await uploadToUguu(_0x3dc3e8),
        _0x49d95d =
          "https://apis.davidcyril.name.ng/remini?url=" +
          encodeURIComponent(_0x643ea8);
      await _0x3807c0["sendMessage"](
        _0x37a077,
        {
          image: { url: _0x49d95d },
          mimetype: "image/png",
          caption: "✨ *Image Upscaled To HD*\n_Powered by MARCO X WAQAR MD BOT_",
        },
        { quoted: _0x5a1d69 },
      );
    } catch (_0x5d77a4) {
      (console["error"]("[REMINI ERROR]", _0x5d77a4),
        await _0x3807c0["sendMessage"](
          _0x37a077,
          {
            text: "❌ Failed to enhance image. Make sure you replied to a clear photo and try again.",
          },
          { quoted: _0x5a1d69 },
        ));
    } finally {
      if (_0x3dc3e8 && fs["existsSync"](_0x3dc3e8))
        try {
          fs["unlinkSync"](_0x3dc3e8);
        } catch {}
    }
  },
};
