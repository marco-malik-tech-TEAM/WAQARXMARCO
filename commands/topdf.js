const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  PDFDocument = require("pdfkit"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "topdf",
  aliases: ["pdf", "makepdf", "img2pdf", "text2pdf"],
  description:
    "Convert a quoted image or text to a PDF file. Usage: .topdf <text>, or reply to an image with .topdf",
  async execute(_0x1a3eeb, _0x934901, _0x1895a4) {
    const _0x4959e5 = _0x934901["key"]["remoteJid"],
      _0xc37f9f =
        _0x934901["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x18baf6 = _0xc37f9f?.["quotedMessage"],
      _0x3eeea4 =
        _0x18baf6?.["conversation"] ||
        _0x18baf6?.["extendedTextMessage"]?.["text"] ||
        "",
      _0x5cc8db = _0x1895a4["join"]("\x20")["trim"]() || _0x3eeea4,
      _0x2cd973 = _0x18baf6?.["imageMessage"] || null;
    if (!_0x2cd973 && !_0x5cc8db)
      return _0x1a3eeb["sendMessage"](
        _0x4959e5,
        {
          text: "📄 *Usage:*\n• Reply to an image: *.topdf*\n• Convert text: *.topdf Your text here*",
        },
        { quoted: _0x934901 },
      );
    const _0x1b4707 = path["join"](
      os["tmpdir"](),
      "pdf_" + Date["now"]() + ".pdf",
    );
    try {
      await _0x1a3eeb["sendMessage"](
        _0x4959e5,
        { text: "⏳ Creating PDF..." },
        { quoted: _0x934901 },
      );
      const _0x5a53fc = new PDFDocument({ margin: 0x28, size: "A4" }),
        _0x282e6d = fs["createWriteStream"](_0x1b4707);
      _0x5a53fc["pipe"](_0x282e6d);
      if (_0x2cd973) {
        const _0x4db7b4 = await downloadMediaMessage(
            {
              message: _0x18baf6,
              key: {
                remoteJid: _0x4959e5,
                id: _0xc37f9f["stanzaId"],
                participant: _0xc37f9f["participant"],
              },
            },
            "buffer",
            {},
          ),
          _0x15e309 = _0x5a53fc["page"]["width"] - 0x50,
          _0x264b6b = _0x5a53fc["page"]["height"] - 0x50;
        _0x5a53fc["image"](_0x4db7b4, 0x28, 0x28, {
          fit: [_0x15e309, _0x264b6b],
          align: "center",
          valign: "center",
        });
      } else
        _0x5a53fc["font"]("Helvetica")
          ["fontSize"](0xc)
          ["text"](_0x5cc8db, { align: "left", lineGap: 0x4 });
      (_0x5a53fc["end"](),
        await new Promise((_0x5279cd, _0x7a5f08) => {
          (_0x282e6d["on"]("finish", _0x5279cd),
            _0x282e6d["on"]("error", _0x7a5f08));
        }),
        await _0x1a3eeb["sendMessage"](
          _0x4959e5,
          {
            document: fs["readFileSync"](_0x1b4707),
            mimetype: "application/pdf",
            fileName: "document_" + Date["now"]() + ".pdf",
            caption: "✅ *PDF created successfully!*",
          },
          { quoted: _0x934901 },
        ));
    } catch (_0x581a3e) {
      (console["error"]("[TOPDF ERROR]", _0x581a3e["message"]),
        await _0x1a3eeb["sendMessage"](
          _0x4959e5,
          { text: "❌ Failed to create PDF. Try again." },
          { quoted: _0x934901 },
        ));
    } finally {
      if (fs["existsSync"](_0x1b4707))
        try {
          fs["unlinkSync"](_0x1b4707);
        } catch (_0x29837d) {}
    }
  },
};
