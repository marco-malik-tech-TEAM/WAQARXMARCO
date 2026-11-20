const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  XLSX = require("xlsx");
module["exports"] = {
  name: "toexcel",
  aliases: ["excel", "makeexcel", "toxlsx", "text2excel"],
  description:
    "Convert comma-separated text to an Excel spreadsheet. Usage: .toexcel Name,Age,City\\nJohn,25,NY",
  async execute(_0x19a9d8, _0x32cc0b, _0x2a5038) {
    const _0x1fafa0 = _0x32cc0b["key"]["remoteJid"],
      _0x589e5c =
        _0x32cc0b["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x954972 = _0x589e5c?.["quotedMessage"],
      _0x1e2b93 =
        _0x954972?.["conversation"] ||
        _0x954972?.["extendedTextMessage"]?.["text"] ||
        "",
      _0x561031 = _0x2a5038["join"]("\x20")["trim"]() || _0x1e2b93;
    if (!_0x561031?.["trim"]())
      return _0x19a9d8["sendMessage"](
        _0x1fafa0,
        {
          text: "📊 *Usage:*\n*.toexcel Name,Age,City\\nJohn,25,NY\\nJane,30,LA*\n\n_Columns = commas, Rows = new lines_\n_Or reply to a text message with CSV data_",
        },
        { quoted: _0x32cc0b },
      );
    const _0xcf7be = path["join"](
      os["tmpdir"](),
      "excel_" + Date["now"]() + ".xlsx",
    );
    try {
      await _0x19a9d8["sendMessage"](
        _0x1fafa0,
        { text: "⏳ Creating Excel file..." },
        { quoted: _0x32cc0b },
      );
      const _0x3dac68 = _0x561031["trim"]()
          ["split"](/\n|\\n/)
          ["filter"]((_0x4d8f9a) => _0x4d8f9a["trim"]()),
        _0x4f5e48 = _0x3dac68["map"]((_0x3b4e42) =>
          _0x3b4e42["split"](",")["map"]((_0x20819f) => {
            const _0x537e58 = _0x20819f["trim"](),
              _0x6bff11 = Number(_0x537e58);
            return !isNaN(_0x6bff11) && _0x537e58 !== ""
              ? _0x6bff11
              : _0x537e58;
          }),
        ),
        _0x3dea06 = XLSX["utils"]["aoa_to_sheet"](_0x4f5e48),
        _0x2aef2a = XLSX["utils"]["book_new"](),
        _0x3456ca = _0x4f5e48["reduce"]((_0x1b155b, _0x2ac049) => {
          return (
            _0x2ac049["forEach"]((_0x10d98d, _0x1ec2d5) => {
              _0x1b155b[_0x1ec2d5] = Math["max"](
                _0x1b155b[_0x1ec2d5] || 0xa,
                String(_0x10d98d)["length"] + 0x4,
              );
            }),
            _0x1b155b
          );
        }, []);
      ((_0x3dea06["!cols"] = _0x3456ca["map"]((_0x42e7fd) => ({
        wch: _0x42e7fd,
      }))),
        XLSX["utils"]["book_append_sheet"](_0x2aef2a, _0x3dea06, "Sheet1"),
        XLSX["writeFile"](_0x2aef2a, _0xcf7be),
        await _0x19a9d8["sendMessage"](
          _0x1fafa0,
          {
            document: fs["readFileSync"](_0xcf7be),
            mimetype:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName: "spreadsheet_" + Date["now"]() + ".xlsx",
            caption:
              "✅ *Excel created!*\n📊 " +
              _0x4f5e48["length"] +
              " rows × " +
              (_0x4f5e48[0x0]?.["length"] || 0x0) +
              " columns",
          },
          { quoted: _0x32cc0b },
        ));
    } catch (_0x484d63) {
      (console["error"]("[TOEXCEL ERROR]", _0x484d63["message"]),
        await _0x19a9d8["sendMessage"](
          _0x1fafa0,
          {
            text: "❌ Failed to create Excel. Make sure data is comma-separated.",
          },
          { quoted: _0x32cc0b },
        ));
    } finally {
      if (fs["existsSync"](_0xcf7be))
        try {
          fs["unlinkSync"](_0xcf7be);
        } catch (_0x5d2652) {}
    }
  },
};
