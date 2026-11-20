const https = require("https"),
  { KEITH_BASE } = require("../config/apis");
function httpsGetJSON(_0x2517dc) {
  return new Promise((_0x4a1149, _0x5cb861) => {
    https["get"](_0x2517dc, (_0x1a2d6e) => {
      let _0x3a294c = "";
      (_0x1a2d6e["on"]("data", (_0x4d7c60) => {
        _0x3a294c += _0x4d7c60;
      }),
        _0x1a2d6e["on"]("end", () => {
          try {
            _0x4a1149(JSON["parse"](_0x3a294c));
          } catch (_0x388111) {
            _0x5cb861(_0x388111);
          }
        }));
    })["on"]("error", _0x5cb861);
  });
}
async function fetchSpeech(_0x51b2f8) {
  const _0x2eaaab =
      KEITH_BASE +
      "/ai/speechwriter?topic=" +
      encodeURIComponent(_0x51b2f8) +
      "&length=short&type=dedication&tone=serious",
    _0x5e4235 = await httpsGetJSON(_0x2eaaab),
    _0x35e447 = _0x5e4235["result"];
  if (_0x35e447 && typeof _0x35e447 === "object")
    throw new Error(
      _0x35e447["error"] ||
        _0x35e447["message"] ||
        "upstream speechwriter service returned a failure.",
    );
  if (
    !_0x5e4235["status"] ||
    typeof _0x35e447 !== "string" ||
    !_0x35e447["trim"]()
  )
    throw new Error(_0x5e4235["error"] || "API returned no usable result.");
  return _0x35e447;
}
module["exports"] = {
  name: "speechwriter",
  aliases: ["speech", "writer"],
  description: "Generate a custom speech on any topic",
  async execute(_0x5f5787, _0x20cfa9, _0x41d499) {
    const _0x14e36e = _0x20cfa9["key"]["remoteJid"],
      _0x5cc7dc =
        _0x14e36e["endsWith"]("@lid") && _0x20cfa9["key"]["remoteJidAlt"]
          ? _0x20cfa9["key"]["remoteJidAlt"]
          : _0x14e36e,
      _0x522065 = _0x41d499["join"]("\x20")["trim"]();
    if (!_0x522065)
      return _0x5f5787["sendMessage"](
        _0x5cc7dc,
        { text: "❌ Provide a topic, e.g. `.speechwriter how to pass exams`" },
        { quoted: _0x20cfa9 },
      );
    const _0x24576f = await _0x5f5787["sendMessage"](
      _0x5cc7dc,
      { text: "✍️ *Drafting your speech...*" },
      { quoted: _0x20cfa9 },
    );
    let _0x48fad0 = null;
    try {
      _0x48fad0 = await fetchSpeech(_0x522065);
    } catch (_0x356101) {
      console["error"](
        "[SPEECHWRITER] Primary endpoint failed:",
        _0x356101["message"],
      );
    }
    if (!_0x48fad0)
      try {
        const _0x4f2d65 =
            'Write a powerful, well-crafted, serious speech on the following topic: "' +
            _0x522065 +
            '". Keep it well-formatted with clear paragraphs.',
          _0x16163d = await httpsGetJSON(
            KEITH_BASE + "/ai/gpt4?q=" + encodeURIComponent(_0x4f2d65),
          );
        _0x16163d["status"] &&
        typeof _0x16163d["result"] === "string" &&
        _0x16163d["result"]["trim"]()
          ? (_0x48fad0 = _0x16163d["result"])
          : console["error"](
              "[SPEECHWRITER] Fallback returned no usable result. Raw:",
              JSON["stringify"](_0x16163d)["slice"](0x0, 0x1f4),
            );
      } catch (_0x34c5b3) {
        console["error"](
          "[SPEECHWRITER] Fallback request failed:",
          _0x34c5b3["message"],
        );
      }
    if (!_0x48fad0)
      return await _0x5f5787["sendMessage"](
        _0x5cc7dc,
        {
          text: "❌ *Failed to generate speech. Please try again later.*",
          edit: _0x24576f["key"],
        },
        { quoted: _0x20cfa9 },
      );
    await _0x5f5787["sendMessage"](
      _0x5cc7dc,
      {
        text: "🎙️ *Generated Speech*\n\n" + _0x48fad0["trim"](),
        edit: _0x24576f["key"],
      },
      { quoted: _0x20cfa9 },
    );
  },
};
