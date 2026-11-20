const axios = require("axios"),
  { isDev } = require("../utils/isDev"),
  BROWSER_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
function formatBody(_0x5c6c82, _0x392fe7) {
  const _0x4149fc =
    _0x392fe7 === "" || /json|text|xml|javascript/i["test"](_0x392fe7);
  if (!_0x4149fc)
    return (
      "_(binary response, " + (_0x392fe7 || "unknown type") + " — not shown)_"
    );
  const _0x1d4685 = (_0x5c6c82 || "")["trim"]();
  if (!_0x1d4685) return "_(empty response body)_";
  try {
    const _0x3cc962 = JSON["parse"](_0x1d4685),
      _0x54c378 = JSON["stringify"](_0x3cc962, null, 0x2);
    return "```json\n" + _0x54c378 + "\n```";
  } catch {
    return "```\n" + _0x1d4685 + "\n```";
  }
}
module["exports"] = {
  name: "fetch",
  aliases: ["curl"],
  description:
    "Fetches content from a URL (developer only). Usage: .fetch <url>",
  async execute(_0x47cb4d, _0x419d66, _0x3af32b) {
    const _0x56ae9e = _0x419d66["key"]["remoteJid"];
    if (!isDev(_0x419d66, _0x47cb4d))
      return _0x47cb4d["sendMessage"](
        _0x56ae9e,
        { text: "❌ This command is restricted to ᴾᴬᴾᴾᴵ ᴵˢᴬᴬᶜ only." },
        { quoted: _0x419d66 },
      );
    const _0x5ed07f = _0x3af32b[0x0];
    if (!_0x5ed07f)
      return _0x47cb4d["sendMessage"](
        _0x56ae9e,
        { text: "❌ Usage: .fetch <url>" },
        { quoted: _0x419d66 },
      );
    try {
      const _0x14fe42 = await axios["get"](_0x5ed07f, {
          timeout: 0x4e20,
          responseType: "text",
          maxRedirects: 0x5,
          validateStatus: () => !![],
          headers: {
            "User-Agent": BROWSER_UA,
            Accept: "application/json, text/plain, text/html, */*",
          },
        }),
        _0x1ffce6 = _0x14fe42["headers"]["content-type"] || "",
        _0x31a413 = formatBody(_0x14fe42["data"], _0x1ffce6),
        _0x54730a =
          "📡 *Status:* " + _0x14fe42["status"] + "\x0a\x0a" + _0x31a413;
      if (_0x54730a["length"] <= 0xfa0)
        await _0x47cb4d["sendMessage"](
          _0x56ae9e,
          { text: _0x54730a },
          { quoted: _0x419d66 },
        );
      else
        for (
          let _0x3823be = 0x0;
          _0x3823be < _0x54730a["length"];
          _0x3823be += 0xfa0
        ) {
          await _0x47cb4d["sendMessage"](
            _0x56ae9e,
            { text: _0x54730a["slice"](_0x3823be, _0x3823be + 0xfa0) },
            { quoted: _0x3823be === 0x0 ? _0x419d66 : undefined },
          );
        }
    } catch (_0x27fc7e) {
      console["error"](
        "[FETCH ERROR]",
        _0x27fc7e["code"],
        _0x27fc7e["response"]?.["status"],
        _0x27fc7e["message"],
      );
      const _0x5c7275 =
        _0x27fc7e["code"] === "ECONNABORTED"
          ? "request timed out."
          : _0x27fc7e["response"]?.["status"]
            ? "server returned " + _0x27fc7e["response"]["status"] + "."
            : _0x27fc7e["message"];
      await _0x47cb4d["sendMessage"](
        _0x56ae9e,
        { text: "❌\x20" + _0x5c7275 },
        { quoted: _0x419d66 },
      );
    }
  },
};
