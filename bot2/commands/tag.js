module["exports"] = {
  name: "tag",
  description: "Mention everyone by replying to a text message.",
  async execute(_0x5d4a03, _0x57d03e, _0x48f341, _0x2a7da6) {
    const _0x132b1e = _0x57d03e["key"]["remoteJid"];
    if (!_0x132b1e["endsWith"]("@g.us"))
      return _0x5d4a03["sendMessage"](
        _0x132b1e,
        { text: "❌ This command only works in groups." },
        { quoted: _0x57d03e },
      );
    if (!_0x2a7da6)
      return _0x5d4a03["sendMessage"](
        _0x132b1e,
        { text: "❌ Only the bot owner can use this command." },
        { quoted: _0x57d03e },
      );
    const _0x360e23 =
        _0x57d03e["message"]?.["extendedTextMessage"]?.["contextInfo"]?.[
          "quotedMessage"
        ],
      _0x4d2a26 =
        _0x360e23?.["conversation"] ||
        _0x360e23?.["extendedTextMessage"]?.["text"] ||
        _0x360e23?.["imageMessage"]?.["caption"] ||
        _0x360e23?.["videoMessage"]?.["caption"] ||
        _0x360e23?.["documentMessage"]?.["caption"];
    if (!_0x4d2a26)
      return _0x5d4a03["sendMessage"](
        _0x132b1e,
        { text: "❌ Reply to a text message." },
        { quoted: _0x57d03e },
      );
    try {
      const _0x3df0f5 = await _0x5d4a03["groupMetadata"](_0x132b1e),
        _0x4e2e86 = _0x3df0f5["participants"]["map"](
          (_0x20d4f6) => _0x20d4f6["id"],
        );
      await _0x5d4a03["sendMessage"](
        _0x132b1e,
        { text: _0x4d2a26, mentions: _0x4e2e86 },
        { quoted: _0x57d03e },
      );
    } catch (_0x349c15) {
      (console["error"](_0x349c15),
        await _0x5d4a03["sendMessage"](
          _0x132b1e,
          { text: "❌ Failed to tag everyone.\n\n" + _0x349c15["message"] },
          { quoted: _0x57d03e },
        ));
    }
  },
};
