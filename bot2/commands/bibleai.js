const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "bibleai",
  aliases: ["aibible", "scripture"],
  description: "Ask Bible-based questions and get answers with references",
  async execute(_0x57be80, _0x3190fd, _0x327bc3) {
    const _0x3234cb = _0x3190fd["key"]["remoteJid"],
      _0x5309ab =
        _0x3234cb["endsWith"]("@lid") && _0x3190fd["key"]["remoteJidAlt"]
          ? _0x3190fd["key"]["remoteJidAlt"]
          : _0x3234cb,
      _0x1565ad = _0x327bc3["join"]("\x20")["trim"]();
    if (!_0x1565ad)
      return _0x57be80["sendMessage"](
        _0x5309ab,
        {
          text: "📖 Ask a Bible question.\n\nExample: `.bibleai what is faith`",
        },
        { quoted: _0x3190fd },
      );
    const _0x2dda2a = await _0x57be80["sendMessage"](
      _0x5309ab,
      { text: "📖 *Searching Scripture...*" },
      { quoted: _0x3190fd },
    );
    try {
      const { data: _0x1b2882 } = await axios["get"](
        API + "/ai/bible?q=" + encodeURIComponent(_0x1565ad),
        { timeout: 0x1d4c0 },
      );
      if (
        !_0x1b2882?.["status"] ||
        !_0x1b2882?.["result"]?.["results"]?.["data"]?.["answer"]
      )
        throw new Error("No Bible answer found.");
      const _0x43fe7e = _0x1b2882["result"]["results"]["data"]["answer"],
        _0x5aef3b = _0x1b2882["result"]["results"]["data"]["sources"] || [];
      let _0xfed615 = "📖 *" + _0x1565ad + "*\n\n" + _0x43fe7e;
      (_0x5aef3b["length"] > 0x0 &&
        (_0xfed615 +=
          "\n\n📌 *Sources:*\n" +
          _0x5aef3b["map"]((_0x339bcd, _0x318fc2) => {
            if (_0x339bcd["type"] === "verse")
              return _0x318fc2 + 0x1 + ". 📜 " + _0x339bcd["text"];
            if (_0x339bcd["type"] === "article")
              return _0x318fc2 + 0x1 + ". 📘 " + _0x339bcd["title"];
            return (
              _0x318fc2 +
              0x1 +
              ".\x20" +
              (_0x339bcd["text"] || _0x339bcd["title"])
            );
          })["join"]("\x0a")),
        await _0x57be80["sendMessage"](
          _0x5309ab,
          { text: _0xfed615, edit: _0x2dda2a["key"] },
          { quoted: _0x3190fd },
        ));
    } catch (_0x4ee5dc) {
      (console["error"]("[BIBLEAI ERROR]", _0x4ee5dc),
        await _0x57be80["sendMessage"](
          _0x5309ab,
          {
            text: "❌ Error fetching Bible answer: " + _0x4ee5dc["message"],
            edit: _0x2dda2a["key"],
          },
          { quoted: _0x3190fd },
        ));
    }
  },
};
