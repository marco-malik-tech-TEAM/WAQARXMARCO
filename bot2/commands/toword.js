const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    ImageRun,
    AlignmentType,
  } = require("docx"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "toword",
  aliases: ["word", "makedoc", "todocx", "img2word", "text2word"],
  description:
    "Convert a quoted image or text to a Word (.docx) file. Usage: .toword <text>, or reply to an image with .toword",
  async execute(_0x33fef8, _0x4f1b9b, _0x2ab150) {
    const _0x2856c1 = _0x4f1b9b["key"]["remoteJid"],
      _0x10a08d =
        _0x4f1b9b["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x59d810 = _0x10a08d?.["quotedMessage"],
      _0x3d1c15 =
        _0x59d810?.["conversation"] ||
        _0x59d810?.["extendedTextMessage"]?.["text"] ||
        "",
      _0x374402 = _0x2ab150["join"]("\x20")["trim"]() || _0x3d1c15,
      _0x5a9147 = _0x59d810?.["imageMessage"] || null;
    if (!_0x5a9147 && !_0x374402)
      return _0x33fef8["sendMessage"](
        _0x2856c1,
        {
          text: "📝 *Usage:*\n• Reply to an image: *.toword*\n• Convert text: *.toword Your text here*",
        },
        { quoted: _0x4f1b9b },
      );
    try {
      await _0x33fef8["sendMessage"](
        _0x2856c1,
        { text: "⏳ Creating Word document..." },
        { quoted: _0x4f1b9b },
      );
      let _0x420419 = [];
      if (_0x5a9147) {
        const _0x553caa = await downloadMediaMessage(
            {
              message: _0x59d810,
              key: {
                remoteJid: _0x2856c1,
                id: _0x10a08d["stanzaId"],
                participant: _0x10a08d["participant"],
              },
            },
            "buffer",
            {},
          ),
          _0x2ee99c = (_0x5a9147["mimetype"] || "")["includes"]("png")
            ? "png"
            : "jpg";
        _0x420419["push"](
          new Paragraph({
            children: [
              new ImageRun({
                data: _0x553caa,
                transformation: { width: 0x1f4, height: 0x15e },
                type: _0x2ee99c,
              }),
            ],
            alignment: AlignmentType["CENTER"],
          }),
        );
      } else
        for (const _0x485f63 of _0x374402["split"]("\x0a")) {
          _0x420419["push"](
            _0x485f63["trim"]()
              ? new Paragraph({
                  children: [
                    new TextRun({
                      text: _0x485f63["trim"](),
                      size: 0x18,
                      font: "Calibri",
                    }),
                  ],
                  spacing: { after: 0x78 },
                })
              : new Paragraph({}),
          );
        }
      const _0x4d2498 = new Document({
          sections: [{ properties: {}, children: _0x420419 }],
        }),
        _0x5cb0c5 = await Packer["toBuffer"](_0x4d2498);
      await _0x33fef8["sendMessage"](
        _0x2856c1,
        {
          document: _0x5cb0c5,
          mimetype:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          fileName: "document_" + Date["now"]() + ".docx",
          caption: "✅ *Word document created successfully!*",
        },
        { quoted: _0x4f1b9b },
      );
    } catch (_0x29ea70) {
      (console["error"]("[TOWORD ERROR]", _0x29ea70["message"]),
        await _0x33fef8["sendMessage"](
          _0x2856c1,
          { text: "❌ Failed to create Word document. Try again." },
          { quoted: _0x4f1b9b },
        ));
    }
  },
};
