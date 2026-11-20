const axios = require("axios"),
  FormData = require("form-data"),
  mime = require("mime-types"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
async function uploadToUguu(_0x3f8074, _0x126aa8) {
  const _0x400552 = mime["lookup"](_0x126aa8) || "image/jpeg",
    _0xc219d3 = new FormData();
  _0xc219d3["append"]("files[]", _0x3f8074, {
    filename: _0x126aa8,
    contentType: _0x400552,
  });
  const _0x574b66 = await axios["post"](
    "https://uguu.se/upload.php",
    _0xc219d3,
    {
      headers: {
        ..._0xc219d3["getHeaders"](),
        origin: "https://uguu.se",
        referer: "https://uguu.se/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    },
  );
  if (
    _0x574b66["data"]?.["success"] &&
    _0x574b66["data"]?.["files"]?.[0x0]?.["url"]
  )
    return _0x574b66["data"]["files"][0x0]["url"];
  throw new Error("Media upload failed");
}
module["exports"] = {
  name: "vision",
  aliases: ["imgai", "analyze", "geminivision"],
  description: "Analyze an image with Vision AI (quote an image)",
  async execute(_0x5b47fa, _0x3f834e, _0x45724a) {
    const _0x5ead8f = _0x3f834e["key"]["remoteJid"],
      _0x5c1449 =
        _0x5ead8f["endsWith"]("@lid") && _0x3f834e["key"]["remoteJidAlt"]
          ? _0x3f834e["key"]["remoteJidAlt"]
          : _0x5ead8f,
      _0x7b7f9 = _0x3f834e["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x22aaab = _0x7b7f9?.["quotedMessage"],
      _0x4f3720 = _0x45724a["join"]("\x20")["trim"]();
    if (!_0x22aaab?.["imageMessage"])
      return await _0x5b47fa["sendMessage"](
        _0x5c1449,
        {
          text: "📌 Reply to an image with a question.\nExample: *.vision what is this?*",
        },
        { quoted: _0x3f834e },
      );
    if (!_0x4f3720)
      return await _0x5b47fa["sendMessage"](
        _0x5c1449,
        {
          text: "❌ Provide a question about the image!\nExample: *.vision what is in this image?*",
        },
        { quoted: _0x3f834e },
      );
    const _0x59de41 = await _0x5b47fa["sendMessage"](
      _0x5c1449,
      { text: "👁️ *Analyzing your image...*" },
      { quoted: _0x3f834e },
    );
    try {
      const _0x4d6417 = await downloadMediaMessage(
          {
            key: {
              remoteJid: _0x5c1449,
              id: _0x7b7f9["stanzaId"],
              fromMe: ![],
              participant: _0x7b7f9["participant"],
            },
            message: _0x22aaab,
          },
          "buffer",
          {},
          { reuploadRequest: _0x5b47fa["updateMediaMessage"] },
        ),
        _0x37fdb3 = await uploadToUguu(_0x4d6417, "image.jpg"),
        _0x51e00a = await axios["get"](
          API +
            "/ai/vision?image=" +
            encodeURIComponent(_0x37fdb3) +
            "&q=" +
            encodeURIComponent(_0x4f3720),
          {
            timeout: 0x1d4c0,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "application/json, text/plain, */*",
            },
          },
        ),
        _0x475304 = _0x51e00a["data"];
      if (!_0x475304?.["status"] || !_0x475304?.["result"])
        return await _0x5b47fa["sendMessage"](
          _0x5c1449,
          {
            text: "❌ No response from Vision AI. Try again.",
            edit: _0x59de41["key"],
          },
          { quoted: _0x3f834e },
        );
      const _0x1d3563 =
        typeof _0x475304["result"] === "string"
          ? _0x475304["result"]
          : _0x475304["result"]["response"] ||
            _0x475304["result"]["text"] ||
            JSON["stringify"](_0x475304["result"]);
      await _0x5b47fa["sendMessage"](
        _0x5c1449,
        {
          text: "👁️ *Vision Analysis*\n\n" + _0x1d3563,
          edit: _0x59de41["key"],
        },
        { quoted: _0x3f834e },
      );
    } catch (_0x398f47) {
      (console["error"]("[VISION ERROR]", _0x398f47),
        await _0x5b47fa["sendMessage"](
          _0x5c1449,
          {
            text: "❌ Failed to analyze image: " + _0x398f47["message"],
            edit: _0x59de41["key"],
          },
          { quoted: _0x3f834e },
        ));
    }
  },
};
