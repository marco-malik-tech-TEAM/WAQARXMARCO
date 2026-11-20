module["exports"] = {
  name: "user",
  description: "Shows your WhatsApp number, name, and profile picture.",
  async execute(_0x141e72, _0x38c9bf, _0x2b9e04) {
    const _0x5987df = _0x38c9bf["key"]["remoteJid"],
      _0x108ee4 =
        _0x38c9bf["key"]["participant"] || _0x38c9bf["key"]["remoteJid"],
      _0x148475 = _0x108ee4["split"]("@")[0x0]["split"](":")[0x0],
      _0x4cf776 = _0x108ee4["endsWith"]("@lid"),
      _0x2efc6c = _0x38c9bf["pushName"] || "Unknown",
      _0x33733d = _0x4cf776
        ? "👤 *Your Info*\n\n🆔 ID: " +
          _0x148475 +
          "\n📛 Name: " +
          _0x2efc6c +
          "\n\n(Your real number is hidden by WhatsApp's privacy settings in this chat.)"
        : "👤 *Your Info*\n\n📱 Number: " +
          _0x148475 +
          "\n📛 Name: " +
          _0x2efc6c;
    try {
      const _0x3a5a68 = await _0x141e72["profilePictureUrl"](
        _0x108ee4,
        "image",
      );
      await _0x141e72["sendMessage"](
        _0x5987df,
        { image: { url: _0x3a5a68 }, caption: _0x33733d },
        { quoted: _0x38c9bf },
      );
    } catch (_0x3b0f70) {
      await _0x141e72["sendMessage"](
        _0x5987df,
        { text: _0x33733d + "\n\n(No profile picture available.)" },
        { quoted: _0x38c9bf },
      );
    }
  },
};
