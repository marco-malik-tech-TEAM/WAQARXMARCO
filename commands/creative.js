"use strict";
const fs = require("fs"),
  path = require("path"),
  axios = require("axios"),
  kit = require("../utils/mediaKit"),
  {
    ff,
    makeDir,
    rmDir,
    num,
    pickOne,
    seedFrom,
    dayKey,
    parseTime,
    stamp,
    textLayer,
    textStrip,
    THEMES,
    hx,
    bgChain,
    cardImage,
    futuristicImage,
    parseThemeWord,
  } = kit,
  BM = kit["BRAND"],
  TAG = kit["TAG"],
  UA = kit["UA"],
  mathMap =
    (_0x4a04eb, _0x405deb, _0x2a9a7a = {}) =>
    (_0x5b174b) => {
      if (_0x2a9a7a[_0x5b174b]) return _0x2a9a7a[_0x5b174b];
      const _0x32eb91 = _0x5b174b["charCodeAt"](0x0);
      if (_0x32eb91 >= 0x41 && _0x32eb91 <= 0x5a)
        return String["fromCodePoint"](_0x4a04eb + _0x32eb91 - 0x41);
      if (_0x32eb91 >= 0x61 && _0x32eb91 <= 0x7a)
        return String["fromCodePoint"](_0x405deb + _0x32eb91 - 0x61);
      return _0x5b174b;
    },
  SMALLCAPS = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "ꜱ",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ",
  },
  NICK_FONTS = [
    mathMap(0x1d400, 0x1d41a),
    mathMap(0x1d4d0, 0x1d4ea),
    mathMap(0x1d56c, 0x1d586),
    mathMap(0x1d538, 0x1d552, {
      C: "ℂ",
      H: "ℍ",
      N: "ℕ",
      P: "ℙ",
      Q: "ℚ",
      R: "ℝ",
      Z: "ℤ",
    }),
    (_0x704971) => SMALLCAPS[_0x704971["toLowerCase"]()] || _0x704971,
    mathMap(0x1d63c, 0x1d656),
    mathMap(0x24b6, 0x24d0),
  ],
  NICK_FRAMES = [
    "꧁༺ {n} ༻꧂",
    "★彡 {n} 彡★",
    "『{n}』",
    "✦•······• {n} •······•✦",
    "☠️ {n} ☠️",
    "⚡ {n} ⚡",
    "【{n}】",
    "•°¯`•.•´¯`•. {n} .•´¯`•.•°",
    "♛ {n} ♛",
    "༒ {n} ༒",
    "⫷ {n} ⫸",
    "▄︻デ {n} ══━一",
    "🔥 {n} 🔥",
    "❖ {n} ❖",
  ],
  span = (..._0x100e7b) =>
    _0x100e7b["flatMap"](([_0x3d067c, _0x27a812]) =>
      Array["from"](
        { length: (_0x27a812 || _0x3d067c) - _0x3d067c + 0x1 },
        (_0x2fa735, _0x59ccbd) => String["fromCharCode"](_0x3d067c + _0x59ccbd),
      ),
    ),
  ZALGO_UP = span(
    [0x300, 0x314],
    [0x33d, 0x344],
    [0x346],
    [0x34a, 0x34c],
    [0x350, 0x352],
    [0x357],
    [0x35b],
    [0x363, 0x36f],
  ),
  ZALGO_MID = span(
    [0x315],
    [0x31b],
    [0x321, 0x322],
    [0x327, 0x328],
    [0x334, 0x338],
    [0x35c, 0x362],
  ),
  ZALGO_DOWN = span(
    [0x316, 0x319],
    [0x31c, 0x320],
    [0x323, 0x326],
    [0x329, 0x333],
    [0x339, 0x33c],
    [0x345],
    [0x347, 0x349],
    [0x34d, 0x34e],
    [0x353, 0x356],
    [0x359, 0x35a],
  );
function zalgo(_0x349dff, _0xc986a8) {
  const _0x2c8f44 = {
      low: [0x1, 0x2, 0x1],
      mid: [0x3, 0x1, 0x3],
      max: [0x6, 0x2, 0x6],
    }[_0xc986a8] || [0x3, 0x1, 0x3],
    _0x58bed2 = (_0x1ecd9a, _0x5bfd56) =>
      Array["from"](
        {
          length:
            Math["floor"](Math["random"]() * _0x5bfd56) +
            (_0x5bfd56 ? 0x1 : 0x0),
        },
        () => pickOne(_0x1ecd9a),
      )["join"]("");
  return Array["from"](_0x349dff)
    ["map"]((_0x5bd7e3) =>
      /\s/["test"](_0x5bd7e3)
        ? _0x5bd7e3
        : _0x5bd7e3 +
          _0x58bed2(ZALGO_UP, _0x2c8f44[0x0]) +
          _0x58bed2(ZALGO_MID, _0x2c8f44[0x1]) +
          _0x58bed2(ZALGO_DOWN, _0x2c8f44[0x2]),
    )
    ["join"]("");
}
const FRAMES = [
  { name: "Double line", top: "╔{h}╗", mid: "║ {t} ║", bot: "╚{h}╝", h: "═" },
  { name: "Rounded", top: "╭{h}╮", mid: "│ {t} │", bot: "╰{h}╯", h: "─" },
  { name: "Heavy", top: "┏{h}┓", mid: "┃ {t} ┃", bot: "┗{h}┛", h: "━" },
  { name: "Stars", top: "✦{h}✦", mid: "✧ {t} ✧", bot: "✦{h}✦", h: "✦" },
  { name: "Plain", top: "+{h}+", mid: "| {t} |", bot: "+{h}+", h: "-" },
  { name: "Hearts", top: "♥{h}♥", mid: "♡ {t} ♡", bot: "♥{h}♥", h: "♥" },
];
function frameText(_0x458797, _0x365230) {
  const _0x47fdeb = String(_0x458797)
      ["split"]("\x0a")
      ["flatMap"]((_0x371bf9) => {
        const _0x7b7975 = [];
        let _0x5a2305 = _0x371bf9["trim"]();
        while (_0x5a2305["length"] > 0x16) {
          let _0x4f36f4 = _0x5a2305["lastIndexOf"]("\x20", 0x16);
          if (_0x4f36f4 < 0x6) _0x4f36f4 = 0x16;
          (_0x7b7975["push"](_0x5a2305["slice"](0x0, _0x4f36f4)["trim"]()),
            (_0x5a2305 = _0x5a2305["slice"](_0x4f36f4)["trim"]()));
        }
        return (_0x7b7975["push"](_0x5a2305), _0x7b7975);
      }),
    _0x2ef383 = Math["max"](
      ..._0x47fdeb["map"]((_0x2f76af) => Array["from"](_0x2f76af)["length"]),
    ),
    _0x6cb914 = _0x365230["h"]["repeat"](_0x2ef383 + 0x2);
  return [
    _0x365230["top"]["replace"]("{h}", _0x6cb914),
    ..._0x47fdeb["map"]((_0xb2363c) =>
      _0x365230["mid"]["replace"](
        "{t}",
        _0xb2363c +
          "\x20"["repeat"](_0x2ef383 - Array["from"](_0xb2363c)["length"]),
      ),
    ),
    _0x365230["bot"]["replace"]("{h}", _0x6cb914),
  ]["join"]("\x0a");
}
const RAINBOW_SQ = ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪"],
  RAINBOW_HEART = ["❤️", "🧡", "💛", "💚", "💙", "💜"],
  GLYPHS = {
    A: [" ### ", "#   #", "#####", "#   #", "#   #"],
    B: ["#### ", "#   #", "#### ", "#   #", "#### "],
    C: [" ####", "#    ", "#    ", "#    ", " ####"],
    D: ["#### ", "#   #", "#   #", "#   #", "#### "],
    E: ["#####", "#    ", "#### ", "#    ", "#####"],
    F: ["#####", "#    ", "#### ", "#    ", "#    "],
    G: [" ####", "#    ", "#  ##", "#   #", " ####"],
    H: ["#   #", "#   #", "#####", "#   #", "#   #"],
    I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
    J: ["#####", "   # ", "   # ", "#  # ", " ##  "],
    K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
    L: ["#    ", "#    ", "#    ", "#    ", "#####"],
    M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
    N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
    O: [" ### ", "#   #", "#   #", "#   #", " ### "],
    P: ["#### ", "#   #", "#### ", "#    ", "#    "],
    Q: [" ### ", "#   #", "# # #", "#  # ", " ## #"],
    R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
    S: [" ####", "#    ", " ### ", "    #", "#### "],
    T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
    U: ["#   #", "#   #", "#   #", "#   #", " ### "],
    V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
    W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
    X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
    Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
    Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
    0x0: [" ### ", "#  ##", "# # #", "##  #", " ### "],
    0x1: ["  #  ", " ##  ", "  #  ", "  #  ", " ### "],
    0x2: [" ### ", "#   #", "  ## ", " #   ", "#####"],
    0x3: ["#### ", "    #", " ### ", "    #", "#### "],
    0x4: ["#   #", "#   #", "#####", "    #", "    #"],
    0x5: ["#####", "#    ", "#### ", "    #", "#### "],
    0x6: [" ### ", "#    ", "#### ", "#   #", " ### "],
    0x7: ["#####", "   # ", "  #  ", " #   ", " #   "],
    0x8: [" ### ", "#   #", " ### ", "#   #", " ### "],
    0x9: [" ### ", "#   #", " ####", "    #", " ### "],
    "\x20": ["   ", "   ", "   ", "   ", "   "],
    "!": ["  #  ", "  #  ", "  #  ", "     ", "  #  "],
    "?": [" ### ", "    #", "  ## ", "     ", "  #  "],
    "-": ["     ", "     ", "#####", "     ", "     "],
    ".": ["     ", "     ", "     ", "     ", "  #  "],
  };
