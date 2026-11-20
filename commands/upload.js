const axios = require("axios"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  BROWSER_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
async function uploadToCatbox(_0x5858bb, _0xce0222) {
  const _0x46f8b3 = new FormData();
  (_0x46f8b3["append"]("reqtype", "fileupload"),
    _0x46f8b3["append"]("fileToUpload", _0x5858bb, _0xce0222));
  const _0x536b86 = await axios["post"](
      "https://catbox.moe/user/api.php",
      _0x46f8b3,
      {
        headers: { ..._0x46f8b3["getHeaders"](), "User-Agent": BROWSER_UA },
        timeout: 0xea60,
      },
    ),
    _0x1626a9 = String(_0x536b86["data"] || "")["trim"]();
  if (!_0x1626a9["startsWith"]("http"))
    throw new Error(_0x1626a9 || "unexpected response");
  return _0x1626a9;
}
async function uploadTo0x0(_0x48e149, _0x354c88) {
  const _0x43faec = new FormData();
  _0x43faec["append"]("file", _0x48e149, _0x354c88);
  const _0x5984fb = await axios["post"]("https://0x0.st", _0x43faec, {
      headers: { ..._0x43faec["getHeaders"](), "User-Agent": BROWSER_UA },
      timeout: 0xea60,
    }),
    _0x1b4fd8 = String(_0x5984fb["data"] || "")["trim"]();
  if (!_0x1b4fd8["startsWith"]("http"))
    throw new Error(_0x1b4fd8 || "unexpected response");
  return _0x1b4fd8;
}
async function uploadToUguu(_0x4c2307, _0x1e53b0) {
  const _0x30122d = new FormData();
  _0x30122d["append"]("files[]", _0x4c2307, _0x1e53b0);
  const _0x2f8899 = await axios["post"]("https://uguu.se/upload", _0x30122d, {
      headers: _0x30122d["getHeaders"](),
      timeout: 0xea60,
    }),
    _0x2d32dd = _0x2f8899["data"]?.["files"]?.[0x0]?.["url"];
  if (!_0x2d32dd) throw new Error("no url in response");
  return _0x2d32dd;
}
async function uploadToTmpFiles(_0x3e57e0, _0x33df94) {
  const _0x106008 = new FormData();
  _0x106008["append"]("file", _0x3e57e0, _0x33df94);
  const _0x33643e = await axios["post"](
      "https://tmpfiles.org/api/v1/upload",
      _0x106008,
      { headers: _0x106008["getHeaders"](), timeout: 0xea60 },
    ),
    _0x1841ee = _0x33643e["data"]?.["data"]?.["url"];
  if (!_0x1841ee) throw new Error("no url in response");
  return _0x1841ee["replace"]("tmpfiles.org/", "tmpfiles.org/dl/");
}
async function uploadMedia(_0x103245, _0x3c83e3) {
  const _0x3b65f5 = [],
    _0x5d78f4 = [
      ["catbox", uploadToCatbox],
      ["0x0.st", uploadTo0x0],
      ["uguu", uploadToUguu],
      ["tmpfiles", uploadToTmpFiles],
    ];
  for (const [_0x5c28da, _0x12cf0e] of _0x5d78f4) {
    try {
      const _0x1a4b47 = await _0x12cf0e(_0x103245, _0x3c83e3);
      return (console["log"]("[UPLOAD] Succeeded via " + _0x5c28da), _0x1a4b47);
    } catch (_0x187857) {
      const _0x1d1594 = _0x187857["response"]?.["status"]
        ? "HTTP " + _0x187857["response"]["status"]
        : _0x187857["message"];
      (console["error"]("[UPLOAD] " + _0x5c28da + " failed:", _0x1d1594),
        _0x3b65f5["push"](_0x5c28da + ":\x20" + _0x1d1594));
    }
  }
  throw new Error(_0x3b65f5["join"](" | "));
}
function extractQuotedMedia(_0x16fc47) {
  const _0x212f0d =
      _0x16fc47["message"]?.["extendedTextMessage"]?.["contextInfo"],
    _0x5b168f = _0x212f0d?.["quotedMessage"],
    _0x27c3e9 = (_0x2773b2) =>
      _0x2773b2?.["imageMessage"]
        ? "imageMessage"
        : _0x2773b2?.["videoMessage"]
          ? "videoMessage"
          : _0x2773b2?.["audioMessage"]
            ? "audioMessage"
            : null;
  if (_0x5b168f && _0x27c3e9(_0x5b168f))
    return {
      message: _0x5b168f,
      key: {
        remoteJid: _0x16fc47["key"]["remoteJid"],
        id: _0x212f0d["stanzaId"],
        fromMe: ![],
        participant: _0x212f0d["participant"],
      },
    };
  if (_0x16fc47["message"] && _0x27c3e9(_0x16fc47["message"]))
    return { message: _0x16fc47["message"], key: _0x16fc47["key"] };
  return null;
}
module["exports"] = {
  name: "upload",
  description: "Upload a quoted image, video, or audio and get a link",
  async execute(_0x4186f7, _0x3cb2f6) {
    const _0x39543b = _0x3cb2f6["key"]["remoteJid"],
      _0x3a431d = extractQuotedMedia(_0x3cb2f6);
    if (!_0x3a431d)
      return await _0x4186f7["sendMessage"](
        _0x39543b,
        { text: "Quote an image, video, or audio message." },
        { quoted: _0x3cb2f6 },
      );
    try {
      const _0x371b52 = await downloadMediaMessage(
        { key: _0x3a431d["key"], message: _0x3a431d["message"] },
        "buffer",
        {},
        { reuploadRequest: _0x4186f7["updateMediaMessage"] },
      );
      if (_0x371b52["length"] > 0xbe * 0x400 * 0x400)
        return await _0x4186f7["sendMessage"](
          _0x39543b,
          { text: "Media is too large (max ~190MB)." },
          { quoted: _0x3cb2f6 },
        );
      const _0x17063b = await uploadMedia(_0x371b52, "file");
      await _0x4186f7["sendMessage"](
        _0x39543b,
        { text: "Media Link:-\n\n" + _0x17063b },
        { quoted: _0x3cb2f6 },
      );
    } catch (_0x2c8030) {
      (console["error"]("[UPLOAD ERROR]", _0x2c8030["message"]),
        await _0x4186f7["sendMessage"](
          _0x39543b,
          { text: "Upload failed: " + _0x2c8030["message"] },
          { quoted: _0x3cb2f6 },
        ));
    }
  },
};
