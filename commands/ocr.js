const axios = require("axios"),
  fs = require("fs"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  os = require("os"),
  path = require("path"),
  OCR_API_KEY = process.env.OCR_API_KEY || "helloworld";
module["exports"] = {
  name: "ocr",
  aliases: ["readtext", "extract", "imgtotext", "scan"],
  description: "Extract text from a quoted image",
  async execute(_0x8d92f0, _0x1792c1) {
    const _0x2ecf70 = _0x1792c1["key"]["remoteJid"],
      _0x2d086e =
        _0x1792c1["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x583ee0 = _0x2d086e?.["quotedMessage"];
    if (!_0x583ee0?.["imageMessage"])
      return await _0x8d92f0["sendMessage"](
        _0x2ecf70,
        { text: "🖼️ Reply to an image with *.ocr* to read text from it." },
        { quoted: _0x1792c1 },
      );
    let _0x4791ba;
    try {
      await _0x8d92f0["sendMessage"](
        _0x2ecf70,
        { text: "🔍 Scanning image for text..." },
        { quoted: _0x1792c1 },
      );
      const _0x2c5e89 = await downloadMediaMessage(
        {
          key: {
            remoteJid: _0x2ecf70,
            id: _0x2d086e["stanzaId"],
            fromMe: ![],
            participant: _0x2d086e["participant"],
          },
          message: _0x583ee0,
        },
        "buffer",
        {},
        { reuploadRequest: _0x8d92f0["updateMediaMessage"] },
      );
      ((_0x4791ba = path["join"](
        os["tmpdir"](),
        "ocr_" + Date["now"]() + ".jpg",
      )),
        fs["writeFileSync"](_0x4791ba, _0x2c5e89));
      const _0x5f117b = new FormData();
      (_0x5f117b["append"]("file", fs["createReadStream"](_0x4791ba)),
        _0x5f117b["append"]("language", "eng"),
        _0x5f117b["append"]("isOverlayRequired", "false"),
        _0x5f117b["append"]("detectOrientation", "true"),
        _0x5f117b["append"]("scale", "true"),
        _0x5f117b["append"]("OCREngine", "2"));
      const _0x84a2d2 = await axios["post"](
          "https://api.ocr.space/parse/image",
          _0x5f117b,
          {
            headers: { ..._0x5f117b["getHeaders"](), apikey: OCR_API_KEY },
            timeout: 0x7530,
          },
        ),
        _0x562c4e = _0x84a2d2["data"];
      if (_0x562c4e?.["IsErroredOnProcessing"])
        return await _0x8d92f0["sendMessage"](
          _0x2ecf70,
          {
            text:
              "❌ OCR error: " +
              (_0x562c4e["ErrorMessage"]?.[0x0] || "Unknown error"),
          },
          { quoted: _0x1792c1 },
        );
      const _0x2c88c6 =
        _0x562c4e?.["ParsedResults"]?.[0x0]?.["ParsedText"]?.["trim"]();
      if (!_0x2c88c6)
        return await _0x8d92f0["sendMessage"](
          _0x2ecf70,
          { text: "🤷 No text found in the image. Try a clearer photo." },
          { quoted: _0x1792c1 },
        );
      await _0x8d92f0["sendMessage"](
        _0x2ecf70,
        { text: _0x2c88c6 },
        { quoted: _0x1792c1 },
      );
    } catch (_0x5603fe) {
      (console["error"]("[OCR ERROR]", _0x5603fe),
        await _0x8d92f0["sendMessage"](
          _0x2ecf70,
          { text: "❌ Failed to read text. Try a clearer, well-lit photo." },
          { quoted: _0x1792c1 },
        ));
    } finally {
      if (_0x4791ba && fs["existsSync"](_0x4791ba))
        try {
          fs["unlinkSync"](_0x4791ba);
        } catch {}
    }
  },
};
