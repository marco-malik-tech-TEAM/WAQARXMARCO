const {
    downloadMediaMessage,
    jidNormalizedUser,
  } = require("@whiskeysockets/baileys"),
  { isOwner } = require("../utils/isOwner");
function unwrapViewOnce(_0x492826) {
  if (!_0x492826) return null;
  let _0x48ef88 = _0x492826;
  if (_0x48ef88["ephemeralMessage"]?.["message"])
    _0x48ef88 = _0x48ef88["ephemeralMessage"]["message"];
  if (_0x48ef88["viewOnceMessage"]?.["message"])
    return _0x48ef88["viewOnceMessage"]["message"];
  if (_0x48ef88["viewOnceMessageV2"]?.["message"])
    return _0x48ef88["viewOnceMessageV2"]["message"];
  if (_0x48ef88["viewOnceMessageV2Extension"]?.["message"])
    return _0x48ef88["viewOnceMessageV2Extension"]["message"];
  return _0x48ef88;
}
function getQuotedViewOnce(_0x572522) {
  const _0x28ddb6 =
      _0x572522["message"]?.["extendedTextMessage"]?.["contextInfo"],
    _0x467229 = _0x28ddb6?.["quotedMessage"];
  if (!_0x467229) return null;
  const _0x383dbf = unwrapViewOnce(_0x467229);
  if (!_0x383dbf) return null;
  if (_0x383dbf["imageMessage"])
    return { type: "image", message: _0x383dbf["imageMessage"] };
  if (_0x383dbf["videoMessage"])
    return { type: "video", message: _0x383dbf["videoMessage"] };
  return null;
}
module["exports"] = {
  name: "vv2",
  aliases: ["mmh", "uhm"],
  noprefix: [
    "😂",
    "😍",
    "🌚",
    "🌝",
    "😊",
    "😉",
    "🙄",
    "😅",
    "🫠",
    "🙂",
    "🥰",
    "😘",
    "🤩",
    "😙",
    "🤢",
    "🤔",
    "🫣",
  ],
  description:
    "Reveal a quoted view-once message and DM it to the owner (owner-only)",
  async execute(_0x12b756, _0x4b4f81) {
    if (!isOwner(_0x4b4f81)) return;
    const _0x4d97a5 =
      _0x4b4f81["message"]?.["extendedTextMessage"]?.["contextInfo"];
    if (!_0x4d97a5?.["quotedMessage"]) return;
    const _0x1dee5f = getQuotedViewOnce(_0x4b4f81),
      _0x3ee5ca = _0x12b756["user"]?.["id"]
        ? jidNormalizedUser(_0x12b756["user"]["id"])
        : null;
    if (!_0x3ee5ca) {
      await _0x12b756["sendMessage"](
        _0x4b4f81["key"]["remoteJid"],
        { text: "❌ Bot session not ready — try again shortly." },
        { quoted: _0x4b4f81 },
      );
      return;
    }
    if (!_0x1dee5f) {
      await _0x12b756["sendMessage"](_0x3ee5ca, {
        text: "Could not find the view-once message.",
      });
      return;
    }
    try {
      const _0x3fdf02 = await downloadMediaMessage(
          {
            message: { [_0x1dee5f["type"] + "Message"]: _0x1dee5f["message"] },
          },
          "buffer",
          {},
        ),
        _0xb81dd6 = _0x1dee5f["message"]["caption"]
          ? "Retrieved by MARCO X WAQAR MD BOT!\n" + _0x1dee5f["message"]["caption"]
          : "Retrieved by MARCO X WAQAR MD BOT!";
      _0x1dee5f["type"] === "image"
        ? await _0x12b756["sendMessage"](
            _0x3ee5ca,
            { image: _0x3fdf02, caption: _0xb81dd6 },
            { quoted: _0x4b4f81 },
          )
        : await _0x12b756["sendMessage"](
            _0x3ee5ca,
            { video: _0x3fdf02, caption: _0xb81dd6 },
            { quoted: _0x4b4f81 },
          );
    } catch (_0x4a9d45) {
      await _0x12b756["sendMessage"](_0x3ee5ca, {
        text: "❌ Failed to retrieve view-once media: " + _0x4a9d45["message"],
      });
    }
  },
};