function asciiArt(_0x1d2ed6, _0x1d7f00) {
  const _0x32dd81 = Array["from"](_0x1d2ed6["toUpperCase"]())["filter"](
      (_0x57485e) => GLYPHS[_0x57485e],
    ),
    _0x1eeb68 = [];
  for (let _0xbb5176 = 0x0; _0xbb5176 < _0x32dd81["length"]; _0xbb5176 += 0x5) {
    const _0x1c59e6 = _0x32dd81["slice"](_0xbb5176, _0xbb5176 + 0x5);
    for (let _0xcd7f1f = 0x0; _0xcd7f1f < 0x5; _0xcd7f1f++)
      _0x1eeb68["push"](
        _0x1c59e6["map"]((_0x518f3f) =>
          GLYPHS[_0x518f3f][_0xcd7f1f]["replace"](/#/g, _0x1d7f00),
        )
          ["join"]("\x20")
          ["replace"](/\s+$/, ""),
      );
    _0x1eeb68["push"]("");
  }
  return _0x1eeb68["join"]("\x0a")["trimEnd"]();
}
const AURAS = [
    {
      name: "Crimson Fire",
      rgb: [0xdc, 0x26, 0x3c],
      mean: "raw power, passion and a bold presence",
    },
    {
      name: "Royal Violet",
      rgb: [0x96, 0x5a, 0xff],
      mean: "wisdom, mystery and a sharp mind",
    },
    {
      name: "Emerald Calm",
      rgb: [0x28, 0xc8, 0x78],
      mean: "healing energy, loyalty and growth",
    },
    {
      name: "Golden Sun",
      rgb: [0xff, 0xc4, 0x2e],
      mean: "confidence, luck and big main-character energy",
    },
    {
      name: "Ocean Blue",
      rgb: [0x46, 0x8c, 0xff],
      mean: "deep thinking, honesty and calm leadership",
    },
    {
      name: "Rose Pink",
      rgb: [0xff, 0x69, 0xb4],
      mean: "warm love, kindness and charm",
    },
    {
      name: "Silver Moon",
      rgb: [0xc8, 0xcd, 0xdc],
      mean: "intuition, balance and quiet strength",
    },
    {
      name: "Turquoise Spark",
      rgb: [0x1e, 0xd2, 0xdc],
      mean: "creativity, humour and fresh ideas",
    },
    {
      name: "Amber Glow",
      rgb: [0xff, 0x8a, 0x1f],
      mean: "hustle, courage and friendly energy",
    },
    {
      name: "Obsidian Shadow",
      rgb: [0x82, 0x82, 0xa0],
      mean: "mystery, focus and unstoppable drive",
    },
  ],
  AURA_TRAITS = [
    "natural leader",
    "loyal friend",
    "quick thinker",
    "secret softie",
    "life of the party",
    "quiet genius",
    "born hustler",
    "peacemaker",
    "risk taker",
    "creative soul",
    "deep feeler",
    "funny one",
    "protector",
    "dreamer",
    "problem solver",
    "magnetic talker",
  ],
  VIBES = {
    Happy: {
      words:
        /\b(happy|joy|glad|great|awesome|amazing|blessed|yay|good|fun|smile|love it|thank|thanks|best|win|won|congrats|nice)\b|[😊😄😁😀😃🥳🎉😍]/g,
      rgb: [0xff, 0xc4, 0x2e],
      line: "Sunshine energy. People feel better around you.",
    },
    Sad: {
      words:
        /\b(sad|cry|crying|hurt|pain|lonely|miss|missing|sorry|tired of|depressed|down|lost|broken|alone)\b|[😢😭😔😞💔🥺]/g,
      rgb: [0x46, 0x78, 0xdc],
      line: "Heavy heart today. Be gentle with yourself.",
    },
    Hyped: {
      words:
        /\b(let'?s go|hype|fire|lit|crazy|insane|wow|omg|turn up|party|vibes|goat|huge|finally|ready)\b|[🔥🚀⚡💥🤩]/g,
      rgb: [0xff, 0x5a, 0x28],
      line: "Pure hype. Everything is moving fast and loud.",
    },
    Angry: {
      words:
        /\b(angry|mad|hate|annoyed|rude|stupid|trash|idiot|furious|fed up|enough|wtf|useless)\b|[😡🤬😤👿]/g,
      rgb: [0xdc, 0x26, 0x3c],
      line: "Steam rising. Breathe first, reply later.",
    },
    Romantic: {
      words:
        /\b(love|babe|baby|heart|kiss|darling|sweetheart|miss you|crush|bae|forever|romantic|cuddle|date)\b|[❤️💕😘🥰💘💖]/g,
      rgb: [0xff, 0x69, 0xb4],
      line: "Soft and sweet. Love is in the air.",
    },
    Chill: {
      words:
        /\b(chill|relax|calm|peace|vibe|easy|slow|weekend|rest|quiet|okay|fine|sawa|poa)\b|[😌😎🌴☕]/g,
      rgb: [0x28, 0xc8, 0xaa],
      line: "Easy and calm. Nothing is rushing you.",
    },
    Hustle: {
      words:
        /\b(work|hustle|money|grind|business|goal|plan|build|boss|client|sales|deal|grow|focus|pesa|kazi)\b|[💰💼📈💪]/g,
      rgb: [0x96, 0x5a, 0xff],
      line: "Locked in. You are building something.",
    },
    Sleepy: {
      words:
        /\b(sleep|sleepy|tired|nap|bed|yawn|exhausted|night|goodnight|lala)\b|[😴🥱🛌🌙]/g,
      rgb: [0x6e, 0x6e, 0xbe],
      line: "Low battery. A proper rest is the best plan.",
    },
  };
function readVibe(_0x58fa06) {
  const _0x11ec52 = {};
  for (const [_0x3b3bdc, _0x3c6ee3] of Object["entries"](VIBES)) {
    const _0x5404e0 = (String(_0x58fa06)
      ["toLowerCase"]()
      ["match"](_0x3c6ee3["words"]) || [])["length"];
    if (_0x5404e0) _0x11ec52[_0x3b3bdc] = _0x5404e0;
  }
  const _0x362725 = Object["entries"](_0x11ec52)["sort"](
      (_0x2f56dd, _0x5ea5c4) => _0x5ea5c4[0x1] - _0x2f56dd[0x1],
    ),
    _0x3a2ee6 = _0x362725[0x0] ? _0x362725[0x0][0x0] : "Chill",
    _0x425c24 = Object["values"](_0x11ec52)["reduce"](
      (_0x52944e, _0x4972f0) => _0x52944e + _0x4972f0,
      0x0,
    ),
    _0x43f7c4 = _0x362725[0x0]
      ? Math["min"](
          0x62,
          Math["round"](
            0x37 +
              (_0x362725[0x0][0x1] / Math["max"](0x1, _0x425c24)) * 0x19 +
              Math["min"](0x12, _0x362725[0x0][0x1] * 0x6),
          ),
        )
      : 0x32;
  return {
    mood: _0x3a2ee6,
    pct: _0x43f7c4,
    second: _0x362725[0x1] ? _0x362725[0x1][0x0] : null,
  };
}
function parseLRC(_0x204e11) {
  const _0x34e473 = [];
  for (const _0x44eec2 of String(_0x204e11 || "")["split"]("\x0a")) {
    const _0x4d24a7 = _0x44eec2["match"](/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
    if (_0x4d24a7 && _0x4d24a7[0x3]["trim"]())
      _0x34e473["push"]({
        t: Number(_0x4d24a7[0x1]) * 0x3c + Number(_0x4d24a7[0x2]),
        text: _0x4d24a7[0x3]["trim"](),
      });
  }
  return _0x34e473;
}
async function findLyrics(_0x372415, _0x2c96a6) {
  let _0x487e19;
  try {
    _0x487e19 = await kit["getRetry"](
      "https://lrclib.net/api/search?q=" + encodeURIComponent(_0x372415),
      { timeout: 0x4e20, headers: { "User-Agent": UA } },
    );
  } catch (_0x46417c) {
    throw new Error("lyrics service failed (" + kit["why"](_0x46417c) + ")");
  }
  const _0x5d256c = (
    Array["isArray"](_0x487e19["data"]) ? _0x487e19["data"] : []
  )["filter"]((_0x346ff1) => _0x346ff1["syncedLyrics"]);
  if (!_0x5d256c["length"]) return null;
  const _0x4da6e5 = _0x2c96a6
    ? _0x5d256c["slice"]()["sort"](
        (_0x55d4a2, _0x248a31) =>
          Math["abs"]((_0x55d4a2["duration"] || 0x0) - _0x2c96a6) -
          Math["abs"]((_0x248a31["duration"] || 0x0) - _0x2c96a6),
      )[0x0]
    : _0x5d256c[0x0];
  return {
    lines: parseLRC(_0x4da6e5["syncedLyrics"]),
    title: _0x4da6e5["trackName"],
    artist: _0x4da6e5["artistName"],
    duration: _0x4da6e5["duration"],
  };
}
module["exports"] = [
  {
    name: "logo",
    aliases: ["futurelogo", "neonlogo", "makelogo"],
    description:
      "Futuristic neon logo (.logo Name | tagline | cyan/magenta/green/gold/red/blue)",
    async execute(_0x2abf3b, _0x961538, _0x3f1764) {
      const _0x20144a = kit["ctx"](_0x2abf3b, _0x961538, _0x3f1764),
        _0x59fdff = _0x20144a["text"]
          ["split"]("|")
          ["map"]((_0x2566f5) => _0x2566f5["trim"]())
          ["filter"](Boolean);
      if (!_0x59fdff["length"])
        return _0x20144a["reply"](
          "🌌 *" +
            BM +
            " Logo*\n\n*.logo Your Name*\n*.logo Nova Tech | Build the future*\n*.logo Nova Tech | Build the future | magenta*\n\nColours: cyan, magenta, green, gold, red, blue",
        );
      const { theme: _0x30b756, rest: _0x3367d3 } = parseThemeWord(_0x59fdff),
        _0x1264ad = (_0x3367d3[0x0] || "")["toUpperCase"]()["slice"](0x0, 0x28),
        _0x193a06 = (_0x3367d3[0x1] || "")["slice"](0x0, 0x46);
      if (!_0x1264ad)
        return _0x20144a["reply"]("Give the logo a name: *.logo Nova Tech*");
      const _0x381feb = makeDir("logo");
      try {
        await _0x20144a["reply"]("🌌 _Rendering your logo..._");
        const _0x35c67e = await futuristicImage(_0x381feb, {
          w: 0x500,
          h: 0x2d0,
          name: _0x1264ad,
          tagline: _0x193a06,
          theme: _0x30b756,
          nameSizes: [0x80, 0x40, 0x20],
        });
        await _0x20144a["send"]({
          image: _0x35c67e,
          mimetype: "image/png",
          caption: "🌌 *" + _0x1264ad + "*\nTheme: " + _0x30b756 + " • " + TAG,
        });
      } catch (_0x2e5606) {
        _0x20144a["reply"](
          "❌ Could not make the logo: " +
            String(_0x2e5606["message"])["slice"](0x0, 0x96),
        );
      } finally {
        rmDir(_0x381feb);
      }
    },
  },
  {
    name: "banner",
    aliases: ["cover", "headerimage", "makebanner"],
    description: "Futuristic banner / cover (.banner Name | tagline | theme)",
    async execute(_0x3e985c, _0xd15e03, _0x4caae7) {
      const _0x58f437 = kit["ctx"](_0x3e985c, _0xd15e03, _0x4caae7),
        _0xdd1965 = _0x58f437["text"]
          ["split"]("|")
          ["map"]((_0x13e58f) => _0x13e58f["trim"]())
          ["filter"](Boolean);
      if (!_0xdd1965["length"])
        return _0x58f437["reply"](
          "🖼️ *" +
            BM +
            " Banner*\n\n*.banner Your Name*\n*.banner Marco X Waqar Designs | Branding & web*\n*.banner Marco X Waqar Designs | Branding & web | gold*\n\nWide 3:1 image for covers, group banners and posters.\nColours: cyan, magenta, green, gold, red, blue",
        );
      const { theme: _0x25d16e, rest: _0x2a5d65 } = parseThemeWord(_0xdd1965),
        _0x28549d = (_0x2a5d65[0x0] || "")["toUpperCase"]()["slice"](0x0, 0x28),
        _0x986a4 = (_0x2a5d65[0x1] || "")["slice"](0x0, 0x50);
      if (!_0x28549d)
        return _0x58f437["reply"](
          "Give the banner a name: *.banner Kamau Designs*",
        );
      const _0x1cb661 = makeDir("ban");
      try {
        await _0x58f437["reply"]("🖼️ _Rendering your banner..._");
        const _0x59723c = await futuristicImage(_0x1cb661, {
          w: 0x5dc,
          h: 0x1f4,
          name: _0x28549d,
          tagline: _0x986a4,
          theme: _0x25d16e,
          nameSizes: [0x80, 0x40, 0x20],
        });
        await _0x58f437["send"]({
          image: _0x59723c,
          mimetype: "image/png",
          caption: "🖼️ *" + _0x28549d + "*\nTheme: " + _0x25d16e + " • " + TAG,
        });
      } catch (_0x584928) {
        _0x58f437["reply"](
          "❌ Could not make the banner: " +
            String(_0x584928["message"])["slice"](0x0, 0x96),
        );
      } finally {
        rmDir(_0x1cb661);
      }
    },
  },
  {
    name: "intro",
    aliases: ["nameintro", "introvideo", "animatedname"],
    description: "Animated name intro video (.intro Name | tagline | colour)",
    async execute(_0x46d144, _0x5dceaa, _0x5dc0e2) {
      const _0x46315b = kit["ctx"](_0x46d144, _0x5dceaa, _0x5dc0e2);
      let _0x5585b5 = _0x46315b["text"]
        ["split"]("|")
        ["map"]((_0x88bb33) => _0x88bb33["trim"]())
        ["filter"](Boolean);
      if (!_0x5585b5["length"])
        return _0x46315b["reply"](
          "🎬 *" +
            BM +
            " Intro*\n\n*.intro Marco X Waqar*\n*.intro Nova Tech | Build the future | magenta*\nAdd *wide* at the end for a landscape video.\nColours: " +
            Object["keys"](THEMES)["join"](",\x20"),
        );
      let _0x1e6d6d = "cyan",
        _0x540a06 = ![];
      _0x5585b5 = _0x5585b5["filter"]((_0x9fdbf7) => {
        const _0x2ddead = _0x9fdbf7["toLowerCase"]();
        if (THEMES[_0x2ddead]) return ((_0x1e6d6d = _0x2ddead), ![]);
        if (_0x2ddead === "wide") return ((_0x540a06 = !![]), ![]);
        return !![];
      });
      const _0x1ba7be = (_0x5585b5[0x0] || "")
          ["toUpperCase"]()
          ["slice"](0x0, 0x1e),
        _0x2ee699 = (_0x5585b5[0x1] || "")["slice"](0x0, 0x3c);
      if (!_0x1ba7be)
        return _0x46315b["reply"]("Give the intro a name: *.intro Marco X Waqar*");
      const _0xe3d60e = THEMES[_0x1e6d6d],
        [_0x2c9fae, _0x214bed] = _0x540a06 ? [0x500, 0x2d0] : [0x2d0, 0x500],
        _0x52e731 = makeDir("intro");
      try {
        await _0x46315b["reply"]("🎬 _Rendering your intro..._");
        const _0x24ab36 = await textLayer(
            _0x1ba7be,
            Math["round"](_0x2c9fae * 0.88),
            [0x80, 0x40, 0x20],
            Math["round"](_0x214bed * 0.4),
          ),
          _0x349eea = path["join"](_0x52e731, "n.png");
        fs["writeFileSync"](_0x349eea, _0x24ab36["png"]);
        const _0x5d7dc4 = [
          "-f",
          "lavfi",
          "-i",
          "color=c=black:s=" + _0x2c9fae + "x" + _0x214bed + ":r=25:d=5",
          "-loop",
          "1",
          "-framerate",
          "25",
          "-t",
          "5",
          "-i",
          _0x349eea,
        ];
        let _0x5ba266 = null;
        if (_0x2ee699) {
          _0x5ba266 = await textLayer(
            _0x2ee699,
            Math["round"](_0x2c9fae * 0.8),
            [0x20],
            0xc8,
          );
          const _0x583bc5 = path["join"](_0x52e731, "t.png");
          (fs["writeFileSync"](_0x583bc5, _0x5ba266["png"]),
            _0x5d7dc4["push"](
              "-loop",
              "1",
              "-framerate",
              "25",
              "-t",
              "5",
              "-i",
              _0x583bc5,
            ));
        }
        const [_0x38e795, _0x4759b3, _0xad9db2] = _0xe3d60e["c"]["map"](
            (_0xbd5d43) => (_0xbd5d43 / 0xff)["toFixed"](0x3),
          ),
          _0x5eaad0 =
            "colorchannelmixer=rr=" +
            _0x38e795 +
            ":rg=0:rb=0:gr=0:gg=" +
            _0x4759b3 +
            ":gb=0:br=0:bg=0:bb=" +
            _0xad9db2,
          _0x579f81 = Math["round"](
            _0x214bed / 0x2 - _0x24ab36["h"] / 0x2 - (_0x5ba266 ? 0x1e : 0x0),
          ),
          _0x537f68 = _0x579f81 + _0x24ab36["h"] + 0xa;
        let _0x4c85c6 =
            "[0:v]" +
            bgChain(
              _0x2c9fae,
              _0x214bed,
              _0xe3d60e["bg"],
              _0xe3d60e["bg2"],
              !![],
              hx(_0xe3d60e["c"]),
            ) +
            "[bg];" +
            ("[1:v]format=rgba,fade=t=in:st=0.5:d=0.9:alpha=1,split=2[na][nb];[na]gblur=sigma=" +
              Math["round"](_0x214bed / 0x32) +
              "," +
              _0x5eaad0 +
              "[ng];") +
            ("[bg][ng]overlay=x=(W-w)/2:y='" +
              _0x579f81 +
              "+max(0,(1.4-t))*60'[s1];[s1][nb]overlay=x=(W-w)/2:y='" +
              _0x579f81 +
              "+max(0,(1.4-t))*60'[s2]"),
          _0x422f3b = "s2";
        _0x5ba266 &&
          ((_0x4c85c6 +=
            ";[2:v]format=rgba,fade=t=in:st=1.6:d=0.8:alpha=1[tg];[" +
            _0x422f3b +
            "][tg]overlay=x=(W-w)/2:y=" +
            _0x537f68 +
            "[s3]"),
          (_0x422f3b = "s3"));
        const _0x20b3a0 = Math["round"](_0x2c9fae * 0.5);
        _0x4c85c6 +=
          ";[" +
          _0x422f3b +
          "]drawbox=x=(iw-" +
          _0x20b3a0 +
          ")/2:y=" +
          (_0x579f81 - 0x12) +
          ":w=" +
          _0x20b3a0 +
          ":h=4:color=" +
          hx(_0xe3d60e["c"]) +
          "@0.9:t=fill:enable='gte(t,1.2)',fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5,format=yuv420p[v]";
        const _0x3db84d = path["join"](_0x52e731, "out.mp4"),
          _0x7b5117 =
            "aevalsrc='0.6*sin(2*PI*(120*t+260*t*t))*lt(t,1.2)+0.5*sin(2*PI*55*t)*exp(-4*(t-1.2))*gte(t,1.2)':d=5:s=44100,afade=t=out:st=4.2:d=0.8";
        try {
          await ff(
            [
              "-y",
              ..._0x5d7dc4,
              "-f",
              "lavfi",
              "-i",
              _0x7b5117,
              "-filter_complex",
              _0x4c85c6,
              "-map",
              "[v]",
              "-map",
              _0x5d7dc4["filter"]((_0x1828ad) => _0x1828ad === "-i")["length"] +
                ":a",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "24",
              "-r",
              "25",
              "-c:a",
              "aac",
              "-b:a",
              "128k",
              "-t",
              "5",
              "-movflags",
              "faststart",
              _0x3db84d,
            ],
            0x2bf20,
          );
        } catch (_0x3a20fc) {
          await ff(
            [
              "-y",
              ..._0x5d7dc4,
              "-filter_complex",
              _0x4c85c6,
              "-map",
              "[v]",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "24",
              "-r",
              "25",
              "-t",
              "5",
              "-movflags",
              "faststart",
              _0x3db84d,
            ],
            0x2bf20,
          );
        }
        await _0x46315b["send"]({
          video: fs["readFileSync"](_0x3db84d),
          mimetype: "video/mp4",
          caption: "🎬 " + _0x1ba7be + " • " + TAG,
        });
      } catch (_0x179a89) {
        _0x46315b["reply"](
          "❌ Could not make the intro: " +
            String(_0x179a89["message"])["slice"](0x0, 0x96),
        );
      } finally {
        rmDir(_0x52e731);
      }
    },
  },
  {
    name: "countdown",
    aliases: ["countdownvideo", "timervideo"],
    description: "Animated countdown video (.countdown 10 [colour] [text])",
    async execute(_0x1b427f, _0x4d5a5f, _0x101eb0) {
      const _0x244cd7 = kit["ctx"](_0x1b427f, _0x4d5a5f, _0x101eb0),
        _0x47f863 = _0x244cd7["text"]["split"](/\s+/)["filter"](Boolean),
        _0x2e428c = Number(_0x47f863[0x0]);
      if (!_0x2e428c || _0x2e428c < 0x3 || _0x2e428c > 0x1e)
        return _0x244cd7["reply"](
          "⏳ *" +
            BM +
            " Countdown*\n\n*.countdown 10*\n*.countdown 5 gold*\n*.countdown 10 magenta Happy New Year*\nFrom 3 to 30 seconds. Optional text shows at the end.",
        );
      let _0x5ea9b2 = "cyan";
      const _0x239ba6 = [];
      _0x47f863["slice"](0x1)["forEach"]((_0x53452e) => {
        if (THEMES[_0x53452e["toLowerCase"]()])
          _0x5ea9b2 = _0x53452e["toLowerCase"]();
        else _0x239ba6["push"](_0x53452e);
      });
      const _0x20a424 = _0x239ba6["join"]("\x20")["slice"](0x0, 0x28) || "GO!",
        _0x4e4c4e = THEMES[_0x5ea9b2],
        _0x102d97 = 0x2d0,
        _0x174e24 = 0x500,
        _0x4b82ce = makeDir("cd");
      try {
        await _0x244cd7["reply"]("⏳ _Rendering " + _0x2e428c + " seconds..._");
        const _0x89f86 = [
            "-f",
            "lavfi",
            "-i",
            "color=c=black:s=" +
              _0x102d97 +
              "x" +
              _0x174e24 +
              ":r=25:d=" +
              (_0x2e428c + 0x2),
          ],
          [_0x45523f, _0x575641, _0x17a10c] = _0x4e4c4e["c"]["map"](
            (_0x34cc03) => (_0x34cc03 / 0xff)["toFixed"](0x3),
          ),
          _0x81b726 =
            "colorchannelmixer=rr=" +
            _0x45523f +
            ":rg=0:rb=0:gr=0:gg=" +
            _0x575641 +
            ":gb=0:br=0:bg=0:bb=" +
            _0x17a10c;
        let _0x42e653 =
            "[0:v]" +
            bgChain(
              _0x102d97,
              _0x174e24,
              _0x4e4c4e["bg"],
              _0x4e4c4e["bg2"],
              !![],
              hx(_0x4e4c4e["c"]),
            ) +
            "[b0]",
          _0x1e7e19 = "b0";
        for (let _0x165129 = 0x0; _0x165129 <= _0x2e428c; _0x165129++) {
          const _0x4a6299 = await textLayer(
              _0x165129 === 0x0
                ? _0x20a424["toUpperCase"]()
                : String(_0x2e428c - _0x165129 + 0x1),
              Math["round"](_0x102d97 * 0.8),
              [0x80, 0x40, 0x20],
              0x12c,
            ),
            _0x321596 = path["join"](_0x4b82ce, "n" + _0x165129 + ".png");
          (fs["writeFileSync"](_0x321596, _0x4a6299["png"]),
            _0x89f86["push"]("-i", _0x321596));
          const _0x32c5bd = _0x165129 === 0x0 ? _0x2e428c : _0x165129 - 0x1,
            _0x4c63e5 = _0x165129 === 0x0 ? _0x2e428c + 0x2 : _0x165129,
            _0x428363 = _0x165129 + 0x1,
            _0x3b8b25 = _0x165129 === 0x0 ? 0x2 : 0x4;
          ((_0x42e653 +=
            ";[" +
            _0x428363 +
            ":v]format=rgba,scale=iw*" +
            _0x3b8b25 +
            ":ih*" +
            _0x3b8b25 +
            ":flags=neighbor,split=2[a" +
            _0x165129 +
            "][c" +
            _0x165129 +
            "];[a" +
            _0x165129 +
            "]gblur=sigma=14," +
            _0x81b726 +
            "[g" +
            _0x165129 +
            "];" +
            ("[" +
              _0x1e7e19 +
              "][g" +
              _0x165129 +
              "]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t," +
              _0x32c5bd +
              "," +
              _0x4c63e5 +
              ")'[p" +
              _0x165129 +
              "];[p" +
              _0x165129 +
              "][c" +
              _0x165129 +
              "]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t," +
              _0x32c5bd +
              "," +
              _0x4c63e5 +
              ")'[q" +
              _0x165129 +
              "]")),
            (_0x1e7e19 = "q" + _0x165129));
        }
        _0x42e653 += ";[" + _0x1e7e19 + "]format=yuv420p[v]";
        const _0x4df66e =
            "aevalsrc='0.5*sin(2*PI*880*t)*lt(mod(t,1),0.1)*lt(t," +
            _0x2e428c +
            ")+0.6*sin(2*PI*1320*t)*gte(t," +
            _0x2e428c +
            ")*lt(t," +
            (_0x2e428c + 0.8) +
            ")':d=" +
            (_0x2e428c + 0x2) +
            ":s=44100,afade=t=out:st=" +
            (_0x2e428c + 1.2) +
            ":d=0.8",
          _0x4ec6da = path["join"](_0x4b82ce, "out.mp4");
        try {
          await ff(
            [
              "-y",
              ..._0x89f86,
              "-f",
              "lavfi",
              "-i",
              _0x4df66e,
              "-filter_complex",
              _0x42e653,
              "-map",
              "[v]",
              "-map",
              _0x2e428c + 0x2 + ":a",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "25",
              "-r",
              "25",
              "-c:a",
              "aac",
              "-b:a",
              "96k",
              "-t",
              String(_0x2e428c + 0x2),
              "-movflags",
              "faststart",
              _0x4ec6da,
            ],
            0x3a980,
          );
        } catch (_0x12e638) {
          await ff(
            [
              "-y",
              ..._0x89f86,
              "-filter_complex",
              _0x42e653,
              "-map",
              "[v]",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "25",
              "-r",
              "25",
              "-t",
              String(_0x2e428c + 0x2),
              "-movflags",
              "faststart",
              _0x4ec6da,
            ],
            0x3a980,
          );
        }
        await _0x244cd7["send"]({
          video: fs["readFileSync"](_0x4ec6da),
          mimetype: "video/mp4",
          caption: "⏳\x20" + _0x2e428c + " • " + TAG,
        });
      } catch (_0x24da9b) {
        _0x244cd7["reply"](
          "❌ Could not make the countdown: " +
            String(_0x24da9b["message"])["slice"](0x0, 0x96),
        );
      } finally {
        rmDir(_0x4b82ce);
      }
    },
  },
  {
    name: "quotecard",
    aliases: ["quoteimage", "quotepic", "qcard"],
    description: "Stylish quote picture (.quotecard <text> | author | colour)",
    async execute(_0x16739d, _0x32e1cf, _0x281340) {
      const _0x43f9bd = kit["ctx"](_0x16739d, _0x32e1cf, _0x281340);
      let _0xa46ad2 = _0x43f9bd["text"]
        ["split"]("|")
        ["map"]((_0x5651f3) => _0x5651f3["trim"]())
        ["filter"](Boolean);
      if (!_0xa46ad2["length"] && _0x43f9bd["quotedText"])
        _0xa46ad2 = [_0x43f9bd["quotedText"]["trim"]()];
      if (!_0xa46ad2["length"])
        return _0x43f9bd["reply"](
          "💬 *" +
            BM +
            " Quote card*\n\n*.quotecard Stay hungry, stay humble | Steve*\n*.quotecard Small steps count | Me | gold*\nColours: " +
            Object["keys"](THEMES)["join"](",\x20") +
            "\n\nOr reply to a message with *.quotecard*",
        );
      let _0x398065 = "cyan";
      _0xa46ad2 = _0xa46ad2["filter"]((_0x13fab4) => {
        if (THEMES[_0x13fab4["toLowerCase"]()])
          return ((_0x398065 = _0x13fab4["toLowerCase"]()), ![]);
        return !![];
      });
      const _0x5ecc6d = (_0xa46ad2[0x0] || "")["slice"](0x0, 0x104),
        _0xbd70bc = (_0xa46ad2[0x1] || "")["slice"](0x0, 0x28);
      if (!_0x5ecc6d)
        return _0x43f9bd["reply"]("Give me the quote text first.");
      const _0xb4e3ce = makeDir("qc");
      try {
        await _0x43f9bd["reply"]("💬 _Designing..._");
        const _0x4bf4c0 = [
          { text: "\x22", sizes: [0x80], glow: !![], gap: 0x6, width: 0.3 },
          {
            text: _0x5ecc6d,
            sizes: [0x40, 0x20],
            maxH: 0x26c,
            glow: ![],
            gap: 0x1e,
            width: 0.82,
          },
        ];
        if (_0xbd70bc)
          _0x4bf4c0["push"]({
            text: "-\x20" + _0xbd70bc["toUpperCase"](),
            sizes: [0x20],
            glow: !![],
            gap: 0x0,
            width: 0.6,
          });
        const _0x37158f = await cardImage(_0xb4e3ce, {
          w: 0x438,
          h: 0x438,
          rgb: THEMES[_0x398065]["c"],
          items: _0x4bf4c0,
        });
        await _0x43f9bd["send"]({
          image: _0x37158f,
          mimetype: "image/png",
          caption: TAG,
        });
      } catch (_0x181109) {
        _0x43f9bd["reply"](
          "❌ Could not make the card: " +
            String(_0x181109["message"])["slice"](0x0, 0x96),
        );
      } finally {
        rmDir(_0xb4e3ce);
      }
    },
  },
  {
    name: "aura",
    aliases: ["auraread", "myaura", "auracheck"],
    description: "Your aura colour and strength today (.aura, or tag someone)",
    async execute(_0x486b9f, _0x5e550c, _0x1101ae) {
      const _0x10ff84 = kit["ctx"](_0x486b9f, _0x5e550c, _0x1101ae),
        _0x1d24bb =
          _0x10ff84["mentions"][0x0] ||
          _0x10ff84["quotedSender"] ||
          _0x10ff84["sender"],
        _0x269da1 = seedFrom(num(_0x1d24bb) + dayKey() + "aura"),
        _0x21051a = AURAS[Math["floor"](_0x269da1() * AURAS["length"])],
        _0xd6df22 = 0x23 + Math["floor"](_0x269da1() * 0x41),
        _0x3dd578 = [];
      while (_0x3dd578["length"] < 0x3) {
        const _0xd05664 =
          AURA_TRAITS[Math["floor"](_0x269da1() * AURA_TRAITS["length"])];
        if (!_0x3dd578["includes"](_0xd05664)) _0x3dd578["push"](_0xd05664);
      }
      const _0x29d4c5 = makeDir("aura");
      try {
        const _0x3f2ba1 = await kit["profilePic"](_0x486b9f, _0x1d24bb),
          _0x232df4 = [
            { text: "AURA READING", sizes: [0x20], gap: 0x12, width: 0.6 },
            {
              text: _0x21051a["name"]["toUpperCase"](),
              sizes: [0x40, 0x20],
              gap: 0xe,
              width: 0.9,
            },
            { text: _0xd6df22 + "%", sizes: [0x80], gap: 0x14, width: 0.5 },
            {
              text: _0x3dd578["join"]("  /  ")["toUpperCase"](),
              sizes: [0x20],
              glow: ![],
              gap: 0x0,
              width: 0.9,
            },
          ],
          _0x54aa72 = await cardImage(_0x29d4c5, {
            w: 0x438,
            h: 0x546,
            rgb: _0x21051a["rgb"],
            items: _0x232df4,
            pic: _0x3f2ba1,
          }),
          _0x2341f8 =
            "█"["repeat"](Math["round"](_0xd6df22 / 0xa)) +
            "░"["repeat"](0xa - Math["round"](_0xd6df22 / 0xa));
        await _0x10ff84["send"]({
          image: _0x54aa72,
          mimetype: "image/png",
          caption:
            "🔮 *" +
            BM +
            " AURA*\n\n@" +
            num(_0x1d24bb) +
            "\n🎨 *" +
            _0x21051a["name"] +
            "*\n⚡ Strength: *" +
            _0xd6df22 +
            "%*\n" +
            _0x2341f8 +
            "\n\n✨ " +
            _0x3dd578["join"](",\x20") +
            "\n💬 " +
            _0x21051a["mean"] +
            "\n\n_Resets every day. For fun only._",
          mentions: [_0x1d24bb],
        });
      } catch (_0x30da28) {
        _0x10ff84["reply"](
          "❌ Could not read the aura: " +
            String(_0x30da28["message"])["slice"](0x0, 0x78),
        );
      } finally {
        rmDir(_0x29d4c5);
      }
    },
  },
  {
    name: "vibe",
    aliases: ["vibecheck", "moodread", "mood"],
    description:
      "Reads the vibe of a message (.vibe <text>, or reply to a message)",
    async execute(_0x3c2193, _0x2fbd29, _0x5781c1) {
      const _0x3a8fa6 = kit["ctx"](_0x3c2193, _0x2fbd29, _0x5781c1),
        _0x5c8e2f = (_0x3a8fa6["text"] || _0x3a8fa6["quotedText"] || "")[
          "trim"
        ]();
      if (!_0x5c8e2f)
        return _0x3a8fa6["reply"](
          "🌀 *" +
            BM +
            " Vibe check*\n\n*.vibe I just got the job, let's go!*\nOr reply to any message with *.vibe*",
        );
      const _0xb1da0c = readVibe(_0x5c8e2f),
        _0x31da0e = VIBES[_0xb1da0c["mood"]],
        _0x477db8 = makeDir("vibe");
      try {
        const _0x1e3e68 = [
            { text: "VIBE CHECK", sizes: [0x20], gap: 0x14, width: 0.6 },
            {
              text: _0xb1da0c["mood"]["toUpperCase"](),
              sizes: [0x80, 0x40],
              gap: 0x14,
              width: 0.9,
            },
            {
              text: _0xb1da0c["pct"] + "% VIBE",
              sizes: [0x40, 0x20],
              gap: 0x18,
              width: 0.7,
            },
            {
              text: _0x31da0e["line"],
              sizes: [0x20],
              glow: ![],
              gap: 0x0,
              width: 0.8,
              maxH: 0x12c,
            },
          ],
          _0x59755d = await cardImage(_0x477db8, {
            w: 0x438,
            h: 0x438,
            rgb: _0x31da0e["rgb"],
            items: _0x1e3e68,
          });
        await _0x3a8fa6["send"]({
          image: _0x59755d,
          mimetype: "image/png",
          caption:
            "🌀 *" +
            BM +
            " VIBE*\n\nMood: *" +
            _0xb1da0c["mood"] +
            "*" +
            (_0xb1da0c["second"]
              ? " with a touch of " + _0xb1da0c["second"]["toLowerCase"]()
              : "") +
            "\nStrength: *" +
            _0xb1da0c["pct"] +
            "%*\n💬 " +
            _0x31da0e["line"] +
            "\n\n_Based on the words and emojis. For fun._",
        });
      } catch (_0x507e1d) {
        _0x3a8fa6["reply"](
          "❌ Could not make the card: " +
            String(_0x507e1d["message"])["slice"](0x0, 0x78),
        );
      } finally {
        rmDir(_0x477db8);
      }
    },
  },
  {
    name: "lyricsvideo",
    aliases: ["lyricvideo", "lyricstatus", "lvideo"],
    description:
      "Make a short lyrics video of a song (.lyricsvideo <song> @0:45)",
    async execute(_0x11ccb2, _0x4719b1, _0x52e47c) {
      const _0x3d2b6c = kit["ctx"](_0x11ccb2, _0x4719b1, _0x52e47c);
      let _0x39e5d3 = (_0x3d2b6c["text"] || _0x3d2b6c["quotedText"] || "")[
        "trim"
      ]();
      if (!_0x39e5d3)
        return _0x3d2b6c["reply"](
          "🎤 *Lyrics video*\n\n.lyricsvideo Hold my hand Bridget Blue\n.lyricsvideo Hold my hand Bridget Blue @0:45  (start at 0:45)\n\nI make a 25-second vertical video with the cover, the song and the lyrics in time.",
        );
      let _0x5d0503 = null;
      const _0x3188de = _0x39e5d3["match"](/@\s*([\d:.hms]+)\s*$/i);
      _0x3188de &&
        ((_0x5d0503 = parseTime(_0x3188de[0x1])),
        (_0x39e5d3 = _0x39e5d3["replace"](_0x3188de[0x0], "")["trim"]()));
      const _0x7226d6 = makeDir("lyr");
      try {
        await _0x3d2b6c["reply"](
          "🎤 _Finding the song, lyrics and cover... this takes a minute._",
        );
        const _0x17c4df = require("yt-search");
        let _0x41cc14;
        try {
          _0x41cc14 = ((await _0x17c4df(_0x39e5d3))["videos"] || [])[0x0];
        } catch (_0x5c467b) {
          throw new Error("song search failed (" + kit["why"](_0x5c467b) + ")");
        }
        if (!_0x41cc14)
          return _0x3d2b6c["reply"]("❌ Could not find that song.");
        const _0x3df99c = await findLyrics(_0x39e5d3, _0x41cc14["seconds"]);
        if (!_0x3df99c || _0x3df99c["lines"]["length"] < 0x3)
          return _0x3d2b6c["reply"](
            "❌ I could not find *timed* lyrics for that song. Try the artist and song name spelled exactly, or another song.",
          );
        const _0x59f348 = 0x19,
          _0x1e79c6 = _0x3df99c["lines"][0x0]["t"],
          _0x3642d6 = Math["max"](
            0x0,
            _0x5d0503 != null ? _0x5d0503 : Math["max"](0x0, _0x1e79c6 - 0.5),
          ),
          _0x1cbe52 = _0x3df99c["lines"]
            [
              "filter"
            ]((_0x3d5b62) => _0x3d5b62["t"] >= _0x3642d6 - 0.2 && _0x3d5b62["t"] < _0x3642d6 + _0x59f348)
            [
              "map"
            ]((_0x2cefa6, _0xdb8055, _0x19d671) => ({ ..._0x2cefa6, end: Math["min"](_0x3642d6 + _0x59f348, _0x19d671[_0xdb8055 + 0x1] ? _0x19d671[_0xdb8055 + 0x1]["t"] : _0x2cefa6["t"] + 0x4) }));
        if (!_0x1cbe52["length"])
          return _0x3d2b6c["reply"](
            "❌ There are no lyrics at that start time. Try another one, e.g. *@0:30*",
          );
        const _0x39c61a = _0x3d2b6c["media"](),
          _0x5076c7 =
            _0x39c61a && /^audio/["test"](_0x39c61a["mime"])
              ? await _0x3d2b6c["download"](_0x39c61a)
              : (await kit["songAudio"](_0x41cc14))["buf"],
          _0x326e0a = path["join"](_0x7226d6, "song.mp3");
        fs["writeFileSync"](_0x326e0a, _0x5076c7);
        const _0x5f0bef = path["join"](_0x7226d6, "cover.jpg");
        try {
          const _0x4b37a6 = await kit["getRetry"](
            _0x41cc14["image"] || _0x41cc14["thumbnail"],
            {
              responseType: "arraybuffer",
              timeout: 0x4e20,
              headers: { "User-Agent": UA },
            },
            0x2,
          );
          fs["writeFileSync"](_0x5f0bef, Buffer["from"](_0x4b37a6["data"]));
        } catch (_0x177be3) {
          await ff(
            [
              "-y",
              "-f",
              "lavfi",
              "-i",
              "color=c=0x20203a:s=640x640",
              "-frames:v",
              "1",
              _0x5f0bef,
            ],
            0x7530,
          );
        }
        const _0x20ffa2 = 0x2d0,
          _0x123a96 = 0x500,
          _0x528f9f = String(_0x3df99c["title"] || _0x41cc14["title"])["slice"](
            0x0,
            0x3c,
          ),
          _0x521cdb = String(
            _0x3df99c["artist"] ||
              (_0x41cc14["author"] && _0x41cc14["author"]["name"]) ||
              "",
          )["slice"](0x0, 0x32),
          _0x148284 = await textStrip(
            _0x528f9f + "\x0a" + _0x521cdb,
            _0x20ffa2,
            { maxHeight: 0xdc, sizes: [0x40, 0x20] },
          ),
          _0xd3ae32 = path["join"](_0x7226d6, "head.png");
        fs["writeFileSync"](_0xd3ae32, _0x148284["png"]);
        const _0xbfce16 = [];
        for (
          let _0x55d7aa = 0x0;
          _0x55d7aa < _0x1cbe52["length"];
          _0x55d7aa++
        ) {
          const _0x564211 = await textStrip(
              _0x1cbe52[_0x55d7aa]["text"],
              _0x20ffa2,
              { maxHeight: 0x168, sizes: [0x40, 0x20] },
            ),
            _0x372889 = path["join"](_0x7226d6, "line" + _0x55d7aa + ".png");
          (fs["writeFileSync"](_0x372889, _0x564211["png"]),
            _0xbfce16["push"]({ f: _0x372889, h: _0x564211["h"] }));
        }
        const _0x3e6792 = [
          "-loop",
          "1",
          "-framerate",
          "24",
          "-t",
          String(_0x59f348),
          "-i",
          _0x5f0bef,
          "-ss",
          String(_0x3642d6),
          "-t",
          String(_0x59f348),
          "-i",
          _0x326e0a,
          "-loop",
          "1",
          "-framerate",
          "24",
          "-t",
          String(_0x59f348),
          "-i",
          _0xd3ae32,
        ];
        _0xbfce16["forEach"]((_0x42eea9) =>
          _0x3e6792["push"](
            "-loop",
            "1",
            "-framerate",
            "24",
            "-t",
            String(_0x59f348),
            "-i",
            _0x42eea9["f"],
          ),
        );
        let _0x248e6e =
            "[0:v]scale=-2:" +
            _0x123a96 +
            ",crop=" +
            _0x20ffa2 +
            ":" +
            _0x123a96 +
            ",boxblur=25:3,eq=brightness=-0.2[bg];" +
            "[0:v]scale=460:460:force_original_aspect_ratio=increase,crop=460:460[art];" +
            "[bg][art]overlay=130:150[b1];[b1][2:v]overlay=0:660[b2]",
          _0x222ecc = "b2";
        (_0x1cbe52["forEach"]((_0x316e3a, _0x420144) => {
          const _0x257ea3 = Math["max"](0x0, _0x316e3a["t"] - _0x3642d6),
            _0x231a51 = Math["max"](
              _0x257ea3 + 0.3,
              _0x316e3a["end"] - _0x3642d6,
            ),
            _0x5680d0 = Math["round"](
              0x384 + (0x104 - _0xbfce16[_0x420144]["h"]) / 0x2,
            );
          ((_0x248e6e +=
            ";[" +
            _0x222ecc +
            "][" +
            (0x3 + _0x420144) +
            ":v]overlay=0:" +
            _0x5680d0 +
            ":enable='between(t," +
            _0x257ea3["toFixed"](0x2) +
            "," +
            _0x231a51["toFixed"](0x2) +
            ")'[b" +
            (_0x420144 + 0x2) +
            "]"),
            (_0x222ecc = "b" + (_0x420144 + 0x2)));
        }),
          (_0x248e6e += ";[" + _0x222ecc + "]format=yuv420p[v]"));
        const _0x2ba620 = path["join"](_0x7226d6, "out.mp4");
        (await ff(
          [
            "-y",
            ..._0x3e6792,
            "-filter_complex",
            _0x248e6e,
            "-map",
            "[v]",
            "-map",
            "1:a",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "28",
            "-r",
            "24",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-af",
            "afade=t=in:d=0.5,afade=t=out:st=" + (_0x59f348 - 1.5) + ":d=1.5",
            "-shortest",
            "-movflags",
            "faststart",
            _0x2ba620,
          ],
          0x3a980,
        ),
          await _0x3d2b6c["send"]({
            video: fs["readFileSync"](_0x2ba620),
            mimetype: "video/mp4",
            caption:
              "🎤 *" +
              _0x528f9f +
              "* — " +
              _0x521cdb +
              "\n⏱️ from " +
              stamp(_0x3642d6),
          }));
      } catch (_0x2607d2) {
        _0x3d2b6c["reply"](
          "❌ Could not make the lyrics video: " +
            String(_0x2607d2["message"])["slice"](0x0, 0xa0),
        );
      } finally {
        rmDir(_0x7226d6);
      }
    },
  },
  {
    name: "nickname",
    aliases: ["nick", "nicks", "fancyname"],
    description: "Stylish nickname and bio ideas (.nickname Marco X Waqar)",
    async execute(_0x24d676, _0x5dc3f4, _0x23776f) {
      const _0x3340ac = kit["ctx"](_0x24d676, _0x5dc3f4, _0x23776f),
        _0x22a545 = (_0x3340ac["text"] || _0x3340ac["quotedText"] || "")
          ["trim"]()
          ["slice"](0x0, 0x18);
      if (!_0x22a545)
        return _0x3340ac["reply"](
          "✨ *" +
            BM +
            " Nickname*\n\n*.nickname Marco X Waqar*\n*.nickname Marco X Waqar Maingi*\n\nYou get styled names with symbols you can copy into WhatsApp, Instagram or games.",
        );
      const _0x4a080e = seedFrom(_0x22a545 + "n"),
        _0x4e38aa = NICK_FONTS["slice"]()["sort"](() => _0x4a080e() - 0.5),
        _0x3ef93f = NICK_FRAMES["slice"]()
          ["sort"](() => _0x4a080e() - 0.5)
          ["slice"](0x0, 0xc)
          ["map"]((_0x96faa8, _0x3f306b) => {
            const _0x238cbe = _0x4e38aa[_0x3f306b % _0x4e38aa["length"]];
            return (
              _0x3f306b +
              0x1 +
              ".\x20" +
              _0x96faa8["replace"](
                "{n}",
                Array["from"](_0x22a545)["map"](_0x238cbe)["join"](""),
              )
            );
          });
      _0x3340ac["reply"](
        "✨ *" +
          BM +
          " Nickname ideas*\n\n" +
          _0x3ef93f["join"]("\x0a") +
          "\n\n_Long-press a line to copy it._",
      );
    },
  },
  {
    name: "glitch",
    aliases: ["zalgo", "glitchtext", "cursedtext"],
    description: "Glitchy cursed text (.glitch low|mid|max <text>)",
    async execute(_0x52708f, _0x3f40f6, _0x55591c) {
      const _0x53f0a6 = kit["ctx"](_0x52708f, _0x3f40f6, _0x55591c);
      let _0x406f55 = _0x53f0a6["text"],
        _0x55989b = "mid";
      const _0x9caa7c = _0x406f55["match"](
        /^(low|mid|max|extreme)\b\s*([\s\S]*)$/i,
      );
      _0x9caa7c &&
        ((_0x55989b =
          _0x9caa7c[0x1]["toLowerCase"]() === "extreme"
            ? "max"
            : _0x9caa7c[0x1]["toLowerCase"]()),
        (_0x406f55 = _0x9caa7c[0x2]["trim"]()));
      if (!_0x406f55) _0x406f55 = _0x53f0a6["quotedText"]["trim"]();
      if (!_0x406f55)
        return _0x53f0a6["reply"](
          "👾 *" +
            BM +
            " Glitch*\n\n*.glitch Marco X Waqar Bot*\n*.glitch max Marco X Waqar Bot*\nLevels: low, mid, max",
        );
      if (_0x406f55["length"] > 0x78)
        return _0x53f0a6["reply"]("⚠️ Keep it under 120 characters.");
      _0x53f0a6["reply"](zalgo(_0x406f55, _0x55989b));
    },
  },
  {
    name: "frame",
    aliases: ["boxtext", "textframe"],
    description:
      "Put text in a decorative box (.frame <text> or .frame 2 <text>)",
    async execute(_0x17295b, _0x5e7619, _0x438630) {
      const _0x276665 = kit["ctx"](_0x17295b, _0x5e7619, _0x438630);
      let _0x446086 = _0x276665["text"],
        _0x1bb585 = null;
      const _0x2259dc = _0x446086["match"](/^(\d)\s+([\s\S]+)$/);
      _0x2259dc &&
        Number(_0x2259dc[0x1]) >= 0x1 &&
        Number(_0x2259dc[0x1]) <= FRAMES["length"] &&
        ((_0x1bb585 = Number(_0x2259dc[0x1]) - 0x1),
        (_0x446086 = _0x2259dc[0x2]["trim"]()));
      if (!_0x446086) _0x446086 = _0x276665["quotedText"]["trim"]();
      if (!_0x446086)
        return _0x276665["reply"](
          "🖼️ *" +
            BM +
            " Frame*\n\n*.frame Welcome to the family*\n*.frame 2 Welcome to the family*  (pick a style 1 to " +
            FRAMES["length"] +
            ")\n\nStyles: " +
            FRAMES["map"](
              (_0x3de9cf, _0x2752e9) =>
                _0x2752e9 + 0x1 + "\x20" + _0x3de9cf["name"],
            )["join"](",\x20"),
        );
      if (_0x446086["length"] > 0x12c)
        return _0x276665["reply"]("⚠️ Keep it under 300 characters.");
      if (_0x1bb585 !== null)
        return _0x276665["reply"](
          "```\n" + frameText(_0x446086, FRAMES[_0x1bb585]) + "\n```",
        );
      _0x276665["reply"](
        FRAMES["slice"](0x0, 0x3)
          ["map"](
            (_0x22588d, _0x2572c2) =>
              "*" +
              (_0x2572c2 + 0x1) +
              ".\x20" +
              _0x22588d["name"] +
              "*\x0a" +
              "```\n" +
              frameText(_0x446086, _0x22588d) +
              "\n```",
          )
          ["join"]("\x0a") +
          ("\n_More: *.frame 4 text* to *.frame " +
            FRAMES["length"] +
            " text*_"),
      );
    },
  },
  {
    name: "rainbow",
    aliases: ["colortext", "rainbowtext"],
    description: "Rainbow-coloured text (.rainbow <text>)",
    async execute(_0x108f8d, _0x310d66, _0x4a2e56) {
      const _0x5d7917 = kit["ctx"](_0x108f8d, _0x310d66, _0x4a2e56),
        _0x224ee5 = (_0x5d7917["text"] || _0x5d7917["quotedText"] || "")[
          "trim"
        ]();
      if (!_0x224ee5)
        return _0x5d7917["reply"](
          "🌈 *" + BM + " Rainbow*\n\n*.rainbow Good vibes only*",
        );
      if (_0x224ee5["length"] > 0x50)
        return _0x5d7917["reply"]("⚠️ Keep it under 80 characters.");
      const _0x42c6b2 = RAINBOW_SQ["join"]("")["repeat"](0x2);
      let _0x33d6e3 = 0x0;
      const _0x253c43 = Array["from"](_0x224ee5)
        ["map"]((_0x49ab99) =>
          _0x49ab99 === "\x20"
            ? "\x20\x20"
            : _0x49ab99 + RAINBOW_HEART[_0x33d6e3++ % 0x6],
        )
        ["join"]("");
      _0x5d7917["reply"](
        _0x42c6b2 + "\x0a\x0a" + _0x253c43 + "\x0a\x0a" + _0x42c6b2,
      );
    },
  },
  {
    name: "ascii",
    aliases: ["asciiart", "blocktext", "bigtext"],
    description: "Big block letters (.ascii hi, or .ascii dots hi)",
    async execute(_0xb92aa9, _0x1cc86c, _0x1cedae) {
      const _0x130558 = kit["ctx"](_0xb92aa9, _0x1cc86c, _0x1cedae);
      let _0xbe36f0 = _0x130558["text"],
        _0x337a47 = "█";
      const _0x40e72a = _0xbe36f0["match"](
        /^(block|dots|hash|stars|hearts)\s+([\s\S]+)$/i,
      );
      _0x40e72a &&
        ((_0x337a47 = {
          block: "█",
          dots: "●",
          hash: "#",
          stars: "★",
          hearts: "♥",
        }[_0x40e72a[0x1]["toLowerCase"]()]),
        (_0xbe36f0 = _0x40e72a[0x2]["trim"]()));
      if (!_0xbe36f0) _0xbe36f0 = _0x130558["quotedText"]["trim"]();
      if (!_0xbe36f0)
        return _0x130558["reply"](
          "🔠 *" +
            BM +
            " ASCII*\n\n*.ascii HELLO*\n*.ascii dots KENYA*\nStyles: block, dots, hash, stars, hearts\nLetters, numbers and ! ? - . only. 15 characters max.",
        );
      const _0x465be4 = Array["from"](_0xbe36f0["toUpperCase"]())
        ["filter"]((_0x3893b8) => GLYPHS[_0x3893b8])
        ["join"]("")
        ["slice"](0x0, 0xf);
      if (!_0x465be4["trim"]())
        return _0x130558["reply"]("⚠️ Use letters, numbers and ! ? - . only.");
      _0x130558["reply"]("```\n" + asciiArt(_0x465be4, _0x337a47) + "\n```");
    },
  },
];
