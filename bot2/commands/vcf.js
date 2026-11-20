module["exports"] = {
  name: "vcf",
  description: "Exports group members as a .vcf contact file.",
  async execute(_0x77ef2d, _0x3901c9) {
    const _0x563214 = _0x3901c9["key"]["remoteJid"];
    if (!_0x563214["endsWith"]("@g.us"))
      return _0x77ef2d["sendMessage"](
        _0x563214,
        { text: "❌ This command only works in groups." },
        { quoted: _0x3901c9 },
      );
    const _0x791dd8 = await _0x77ef2d["groupMetadata"](_0x563214),
      _0x1d1a0b = _0x791dd8["participants"]["map"]((_0x29ae39, _0x35b5b9) => {
        const _0x2f40c9 = (_0x29ae39["phoneNumber"] || _0x29ae39["id"])[
          "split"
        ]("@")[0x0];
        return (
          "BEGIN:VCARD\nVERSION:3.0\nFN:Contact " +
          (_0x35b5b9 + 0x1) +
          "\nTEL;TYPE=CELL:+" +
          _0x2f40c9 +
          "\nEND:VCARD"
        );
      }),
      _0x2d81f0 = _0x1d1a0b["join"]("\x0a");
    await _0x77ef2d["sendMessage"](
      _0x563214,
      {
        document: Buffer["from"](_0x2d81f0, "utf8"),
        mimetype: "text/vcard",
        fileName: _0x791dd8["subject"]["replace"](/[^\w\s-]/g, "") + ".vcf",
        caption:
          "📇 " + _0x791dd8["participants"]["length"] + " contacts exported.",
      },
      { quoted: _0x3901c9 },
    );
  },
};
