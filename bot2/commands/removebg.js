const axios = require("axios"),
  fs = require("fs"),
  FormData = require("form-data"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  os = require("os"),
  path = require("path");
module["exports"] = {
  name: "removebg",
  aliases: ["rmbg", "bgremove", "nobg"],
  description: "Remove background from a quoted image",
  async execute(_0x5a99a7, _0x49297c) {
    const _0x18abcf = _0x49297c["key"]["remoteJid"],
      _0x7bf256 =
        _0x49297c["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x2f7133 = _0x7bf256?.["quotedMessage"];
    if (!_0x2f7133?.["imageMessage"])
      return await _0x5a99a7["sendMessage"](
        _0x18abcf,
        {
          text: "🖼️ Reply to an image with *.removebg* to remove its background.",
        },
        { quoted: _0x49297c },
      );
    let _0x1228ed;
    try {
      await _0x5a99a7["sendMessage"](
        _0x18abcf,
        { text: "🧼 Removing background..." },
        { quoted: _0x49297c },
      );
      const _0x592a0d = await downloadMediaMessage(
        {
          key: {
            remoteJid: _0x18abcf,
            id: _0x7bf256["stanzaId"],
            fromMe: ![],
            participant: _0x7bf256["participant"],
          },
          message: _0x2f7133,
        },
        "buffer",
        {},
        { reuploadRequest: _0x5a99a7["updateMediaMessage"] },
      );
      ((_0x1228ed = path["join"](
        os["tmpdir"](),
        "removebg_" + Date["now"]() + ".jpg",
      )),
        fs["writeFileSync"](_0x1228ed, _0x592a0d));
      const _0x18ce3a = new FormData();
      (_0x18ce3a["append"]("image_file", fs["createReadStream"](_0x1228ed)),
        _0x18ce3a["append"]("turnstile_token", ""));
      const _0x72e915 = await axios["post"](
          "https://api.ezremove.ai/api/ez-remove/background-remove/create-job-v2",
          _0x18ce3a,
          {
            headers: {
              "product-serial": "07cc2e862644a6a1860194a9f6a6f70f",
              ..._0x18ce3a["getHeaders"](),
            },
            timeout: 0x7530,
          },
        ),
        _0x32c247 = _0x72e915["data"]?.["result"]?.["job_id"];
      if (!_0x32c247)
        return await _0x5a99a7["sendMessage"](
          _0x18abcf,
          { text: "❌ Failed to create removebg job." },
          { quoted: _0x49297c },
        );
      let _0x26e7de;
      for (let _0xc0725a = 0x0; _0xc0725a < 0xa; _0xc0725a++) {
        const _0x545ffa = await axios["get"](
          "https://api.ezremove.ai/api/ez-remove/background-remove/get-job/" +
            _0x32c247,
        );
        _0x26e7de = _0x545ffa["data"]?.["result"]?.["output"]?.[0x0];
        if (_0x26e7de) break;
        await new Promise((_0x5a92f6) => setTimeout(_0x5a92f6, 0x7d0));
      }
      if (!_0x26e7de)
        return await _0x5a99a7["sendMessage"](
          _0x18abcf,
          { text: "⚠️ Background removal not ready. Try again shortly." },
          { quoted: _0x49297c },
        );
      await _0x5a99a7["sendMessage"](
        _0x18abcf,
        { image: { url: _0x26e7de }, caption: "✅ Background removed" },
        { quoted: _0x49297c },
      );
    } catch (_0x5307e9) {
      (console["error"]("[REMOVEBG ERROR]", _0x5307e9),
        await _0x5a99a7["sendMessage"](
          _0x18abcf,
          { text: "❌ Failed to remove background. Try a different image." },
          { quoted: _0x49297c },
        ));
    } finally {
      if (_0x1228ed && fs["existsSync"](_0x1228ed))
        try {
          fs["unlinkSync"](_0x1228ed);
        } catch {}
    }
  },
};
