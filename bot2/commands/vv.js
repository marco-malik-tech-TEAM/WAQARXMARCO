const { downloadMediaMessage } = require("@whiskeysockets/baileys");
function unwrapViewOnce(_0x403dde) {
  if (!_0x403dde) return null;
  let _0x22a84e = _0x403dde;
  if (_0x22a84e["ephemeralMessage"]?.["message"])
    _0x22a84e = _0x22a84e["ephemeralMessage"]["message"];
  if (_0x22a84e["viewOnceMessage"]?.["message"])
    return _0x22a84e["viewOnceMessage"]["message"];
  if (_0x22a84e["viewOnceMessageV2"]?.["message"])
    return _0x22a84e["viewOnceMessageV2"]["message"];
  if (_0x22a84e["viewOnceMessageV2Extension"]?.["message"])
    return _0x22a84e["viewOnceMessageV2Extension"]["message"];
  return _0x22a84e;
}
function getQuotedViewOnce(_0x4d78fe) {
  const _0x35b922 =
      _0x4d78fe["message"]?.["extendedTextMessage"]?.["contextInfo"],
    _0x5dd011 = _0x35b922?.["quotedMessage"];
  if (!_0x5dd011) return null;
  const _0x4d3574 = unwrapViewOnce(_0x5dd011);
  if (!_0x4d3574) return null;
  if (_0x4d3574["imageMessage"])
    return { type: "image", message: _0x4d3574["imageMessage"] };
  if (_0x4d3574["videoMessage"])
    return { type: "video", message: _0x4d3574["videoMessage"] };
  if (_0x4d3574["audioMessage"])
    return { type: "audio", message: _0x4d3574["audioMessage"] };
  return null;
}
module["exports"] = {
  name: "vv",
  description:
    "Retrieves a view-once photo/video from a quoted message. Reply to it with .vv",
  async execute(_0x552e10, _0x4b5adf) {
    const _0xdef2f5 = _0x4b5adf["key"]["remoteJid"],
      _0x56a493 =
        _0x4b5adf["message"]?.["extendedTextMessage"]?.["contextInfo"];
    if (!_0x56a493?.["quotedMessage"]) {
      await _0x552e10["sendMessage"](
        _0xdef2f5,
        { text: "❌ Reply to a view-once photo or video with .vv" },
        { quoted: _0x4b5adf },
      );
      return;
    }
    const _0x5ed7bb = getQuotedViewOnce(_0x4b5adf);
    if (!_0x5ed7bb) {
      const _0x14d56a = require("fs"),
        _0x1b2cb9 = require("path"),
        _0x468f34 = _0x1b2cb9["join"](__dirname, "../vv_debug.json");
      (_0x14d56a["writeFileSync"](
        _0x468f34,
        JSON["stringify"](
          { contextInfo: _0x56a493, quotedMessage: _0x56a493["quotedMessage"] },
          null,
          0x2,
        ),
      ),
        await _0x552e10["sendMessage"](
          _0xdef2f5,
          { text: "⚠️ Please reply to a View Once message." },
          { quoted: _0x4b5adf },
        ));
      return;
    }
    try {
      const _0x40bd57 = await downloadMediaMessage(
          {
            message: { [_0x5ed7bb["type"] + "Message"]: _0x5ed7bb["message"] },
          },
          "buffer",
          {},
        ),
        _0x1424bc = _0x5ed7bb["message"]["caption"] || "";
      if (_0x5ed7bb["type"] === "image")
        await _0x552e10["sendMessage"](
          _0xdef2f5,
          { image: _0x40bd57, caption: _0x1424bc },
          { quoted: _0x4b5adf },
        );
      else
        _0x5ed7bb["type"] === "video"
          ? await _0x552e10["sendMessage"](
              _0xdef2f5,
              { video: _0x40bd57, caption: _0x1424bc },
              { quoted: _0x4b5adf },
            )
          : await _0x552e10["sendMessage"](
              _0xdef2f5,
              {
                audio: _0x40bd57,
                mimetype:
                  _0x5ed7bb["message"]["mimetype"] || "audio/ogg; codecs=opus",
                ptt: _0x5ed7bb["message"]["ptt"] ?? !![],
              },
              { quoted: _0x4b5adf },
            );
    } catch (_0xc7967b) {
      await _0x552e10["sendMessage"](
        _0xdef2f5,
        {
          text:
            "❌ Failed to retrieve view-once media: " + _0xc7967b["message"],
        },
        { quoted: _0x4b5adf },
      );
    }
  },
};
