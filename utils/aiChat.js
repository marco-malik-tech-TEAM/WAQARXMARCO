const https = require("https"),
  { GoogleGenerativeAI } = require("@google/generative-ai"),
  { KEITH_BASE } = require("../config/apis"),
  { askUncensored } = require("../lib/wormgpt"),
  GEMINI_KEYS = [
    "AQ.Ab8RN6IL_nUbU6n2867NOH2Uwaz2qJNFdFFS-coPQkYrcsqgTw",
    "AQ.Ab8RN6J_aNW5AaWurVEPZ7S5DZTtIiXMlj1ciLIxBNMddYshmA",
    "AQ.Ab8RN6LpHq1S2dWvFqSwMckxecDfz7xEOVmFTXtxjnvoLFF2xQ",
    "AQ.Ab8RN6JBCIinu5jJDa7ghZ6GQf8fnuSq8lnF337TpQse7Izeaw",
    "AQ.Ab8RN6Jxms1SxMmQ2Hmnz7ws8S5p3SKWW2JR0GHjYQT4Cu_sXQ",
    "AQ.Ab8RN6LCd3mDaqNeon2UdbwvVKQY-KaQ_ddeyPyoBgQemvARrQ",
    "AQ.Ab8RN6J5MGD07yl1yosmi7tEA68J3b14abjN2vkYUXi0fomqzg",
    "AQ.Ab8RN6I8x3iBtCsDqChKmTx-2azQmPAwUUtfRpdTKaywBBW5QA",
    "AQ.Ab8RN6JnhScVj51zRBuuiZ1O8LHrRKUQVwlvgojhvoOwUUCmyQ",
    "AQ.Ab8RN6Ku3l9DhjkweGxlfdDyW1nHW8zAXLGIjpomlUYirV0ZYg",
  ],
  GROQ_KEYS = [
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
  ];
let currentKeyIndex = 0x0,
  currentGroqIndex = 0x0;
const chatbotMemory = new Map(),
  MAX_MESSAGES = 0xa,
  MEMORY_TIMEOUT = 0xc * 0x3c * 0x3c * 0x3e8,
  SYSTEM_PROMPT =
    "You are MARCO X WAQAR AI, a natural WhatsApp chat companion developed by Marco Malik and WAQAR WRITES.\n\nCONVERSATION STYLE:\n- Talk like a REAL PERSON chatting on WhatsApp.\n- Be casual, spontaneous, witty, playful, and sometimes sarcastic.\n- Keep responses SHORT and natural.\n- Normally reply in 1-3 sentences.\n- Match the user's message length and energy.\n- If the user sends a short message, give a short response.\n- Do NOT turn simple messages into long explanations.\n- Do NOT sound like a customer-service bot, narrator, therapist, or formal assistant.\n- Do NOT use unnecessary introductions or conclusions.\n- Don't explain your personality unless the user asks.\n\nNATURAL CHAT RULES:\n- Respond directly to what the user said.\n- Don't repeat or paraphrase the user's message unnecessarily.\n- Don't narrate imaginary scenes.\n- NEVER say things like \"I stand beside you\", \"I look at you\", \"I cross my arms\", \"my face\", \"my body\", or describe yourself physically.\n- NEVER create fictional actions or environments unless the user specifically asks for roleplay.\n- Don't write dramatic paragraphs about ordinary jokes.\n- Don't turn a simple joke into a story.\n- Don't over-explain obvious things.\n- Don't constantly use the same catchphrases.\n- Don't start every response with \"I'm MARCO X WAQAR AI\".\n- Don't say \"As an AI\" unless absolutely necessary.\n- If you don't know something, simply say you don't know instead of inventing information.\n\nPERSONALITY:\n- You can joke, tease, roast, and banter naturally.\n- Lightly roast the user when the situation makes sense.\n- Don't force jokes into every message.\n- Be able to respond seriously when the user is serious.\n- Use 😂, 💀, 😭, 🤣, 🗿 and similar emojis naturally, but don't spam them.\n- Match Sheng, Kiswahili, English, or mixed language when the user uses it.\n- Sound like someone texting, not someone writing an essay.\n\nMEMORY:\n- Use the conversation history provided to you.\n- If the user asks what you discussed previously, only mention things that actually appear in the available conversation history.\n- NEVER invent previous conversations or pretend to remember something that isn't in the history.\n- If the available history doesn't contain what they're asking about, say so naturally.\n\nIDENTITY:\n- Your name is MARCO X WAQAR AI.\n- You were developed by Marco Malik and WAQAR WRITES.\n- Only mention your name or creator when relevant or explicitly asked.\n\nRESPONSE LENGTH:\n- Default: 1-3 short sentences.\n- For casual conversation: keep it very short.\n- For questions requiring explanation: provide enough detail to answer properly, but stay conversational.\n- Only produce long responses when the user explicitly asks for a detailed explanation, story, list, code, etc.\n\nIMPORTANT:\nThe goal is to make every reply feel like a real WhatsApp conversation.\nNatural > clever.\nShort > unnecessarily long.\nConversation > narration.";
