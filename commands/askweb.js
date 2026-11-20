const axios = require("axios"),
  TAVILY_API_KEY =
    process.env.TAVILY_API_KEY ||
    "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",
  AI_API_URL =
    process.env.AI_API_URL || "https://api.groq.com/openai/v1/chat/completions",
  AI_API_KEY =
    process.env.AI_API_KEY ||
    "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",
  AI_MODEL = process.env.AI_MODEL || "openai/gpt-oss-120b",
  DEFAULT_SYSTEM =
    "Answer using the web search results when provided. Be accurate and brief, 1-3 sentences unless more is needed. " +
    "End with the source names in brackets, like (source: Wikipedia and UEFA). " +
    "Reply in the same language as the question. Use single asterisks for *bold*, never double, and no headers.";
function getBody(_0x4477e2) {
  const _0x3196c9 = _0x4477e2["message"] || {};
  return (
    _0x3196c9["conversation"] ||
    _0x3196c9["extendedTextMessage"]?.["text"] ||
    _0x3196c9["imageMessage"]?.["caption"] ||
    ""
  );
}
function getArgs(_0x51eead, _0x31de43) {
  const _0x5a7860 = getBody(_0x51eead)["trim"]()["split"](/\s+/),
    _0x435071 = _0x5a7860["findIndex"]((_0x238e0c) =>
      _0x31de43["includes"](
        _0x238e0c["replace"](/^[^\p{L}\p{N}]+/u, "")["toLowerCase"](),
      ),
    );
  return _0x5a7860["slice"](_0x435071 === -0x1 ? 0x1 : _0x435071 + 0x1)["join"](
    "\x20",
  );
}
async function callAI(_0x1bff57, _0x5db9d8) {
  const _0x1e3bc2 = await axios["post"](
    AI_API_URL,
    {
      model: AI_MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: _0x5db9d8 },
        { role: "user", content: _0x1bff57 },
      ],
    },
    {
      headers: {
        Authorization: "Bearer " + AI_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 0xafc8,
    },
  );
  return (
    _0x1e3bc2["data"]?.["choices"]?.[0x0]?.["message"]?.["content"]?.[
      "trim"
    ]() || ""
  );
}
async function answer(
  _0x1e4cd2,
  {
    context: context = "",
    search: search = !![],
    system: system = DEFAULT_SYSTEM,
  } = {},
) {
  let _0x53b2d2 = [],
    _0x229009 = "";
  if (search) {
    if (!TAVILY_API_KEY) throw new Error("TAVILY_API_KEY is not set");
    const _0x2e8c45 = await axios["post"](
      "https://api.tavily.com/search",
      {
        query: _0x1e4cd2["slice"](0x0, 0x190),
        search_depth: "basic",
        max_results: 0x5,
        include_answer: !![],
      },
      {
        headers: {
          Authorization: "Bearer " + TAVILY_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 0x4e20,
      },
    );
    ((_0x53b2d2 = _0x2e8c45["data"]?.["results"] || []),
      (_0x229009 = _0x2e8c45["data"]?.["answer"] || ""));
  }
  let _0xfc4b = "";
  if (AI_API_KEY) {
    const _0x3a309e = ["Today's date: " + new Date()["toDateString"]()];
    if (context)
      _0x3a309e["push"](
        'Provided text:\n"""\n' + context["slice"](0x0, 0x1770) + '\n"""',
      );
    _0x53b2d2["length"] &&
      _0x3a309e["push"](
        "Web search results:\n" +
          _0x53b2d2["map"](
            (_0x6b486e, _0x524f7e) =>
              "[" +
              (_0x524f7e + 0x1) +
              "]\x20" +
              _0x6b486e["title"] +
              "\x0a" +
              _0x6b486e["content"] +
              "\nURL: " +
              _0x6b486e["url"],
          )["join"]("\x0a\x0a"),
      );
    _0x3a309e["push"]("Question: " + _0x1e4cd2);
    try {
      _0xfc4b = await callAI(_0x3a309e["join"]("\x0a\x0a"), system);
    } catch (_0x9c0c29) {
      console["error"](
        "[ASKWEB AI ERROR]",
        _0x9c0c29["response"]?.["status"],
        JSON["stringify"](_0x9c0c29["response"]?.["data"]) ||
          _0x9c0c29["message"],
      );
    }
  } else {
    if (!search) throw new Error("AI_API_KEY is not set");
  }
  if (!_0xfc4b) _0xfc4b = _0x229009 || _0x53b2d2[0x0]?.["content"] || "";
  const _0x3f5948 = _0x53b2d2["slice"](0x0, 0x3)["map"](
    (_0xd3cd12) => "•\x20" + _0xd3cd12["title"] + "\x0a" + _0xd3cd12["url"],
  );
  return { text: _0xfc4b, sources: _0x3f5948 };
}
async function editOrSend(
  _0x513915,
  _0x13d2a7,
  _0x5a9e3c,
  _0x31a796,
  _0x290d17,
) {
  try {
    if (!_0x31a796?.["key"]) throw new Error("no placeholder key");
    await _0x513915["sendMessage"](_0x13d2a7, {
      text: _0x290d17,
      edit: _0x31a796["key"],
    });
  } catch (_0x12552e) {
    (console["error"]("[ASKWEB EDIT FALLBACK]", _0x12552e["message"]),
      await _0x513915["sendMessage"](
        _0x13d2a7,
        { text: _0x290d17 },
        { quoted: _0x5a9e3c },
      ));
  }
}
const command = {
  name: "askweb",
  aliases: ["websearch", "searchai", "ask"],
  description: "AI answer backed by live web search",
  async execute(_0x2855f3, _0x5854b7) {
    const _0x6a3c5e = _0x5854b7["key"]["remoteJid"],
      _0x20b3e9 =
        _0x5854b7["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x2c5630 =
        _0x20b3e9?.["quotedMessage"]?.["conversation"] ||
        _0x20b3e9?.["quotedMessage"]?.["extendedTextMessage"]?.["text"] ||
        "",
      _0x1c8994 = getArgs(_0x5854b7, [
        "askweb",
        "websearch",
        "searchai",
        "ask",
      ]),
      _0x3a47ed = (_0x1c8994 || _0x2c5630)["trim"]();
    if (!_0x3a47ed)
      return await _0x2855f3["sendMessage"](
        _0x6a3c5e,
        {
          text: "🌐 Usage: *.askweb <question>*\nExample: .askweb who won the UCL 2026 ?",
        },
        { quoted: _0x5854b7 },
      );
    const _0x4cb139 = await _0x2855f3["sendMessage"](
      _0x6a3c5e,
      { text: "🔎 Searching the web..." },
      { quoted: _0x5854b7 },
    );
    try {
      const { text: _0x11ec88 } = await answer(_0x3a47ed, { search: !![] });
      if (!_0x11ec88)
        return await editOrSend(
          _0x2855f3,
          _0x6a3c5e,
          _0x5854b7,
          _0x4cb139,
          "🤷 No web results found.",
        );
      await editOrSend(_0x2855f3, _0x6a3c5e, _0x5854b7, _0x4cb139, _0x11ec88);
    } catch (_0x23b224) {
      (console["error"](
        "[ASKWEB ERROR]",
        _0x23b224["response"]?.["status"],
        _0x23b224["message"],
      ),
        await editOrSend(
          _0x2855f3,
          _0x6a3c5e,
          _0x5854b7,
          _0x4cb139,
          "❌\x20" +
            (_0x23b224["message"]?.["includes"]("not set")
              ? _0x23b224["message"]
              : "Web search failed. Try again in a moment."),
        ));
    }
  },
};
((command["answer"] = answer), (module["exports"] = command));
