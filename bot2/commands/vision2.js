const axios = require("axios"),
  FormData = require("form-data"),
  mime = require("mime-types"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { KEITH_BASE } = require("../config/apis");
async function uploadToUguu(_0x272c76, _0x59aa1a) {
  const _0x3ed031 = mime["lookup"](_0x59aa1a) || "image/jpeg",
    _0xb3b453 = new FormData();
  _0xb3b453["append"]("files[]", _0x272c76, {
    filename: _0x59aa1a,
    contentType: _0x3ed031,
  });
  const _0xf6bb4a = await axios["post"](
    "https://uguu.se/upload.php",
    _0xb3b453,
    {
      headers: {
        ..._0xb3b453["getHeaders"](),
        origin: "https://uguu.se",
        referer: "https://uguu.se/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    },
  );
  if (
    _0xf6bb4a["data"]?.["success"] &&
    _0xf6bb4a["data"]?.["files"]?.[0x0]?.["url"]
  )
    return _0xf6bb4a["data"]["files"][0x0]["url"];
  throw new Error("Media upload failed");
}
module["exports"] = {
  name: "vision2",
  aliases: ["v2", "analyze2", "imgai2"],
  description: "Analyze an image with AI (quote an image)",
  async execute(_0x117b0f, _0x4173ad, _0x4c7626) {
    const _0x3d2ddb = _0x4173ad["key"]["remoteJid"],
      _0x1a95bb =
        _0x3d2ddb["endsWith"]("@lid") && _0x4173ad["key"]["remoteJidAlt"]
          ? _0x4173ad["key"]["remoteJidAlt"]
          : _0x3d2ddb,
      _0x3ad8b7 =
        _0x4173ad["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x2f663f = _0x3ad8b7?.["quotedMessage"],
      _0x45adb2 = _0x4c7626["join"]("\x20")["trim"]();
    if (!_0x2f663f?.["imageMessage"])
      return await _0x117b0f["sendMessage"](
        _0x1a95bb,
        { text: "📌 Reply to an image message to analyze it." },
        { quoted: _0x4173ad },
      );
    if (!_0x45adb2)
      return await _0x117b0f["sendMessage"](
        _0x1a95bb,
        {
          text: "❌ Provide a question/instruction!\nExample: *.vision2 what is in this image?*",
        },
        { quoted: _0x4173ad },
      );
    const _0x1749d2 = await _0x117b0f["sendMessage"](
      _0x1a95bb,
      { text: "🤖 *Analyzing your image...*" },
      { quoted: _0x4173ad },
    );
    try {
      const _0x5ba470 = await downloadMediaMessage(
          {
            key: {
              remoteJid: _0x1a95bb,
              id: _0x3ad8b7["stanzaId"],
              fromMe: ![],
              participant: _0x3ad8b7["participant"],
            },
            message: _0x2f663f,
          },
          "buffer",
          {},
          { reuploadRequest: _0x117b0f["updateMediaMessage"] },
        ),
        _0x3a1ec6 = await uploadToUguu(_0x5ba470, "image.jpg"),
        _0x5f0e1a = await axios["get"](
          KEITH_BASE +
            "/ai/vision?image=" +
            encodeURIComponent(_0x3a1ec6) +
            "&q=" +
            encodeURIComponent(_0x45adb2),
          {
            timeout: 0x1d4c0,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "application/json, text/plain, */*",
            },
          },
        ),
        _0xc2aed4 = _0x5f0e1a["data"];
      if (!_0xc2aed4?.["status"] || !_0xc2aed4?.["result"])
        return await _0x117b0f["sendMessage"](
          _0x1a95bb,
          {
            text: "❌ No response from Vision AI. Try again.",
            edit: _0x1749d2["key"],
          },
          { quoted: _0x4173ad },
        );
      const _0x372058 =
        typeof _0xc2aed4["result"] === "string"
          ? _0xc2aed4["result"]
          : _0xc2aed4["result"]["response"] ||
            _0xc2aed4["result"]["text"] ||
            JSON["stringify"](_0xc2aed4["result"]);
      await _0x117b0f["sendMessage"](
        _0x1a95bb,
        {
          text: "👁️ *Vision Analysis*\n\n" + _0x372058,
          edit: _0x1749d2["key"],
        },
        { quoted: _0x4173ad },
      );
    } catch (_0x44831c) {
      (console["error"]("[VISION2 ERROR]", _0x44831c),
        await _0x117b0f["sendMessage"](
          _0x1a95bb,
          {
            text: "❌ Failed to analyze image: " + _0x44831c["message"],
            edit: _0x1749d2["key"],
          },
          { quoted: _0x4173ad },
        ));
    }
  },
};
