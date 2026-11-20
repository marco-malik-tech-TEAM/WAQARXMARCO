const { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { exec, execSync } = require("child_process"),
  fs = require("fs"),
  path = require("path"),
  os = require("os"),
  crypto = require("crypto");
let FFMPEG_PATH = "ffmpeg";
try {
  FFMPEG_PATH = require("ffmpeg-static");
} catch {
  try {
    const found = execSync(
      "which ffmpeg 2>/dev/null || command -v ffmpeg 2>/dev/null",
    )
      ["toString"]()
      ["trim"]();
    if (found) FFMPEG_PATH = found;
  } catch {}
}
function resolveJid(_0xd44556) {
  const _0x3b530a = _0xd44556["key"]["remoteJid"];
  return _0x3b530a["endsWith"]("@lid") && _0xd44556["key"]["remoteJidAlt"]
    ? _0xd44556["key"]["remoteJidAlt"]
    : _0x3b530a;
}
function execAsync(_0x93e749) {
  return new Promise((_0x3a4f0f, _0x2c8e75) => {
    exec(_0x93e749, { env: process.env }, (_0x4134c5, _0x40048c, _0x23d62e) => {
      if (_0x4134c5) _0x2c8e75(new Error(_0x23d62e || _0x4134c5["message"]));
      else _0x3a4f0f(_0x40048c);
    });
  });
}
async function fetchJson(_0x1bd645) {
  const _0x2d0422 = await fetch(_0x1bd645);
  if (!_0x2d0422["ok"]) throw new Error("HTTP " + _0x2d0422["status"]);
  return _0x2d0422["json"]();
}
async function fetchText(_0x822410) {
  const _0x37876a = await fetch(_0x822410);
  if (!_0x37876a["ok"]) throw new Error("HTTP " + _0x37876a["status"]);
  return _0x37876a["text"]();
}
function generateUUID() {
  if (crypto["randomUUID"]) return crypto["randomUUID"]();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"["replace"](
    /[xy]/g,
    (_0x50212b) => {
      const _0x3e7f60 = (Math["random"]() * 0x10) | 0x0;
      return (_0x50212b === "x" ? _0x3e7f60 : (_0x3e7f60 & 0x3) | 0x8)[
        "toString"
      ](0x10);
    },
  );
}
async function applyAudioEffect(_0x5c3875, _0x562d67, _0xc321b3, _0x10a5aa) {
  const _0xe04c7 = resolveJid(_0x562d67),
    _0x5aa3cb = _0x562d67["message"]?.["extendedTextMessage"]?.["contextInfo"],
    _0x20610f = _0x5aa3cb?.["quotedMessage"];
  if (!_0x20610f || (!_0x20610f["audioMessage"] && !_0x20610f["videoMessage"]))
    return _0x5c3875["sendMessage"](
      _0xe04c7,
      {
        text:
          "❌ Reply to an audio or voice message to apply the *" +
          _0x10a5aa +
          "* effect.",
      },
      { quoted: _0x562d67 },
    );
  await _0x5c3875["sendMessage"](
    _0xe04c7,
    { text: "⏳ Applying *" + _0x10a5aa + "* effect..." },
    { quoted: _0x562d67 },
  );
  const _0x3b2284 = path["join"](
      os["tmpdir"](),
      "bot_in_" + Date["now"]() + ".mp3",
    ),
    _0x230d61 = path["join"](
      os["tmpdir"](),
      "bot_out_" + Date["now"]() + ".mp3",
    );
  try {
    const _0x166b91 = await downloadMediaMessage(
      {
        message: _0x20610f,
        key: {
          remoteJid: _0xe04c7,
          id: _0x5aa3cb["stanzaId"],
          participant: _0x5aa3cb["participant"],
        },
      },
      "buffer",
      {},
    );
    (fs["writeFileSync"](_0x3b2284, _0x166b91),
      await execAsync(
        "\x22" +
          FFMPEG_PATH +
          '" -y -i "' +
          _0x3b2284 +
          '" -af "' +
          _0xc321b3 +
          '" "' +
          _0x230d61 +
          "\x22",
      ));
    const _0x49807f = fs["readFileSync"](_0x230d61);
    await _0x5c3875["sendMessage"](
      _0xe04c7,
      {
        audio: _0x49807f,
        mimetype: "audio/mpeg",
        ptt: !!_0x20610f["audioMessage"]?.["ptt"],
      },
      { quoted: _0x562d67 },
    );
  } catch (_0x5c6d6d) {
    (console["error"]("[audioeffect:" + _0x10a5aa + "]", _0x5c6d6d["message"]),
      await _0x5c3875["sendMessage"](
        _0xe04c7,
        {
          text:
            "❌ Failed to apply *" + _0x10a5aa + "*: " + _0x5c6d6d["message"],
        },
        { quoted: _0x562d67 },
      ));
  } finally {
    if (fs["existsSync"](_0x3b2284)) fs["unlinkSync"](_0x3b2284);
    if (fs["existsSync"](_0x230d61)) fs["unlinkSync"](_0x230d61);
  }
}
const FLIP_MAP = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "l",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  B: "q",
  C: "Ɔ",
  D: "p",
  E: "Ǝ",
  F: "Ⅎ",
  G: "פ",
  H: "H",
  I: "I",
  J: "ɾ",
  K: "ʞ",
  L: "˥",
  M: "W",
  N: "N",
  O: "O",
  P: "d",
  Q: "b",
  R: "ɹ",
  S: "S",
  T: "┴",
  U: "∩",
  V: "Λ",
  W: "M",
  X: "X",
  Y: "⅄",
  Z: "Z",
  0: "0",
  1: "Ɩ",
  2: "ᄅ",
  3: "Ɛ",
  4: "ㄣ",
  5: "ϛ",
  6: "9",
  7: "ㄥ",
  8: "8",
  9: "6",
  ".": "˙",
  ",": "\x27",
  "!": "¡",
  "?": "¿",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
  _: "‾",
  "&": "⅄",
};
module["exports"] = [
  {
    name: "bass",
    aliases: ["bassboost"],
    description:
      "Boost bass on a voice/audio message. Reply to audio with .bass",
    execute: (_0xd13e8a, _0x1fafd9) =>
      applyAudioEffect(_0xd13e8a, _0x1fafd9, "bass=g=20", "Bass Boost"),
  },
  {
    name: "deep",
    description: "Make audio deeper (lower pitch). Reply to audio with .deep",
    execute: (_0x19a08c, _0x4d4f48) =>
      applyAudioEffect(
        _0x19a08c,
        _0x4d4f48,
        "asetrate=44100*0.8,aresample=44100",
        "Deep",
      ),
  },
  {
    name: "robot",
    description: "Apply robot voice effect. Reply to audio with .robot",
    execute: (_0x10813d, _0x5077d9) =>
      applyAudioEffect(_0x10813d, _0x5077d9, "aecho=0.8:0.88:60:0.4", "Robot"),
  },
  {
    name: "chipmunk",
    description: "Chipmunk voice effect. Reply to audio with .chipmunk",
    execute: (_0x2cb49a, _0x1dcaa1) =>
      applyAudioEffect(
        _0x2cb49a,
        _0x1dcaa1,
        "asetrate=44100*1.6,aresample=44100",
        "Chipmunk",
      ),
  },
  {
    name: "nightcore",
    description:
      "Nightcore effect (faster + higher pitch). Reply to audio with .nightcore",
    execute: (_0x3b2680, _0x2a5596) =>
      applyAudioEffect(
        _0x3b2680,
        _0x2a5596,
        "asetrate=44100*1.25,aresample=44100,bass=g=3",
        "Nightcore",
      ),
  },
  {
    name: "reverse",
    aliases: ["reverseaudio"],
    description: "Reverse an audio message. Reply to audio with .reverse",
    execute: (_0x4ce838, _0x298037) =>
      applyAudioEffect(_0x4ce838, _0x298037, "areverse", "Reverse"),
  },
  {
    name: "slow",
    description: "Slow audio to 75% speed. Reply to audio with .slow",
    execute: (_0x5cab17, _0xa54c86) =>
      applyAudioEffect(_0x5cab17, _0xa54c86, "atempo=0.75", "Slow"),
  },
  {
    name: "fast",
    description: "Speed audio up to 1.5x. Reply to audio with .fast",
    execute: (_0x197d0c, _0x593a31) =>
      applyAudioEffect(_0x197d0c, _0x593a31, "atempo=1.5", "Fast"),
  },
  {
    name: "earrape",
    description:
      "Ear rape effect (extreme volume). Reply to audio with .earrape",
    execute: (_0x77f3c6, _0x545617) =>
      applyAudioEffect(_0x77f3c6, _0x545617, "volume=20", "Earrape"),
  },
  {
    name: "fliptext",
    aliases: ["upsidedown", "flip"],
    description:
      "Flip text upside down. Usage: .fliptext <text> or reply to a text",
    async execute(_0x456313, _0x2d3134, _0x5847ee) {
      const _0x37309f = resolveJid(_0x2d3134);
      let _0x2c8e04 = _0x5847ee["join"]("\x20");
      if (!_0x2c8e04) {
        const _0x109f50 =
            _0x2d3134["message"]?.["extendedTextMessage"]?.["contextInfo"],
          _0xd0b336 = _0x109f50?.["quotedMessage"];
        _0x2c8e04 =
          _0xd0b336?.["conversation"] ||
          _0xd0b336?.["extendedTextMessage"]?.["text"] ||
          "";
      }
      if (!_0x2c8e04)
        return _0x456313["sendMessage"](
          _0x37309f,
          { text: "❌ Usage: .fliptext <text> or reply to a text message" },
          { quoted: _0x2d3134 },
        );
      const _0x5f1db3 = _0x2c8e04["split"]("")
        ["map"]((_0x1b7a52) => FLIP_MAP[_0x1b7a52] || _0x1b7a52)
        ["reverse"]()
        ["join"]("");
      return _0x456313["sendMessage"](
        _0x37309f,
        { text: _0x5f1db3 },
        { quoted: _0x2d3134 },
      );
    },
  },
  {
    name: "uuid",
    description: "Generate a random UUID. Usage: .uuid",
    async execute(_0x2fb3dc, _0x596688) {
      const _0x1e5e12 = resolveJid(_0x596688);
      return _0x2fb3dc["sendMessage"](
        _0x1e5e12,
        { text: "🔑 *UUID:*\n`" + generateUUID() + "`" },
        { quoted: _0x596688 },
      );
    },
  },
  {
    name: "wiki",
    aliases: ["wikipedia"],
    description: "Search Wikipedia for a topic. Usage: .wiki <topic>",
    async execute(_0x1c0b62, _0x1f49df, _0x19dc53) {
      const _0x3bb1c4 = resolveJid(_0x1f49df),
        _0x3e3a4b = _0x19dc53["join"]("\x20");
      if (!_0x3e3a4b)
        return _0x1c0b62["sendMessage"](
          _0x3bb1c4,
          { text: "❌ Usage: .wiki <topic>" },
          { quoted: _0x1f49df },
        );
      try {
        const _0x31a7ba = await fetchJson(
          "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(_0x3e3a4b),
        );
        if (_0x31a7ba["type"] === "disambiguation")
          return _0x1c0b62["sendMessage"](
            _0x3bb1c4,
            {
              text:
                "⚠️ *" +
                _0x31a7ba["title"] +
                "* is a disambiguation page — please be more specific.\n\n" +
                _0x31a7ba["extract"],
            },
            { quoted: _0x1f49df },
          );
        const _0x422681 = [
          "📖 *" + _0x31a7ba["title"] + "*",
          "",
          _0x31a7ba["extract"],
          "",
          "🔗 " + (_0x31a7ba["content_urls"]?.["desktop"]?.["page"] || ""),
        ]
          ["join"]("\x0a")
          ["trim"]();
        return _0x1c0b62["sendMessage"](
          _0x3bb1c4,
          { text: _0x422681 },
          { quoted: _0x1f49df },
        );
      } catch {
        return _0x1c0b62["sendMessage"](
          _0x3bb1c4,
          { text: "❌ No Wikipedia article found for *" + _0x3e3a4b + "*." },
          { quoted: _0x1f49df },
        );
      }
    },
  },
  {
    name: "whois",
    description: "WHOIS lookup for a domain. Usage: .whois <domain>",
    async execute(_0x97f007, _0xa271e4, _0xd407c4) {
      const _0x1b5657 = resolveJid(_0xa271e4),
        _0x3c7f90 = _0xd407c4[0x0];
      if (!_0x3c7f90)
        return _0x97f007["sendMessage"](
          _0x1b5657,
          { text: "❌ Usage: .whois <domain>" },
          { quoted: _0xa271e4 },
        );
      try {
        const _0x143430 = await fetchText(
          "https://api.hackertarget.com/whois/?q=" +
            encodeURIComponent(_0x3c7f90),
        );
        if (
          _0x143430["includes"]("error") ||
          _0x143430["includes"]("API count exceeded") ||
          _0x143430["includes"]("must be a valid")
        )
          return _0x97f007["sendMessage"](
            _0x1b5657,
            {
              text:
                "❌ Could not fetch WHOIS for *" +
                _0x3c7f90 +
                "*. Check the domain and try again.",
            },
            { quoted: _0xa271e4 },
          );
        const _0x5cee39 =
          _0x143430["length"] > 0xbb8
            ? _0x143430["substring"](0x0, 0xbb8) + "\n...(truncated)"
            : _0x143430;
        return _0x97f007["sendMessage"](
          _0x1b5657,
          { text: "🔍 *WHOIS: " + _0x3c7f90 + "*\n```" + _0x5cee39 + "```" },
          { quoted: _0xa271e4 },
        );
      } catch (_0x151ca7) {
        return _0x97f007["sendMessage"](
          _0x1b5657,
          { text: "❌ WHOIS lookup failed: " + _0x151ca7["message"] },
          { quoted: _0xa271e4 },
        );
      }
    },
  },
  {
    name: "geoip",
    aliases: ["ip"],
    description: "Get geolocation info for an IP address. Usage: .geoip <ip>",
    async execute(_0x47007a, _0x5633a9, _0x16c43c) {
      const _0x4fbd4a = resolveJid(_0x5633a9),
        _0x152e1d = _0x16c43c[0x0];
      if (!_0x152e1d)
        return _0x47007a["sendMessage"](
          _0x4fbd4a,
          { text: "❌ Usage: .geoip <ip address>" },
          { quoted: _0x5633a9 },
        );
      try {
        const _0x32d6ba = await fetchJson(
          "http://ip-api.com/json/" +
            encodeURIComponent(_0x152e1d) +
            "?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query",
        );
        if (_0x32d6ba["status"] !== "success")
          return _0x47007a["sendMessage"](
            _0x4fbd4a,
            {
              text: "❌\x20" + (_0x32d6ba["message"] || "Failed to lookup IP."),
            },
            { quoted: _0x5633a9 },
          );
        const _0x3fbc18 = [
          "🌍 *GeoIP: " + _0x32d6ba["query"] + "*",
          "",
          "🏳️ Country: " +
            _0x32d6ba["country"] +
            "\x20(" +
            _0x32d6ba["countryCode"] +
            ")",
          "🏙️ Region: " + _0x32d6ba["regionName"],
          "🏘️ City: " + _0x32d6ba["city"],
          "📮 ZIP: " + _0x32d6ba["zip"],
          "📍 Coordinates: " + _0x32d6ba["lat"] + ",\x20" + _0x32d6ba["lon"],
          "🕐 Timezone: " + _0x32d6ba["timezone"],
          "🌐 ISP: " + _0x32d6ba["isp"],
          "🏢 Org: " + _0x32d6ba["org"],
          "📡 AS: " + _0x32d6ba["as"],
        ]["join"]("\x0a");
        return _0x47007a["sendMessage"](
          _0x4fbd4a,
          { text: _0x3fbc18 },
          { quoted: _0x5633a9 },
        );
      } catch (_0x940da7) {
        return _0x47007a["sendMessage"](
          _0x4fbd4a,
          { text: "❌ GeoIP lookup failed: " + _0x940da7["message"] },
          { quoted: _0x5633a9 },
        );
      }
    },
  },
  {
    name: "ytsearch",
    aliases: ["yts"],
    description: "Search YouTube for videos. Usage: .ytsearch <query>",
    async execute(_0x390613, _0x575c70, _0x6df684) {
      const _0x1c2364 = resolveJid(_0x575c70),
        _0x38f2ae = _0x6df684["join"]("\x20");
      if (!_0x38f2ae)
        return _0x390613["sendMessage"](
          _0x1c2364,
          { text: "❌ Usage: .ytsearch <query>" },
          { quoted: _0x575c70 },
        );
      try {
        const _0x100373 = await fetchJson(
            "https://yt.lemnoslife.com/noKey/search?q=" +
              encodeURIComponent(_0x38f2ae) +
              "&part=snippet&type=video&maxResults=5",
          ),
          _0x9a057d = _0x100373?.["items"];
        if (!_0x9a057d || _0x9a057d["length"] === 0x0)
          return _0x390613["sendMessage"](
            _0x1c2364,
            { text: "❌ No results found for *" + _0x38f2ae + "*." },
            { quoted: _0x575c70 },
          );
        const _0x16507c = _0x9a057d["slice"](0x0, 0x5)
          ["map"]((_0x3dd7ef, _0x1cd636) => {
            const _0x1197b3 = _0x3dd7ef["snippet"]?.["title"] || "Unknown",
              _0x411358 = _0x3dd7ef["snippet"]?.["channelTitle"] || "Unknown",
              _0x2102f3 = _0x3dd7ef["id"]?.["videoId"],
              _0x584195 = _0x2102f3 ? "https://youtu.be/" + _0x2102f3 : "N/A";
            return (
              _0x1cd636 +
              0x1 +
              ". *" +
              _0x1197b3 +
              "*\n   📺 " +
              _0x411358 +
              "\n   🔗 " +
              _0x584195
            );
          })
          ["join"]("\x0a\x0a");
        return _0x390613["sendMessage"](
          _0x1c2364,
          { text: "🔍 *YouTube: " + _0x38f2ae + "*\n\n" + _0x16507c },
          { quoted: _0x575c70 },
        );
      } catch (_0x1e5495) {
        return _0x390613["sendMessage"](
          _0x1c2364,
          { text: "❌ YouTube search failed: " + _0x1e5495["message"] },
          { quoted: _0x575c70 },
        );
      }
    },
  },
  {
    name: "nba",
    description: "Get today's NBA scores. Usage: .nba",
    async execute(_0x4d36bb, _0x2eeab6) {
      const _0x403e63 = resolveJid(_0x2eeab6);
      try {
        const _0x24bb16 = await fetchJson(
            "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
          ),
          _0x558fdc = _0x24bb16?.["events"];
        if (!_0x558fdc || _0x558fdc["length"] === 0x0)
          return _0x4d36bb["sendMessage"](
            _0x403e63,
            { text: "🏀 No NBA games scheduled today." },
            { quoted: _0x2eeab6 },
          );
        const _0x52f6a9 = _0x558fdc["map"]((_0x15d639) => {
          const _0x498376 = _0x15d639["competitions"]?.[0x0],
            _0x38b239 = _0x498376?.["competitors"]?.["find"](
              (_0x1e9b7a) => _0x1e9b7a["homeAway"] === "home",
            ),
            _0x225bb0 = _0x498376?.["competitors"]?.["find"](
              (_0x30f3bf) => _0x30f3bf["homeAway"] === "away",
            ),
            _0x418797 =
              _0x498376?.["status"]?.["type"]?.["shortDetail"] || "Scheduled";
          return (
            "🏀 *" +
            _0x225bb0?.["team"]?.["abbreviation"] +
            "\x20" +
            (_0x225bb0?.["score"] ?? "-") +
            "* vs *" +
            (_0x38b239?.["score"] ?? "-") +
            "\x20" +
            _0x38b239?.["team"]?.["abbreviation"] +
            "*\n   📍 " +
            _0x418797
          );
        })["join"]("\x0a\x0a");
        return _0x4d36bb["sendMessage"](
          _0x403e63,
          { text: "🏀 *NBA Scores*\n\n" + _0x52f6a9 },
          { quoted: _0x2eeab6 },
        );
      } catch (_0x30242d) {
        return _0x4d36bb["sendMessage"](
          _0x403e63,
          { text: "❌ Failed to fetch NBA scores: " + _0x30242d["message"] },
          { quoted: _0x2eeab6 },
        );
      }
    },
  },
];
