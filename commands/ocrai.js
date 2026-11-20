const axios = require("axios"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  askweb = require("./askweb"),
  OCR_API_KEY = process.env.OCR_API_KEY || "helloworld",
  OCR_LANG = process.env.OCR_LANG || "eng",
  OCR_SYSTEM =
    "You receive text extracted from an image by OCR (it may contain errors and UI clutter; fix obvious ones). " +
    "Say briefly what the content is, then explain the key points clearly. " +
    "If the user asks a question, answer it from the text. " +
    "Reply in English unless the user's question is written in another language. " +
    "Use single asterisks for *bold*, never double, and no headers.";
function getBody(_0x543c4e) {
  const _0x3cae7b = _0x543c4e["message"] || {};
  return (
    _0x3cae7b["conversation"] ||
    _0x3cae7b["extendedTextMessage"]?.["text"] ||
    _0x3cae7b["imageMessage"]?.["caption"] ||
    ""
  );
}
function getArgs(_0x362d25, _0x5dc5b5) {
  const _0x3b5c2d = getBody(_0x362d25)["trim"]()["split"](/\s+/),
    _0x291478 = _0x3b5c2d["findIndex"]((_0xf4f0ec) =>
      _0x5dc5b5["includes"](
        _0xf4f0ec["replace"](/^[^\p{L}\p{N}]+/u, "")["toLowerCase"](),
      ),
    );
  return _0x3b5c2d["slice"](_0x291478 === -0x1 ? 0x1 : _0x291478 + 0x1)["join"](
    "\x20",
  );
}
async function runOCR(_0x349c8d) {
  const _0x471683 = new FormData();
  (_0x471683["append"]("file", _0x349c8d, {
    filename: "image.jpg",
    contentType: "image/jpeg",
  }),
    _0x471683["append"]("language", OCR_LANG),
    _0x471683["append"]("isOverlayRequired", "false"),
    _0x471683["append"]("detectOrientation", "true"),
    _0x471683["append"]("scale", "true"),
    _0x471683["append"]("OCREngine", "2"));
  const _0x1faf01 = await axios["post"](
    "https://api.ocr.space/parse/image",
    _0x471683,
    {
      headers: { ..._0x471683["getHeaders"](), apikey: OCR_API_KEY },
      timeout: 0x7530,
    },
  );
  if (_0x1faf01["data"]?.["IsErroredOnProcessing"])
    throw new Error(_0x1faf01["data"]["ErrorMessage"]?.[0x0] || "OCR failed");
  return (
    _0x1faf01["data"]?.["ParsedResults"]?.[0x0]?.["ParsedText"]?.["trim"]() ||
    ""
  );
}
module["exports"] = {
  name: "ocrai",
  aliases: ["explaintext", "readexplain", "aiocr"],
  description: "Extract text from an image and explain it with AI",
  async execute(_0x4351b1, _0x41f219) {
    const _0x76661a = _0x41f219["key"]["remoteJid"],
      _0x1f8174 =
        _0x41f219["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x49cb35 = _0x1f8174?.["quotedMessage"];
    let _0x180198 = null;
    if (_0x41f219["message"]?.["imageMessage"]) _0x180198 = _0x41f219;
    else
      _0x49cb35?.["imageMessage"] &&
        (_0x180198 = {
          key: {
            remoteJid: _0x76661a,
            id: _0x1f8174["stanzaId"],
            fromMe: ![],
            participant: _0x1f8174["participant"],
          },
          message: _0x49cb35,
        });
    if (!_0x180198)
      return await _0x4351b1["sendMessage"](
        _0x76661a,
        {
          text: "🖼️ Reply to an image with *.ocrai* (optionally add a question, e.g. *.ocrai what is the total?*).",
        },
        { quoted: _0x41f219 },
      );
    const _0x511cdc =
      getArgs(_0x41f219, ["ocrai", "explaintext", "readexplain", "aiocr"]) ||
      "Explain what this text says and its key points.";
    try {
      await _0x4351b1["sendMessage"](
        _0x76661a,
        { text: "🔍 Reading and analysing image..." },
        { quoted: _0x41f219 },
      );
      const _0x27201b = await downloadMediaMessage(
          _0x180198,
          "buffer",
          {},
          { reuploadRequest: _0x4351b1["updateMediaMessage"] },
        ),
        _0x31076c = await runOCR(_0x27201b);
      if (!_0x31076c)
        return await _0x4351b1["sendMessage"](
          _0x76661a,
          { text: "🤷 No text found in the image. Try a clearer photo." },
          { quoted: _0x41f219 },
        );
      const { text: _0x5abb8b } = await askweb["answer"](_0x511cdc, {
          context: _0x31076c,
          search: ![],
          system: OCR_SYSTEM,
        }),
        _0x63db4c =
          _0x31076c["length"] > 0x4b0
            ? _0x31076c["slice"](0x0, 0x4b0) + "…"
            : _0x31076c;
      await _0x4351b1["sendMessage"](
        _0x76661a,
        {
          text:
            "📄 *Extracted text*\n" +
            _0x63db4c +
            "\n\n🧠 *Explanation*\n" +
            (_0x5abb8b || "No explanation generated."),
        },
        { quoted: _0x41f219 },
      );
    } catch (_0x46120d) {
      (console["error"]("[OCRAI ERROR]", _0x46120d),
        await _0x4351b1["sendMessage"](
          _0x76661a,
          {
            text:
              "❌\x20" +
              (_0x46120d["message"]?.["includes"]("not set")
                ? _0x46120d["message"]
                : "Failed to process the image. Try a clearer, well-lit photo."),
          },
          { quoted: _0x41f219 },
        ));
    }
  },
};
