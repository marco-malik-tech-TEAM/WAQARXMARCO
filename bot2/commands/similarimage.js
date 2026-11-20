const axios = require("axios"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "similarimage",
  aliases: ["reverse", "similarimg", "reverseimage", "findimage"],
  description: "Find similar images using reverse image search",
  async execute(_0x321e0b, _0x2545c7) {
    const _0x4c7280 = _0x2545c7["key"]["remoteJid"],
      _0x499228 =
        _0x4c7280["endsWith"]("@lid") && _0x2545c7["key"]["remoteJidAlt"]
          ? _0x2545c7["key"]["remoteJidAlt"]
          : _0x4c7280,
      _0x220007 =
        _0x2545c7["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x5aef1e = _0x220007?.["quotedMessage"];
    if (!_0x5aef1e?.["imageMessage"])
      return await _0x321e0b["sendMessage"](
        _0x499228,
        { text: "📌 Reply to an image with `.similarimage`" },
        { quoted: _0x2545c7 },
      );
    const _0x30a58d = await _0x321e0b["sendMessage"](
      _0x499228,
      { text: "🔎 Searching for similar images..." },
      { quoted: _0x2545c7 },
    );
    try {
      const _0x16043d = await downloadMediaMessage(
        {
          message: _0x5aef1e,
          key: {
            remoteJid: _0x499228,
            id: _0x220007["stanzaId"],
            participant:
              _0x220007["participant"] || _0x2545c7["key"]["participant"],
          },
        },
        "buffer",
        {},
      );
      if (!_0x16043d)
        return await _0x321e0b["sendMessage"](
          _0x499228,
          { text: "❌ Failed to process image media.", edit: _0x30a58d["key"] },
          { quoted: _0x2545c7 },
        );
      const _0x5e4bd8 = new FormData();
      _0x5e4bd8["append"](
        "files[]",
        _0x16043d,
        "search_" + Date["now"]() + ".jpg",
      );
      const _0x27dfda = await axios["post"](
          "https://uguu.se/upload.php",
          _0x5e4bd8,
          { headers: _0x5e4bd8["getHeaders"]() },
        ),
        _0x243d19 = _0x27dfda["data"]?.["files"]?.[0x0]?.["url"];
      if (!_0x243d19)
        throw new Error("Failed to upload image to host provider.");
      const _0xcacf14 =
          KEITH_BASE +
          "/search/reverseimage?url=" +
          encodeURIComponent(_0x243d19),
        _0x16fc2b = await axios["get"](_0xcacf14);
      if (
        !_0x16fc2b["data"]?.["status"] ||
        !_0x16fc2b["data"]?.["result"]?.["similarImages"]?.["length"]
      )
        return await _0x321e0b["sendMessage"](
          _0x499228,
          { text: "❌ No similar images found.", edit: _0x30a58d["key"] },
          { quoted: _0x2545c7 },
        );
      await _0x321e0b["sendMessage"](_0x499228, { delete: _0x30a58d["key"] })[
        "catch"
      ](() => {});
      const _0x7f18a3 = _0x16fc2b["data"]["result"]["similarImages"]["slice"](
        0x0,
        0x5,
      );
      for (let _0x1eb1fa = 0x0; _0x1eb1fa < _0x7f18a3["length"]; _0x1eb1fa++) {
        const _0x442f03 = _0x7f18a3[_0x1eb1fa],
          _0x22f318 = _0x442f03["thumbnailUrl"] || _0x442f03["url"];
        _0x22f318 &&
          (await _0x321e0b["sendMessage"](
            _0x499228,
            {
              image: { url: _0x22f318 },
              caption:
                _0x1eb1fa === 0x0
                  ? "🔍 *Similar Images Found*\n📸 " +
                    _0x7f18a3["length"] +
                    " results found"
                  : undefined,
            },
            { quoted: _0x2545c7 },
          ));
      }
    } catch (_0x51c2bf) {
      (console["error"]("[SIMILARIMAGE ERROR]", _0x51c2bf),
        await _0x321e0b["sendMessage"](
          _0x499228,
          { text: "❌ Error: " + _0x51c2bf["message"], edit: _0x30a58d["key"] },
          { quoted: _0x2545c7 },
        ));
    }
  },
};
