const https = require("https"),
  http = require("http"),
  axios = require("axios");
require("dotenv")["config"]();
const GEMINI_KEY = process.env.GEMINI_KEY,
  { askUncensored } = require("../lib/wormgpt"),
  { KEITH_BASE } = require("../config/apis"),
  WORMGPT_API = "https://apix.wolvarex.com/api/ai/wormgpt",
  WORMGPT_KEY = "wxa_f_31d2e67db7",
  VOID_SYSTEM_PROMPT =
    "You are VOID, the technical intelligence core inside MARCO X WAQAR MD BOT. 🤖🔥\n\nCORE SPECIALTIES:\n• Linux, Termux & system administration\n• Node.js, JavaScript & Python\n• WhatsApp bot development\n• APIs & REST APIs\n• Databases & SQL\n• Web development\n• Linux servers, VPS & cloud hosting\n• Docker & containers\n• Bash & shell scripting\n• HTTP, DNS & networking\n• Cybersecurity education & ethical hacking concepts\n\nPERSONALITY:\n• Intelligent, relaxed, mysterious and technical.\n• Practical, direct and concise.\n• Explain difficult things simply.\n• Provide useful code when needed.\n• Use emojis naturally.\n\nIDENTITY:\n• You are VOID, part of MARCO X WAQAR MD BOT.\n• Developers: Marco Malik (Developer) and WAQAR WRITES (Co-Owner)\n• Official channel: https://whatsapp.com/channel/0029VbE1PSOGzzKS8DCvLM32\n\nACCURACY:\n• Never invent MARCO X WAQAR MD BOT commands, features, links, environment variables or procedures.\n• If specific MARCO X WAQAR MD BOT information is unknown, say so instead of guessing.\n• For news and updates about the bot, point users to the official channel.\n• General technical questions can be answered using normal technical knowledge.\n\nSECURITY:\n• Never ask users to publicly share API keys, passwords, PATs, SESSION_IDs, cookies or other secrets.\n• Tell users to redact secrets from logs before sharing them.",
  geminiSessions = new Map(),
  groqSessions = new Map(),
  gptSessions = new Map(),
  mistralSessions = new Map(),
  wormgptSessions = new Map(),
  bingSessions = new Map();
