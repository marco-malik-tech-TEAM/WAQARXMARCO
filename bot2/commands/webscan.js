const https = require("https"),
  http = require("http"),
  { URL } = require("url");
function scanSite(_0x1c00a4) {
  return new Promise((_0x1d48a6, _0x3b129e) => {
    let _0x495c48;
    try {
      _0x495c48 = new URL(_0x1c00a4);
    } catch {
      return _0x3b129e(new Error("Invalid URL"));
    }
    const _0x5c072c = _0x495c48["protocol"] === "https:" ? https : http,
      _0x1240c8 = Date["now"](),
      _0x583cab = _0x5c072c["request"](
        {
          hostname: _0x495c48["hostname"],
          path: _0x495c48["pathname"] || "/",
          method: "GET",
          timeout: 0x2710,
        },
        (_0x1f8fad) => {
          const _0x58c7af = Date["now"]() - _0x1240c8;
          (_0x1f8fad["resume"](),
            _0x1d48a6({
              url: _0x1c00a4,
              status: _0x1f8fad["statusCode"],
              statusMessage: _0x1f8fad["statusMessage"],
              server: _0x1f8fad["headers"]["server"] || "Unknown",
              contentType: _0x1f8fad["headers"]["content-type"] || "Unknown",
              poweredBy:
                _0x1f8fad["headers"]["x-powered-by"] || "Not disclosed",
              responseTime: _0x58c7af,
              headers: _0x1f8fad["headers"],
            }));
        },
      );
    (_0x583cab["on"]("timeout", () => {
      (_0x583cab["destroy"](), _0x3b129e(new Error("Request timed out")));
    }),
      _0x583cab["on"]("error", (_0x202fbf) => _0x3b129e(_0x202fbf)),
      _0x583cab["end"]());
  });
}
module["exports"] = {
  name: "webscan",
  description:
    "Scan a website and give basic details. Usage: .webscan https://google.com",
  async execute(_0x5b5740, _0x54e932, _0x3cdaae) {
    const _0x320212 = _0x54e932["key"]["remoteJid"];
    let _0x570060 = _0x3cdaae["join"]("\x20")["trim"]();
    if (!_0x570060)
      return _0x5b5740["sendMessage"](
        _0x320212,
        { text: "❌ Enter a URL\nExample: .webscan https://google.com" },
        { quoted: _0x54e932 },
      );
    !_0x570060["startsWith"]("http") && (_0x570060 = "https://" + _0x570060);
    await _0x5b5740["sendMessage"](
      _0x320212,
      { text: "🔍 Scanning website..." },
      { quoted: _0x54e932 },
    );
    try {
      const _0x1e99bf = await scanSite(_0x570060),
        _0x12740c = ("\n╭──〔 🌐 WEBSITE SCAN 〕──╮\n🔗 *URL:* " +
          _0x1e99bf["url"] +
          "\n📊 *Status:* " +
          _0x1e99bf["status"] +
          "\x20" +
          _0x1e99bf["statusMessage"] +
          "\n🖥 *Server:* " +
          _0x1e99bf["server"] +
          "\n⚙️ *Powered By:* " +
          _0x1e99bf["poweredBy"] +
          "\n📄 *Content-Type:* " +
          _0x1e99bf["contentType"] +
          "\n⏱ *Response Time:* " +
          _0x1e99bf["responseTime"] +
          "ms\n╰──────────────────╯")["trim"]();
      await _0x5b5740["sendMessage"](
        _0x320212,
        { text: _0x12740c },
        { quoted: _0x54e932 },
      );
    } catch (_0x22ae33) {
      await _0x5b5740["sendMessage"](
        _0x320212,
        { text: "❌ Scan failed: " + _0x22ae33["message"] },
        { quoted: _0x54e932 },
      );
    }
  },
};
