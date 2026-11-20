const axios = require("axios"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
async function uploadToCatbox(_0x9b3959, _0x2edfe8) {
  const _0xc4d883 = new FormData();
  (_0xc4d883["append"]("reqtype", "fileupload"),
    _0xc4d883["append"]("fileToUpload", _0x9b3959, { filename: _0x2edfe8 }));
  const _0x192413 = await axios["post"](
    "https://catbox.moe/user/api.php",
    _0xc4d883,
    { headers: _0xc4d883["getHeaders"]() },
  );
  return _0x192413["data"];
}
module["exports"] = {
  name: "vocalremover",
  aliases: ["removevocal", "aivocal", "extractvocal"],
  description: "Extract vocals from quoted audio or video",
  async execute(_0x50ce2b, _0x463f54) {
    const _0x2c6313 = _0x463f54["key"]["remoteJid"],
      _0x2c8e84 =
        _0x2c6313["endsWith"]("@lid") && _0x463f54["key"]["remoteJidAlt"]
          ? _0x463f54["key"]["remoteJidAlt"]
          : _0x2c6313,
      _0x11247d =
        _0x463f54["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x52964a = _0x11247d?.["quotedMessage"],
      _0x28d255 = _0x52964a?.["audioMessage"],
      _0x50b2e1 = _0x52964a?.["videoMessage"];
    if (!_0x28d255 && !_0x50b2e1)
      return _0x50ce2b["sendMessage"](
        _0x2c8e84,
        { text: "📌 Reply to an audio or video message to extract vocals." },
        { quoted: _0x463f54 },
      );
    const _0x36ddc8 = await _0x50ce2b["sendMessage"](
      _0x2c8e84,
      { text: "🎵 *Extracting vocals...*" },
      { quoted: _0x463f54 },
    );
    try {
      const _0x462c6e = await downloadMediaMessage(
          {
            key: {
              remoteJid: _0x2c8e84,
              id: _0x11247d["stanzaId"],
              fromMe: ![],
              participant: _0x11247d["participant"],
            },
            message: _0x52964a,
          },
          "buffer",
          {},
          { reuploadRequest: _0x50ce2b["updateMediaMessage"] },
        ),
        _0x202398 = _0x28d255 ? "mp3" : "mp4",
        _0x4e5d11 = await uploadToCatbox(_0x462c6e, "media." + _0x202398),
        { data: _0x43f92b } = await axios["get"](
          API + "/ai/vocalremover?url=" + encodeURIComponent(_0x4e5d11),
          { timeout: 0x2bf20 },
        );
      if (!_0x43f92b?.["status"] || !_0x43f92b?.["result"]?.["vocal"])
        throw new Error("No vocal track found.");
      (await _0x50ce2b["sendMessage"](
        _0x2c8e84,
        {
          audio: { url: _0x43f92b["result"]["vocal"] },
          mimetype: "audio/mp4",
          ptt: ![],
        },
        { quoted: _0x463f54 },
      ),
        await _0x50ce2b["sendMessage"](_0x2c8e84, { delete: _0x36ddc8["key"] })[
          "catch"
        ](() => {}));
    } catch (_0x1663fe) {
      (console["error"]("[VOCALREMOVER ERROR]", _0x1663fe),
        await _0x50ce2b["sendMessage"](
          _0x2c8e84,
          {
            text: "❌ Failed to extract vocals: " + _0x1663fe["message"],
            edit: _0x36ddc8["key"],
          },
          { quoted: _0x463f54 },
        ));
    }
  },
};
