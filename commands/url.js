const axios = require("axios"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  BROWSER_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  IMGBB_KEY = process.env.IMGBB_KEY;
async function uploadToImgBB(_0x44b4d9) {
  if (!IMGBB_KEY) throw new Error("IMGBB_KEY not set");
  const _0x1b903d = new FormData();
  _0x1b903d["append"]("image", _0x44b4d9["toString"]("base64"));
  const { data: _0x1de1cd } = await axios["post"](
    "https://api.imgbb.com/1/upload?key=" + IMGBB_KEY,
    _0x1b903d,
    { headers: _0x1b903d["getHeaders"](), timeout: 0x7530 },
  );
  if (!_0x1de1cd?.["success"] || !_0x1de1cd?.["data"]?.["url"])
    throw new Error(_0x1de1cd?.["error"]?.["message"] || "no url in response");
  return _0x1de1cd["data"]["url"];
}
async function uploadToCatbox(_0x132a73, _0x4098bf) {
  const _0x49d5a1 = new FormData();
  (_0x49d5a1["append"]("reqtype", "fileupload"),
    _0x49d5a1["append"]("fileToUpload", _0x132a73, _0x4098bf));
  const _0x25e022 = await axios["post"](
      "https://catbox.moe/user/api.php",
      _0x49d5a1,
      {
        headers: { ..._0x49d5a1["getHeaders"](), "User-Agent": BROWSER_UA },
        timeout: 0xea60,
      },
    ),
    _0x5dd018 = String(_0x25e022["data"] || "")["trim"]();
  if (!_0x5dd018["startsWith"]("http"))
    throw new Error(_0x5dd018 || "unexpected response");
  return _0x5dd018;
}
async function uploadTo0x0(_0x4d6c7d, _0x5b301b) {
  const _0x5d0a05 = new FormData();
  _0x5d0a05["append"]("file", _0x4d6c7d, _0x5b301b);
  const _0x3a8449 = await axios["post"]("https://0x0.st", _0x5d0a05, {
      headers: { ..._0x5d0a05["getHeaders"](), "User-Agent": BROWSER_UA },
      timeout: 0xea60,
    }),
    _0xc1d843 = String(_0x3a8449["data"] || "")["trim"]();
  if (!_0xc1d843["startsWith"]("http"))
    throw new Error(_0xc1d843 || "unexpected response");
  return _0xc1d843;
}
async function uploadToUguu(_0x2db0ef, _0x25e13a) {
  const _0x17f7d5 = new FormData();
  _0x17f7d5["append"]("files[]", _0x2db0ef, _0x25e13a);
  const _0x450240 = await axios["post"]("https://uguu.se/upload", _0x17f7d5, {
      headers: _0x17f7d5["getHeaders"](),
      timeout: 0xea60,
    }),
    _0x566822 = _0x450240["data"]?.["files"]?.[0x0]?.["url"];
  if (!_0x566822) throw new Error("no url in response");
  return _0x566822;
}
async function uploadToTmpFiles(_0x34519b, _0xdc30e3) {
  const _0x52b488 = new FormData();
  _0x52b488["append"]("file", _0x34519b, _0xdc30e3);
  const _0xa02693 = await axios["post"](
      "https://tmpfiles.org/api/v1/upload",
      _0x52b488,
      { headers: _0x52b488["getHeaders"](), timeout: 0xea60 },
    ),
    _0xd05520 = _0xa02693["data"]?.["data"]?.["url"];
  if (!_0xd05520) throw new Error("no url in response");
  return _0xd05520["replace"]("tmpfiles.org/", "tmpfiles.org/dl/");
}
async function uploadImage(_0x101c54, _0x435a66) {
  const _0xcfb765 = [];
  try {
    return await uploadToImgBB(_0x101c54);
  } catch (_0x3d1fc7) {
    (console["error"]("[URL] imgbb failed:", _0x3d1fc7["message"]),
      _0xcfb765["push"]("imgbb: " + _0x3d1fc7["message"]));
  }
  const _0x502aba = [
    ["catbox", uploadToCatbox],
    ["0x0.st", uploadTo0x0],
    ["uguu", uploadToUguu],
    ["tmpfiles", uploadToTmpFiles],
  ];
  for (const [_0x1d9ad9, _0x4618b8] of _0x502aba) {
    try {
      const _0x3a6b79 = await _0x4618b8(_0x101c54, _0x435a66);
      return (console["log"]("[URL] Succeeded via " + _0x1d9ad9), _0x3a6b79);
    } catch (_0x1c1b77) {
      const _0x1a0f2f = _0x1c1b77["response"]?.["status"]
        ? "HTTP " + _0x1c1b77["response"]["status"]
        : _0x1c1b77["message"];
      (console["error"]("[URL] " + _0x1d9ad9 + " failed:", _0x1a0f2f),
        _0xcfb765["push"](_0x1d9ad9 + ":\x20" + _0x1a0f2f));
    }
  }
  throw new Error(_0xcfb765["join"](" | "));
}
function extractQuotedImage(_0x145f72) {
  const _0x339355 =
      _0x145f72["message"]?.["extendedTextMessage"]?.["contextInfo"],
    _0x2aa0a8 = _0x339355?.["quotedMessage"];
  if (_0x2aa0a8?.["imageMessage"])
    return {
      message: _0x2aa0a8,
      key: {
        remoteJid: _0x145f72["key"]["remoteJid"],
        id: _0x339355["stanzaId"],
        fromMe: ![],
        participant: _0x339355["participant"],
      },
    };
  if (_0x145f72["message"]?.["imageMessage"])
    return { message: _0x145f72["message"], key: _0x145f72["key"] };
  return null;
}
module["exports"] = {
  name: "url",
  aliases: ["imgurl", "uploads"],
  description: "Upload a quoted image and get a direct link",
  async execute(_0x40100f, _0x34c96c) {
    const _0x10c632 = _0x34c96c["key"]["remoteJid"],
      _0x51177e = extractQuotedImage(_0x34c96c);
    if (!_0x51177e)
      return await _0x40100f["sendMessage"](
        _0x10c632,
        { text: "Quote an image with *.url*." },
        { quoted: _0x34c96c },
      );
    try {
      const _0x2e85e8 = await downloadMediaMessage(
        { key: _0x51177e["key"], message: _0x51177e["message"] },
        "buffer",
        {},
        { reuploadRequest: _0x40100f["updateMediaMessage"] },
      );
      if (_0x2e85e8["length"] > 0xa * 0x400 * 0x400)
        return await _0x40100f["sendMessage"](
          _0x10c632,
          { text: "Media is too large (max 10MB)." },
          { quoted: _0x34c96c },
        );
      const _0x767cfc = await uploadImage(_0x2e85e8, "image.jpg");
      await _0x40100f["sendMessage"](
        _0x10c632,
        { text: "Media Link:-\n\n" + _0x767cfc },
        { quoted: _0x34c96c },
      );
    } catch (_0x52f559) {
      (console["error"]("[URL ERROR]", _0x52f559["message"]),
        await _0x40100f["sendMessage"](
          _0x10c632,
          { text: "❌ Upload failed: " + _0x52f559["message"] },
          { quoted: _0x34c96c },
        ));
    }
  },
};