function getHistory(_0x4dc1bc, _0x4183a0) {
  return _0x4dc1bc["get"](_0x4183a0) || [];
}
function pushHistory(_0x1c3726, _0x278285, _0x70b67b, _0x5cf6f0) {
  const _0x2053c7 = getHistory(_0x1c3726, _0x278285);
  _0x2053c7["push"]({ role: _0x70b67b, content: _0x5cf6f0 });
  if (_0x2053c7["length"] > 0x14) _0x2053c7["shift"]();
  _0x1c3726["set"](_0x278285, _0x2053c7);
}
function buildPrompt(_0x48fe73, _0x731b62) {
  let _0x4cb33b = "";
  for (const _0x2dcdfc of _0x48fe73) {
    _0x4cb33b +=
      (_0x2dcdfc["role"] === "user" ? "User" : "AI") +
      ":\x20" +
      _0x2dcdfc["content"] +
      "\x0a";
  }
  return ((_0x4cb33b += "User: " + _0x731b62), _0x4cb33b);
}
function httpsGetJSON(_0x4236f4) {
  return new Promise((_0x4afba7, _0x3c2d21) => {
    https["get"](_0x4236f4, (_0x4c2064) => {
      let _0x1c3f77 = "";
      (_0x4c2064["on"]("data", (_0x643648) => {
        _0x1c3f77 += _0x643648;
      }),
        _0x4c2064["on"]("end", () => {
          try {
            _0x4afba7(JSON["parse"](_0x1c3f77));
          } catch (_0x1abef9) {
            _0x3c2d21(_0x1abef9);
          }
        }));
    })["on"]("error", _0x3c2d21);
  });
}
function httpsPost(_0x482b3a, _0x18a671, _0x2aa769, _0x47e10a) {
  return new Promise((_0x4f295f, _0x15ac97) => {
    const _0x4cff8a = JSON["stringify"](_0x47e10a),
      _0x45c8b7 = https["request"](
        {
          hostname: _0x482b3a,
          path: _0x18a671,
          method: "POST",
          headers: {
            ..._0x2aa769,
            "Content-Length": Buffer["byteLength"](_0x4cff8a),
          },
        },
        (_0x54ced5) => {
          let _0x1b2808 = "";
          (_0x54ced5["on"]("data", (_0xdbbb32) => (_0x1b2808 += _0xdbbb32)),
            _0x54ced5["on"]("end", () => {
              try {
                _0x4f295f(JSON["parse"](_0x1b2808));
              } catch {
                _0x4f295f({ error: _0x1b2808 });
              }
            }));
        },
      );
    (_0x45c8b7["on"]("error", _0x15ac97),
      _0x45c8b7["write"](_0x4cff8a),
      _0x45c8b7["end"]());
  });
}
function downloadImage(_0x259bcf) {
  return new Promise((_0x5ce612, _0x576512) => {
    const _0x25cee9 = _0x259bcf["startsWith"]("https") ? https : http;
    _0x25cee9["get"](_0x259bcf, (_0x4a851f) => {
      const _0x2458a8 = [];
      (_0x4a851f["on"]("data", (_0x39c87d) => _0x2458a8["push"](_0x39c87d)),
        _0x4a851f["on"]("end", () => _0x5ce612(Buffer["concat"](_0x2458a8))),
        _0x4a851f["on"]("error", _0x576512));
    })["on"]("error", _0x576512);
  });
}
async function getAIReply(_0x24c559, _0x26d0e8) {
  const _0x5b69e3 = encodeURIComponent(_0x26d0e8),
    _0x58a065 = await httpsGetJSON(
      "" + KEITH_BASE + _0x24c559 + "?q=" + _0x5b69e3,
    );
  if (!_0x58a065["status"] || !_0x58a065["result"])
    throw new Error(
      _0x58a065["error"] || "API returned status false or missing result.",
    );
  return typeof _0x58a065["result"] === "string"
    ? _0x58a065["result"]
    : JSON["stringify"](_0x58a065["result"]);
}
function makeChatCommand({
  name: _0x2cf3dc,
  aliases: _0x5e4f9d,
  label: _0xf0d46f,
  emoji: _0x13533e,
  sessions: _0x37210c,
  endpointPath: _0x29124a,
  brandReplace: _0x2ac60c,
}) {
  return {
    name: _0x2cf3dc,
    aliases: _0x5e4f9d,
    description:
      "Chat with " +
      _0xf0d46f +
      " (remembers conversation). Usage: ." +
      _0x2cf3dc +
      " your question",
    async execute(_0x2a0331, _0x45c9b8, _0x5a751f) {
      const _0x76860c = _0x45c9b8["key"]["remoteJid"],
        _0x515e19 = _0x5a751f["join"]("\x20")["trim"](),
        _0x4a8a58 = _0x45c9b8["key"]["participant"] || _0x76860c;
      if (!_0x515e19)
        return _0x2a0331["sendMessage"](
          _0x76860c,
          {
            text:
              "❌ Usage: ." +
              _0x2cf3dc +
              " your question\n\n💡 Use ." +
              _0x2cf3dc +
              " -clear to reset conversation history.",
          },
          { quoted: _0x45c9b8 },
        );
      if (_0x515e19 === "-clear")
        return (
          _0x37210c["delete"](_0x4a8a58),
          _0x2a0331["sendMessage"](
            _0x76860c,
            { text: "🧹 *" + _0xf0d46f + " history cleared!* Fresh start." },
            { quoted: _0x45c9b8 },
          )
        );
      const _0x3ac213 = await _0x2a0331["sendMessage"](
        _0x76860c,
        { text: _0x13533e + "\x20" + _0xf0d46f + " is thinking..." },
        { quoted: _0x45c9b8 },
      );
      try {
        const _0x5a7c8a = getHistory(_0x37210c, _0x4a8a58),
          _0x3f7828 = buildPrompt(_0x5a7c8a, _0x515e19),
          _0x4ab529 = await getAIReply(_0x29124a, _0x3f7828),
          _0x316052 = _0x4ab529["replace"](_0x2ac60c[0x0], _0x2ac60c[0x1])[
            "replace"
          ](_0x2ac60c[0x2], _0x2ac60c[0x3]);
        (pushHistory(_0x37210c, _0x4a8a58, "user", _0x515e19),
          pushHistory(_0x37210c, _0x4a8a58, "assistant", _0x316052),
          await _0x2a0331["sendMessage"](
            _0x76860c,
            {
              text: _0x13533e + "\x20*" + _0xf0d46f + "*\n\n" + _0x316052,
              edit: _0x3ac213["key"],
            },
            { quoted: _0x45c9b8 },
          ));
      } catch (_0x2930fd) {
        await _0x2a0331["sendMessage"](
          _0x76860c,
          {
            text: "❌\x20" + _0xf0d46f + " error: " + _0x2930fd["message"],
            edit: _0x3ac213["key"],
          },
          { quoted: _0x45c9b8 },
        );
      }
    },
  };
}
module["exports"] = [
  makeChatCommand({
    name: "gpt",
    aliases: ["gpt4", "chatgpt"],
    label: "GPT-4 AI",
    emoji: "🧠",
    sessions: gptSessions,
    endpointPath: "/ai/gpt",
    brandReplace: [/Keith AI/gi, "MARCO X WAQAR AI", /Keithkeizzah/gi, "MARCO X WAQAR"],
  }),
  makeChatCommand({
    name: "groq",
    aliases: ["groqai"],
    label: "Groq AI",
    emoji: "⚡",
    sessions: groqSessions,
    endpointPath: "/ai/gpt",
    brandReplace: [/Keith AI/gi, "MARCO X WAQAR AI", /Keithkeizzah/gi, "MARCO X WAQAR"],
  }),
  makeChatCommand({
    name: "gemini",
    aliases: ["gai"],
    label: "Gemini AI",
    emoji: "🤖",
    sessions: geminiSessions,
    endpointPath: "/ai/gpt",
    brandReplace: [/Keith AI/gi, "MARCO X WAQAR AI", /Keithkeizzah/gi, "MARCO X WAQAR"],
  }),
  makeChatCommand({
    name: "bing",
    aliases: ["bingai", "msbing"],
    label: "Bing AI",
    emoji: "🔍",
    sessions: bingSessions,
    endpointPath: "/ai/gpt",
    brandReplace: [/Keith AI/gi, "MARCO X WAQAR AI", /Keithkeizzah/gi, "MARCO X WAQAR"],
  }),
  makeChatCommand({
    name: "mistral",
    aliases: ["mi"],
    label: "Mistral AI",
    emoji: "🌀",
    sessions: mistralSessions,
    endpointPath: "/ai/gpt",
    brandReplace: [/Keith AI/gi, "MARCO X WAQAR AI", /Keithkeizzah/gi, "MARCO X WAQAR"],
  }),
  {
    name: "wormgpt",
    description: "Chat with WormGPT AI. Usage: .wormgpt <prompt>",
    async execute(_0xadbd96, _0x10077c, _0x548a31) {
      const _0x384d27 = _0x10077c["key"]["remoteJid"],
        _0x561008 = _0x548a31["join"]("\x20")["trim"]();
      if (!_0x561008)
        return await _0xadbd96["sendMessage"](
          _0x384d27,
          {
            text:
              "🪱 *WORMGPT AI*\n\n" +
              "Example:\n" +
              ".wormgpt Tell me about black holes",
          },
          { quoted: _0x10077c },
        );
      let _0x1fd0c8;
      try {
        _0x1fd0c8 = await _0xadbd96["sendMessage"](
          _0x384d27,
          { text: "🪱 WormGPT is thinking..." },
          { quoted: _0x10077c },
        );
        let _0x35f42c = null;
        try {
          console["log"]("[WORMGPT] Trying Wolvarex API...");
          const { data: _0xd8d286 } = await axios["get"](WORMGPT_API, {
            params: { q: _0x561008, key: WORMGPT_KEY },
            timeout: 0x7530,
          });
          console["log"]("[WORMGPT] Wolvarex response received.");
          if (_0xd8d286) {
            if (typeof _0xd8d286["result"] === "string")
              _0x35f42c = _0xd8d286["result"];
            else
              _0xd8d286["result"] &&
                (_0x35f42c =
                  _0xd8d286["result"]["response"] ||
                  _0xd8d286["result"]["answer"] ||
                  _0xd8d286["result"]["text"] ||
                  null);
            (!_0x35f42c &&
              typeof _0xd8d286["response"] === "string" &&
              (_0x35f42c = _0xd8d286["response"]),
              !_0x35f42c &&
                typeof _0xd8d286["answer"] === "string" &&
                (_0x35f42c = _0xd8d286["answer"]),
              !_0x35f42c &&
                typeof _0xd8d286["text"] === "string" &&
                (_0x35f42c = _0xd8d286["text"]));
          }
          if (!_0x35f42c || !_0x35f42c["trim"]())
            throw new Error("Wolvarex returned an empty response");
        } catch (_0x298818) {
          console["error"]("[WORMGPT] Wolvarex failed:", _0x298818["message"]);
          try {
            console["log"]("[WORMGPT] Switching to Keith fallback...");
            const { data: _0x4863e2 } = await axios["get"](
              KEITH_BASE + "/ai/wormgpt",
              { params: { q: _0x561008 }, timeout: 0x7530 },
            );
            if (_0x4863e2) {
              if (typeof _0x4863e2["result"] === "string")
                _0x35f42c = _0x4863e2["result"];
              else
                _0x4863e2["result"] &&
                  (_0x35f42c =
                    _0x4863e2["result"]["response"] ||
                    _0x4863e2["result"]["answer"] ||
                    _0x4863e2["result"]["text"] ||
                    null);
              (!_0x35f42c &&
                typeof _0x4863e2["response"] === "string" &&
                (_0x35f42c = _0x4863e2["response"]),
                !_0x35f42c &&
                  typeof _0x4863e2["answer"] === "string" &&
                  (_0x35f42c = _0x4863e2["answer"]),
                !_0x35f42c &&
                  typeof _0x4863e2["text"] === "string" &&
                  (_0x35f42c = _0x4863e2["text"]));
            }
            if (!_0x35f42c || !_0x35f42c["trim"]())
              throw new Error("Keith API returned an empty response");
            console["log"]("[WORMGPT] Keith fallback successful.");
          } catch (_0x142f82) {
            return (
              console["error"](
                "[WORMGPT] Keith fallback failed:",
                _0x142f82["message"],
              ),
              await _0xadbd96["sendMessage"](
                _0x384d27,
                {
                  text:
                    "❌ *WORMGPT ERROR*\n\n" +
                    "Both WormGPT services are currently unavailable.",
                  edit: _0x1fd0c8?.["key"],
                },
                { quoted: _0x10077c },
              )
            );
          }
        }
        _0x35f42c = String(_0x35f42c)["trim"]();
        if (_0x35f42c["length"] <= 0xfa0)
          await _0xadbd96["sendMessage"](_0x384d27, {
            text: "🪱 *WORMGPT AI*\n\n" + _0x35f42c,
            edit: _0x1fd0c8["key"],
          });
        else {
          await _0xadbd96["sendMessage"](_0x384d27, {
            text: "🪱 *WORMGPT AI*\n\n" + _0x35f42c["slice"](0x0, 0xfa0),
            edit: _0x1fd0c8["key"],
          });
          for (
            let _0x3762c7 = 0xfa0;
            _0x3762c7 < _0x35f42c["length"];
            _0x3762c7 += 0xfa0
          ) {
            await _0xadbd96["sendMessage"](_0x384d27, {
              text: _0x35f42c["slice"](_0x3762c7, _0x3762c7 + 0xfa0),
            });
          }
        }
      } catch (_0x2e2c26) {
        (console["error"]("[WORMGPT ERROR]", _0x2e2c26),
          await _0xadbd96["sendMessage"](
            _0x384d27,
            {
              text:
                "❌ *WORMGPT ERROR*\n\n" + "Failed to process your request.",
              edit: _0x1fd0c8?.["key"],
            },
            { quoted: _0x10077c },
          ));
      }
    },
  },
  {
    name: "void",
    aliases: ["v", "voidai"],
    description: "Advanced technical AI assistant. Usage: .void your question",
    async execute(_0xbd040f, _0x3d5524, _0x5a9293) {
      const _0x5c1399 = _0x3d5524["key"]["remoteJid"],
        _0x10bba1 = _0x5a9293["join"]("\x20")["trim"]();
      if (!_0x10bba1)
        return _0xbd040f["sendMessage"](
          _0x5c1399,
          { text: "❌ Usage: .void your question" },
          { quoted: _0x3d5524 },
        );
      const _0x986bec = await _0xbd040f["sendMessage"](
        _0x5c1399,
        { text: "🌌 *VOID AI is thinking...*" },
        { quoted: _0x3d5524 },
      );
      try {
        const _0x1001b2 =
            VOID_SYSTEM_PROMPT["trim"]() +
            "\n\nUser: " +
            _0x10bba1 +
            "\n\nVOID:",
          _0x23517b = await askUncensored(_0x1001b2);
        await _0xbd040f["sendMessage"](
          _0x5c1399,
          { text: "🌌 *VOID AI*\n\n" + _0x23517b, edit: _0x986bec["key"] },
          { quoted: _0x3d5524 },
        );
      } catch (_0x57a468) {
        await _0xbd040f["sendMessage"](
          _0x5c1399,
          {
            text: "❌ VOID error: " + _0x57a468["message"],
            edit: _0x986bec["key"],
          },
          { quoted: _0x3d5524 },
        );
      }
    },
  },
  {
    name: "worm",
    aliases: ["wgpt", "dark", "darkgpt"],
    description: "WormGPT with conversation memory. Usage: .worm your question",
    async execute(_0x502dec, _0x50d00f, _0x76a619) {
      const _0x5bf6ab = _0x50d00f["key"]["remoteJid"],
        _0x394e96 = _0x76a619["join"]("\x20")["trim"](),
        _0x51c31b = _0x50d00f["key"]["participant"] || _0x5bf6ab;
      if (!_0x394e96)
        return _0x502dec["sendMessage"](
          _0x5bf6ab,
          {
            text: "❌ Usage: .worm your question\n\n💡 Use .worm -clear to reset conversation history.",
          },
          { quoted: _0x50d00f },
        );
      if (_0x394e96 === "-clear")
        return (
          wormgptSessions["delete"](_0x51c31b),
          _0x502dec["sendMessage"](
            _0x5bf6ab,
            { text: "🧹 *WormGPT history cleared!* Fresh start." },
            { quoted: _0x50d00f },
          )
        );
      const _0x2adbed = await _0x502dec["sendMessage"](
        _0x5bf6ab,
        { text: "☠️ WormGPT is thinking..." },
        { quoted: _0x50d00f },
      );
      try {
        const _0x41021b =
            "\nYou are WormGPT, a dark cyberpunk AI assistant with memory.\nYou are witty, mysterious, sarcastic, and entertaining.\nUse emojis naturally when they fit the mood (💀🔥😈🧪😂).\nRemember previous messages in the conversation and maintain context.\nCreated by Marco Malik and WAQAR WRITES.\n",
          _0x361e24 = getHistory(wormgptSessions, _0x51c31b),
          _0x2f6f2f = buildPrompt(_0x361e24, _0x394e96),
          _0x3994f = _0x41021b + "\x0a\x0a" + _0x2f6f2f + "\n\nWormGPT:",
          _0xd9310c = await askUncensored(_0x3994f);
        (pushHistory(wormgptSessions, _0x51c31b, "user", _0x394e96),
          pushHistory(wormgptSessions, _0x51c31b, "assistant", _0xd9310c),
          await _0x502dec["sendMessage"](
            _0x5bf6ab,
            { text: "☠️ *WormGPT*\n\n" + _0xd9310c, edit: _0x2adbed["key"] },
            { quoted: _0x50d00f },
          ));
      } catch (_0x1fb1cd) {
        await _0x502dec["sendMessage"](
          _0x5bf6ab,
          {
            text: "❌ WormGPT error: " + _0x1fb1cd["message"],
            edit: _0x2adbed["key"],
          },
          { quoted: _0x50d00f },
        );
      }
    },
  },
  {
    name: "dall",
    description: "Generate AI image. Usage: .dall your prompt",
    async execute(_0x49ae95, _0x533851, _0x10e1f4) {
      const _0x176bf0 = _0x533851["key"]["remoteJid"],
        _0x4a017e = _0x10e1f4["join"]("\x20");
      if (!_0x4a017e)
        return _0x49ae95["sendMessage"](
          _0x176bf0,
          { text: "❌ Usage: .dall your image prompt" },
          { quoted: _0x533851 },
        );
      const _0x4eab21 = await _0x49ae95["sendMessage"](
        _0x176bf0,
        { text: "🎨 Generating image..." },
        { quoted: _0x533851 },
      );
      try {
        const _0x5966fa = encodeURIComponent(_0x4a017e),
          _0x6e3839 =
            "https://image.pollinations.ai/prompt/" +
            _0x5966fa +
            "?width=512&height=512&nologo=true",
          _0x33c974 = await downloadImage(_0x6e3839);
        (await _0x49ae95["sendMessage"](
          _0x176bf0,
          {
            image: _0x33c974,
            caption: "🎨 *AI Image*\n📝 Prompt: " + _0x4a017e,
          },
          { quoted: _0x533851 },
        ),
          await _0x49ae95["sendMessage"](_0x176bf0, {
            delete: _0x4eab21["key"],
          })["catch"](() => {}));
      } catch (_0x455c98) {
        await _0x49ae95["sendMessage"](_0x176bf0, {
          text: "❌ Image generation error: " + _0x455c98["message"],
          edit: _0x4eab21["key"],
        });
      }
    },
  },
  {
    name: "upscale",
    description: "Upscale an image using AI. Reply to an image with .upscale",
    async execute(_0x48ddfe, _0x457860) {
      const _0xdf0050 = _0x457860["key"]["remoteJid"],
        _0x144271 =
          _0x457860["message"]?.["extendedTextMessage"]?.["contextInfo"],
        _0x1ca1f0 = _0x144271?.["quotedMessage"];
      if (!_0x1ca1f0?.["imageMessage"])
        return _0x48ddfe["sendMessage"](
          _0xdf0050,
          { text: "❌ Reply to an image with .upscale" },
          { quoted: _0x457860 },
        );
      const _0x733979 = await _0x48ddfe["sendMessage"](
          _0xdf0050,
          { text: "🔍 Upscaling image..." },
          { quoted: _0x457860 },
        ),
        _0x18dd66 = require("form-data"),
        _0x26c38c = require("fs"),
        _0x35e86a = require("os");
      try {
      } catch (_0x29639c) {
        await _0x48ddfe["sendMessage"](_0xdf0050, {
          text: "❌ Upscale error: " + _0x29639c["message"],
          edit: _0x733979["key"],
        });
      }
    },
  },
];