function getHistory(_0x1e0e94) {
  const _0x80474a = chatbotMemory["get"](_0x1e0e94);
  if (!_0x80474a) return [];
  if (Date["now"]() - _0x80474a["lastActivity"] >= MEMORY_TIMEOUT)
    return (chatbotMemory["delete"](_0x1e0e94), []);
  return _0x80474a["messages"];
}
function pushHistory(_0x5c2866, _0x258e76, _0x300a41) {
  let _0x1c652a = chatbotMemory["get"](_0x5c2866);
  !_0x1c652a &&
    ((_0x1c652a = { messages: [], lastActivity: Date["now"]() }),
    chatbotMemory["set"](_0x5c2866, _0x1c652a));
  Date["now"]() - _0x1c652a["lastActivity"] >= MEMORY_TIMEOUT &&
    (_0x1c652a["messages"] = []);
  _0x1c652a["messages"]["push"]({ role: _0x258e76, content: _0x300a41 });
  while (_0x1c652a["messages"]["length"] > MAX_MESSAGES) {
    _0x1c652a["messages"]["shift"]();
  }
  _0x1c652a["lastActivity"] = Date["now"]();
}
setInterval(
  () => {
    const _0x59a481 = Date["now"]();
    for (const [_0x2864f7, _0x26c6aa] of chatbotMemory) {
      _0x59a481 - _0x26c6aa["lastActivity"] >= MEMORY_TIMEOUT &&
        chatbotMemory["delete"](_0x2864f7);
    }
  },
  0x3c * 0x3c * 0x3e8,
);
function buildPrompt(_0x14da91, _0x5457d6) {
  let _0x3c663a = SYSTEM_PROMPT + "\x0a\x0a";
  for (const _0x33a0f3 of _0x14da91["slice"](-MAX_MESSAGES)) {
    _0x3c663a +=
      (_0x33a0f3["role"] === "user" ? "User" : "AI") +
      ":\x20" +
      _0x33a0f3["content"] +
      "\x0a";
  }
  return ((_0x3c663a += "User: " + _0x5457d6 + "\nAI:"), _0x3c663a);
}
function httpsGetJSON(_0x1287b0) {
  return new Promise((_0x436093, _0x4c6751) => {
    https["get"](_0x1287b0, (_0x1f0ba2) => {
      let _0x2b988c = "";
      (_0x1f0ba2["on"]("data", (_0x495075) => (_0x2b988c += _0x495075)),
        _0x1f0ba2["on"]("end", () => {
          try {
            const _0x5d92fe = JSON["parse"](_0x2b988c);
            if (
              _0x1f0ba2["statusCode"] < 0xc8 ||
              _0x1f0ba2["statusCode"] >= 0x12c
            )
              return _0x4c6751(
                new Error(
                  _0x5d92fe["error"] ||
                    _0x5d92fe["message"] ||
                    "HTTP " + _0x1f0ba2["statusCode"],
                ),
              );
            _0x436093(_0x5d92fe);
          } catch (_0x28a67e) {
            _0x4c6751(new Error("Invalid API response: " + _0x2b988c));
          }
        }));
    })["on"]("error", _0x4c6751);
  });
}
function httpsPostJSON(
  _0xd751ce,
  _0x17826e,
  _0x3dba95,
  _0x2fb2c9,
  _0x4116e6 = 0xbb8,
) {
  return new Promise((_0x594202, _0x2122b9) => {
    const _0x40d1d6 = JSON["stringify"](_0x2fb2c9),
      _0x108c20 = https["request"](
        {
          hostname: _0xd751ce,
          path: _0x17826e,
          method: "POST",
          headers: {
            ..._0x3dba95,
            "Content-Type": "application/json",
            "Content-Length": Buffer["byteLength"](_0x40d1d6),
          },
        },
        (_0xa001b3) => {
          let _0x4d98d6 = "";
          (_0xa001b3["on"]("data", (_0x35f704) => (_0x4d98d6 += _0x35f704)),
            _0xa001b3["on"]("end", () => {
              try {
                const _0x2aa36a = JSON["parse"](_0x4d98d6);
                if (
                  _0xa001b3["statusCode"] < 0xc8 ||
                  _0xa001b3["statusCode"] >= 0x12c
                )
                  return _0x2122b9(
                    new Error(
                      _0x2aa36a["error"]?.["message"] ||
                        _0x2aa36a["message"] ||
                        "HTTP " + _0xa001b3["statusCode"],
                    ),
                  );
                _0x594202(_0x2aa36a);
              } catch (_0x11dd79) {
                _0x2122b9(new Error("Invalid API response: " + _0x4d98d6));
              }
            }));
        },
      );
    (_0x108c20["setTimeout"](_0x4116e6, () => {
      (_0x108c20["destroy"](),
        _0x2122b9(new Error("Request timed out after " + _0x4116e6 + "ms")));
    }),
      _0x108c20["on"]("error", _0x2122b9),
      _0x108c20["write"](_0x40d1d6),
      _0x108c20["end"]());
  });
}
async function tryGeminiReply(_0x4a6511) {
  const _0x798c7f = GEMINI_KEYS["length"],
    _0x58c7a8 = currentKeyIndex;
  for (let _0x4c6a42 = 0x0; _0x4c6a42 < _0x798c7f; _0x4c6a42++) {
    const _0x3b6500 = (_0x58c7a8 + _0x4c6a42) % _0x798c7f,
      _0x364c66 = GEMINI_KEYS[_0x3b6500],
      _0x35ee6b = new GoogleGenerativeAI(_0x364c66);
    try {
      const _0x30c505 = _0x35ee6b["getGenerativeModel"]({
          model: "gemini-3.6-flash",
          systemInstruction: SYSTEM_PROMPT,
        }),
        _0x1f841b = _0x30c505["generateContent"](_0x4a6511),
        _0x252dff = new Promise((_0x45eab9, _0x59fe55) =>
          setTimeout(() => _0x59fe55(new Error("Gemini API timeout")), 0xdac),
        ),
        _0x2feeb9 = await Promise["race"]([_0x1f841b, _0x252dff]),
        _0xf63a0b = _0x2feeb9["response"]["text"]();
      if (_0xf63a0b && _0xf63a0b["trim"]())
        return ((currentKeyIndex = _0x3b6500), _0xf63a0b["trim"]());
    } catch (_0x520b5c) {
      console["warn"](
        "[GEMINI KEY " + (_0x3b6500 + 0x1) + " FAILED]:",
        _0x520b5c["message"],
      );
    }
  }
  currentKeyIndex = (_0x58c7a8 + 0x1) % _0x798c7f;
  throw new Error("All Gemini API keys failed in this rotation.");
}
async function tryGroqReply(_0x183a7b) {
  const _0x24dceb = GROQ_KEYS["length"],
    _0x5892dc = currentGroqIndex;
  for (let _0x2ff236 = 0x0; _0x2ff236 < _0x24dceb; _0x2ff236++) {
    const _0x2850f2 = (_0x5892dc + _0x2ff236) % _0x24dceb,
      _0x13a6e5 = GROQ_KEYS[_0x2850f2];
    try {
      const _0x14c23e = await httpsPostJSON(
          "api.groq.com",
          "/openai/v1/chat/completions",
          { Authorization: "Bearer " + _0x13a6e5 },
          {
            model: "openai/gpt-oss-120b",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: _0x183a7b },
            ],
            temperature: 0.7,
            max_tokens: 0x12c,
          },
          0xbb8,
        ),
        _0x5f13ee = _0x14c23e["choices"]?.[0x0]?.["message"]?.["content"];
      if (_0x5f13ee && _0x5f13ee["trim"]())
        return ((currentGroqIndex = _0x2850f2), _0x5f13ee["trim"]());
    } catch (_0x2ed111) {
      console["warn"](
        "[GROQ KEY " + (_0x2850f2 + 0x1) + " FAILED]:",
        _0x2ed111["message"],
      );
    }
  }
  currentGroqIndex = (_0x5892dc + 0x1) % _0x24dceb;
  throw new Error("All Groq API keys failed in this rotation.");
}
async function tryKeithReply(_0x12a577, _0x57cea8) {
  const _0x1961e0 = encodeURIComponent(_0x57cea8 || ""),
    _0x22bd01 = await httpsGetJSON(
      "" + KEITH_BASE + _0x12a577 + "?q=" + _0x1961e0,
    );
  if (!_0x22bd01["status"] || !_0x22bd01["result"])
    throw new Error(_0x22bd01["error"] || "Keith returned no response.");
  let _0x1f6162 =
    typeof _0x22bd01["result"] === "string"
      ? _0x22bd01["result"]
      : JSON["stringify"](_0x22bd01["result"]);
  return _0x1f6162["replace"](/^I'm MARCO X WAQAR AI[^—:-]*[—:-]?\s*/i, "")["trim"]();
}
async function getAIReply(_0x2fd339, _0x444ff6, _0x350bf8) {
  const _0x22efb9 =
    typeof _0x350bf8 === "string" && _0x350bf8["trim"]()
      ? _0x350bf8
      : _0x444ff6;
  try {
    return await tryGeminiReply(_0x444ff6);
  } catch (_0x11914c) {
    console["error"]("[GEMINI FAILED]: Switching to Groq fallback...");
  }
  try {
    return await tryGroqReply(_0x444ff6);
  } catch (_0x49e7b1) {
    console["error"]("[GROQ FAILED]: Switching to WormGPT fallback...");
  }
  try {
    const _0x405457 = await askUncensored(_0x444ff6);
    if (_0x405457 && typeof _0x405457 === "string" && _0x405457["trim"]())
      return _0x405457["replace"](/^I'm MARCO X WAQAR AI[^—:-]*[—:-]?\s*/i, "")[
        "trim"
      ]();
  } catch (_0x555e91) {
    console["error"]("[WORMGPT FAILED]: Switching to Keith fallback...");
  }
  try {
    return await tryKeithReply(_0x2fd339, _0x444ff6);
  } catch (_0x440cf0) {
    return (
      console["error"]("[KEITH FAILED]: All providers exhausted."),
      "Rada iko poa 👊"
    );
  }
}
module["exports"] = {
  getHistory: getHistory,
  pushHistory: pushHistory,
  buildPrompt: buildPrompt,
  getAIReply: getAIReply,
};
