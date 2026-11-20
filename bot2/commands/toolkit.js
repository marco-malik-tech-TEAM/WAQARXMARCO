"use strict";
const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  crypto = require("crypto"),
  dns = require("dns")["promises"],
  net = require("net"),
  axios = require("axios"),
  kit = require("../utils/mediaKit"),
  { ff, makeDir, rmDir, num, pickOne, rand, stamp } = kit,
  BM = kit["BRAND"],
  TAG = kit["TAG"],
  UA = kit["UA"];
async function askAI(_0x468aa9) {
  try {
    const _0x3ede2a = await axios["get"](
        "https://text.pollinations.ai/" + encodeURIComponent(_0x468aa9),
        {
          timeout: 0x4650,
          headers: { "User-Agent": UA },
          responseType: "text",
          transformResponse: [(_0x1781cc) => _0x1781cc],
        },
      ),
      _0x1cfe49 = String(_0x3ede2a["data"] || "")["trim"]();
    if (
      _0x1cfe49["length"] < 0xf ||
      _0x1cfe49["length"] > 0xfa0 ||
      /^<|^\{/["test"](_0x1cfe49) ||
      /rate limit|error/i["test"](_0x1cfe49["slice"](0x0, 0x3c))
    )
      return null;
    return _0x1cfe49;
  } catch (_0x4f51f5) {
    return null;
  }
}
const REM_FILE = path["join"](process["cwd"](), "reminders_data.json");
let REM = null;
function loadRem() {
  if (REM) return REM;
  try {
    REM = JSON["parse"](fs["readFileSync"](REM_FILE, "utf8"));
  } catch (_0x29699a) {
    REM = { id: 0x0, list: [] };
  }
  return ((REM["list"] = REM["list"] || []), REM);
}
const saveRem = () => {
    try {
      fs["writeFileSync"](REM_FILE, JSON["stringify"](REM));
    } catch (_0x5d808a) {}
  },
  NAIROBI = 0x3 * 0xe10 * 0x3e8;
function parseWhen(_0x4ddd91) {
  _0x4ddd91 = String(_0x4ddd91 || "")["trim"]();
  let _0x85d028 = _0x4ddd91["match"](/^((?:\d+\s*[dhms]\s*)+)([\s\S]*)$/i);
  if (_0x85d028) {
    let _0x5d95ec = 0x0;
    for (const _0x3e0156 of _0x85d028[0x1]["matchAll"](/(\d+)\s*([dhms])/gi))
      _0x5d95ec +=
        Number(_0x3e0156[0x1]) *
        { d: 0x15180, h: 0xe10, m: 0x3c, s: 0x1 }[
          _0x3e0156[0x2]["toLowerCase"]()
        ] *
        0x3e8;
    return {
      at: Date["now"]() + _0x5d95ec,
      text: _0x85d028[0x2]["trim"](),
      ms: _0x5d95ec,
    };
  }
  _0x85d028 = _0x4ddd91["match"](
    /^(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s+([\s\S]*)$/i,
  );
  if (
    _0x85d028 &&
    (/^at\s/i["test"](_0x4ddd91) || _0x85d028[0x2] || _0x85d028[0x3])
  ) {
    let _0x6e3784 = Number(_0x85d028[0x1]);
    const _0x18b163 = Number(_0x85d028[0x2] || 0x0);
    if (_0x85d028[0x3]) {
      const _0x361934 = _0x85d028[0x3]["toLowerCase"]() === "pm";
      if (_0x6e3784 === 0xc) _0x6e3784 = _0x361934 ? 0xc : 0x0;
      else {
        if (_0x361934) _0x6e3784 += 0xc;
      }
    }
    if (_0x6e3784 > 0x17 || _0x18b163 > 0x3b) return null;
    const _0x226bfa = new Date(Date["now"]() + NAIROBI);
    let _0x131df3 =
      Date["UTC"](
        _0x226bfa["getUTCFullYear"](),
        _0x226bfa["getUTCMonth"](),
        _0x226bfa["getUTCDate"](),
        _0x6e3784,
        _0x18b163,
      ) - NAIROBI;
    if (_0x131df3 <= Date["now"]() + 0x1388) _0x131df3 += 0x5265c00;
    return {
      at: _0x131df3,
      text: _0x85d028[0x4]["trim"](),
      ms: _0x131df3 - Date["now"](),
    };
  }
  return null;
}
function parseReminder(_0x5ee715) {
  _0x5ee715 = String(_0x5ee715 || "")["trim"]();
  let _0x576c34 = _0x5ee715,
    _0x110902 = null;
  const _0x8df301 = _0x5ee715["indexOf"]("|");
  if (_0x8df301 >= 0x0) {
    _0x576c34 = _0x5ee715["slice"](0x0, _0x8df301)["trim"]();
    const _0x52f88d = _0x5ee715["slice"](_0x8df301 + 0x1)["trim"]();
    if (/^(silent|none|off|quiet|mute)$/i["test"](_0x52f88d))
      _0x110902 = { type: "none" };
    else {
      if (/^(alarm|alert|beep|default)$/i["test"](_0x52f88d))
        _0x110902 = { type: "alarm" };
      else {
        if (_0x52f88d) {
          const _0x3b8c50 = _0x52f88d["match"](
            /^(?:song|play|music|tone)\b\s*:?\s*([\s\S]+)$/i,
          );
          _0x110902 = {
            type: "song",
            query: (_0x3b8c50 ? _0x3b8c50[0x1] : _0x52f88d)
              ["trim"]()
              ["slice"](0x0, 0x64),
          };
        }
      }
    }
  }
  let _0x2f04bf = parseWhen(_0x576c34);
  if (!_0x2f04bf) {
    let _0x11fa84 = _0x576c34["match"](
      /^([\s\S]+?)\s+(?:at\s+|@\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i,
    );
    if (_0x11fa84)
      _0x2f04bf = parseWhen(
        "at " +
          _0x11fa84[0x2] +
          (_0x11fa84[0x3] ? ":" + _0x11fa84[0x3] : "") +
          _0x11fa84[0x4] +
          "\x20" +
          _0x11fa84[0x1],
      );
    if (!_0x2f04bf) {
      _0x11fa84 = _0x576c34["match"](
        /^([\s\S]+?)\s+in\s+((?:\d+\s*[dhms]\s*)+)$/i,
      );
      if (_0x11fa84)
        _0x2f04bf = parseWhen(_0x11fa84[0x2] + "\x20" + _0x11fa84[0x1]);
    }
    if (!_0x2f04bf) {
      _0x11fa84 = _0x576c34["match"](/^([\s\S]+?)\s+at\s+(\d{1,2}):(\d{2})$/i);
      if (_0x11fa84)
        _0x2f04bf = parseWhen(
          "at " +
            _0x11fa84[0x2] +
            ":" +
            _0x11fa84[0x3] +
            "\x20" +
            _0x11fa84[0x1],
        );
    }
  }
  return _0x2f04bf ? { ..._0x2f04bf, tone: _0x110902 } : null;
}
const nairobiStamp = (_0x47b8f4) =>
  new Date(_0x47b8f4)["toLocaleString"]("en-GB", {
    timeZone: "Africa/Nairobi",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: ![],
  });
function human(_0x158105) {
  const _0xf8c8a1 = Math["round"](_0x158105 / 0x3e8);
  if (_0xf8c8a1 < 0x5a) return _0xf8c8a1 + " seconds";
  const _0x128878 = Math["round"](_0xf8c8a1 / 0x3c);
  if (_0x128878 < 0x5a) return _0x128878 + " minutes";
  const _0x1d565e = Math["floor"](_0x128878 / 0x3c),
    _0x17189d = _0x128878 % 0x3c;
  if (_0x1d565e < 0x30)
    return _0x1d565e + "h" + (_0x17189d ? "\x20" + _0x17189d + "m" : "");
  return Math["round"](_0x1d565e / 0x18) + " days";
}
let LAST = null;
const grab = (_0x22369c) => {
  if (_0x22369c) LAST = _0x22369c;
};
async function alarmFile() {
  const _0x23970b = path["join"](os["tmpdir"](), "botmd_alert.mp3");
  if (fs["existsSync"](_0x23970b) && fs["statSync"](_0x23970b)["size"] > 0x7d0)
    return _0x23970b;
  const _0x239341 = "mod(t,1.2)";
  return (
    await ff(
      [
        "-y",
        "-f",
        "lavfi",
        "-i",
        "aevalsrc='0.5*sin(2*PI*t*if(lt(" +
          _0x239341 +
          ",0.15),880,if(lt(" +
          _0x239341 +
          ",0.3),1175,if(lt(" +
          _0x239341 +
          ",0.45),1568,0))))*lt(" +
          _0x239341 +
          ",0.45)':d=7.2:s=44100",
        "-af",
        "afade=t=out:st=6.4:d=0.8",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "96k",
        "-ac",
        "1",
        _0x23970b,
      ],
      0xea60,
    ),
    _0x23970b
  );
}
async function playTone(_0x4af374, _0x26af6d) {
  const _0x329cfc = loadRem(),
    _0x199fd3 = _0x26af6d["tone"] ||
      (_0x329cfc["tones"] && _0x329cfc["tones"][_0x26af6d["sender"]]) || {
        type: "alarm",
      };
  if (_0x199fd3["type"] === "none") return;
  if (_0x199fd3["type"] === "song")
    try {
      const { buf: _0x27ad44 } = await kit["songAudio"](_0x199fd3["query"]);
      await _0x4af374["sendMessage"](_0x26af6d["sender"], {
        audio: _0x27ad44,
        mimetype: "audio/mpeg",
        ptt: ![],
        fileName: _0x199fd3["query"]["slice"](0x0, 0x28) + ".mp3",
      });
      return;
    } catch (_0x5b6971) {}
  try {
    await _0x4af374["sendMessage"](_0x26af6d["sender"], {
      audio: fs["readFileSync"](await alarmFile()),
      mimetype: "audio/mpeg",
      ptt: ![],
      fileName: BM + " alert.mp3",
    });
  } catch (_0x46874b) {}
}
async function fireDue() {
  const _0x57a503 = loadRem();
  if (!LAST || !_0x57a503["list"]["length"]) return;
  const _0x35e8d8 = _0x57a503["list"]["filter"](
    (_0x30685f) => _0x30685f["at"] <= Date["now"](),
  );
  if (!_0x35e8d8["length"]) return;
  ((_0x57a503["list"] = _0x57a503["list"]["filter"](
    (_0x4baf17) => _0x4baf17["at"] > Date["now"](),
  )),
    saveRem());
  for (const _0x14c6c5 of _0x35e8d8) {
    const _0x9484ed = _0x14c6c5["tone"] ||
        (_0x57a503["tones"] && _0x57a503["tones"][_0x14c6c5["sender"]]) || {
          type: "alarm",
        },
      _0x15c991 =
        "⏰ *" +
        BM +
        " ALERT* ⏰\n\n@" +
        num(_0x14c6c5["sender"]) +
        "\n\n📌 *" +
        _0x14c6c5["text"] +
        "*\n\n" +
        (_0x9484ed["type"] === "song"
          ? "🎵 _" +
            _0x9484ed["query"] +
            "_ is coming. Tap the audio to play.\n"
          : _0x9484ed["type"] === "alarm"
            ? "🔔 _Tap the audio to play your alert._\n"
            : "") +
        ("_set " + human(Date["now"]() - _0x14c6c5["set"]) + " ago_");
    try {
      await LAST["sendMessage"](_0x14c6c5["sender"], {
        text: _0x15c991,
        mentions: [_0x14c6c5["sender"]],
      });
    } catch (_0x3a3758) {}
    if (
      _0x14c6c5["chat"] &&
      _0x14c6c5["chat"] !== _0x14c6c5["sender"] &&
      String(_0x14c6c5["chat"])["endsWith"]("@g.us")
    )
      try {
        await LAST["sendMessage"](_0x14c6c5["chat"], {
          text: _0x15c991,
          mentions: [_0x14c6c5["sender"]],
        });
      } catch (_0x489a85) {}
    await playTone(LAST, _0x14c6c5);
  }
}
const remTimer = setInterval(() => {
  fireDue()["catch"](() => {});
}, 0x3a98);
if (remTimer["unref"]) remTimer["unref"]();
setTimeout(() => {
  if (!LAST) LAST = global["sock"] || global["conn"] || null;
}, 0x1f40)["unref"]?.();
const ROASTS = [
    "{n}, your WiFi is faster at disconnecting than you are at replying.",
    '{n} still says "I\'m on my way" while looking for socks.',
    "{n}'s phone has 3% battery and 400 unread messages, and somehow the battery is the one that's doing better.",
    "{n} is the reason the group chat has a mute button.",
    '{n} types "lol" with a straight face. Every time.',
    "{n} plans like a CEO and executes like a Monday morning.",
    "{n}'s alarm has been snoozed more times than the group admin has been tagged.",
    '{n} says "I\'ll pay you back" with the confidence of a person who has never paid anyone back.',
    '{n} has a 1000-day streak of not seeing the message "Where are you?" in time.',
    '{n} gets lost between the fridge and the kitchen and calls it "exploring".',
    "{n} sends voice notes long enough to qualify as a podcast.",
    '{n}\'s fashion sense? Bold. Of course "bold" is just a polite word.',
    '{n} said "five minutes" and meant "see you next week".',
    "{n} treats the group chat like a library: reads everything and never says a word.",
    "{n}'s cooking is proof that the smoke alarm works.",
    "{n} has so many tabs open that the browser is asking for help.",
    "{n} would lose an argument against a calculator.",
    "{n}'s selfies need an editor, a filter and a prayer.",
    '{n} treats "reply all" like a personality.',
    '{n} calls it "a short nap" and wakes up the next day.',
  ],
  CAPTIONS = {
    funny: [
      "Me, pretending I have it all together. {t}",
      "No thoughts, just {t}.",
      "Plot twist: {t} was the plan all along.",
      "{t}: 10/10, would do again.",
      "Professional overthinker, amateur at {t}.",
    ],
    deep: [
      "Some days teach you more than years do. {t}",
      "Quiet minds build loud futures. {t}",
      "Not lost, just writing the next chapter. {t}",
      "Grow through what you go through. {t}",
      "Silence is also an answer. {t}",
    ],
    savage: [
      "Not everyone deserves the sequel. {t}",
      "I don't chase. I attract. {t}",
      "Still winning, even when you're not watching. {t}",
      "Be yourself. Everyone else is taken, and badly copied. {t}",
    ],
    love: [
      "You are my favourite notification. {t}",
      "Home is wherever you are. {t}",
      "Two hearts, one plan. {t}",
      "Found my person. {t}",
    ],
    hustle: [
      "Dreams don't work unless you do. {t}",
      "Built in silence, shown in results. {t}",
      "Small steps, big receipts. {t}",
      "Hustle now, shine later. {t}",
      "Today's sweat is tomorrow's story. {t}",
    ],
    vibes: [
      "Good vibes only. {t}",
      "Living in the moment. {t}",
      "Golden hour, golden mood. {t}",
      "Peace looks good on me. {t}",
      "Making memories, not excuses. {t}",
    ],
  },
  TAGBANK = {
    kenya: [
      "#Kenya",
      "#Nairobi",
      "#KenyaTwitter",
      "#254",
      "#Mombasa",
      "#MadeInKenya",
      "#KenyanCreators",
      "#VisitKenya",
    ],
    music: [
      "#Music",
      "#NewMusic",
      "#Afrobeats",
      "#Gengetone",
      "#Bongo",
      "#MusicVideo",
      "#Artist",
      "#Studio",
    ],
    food: [
      "#Foodie",
      "#Foodstagram",
      "#Yummy",
      "#Chefs",
      "#HomeCooking",
      "#KenyanFood",
      "#NyamaChoma",
      "#Chapati",
    ],
    fitness: [
      "#Fitness",
      "#Gym",
      "#Workout",
      "#FitLife",
      "#Health",
      "#Motivation",
      "#Gains",
      "#Training",
    ],
    business: [
      "#Business",
      "#Entrepreneur",
      "#Hustle",
      "#SmallBusiness",
      "#SupportLocal",
      "#Branding",
      "#Startup",
      "#Marketing",
    ],
    fashion: [
      "#Fashion",
      "#Style",
      "#OOTD",
      "#Outfit",
      "#Streetwear",
      "#Trendy",
      "#Thrift",
      "#Mtumba",
    ],
    travel: [
      "#Travel",
      "#Wanderlust",
      "#Explore",
      "#Safari",
      "#Adventure",
      "#Vacation",
      "#TravelGram",
      "#Nature",
    ],
    tech: [
      "#Tech",
      "#Coding",
      "#Developer",
      "#AI",
      "#Software",
      "#Innovation",
      "#Programming",
      "#Gadgets",
    ],
    football: [
      "#Football",
      "#Soccer",
      "#Goal",
      "#MatchDay",
      "#PremierLeague",
      "#Harambee",
      "#Sports",
      "#FootballLife",
    ],
    love: [
      "#Love",
      "#Couple",
      "#Relationship",
      "#Together",
      "#CoupleGoals",
      "#Romance",
      "#Forever",
      "#Soulmate",
    ],
    beauty: [
      "#Beauty",
      "#Makeup",
      "#Skincare",
      "#Hair",
      "#Glow",
      "#SelfCare",
      "#NaturalHair",
      "#Nails",
    ],
    car: [
      "#Cars",
      "#CarLife",
      "#Auto",
      "#Drive",
      "#CarsOfKenya",
      "#Mechanic",
      "#Wheels",
      "#Garage",
    ],
    art: [
      "#Art",
      "#Design",
      "#Creative",
      "#Photography",
      "#Artist",
      "#Illustration",
      "#Drawing",
      "#Photo",
    ],
  },
  TAGKEYS = {
    kenya: /kenya|nairobi|mombasa|kisumu|nakuru|254|swahili|harambee/,
    music: /music|song|beat|dj|album|rapper|singer|studio|gengetone/,
    food: /food|eat|cook|chef|restaurant|pizza|chapati|nyama|cake|bake|recipe|lunch|dinner/,
    fitness: /gym|fit|workout|run|health|muscle|training|yoga/,
    business:
      /business|shop|sale|sell|brand|market|startup|product|order|delivery|client|store/,
    fashion: /fashion|outfit|dress|shoes|style|clothes|wear|thrift|sneaker/,
    travel: /travel|trip|safari|beach|hotel|vacation|holiday|flight|tour|hike/,
    tech: /tech|code|coding|app|software|ai|developer|phone|laptop|website|bot/,
    football:
      /football|soccer|goal|match|league|arsenal|chelsea|united|city|liverpool|gor|afc|harambee/,
    love: /love|couple|wedding|date|boyfriend|girlfriend|anniversary|bae/,
    beauty: /beauty|makeup|skin|hair|nails|salon|barber|braids|glow/,
    car: /car|auto|drive|engine|toyota|garage|motor|bike/,
    art: /art|design|draw|photo|paint|logo|graphic|creative/,
  },
  STOP = new Set(
    "the a an and or for to of in on at is are was were be been it this that with my your our i you we they he she as by from but not so if me us them his her its just very really about have has had will can could would should do does did get got into out up down over"[
      "split"
    ]("\x20"),
  ),
  SHORTENERS = new Set([
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "is.gd",
    "v.gd",
    "cutt.ly",
    "rb.gy",
    "goo.gl",
    "ow.ly",
    "shorturl.at",
    "tiny.cc",
    "rebrand.ly",
    "buff.ly",
    "lnkd.in",
  ]),
  RISKY_TLD =
    /\.(zip|mov|xyz|top|click|work|loan|gq|tk|ml|cf|ga|icu|cyou|rest|sbs|monster|buzz|vip|cam|bid|win|country|stream|download|racing|review|science|party)$/,
  BAIT =
    /(login|log-in|signin|verify|verification|secure|security|update|account|wallet|bonus|prize|winner|claim|giveaway|free-?(data|airtime|money|cash|gift)|airtime|reward|refund|suspend|unlock|confirm|banking|password|pin-?reset|promo)/,
  BRANDS = {
    safaricom: ["safaricom.co.ke", "safaricom.com"],
    mpesa: ["safaricom.co.ke", "safaricom.com", "m-pesa.com"],
    whatsapp: ["whatsapp.com", "wa.me", "whatsapp.net", "wa.link"],
    facebook: ["facebook.com", "fb.com", "fb.me"],
    instagram: ["instagram.com"],
    google: ["google.com", "google.co.ke", "goo.gl"],
    paypal: ["paypal.com"],
    binance: ["binance.com"],
    netflix: ["netflix.com"],
    tiktok: ["tiktok.com"],
    telegram: ["telegram.org", "t.me"],
    youtube: ["youtube.com", "youtu.be"],
    equity: ["equitygroupholdings.com", "equitybank.co.ke"],
    kcb: ["kcbgroup.com", "ke.kcbgroup.com"],
    kra: ["kra.go.ke"],
    ecitizen: ["ecitizen.go.ke"],
    airtel: ["airtel.co.ke", "airtel.com"],
    amazon: ["amazon.com"],
    apple: ["apple.com"],
    microsoft: ["microsoft.com", "live.com"],
    twitter: ["twitter.com", "x.com"],
  };
function regDomain(_0x4751de) {
  const _0x5a87a2 = _0x4751de["split"](".");
  if (_0x5a87a2["length"] <= 0x2) return _0x4751de;
  const _0xedf19f = _0x5a87a2["slice"](-0x2)["join"](".");
  if (/^(co|com|or|go|ac|ne|org|net|gov|edu)\.[a-z]{2}$/["test"](_0xedf19f))
    return _0x5a87a2["slice"](-0x3)["join"](".");
  return _0xedf19f;
}
function analyseUrl(_0x25c1cd) {
  const _0x427aa7 = [];
  let _0x7fa4e0 = 0x0,
    _0x5d673b;
  try {
    _0x5d673b = new URL(_0x25c1cd);
  } catch (_0x7632b4) {
    return { score: 0x0, flags: ["Not a valid link"], host: "" };
  }
  const _0x457b3e = _0x5d673b["hostname"]["toLowerCase"](),
    _0x10ae01 = (_0x457b3e + _0x5d673b["pathname"] + _0x5d673b["search"])[
      "toLowerCase"
    ](),
    _0xe4e0d4 = regDomain(_0x457b3e);
  _0x5d673b["protocol"] !== "https:" &&
    ((_0x7fa4e0 += 0x1), _0x427aa7["push"]("Not using https (no encryption)"));
  /^\d{1,3}(\.\d{1,3}){3}$/["test"](_0x457b3e) &&
    ((_0x7fa4e0 += 0x4),
    _0x427aa7["push"]("Address is a raw IP number, not a real website name"));
  _0x457b3e["includes"]("xn--") &&
    ((_0x7fa4e0 += 0x4),
    _0x427aa7["push"]("Uses look-alike (punycode) characters in the name"));
  (_0x5d673b["username"] ||
    (_0x25c1cd["includes"]("@") && /^https?:\/\/[^/]*@/["test"](_0x25c1cd))) &&
    ((_0x7fa4e0 += 0x4),
    _0x427aa7["push"]('Contains "@", a trick to hide the real destination'));
  SHORTENERS["has"](_0xe4e0d4) &&
    ((_0x7fa4e0 += 0x2),
    _0x427aa7["push"]("Short link: the real destination is hidden"));
  RISKY_TLD["test"](_0x457b3e) &&
    ((_0x7fa4e0 += 0x2),
    _0x427aa7["push"]("Ends with a domain type often used for scams"));
  _0x457b3e["split"](".")["length"] > 0x4 &&
    ((_0x7fa4e0 += 0x2),
    _0x427aa7["push"]("Many sub-domains stacked together"));
  (_0x457b3e["match"](/-/g) || [])["length"] >= 0x3 &&
    ((_0x7fa4e0 += 0x1), _0x427aa7["push"]("Lots of hyphens in the name"));
  BAIT["test"](_0x10ae01) &&
    ((_0x7fa4e0 += 0x2),
    _0x427aa7["push"](
      "Contains bait words (login / verify / prize / claim...)",
    ));
  /\.(apk|exe|scr|bat|msi|jar)(\?|$)/["test"](
    _0x5d673b["pathname"]["toLowerCase"](),
  ) && ((_0x7fa4e0 += 0x3), _0x427aa7["push"]("Downloads an installable file"));
  for (const [_0x40e39a, _0x419519] of Object["entries"](BRANDS)) {
    if (
      _0x457b3e["includes"](_0x40e39a) &&
      !_0x419519["includes"](_0xe4e0d4) &&
      !_0x419519["some"]((_0x1605b4) => _0x457b3e["endsWith"]("." + _0x1605b4))
    ) {
      ((_0x7fa4e0 += 0x5),
        _0x427aa7["push"](
          "Pretends to be *" +
            _0x40e39a +
            "* but the real domain is " +
            _0xe4e0d4,
        ));
      break;
    }
  }
  return { score: _0x7fa4e0, flags: _0x427aa7, host: _0xe4e0d4 };
}
function privateIp(_0x5f1254) {
  if (net["isIPv4"](_0x5f1254)) {
    const [_0x14d8c6, _0x276baf] = _0x5f1254["split"](".")["map"](Number);
    return (
      _0x14d8c6 === 0x0 ||
      _0x14d8c6 === 0xa ||
      _0x14d8c6 === 0x7f ||
      (_0x14d8c6 === 0xa9 && _0x276baf === 0xfe) ||
      (_0x14d8c6 === 0xac && _0x276baf >= 0x10 && _0x276baf <= 0x1f) ||
      (_0x14d8c6 === 0xc0 && _0x276baf === 0xa8) ||
      (_0x14d8c6 === 0x64 && _0x276baf >= 0x40 && _0x276baf <= 0x7f) ||
      _0x14d8c6 >= 0xe0
    );
  }
  const _0x5ef6b3 = String(_0x5f1254)["toLowerCase"]();
  return (
    _0x5ef6b3 === "::1" ||
    _0x5ef6b3 === "::" ||
    _0x5ef6b3["startsWith"]("fc") ||
    _0x5ef6b3["startsWith"]("fd") ||
    _0x5ef6b3["startsWith"]("fe80") ||
    _0x5ef6b3["startsWith"]("::ffff:")
  );
}
async function publicHost(_0x1bb7be) {
  try {
    if (net["isIP"](_0x1bb7be)) return !privateIp(_0x1bb7be);
    const _0x52f0bb = await dns["lookup"](_0x1bb7be, { all: !![] });
    return (
      _0x52f0bb["length"] > 0x0 &&
      _0x52f0bb["every"]((_0xa5fd8c) => !privateIp(_0xa5fd8c["address"]))
    );
  } catch (_0x17203b) {
    return ![];
  }
}
async function followRedirects(_0x30642d) {
  let _0x16aacb = _0x30642d;
  for (let _0x22778a = 0x0; _0x22778a < 0x6; _0x22778a++) {
    let _0x2fcbc4;
    try {
      _0x2fcbc4 = new URL(_0x16aacb);
    } catch (_0x5b3fc1) {
      return { url: _0x16aacb, blocked: !![] };
    }
    if (
      !/^https?:$/["test"](_0x2fcbc4["protocol"]) ||
      !(await publicHost(_0x2fcbc4["hostname"]))
    )
      return { url: _0x16aacb, blocked: !![] };
    const _0x31b327 = await axios["get"](_0x16aacb, {
      maxRedirects: 0x0,
      timeout: 0x2328,
      validateStatus: () => !![],
      responseType: "stream",
      headers: { "User-Agent": UA },
    });
    if (_0x31b327["data"] && _0x31b327["data"]["destroy"])
      _0x31b327["data"]["destroy"]();
    const _0x1aa650 = _0x31b327["headers"] && _0x31b327["headers"]["location"];
    if (
      _0x31b327["status"] >= 0x12c &&
      _0x31b327["status"] < 0x190 &&
      _0x1aa650
    ) {
      _0x16aacb = new URL(_0x1aa650, _0x16aacb)["toString"]();
      continue;
    }
    return { url: _0x16aacb, blocked: ![] };
  }
  return { url: _0x16aacb, blocked: ![] };
}
function readExif(_0x2b6acf) {
  if (
    _0x2b6acf["length"] < 0x4 ||
    _0x2b6acf[0x0] !== 0xff ||
    _0x2b6acf[0x1] !== 0xd8
  )
    return null;
  let _0x2c3d81 = 0x2,
    _0x4a8154 = -0x1;
  while (_0x2c3d81 + 0x4 < _0x2b6acf["length"]) {
    if (_0x2b6acf[_0x2c3d81] !== 0xff) break;
    const _0x1c9118 = _0x2b6acf[_0x2c3d81 + 0x1],
      _0x5248b8 = _0x2b6acf["readUInt16BE"](_0x2c3d81 + 0x2);
    if (
      _0x1c9118 === 0xe1 &&
      _0x2b6acf["toString"]("latin1", _0x2c3d81 + 0x4, _0x2c3d81 + 0x8) ===
        "Exif"
    ) {
      _0x4a8154 = _0x2c3d81 + 0xa;
      break;
    }
    if (_0x1c9118 === 0xda) break;
    _0x2c3d81 += 0x2 + _0x5248b8;
  }
  if (_0x4a8154 < 0x0) return {};
  const _0x11d6ac =
      _0x2b6acf["toString"]("latin1", _0x4a8154, _0x4a8154 + 0x2) === "II",
    _0x37e292 = (_0x24e393) =>
      _0x11d6ac
        ? _0x2b6acf["readUInt16LE"](_0x24e393)
        : _0x2b6acf["readUInt16BE"](_0x24e393),
    _0x34417e = (_0x5cdcbb) =>
      _0x11d6ac
        ? _0x2b6acf["readUInt32LE"](_0x5cdcbb)
        : _0x2b6acf["readUInt32BE"](_0x5cdcbb),
    _0x534233 = {
      0x1: 0x1,
      0x2: 0x1,
      0x3: 0x2,
      0x4: 0x4,
      0x5: 0x8,
      0x7: 0x1,
      0x9: 0x4,
      0xa: 0x8,
    };
  function _0x4ae88e(_0x14746) {
    const _0x340082 = {};
    if (_0x14746 + 0x2 > _0x2b6acf["length"]) return _0x340082;
    const _0xec161a = _0x37e292(_0x4a8154 + _0x14746);
    for (let _0x4e391b = 0x0; _0x4e391b < _0xec161a; _0x4e391b++) {
      const _0xc91841 = _0x4a8154 + _0x14746 + 0x2 + _0x4e391b * 0xc;
      if (_0xc91841 + 0xc > _0x2b6acf["length"]) break;
      const _0x25bd43 = _0x37e292(_0xc91841),
        _0x492984 = _0x37e292(_0xc91841 + 0x2),
        _0x15e318 = _0x34417e(_0xc91841 + 0x4),
        _0x5a7da2 = (_0x534233[_0x492984] || 0x1) * _0x15e318,
        _0x539f41 =
          _0x5a7da2 <= 0x4
            ? _0xc91841 + 0x8
            : _0x4a8154 + _0x34417e(_0xc91841 + 0x8);
      if (_0x539f41 + _0x5a7da2 > _0x2b6acf["length"]) continue;
      let _0x5e63dd;
      if (_0x492984 === 0x2)
        _0x5e63dd = _0x2b6acf["toString"](
          "latin1",
          _0x539f41,
          _0x539f41 + Math["max"](0x0, _0x15e318 - 0x1),
        )
          ["replace"](/\0.*$/, "")
          ["trim"]();
      else {
        if (_0x492984 === 0x3)
          _0x5e63dd =
            _0x15e318 === 0x1
              ? _0x37e292(_0x539f41)
              : Array["from"]({ length: _0x15e318 }, (_0x2b6511, _0x1d3415) =>
                  _0x37e292(_0x539f41 + _0x1d3415 * 0x2),
                );
        else {
          if (_0x492984 === 0x4)
            _0x5e63dd =
              _0x15e318 === 0x1
                ? _0x34417e(_0x539f41)
                : Array["from"]({ length: _0x15e318 }, (_0xb4b18f, _0x52a7eb) =>
                    _0x34417e(_0x539f41 + _0x52a7eb * 0x4),
                  );
          else {
            if (_0x492984 === 0x5)
              _0x5e63dd = Array["from"](
                { length: _0x15e318 },
                (_0x4735ec, _0x725748) => {
                  const _0x3fce5f = _0x34417e(
                    _0x539f41 + _0x725748 * 0x8 + 0x4,
                  );
                  return _0x3fce5f
                    ? _0x34417e(_0x539f41 + _0x725748 * 0x8) / _0x3fce5f
                    : 0x0;
                },
              );
            else continue;
          }
        }
      }
      _0x340082[_0x25bd43] = _0x5e63dd;
    }
    return _0x340082;
  }
  const _0x22dc86 = _0x4ae88e(_0x34417e(_0x4a8154 + 0x4)),
    _0x463507 = _0x22dc86[0x8769] ? _0x4ae88e(_0x22dc86[0x8769]) : {},
    _0x273c2a = _0x22dc86[0x8825] ? _0x4ae88e(_0x22dc86[0x8825]) : {},
    _0x1416da = (_0x23ea0f) =>
      Array["isArray"](_0x23ea0f) ? _0x23ea0f[0x0] : _0x23ea0f,
    _0x36f7f7 = {
      make: _0x22dc86[0x10f],
      model: _0x22dc86[0x110],
      software: _0x22dc86[0x131],
      taken: _0x463507[0x9003] || _0x22dc86[0x132],
      width: _0x463507[0xa002],
      height: _0x463507[0xa003],
      iso: _0x1416da(_0x463507[0x8827]),
      fnum: _0x1416da(_0x463507[0x829d]),
      exposure: _0x1416da(_0x463507[0x829a]),
      focal: _0x1416da(_0x463507[0x920a]),
    };
  if (_0x273c2a[0x2] && _0x273c2a[0x4]) {
    const _0x2742f6 = (_0x529975) =>
      _0x529975[0x0] + _0x529975[0x1] / 0x3c + _0x529975[0x2] / 0xe10;
    let _0x3f2855 = _0x2742f6(_0x273c2a[0x2]),
      _0x3348a8 = _0x2742f6(_0x273c2a[0x4]);
    if (String(_0x273c2a[0x1])["toUpperCase"]() === "S") _0x3f2855 = -_0x3f2855;
    if (String(_0x273c2a[0x3])["toUpperCase"]() === "W") _0x3348a8 = -_0x3348a8;
    _0x36f7f7["gps"] = { lat: _0x3f2855, lon: _0x3348a8 };
  }
  return _0x36f7f7;
}
function pdfClean(_0x16e860) {
  return String(_0x16e860)
    ["replace"](/[‘’]/g, "\x27")
    ["replace"](/[“”]/g, "\x22")
    ["replace"](/[–—]/g, "-")
    ["replace"](/…/g, "...")
    ["replace"](/•/g, "-")
    ["replace"](/[^\x20-\x7E\xA0-\xFF]/g, "?")
    ["replace"](/\\/g, "\x5c\x5c")
    ["replace"](/\(/g, "\x5c(")
    ["replace"](/\)/g, "\x5c)");
}
function buildPdf(_0x251665) {
  const _0x411ccd = 0x253,
    _0x2a2004 = 0x34a,
    _0x546e85 = 0x32,
    _0x1856aa = [[]];
  let _0x28347b = _0x2a2004 - _0x546e85;
  const _0x526840 = () => {
    (_0x1856aa["push"]([]), (_0x28347b = _0x2a2004 - _0x546e85));
  };
  for (const _0x17558d of _0x251665) {
    if (_0x17558d["gap"]) {
      _0x28347b -= _0x17558d["gap"];
      continue;
    }
    const _0x467311 = _0x17558d["size"] || 0xb,
      _0x4f7408 = Math["round"](_0x467311 * 1.45),
      _0x2e0f0d = Math["max"](
        0x14,
        Math["floor"](
          (_0x411ccd - _0x546e85 * 0x2 - (_0x17558d["indent"] || 0x0)) /
            (_0x467311 * (_0x17558d["bold"] ? 0.54 : 0.5)),
        ),
      ),
      _0x17e460 = String(_0x17558d["text"])["split"](/\s+/),
      _0x4228c6 = [];
    let _0x668901 = "";
    for (const _0x4a8122 of _0x17e460) {
      if ((_0x668901 + "\x20" + _0x4a8122)["trim"]()["length"] > _0x2e0f0d) {
        if (_0x668901) _0x4228c6["push"](_0x668901);
        _0x668901 = _0x4a8122;
      } else _0x668901 = (_0x668901 + "\x20" + _0x4a8122)["trim"]();
    }
    if (_0x668901) _0x4228c6["push"](_0x668901);
    for (const _0x610874 of _0x4228c6) {
      if (_0x28347b - _0x4f7408 < _0x546e85) _0x526840();
      const _0x172ae5 = _0x1856aa[_0x1856aa["length"] - 0x1];
      (_0x172ae5["push"](
        "BT /" +
          (_0x17558d["bold"] ? "F2" : "F1") +
          "\x20" +
          _0x467311 +
          " Tf " +
          (_0x17558d["color"] || "0 0 0") +
          " rg " +
          (_0x546e85 + (_0x17558d["indent"] || 0x0)) +
          "\x20" +
          (_0x28347b - _0x467311) +
          " Td (" +
          pdfClean(_0x610874) +
          ") Tj ET",
      ),
        (_0x28347b -= _0x4f7408));
    }
    if (_0x17558d["rule"]) {
      const _0x326747 = _0x1856aa[_0x1856aa["length"] - 0x1];
      (_0x326747["push"](
        "0.6 w 0.2 0.2 0.2 RG " +
          _0x546e85 +
          "\x20" +
          (_0x28347b + 0x2) +
          " m " +
          (_0x411ccd - _0x546e85) +
          "\x20" +
          (_0x28347b + 0x2) +
          " l S",
      ),
        (_0x28347b -= 0x6));
    }
  }
  const _0x3e6ef7 = [],
    _0x2bb277 = (_0xbaaca9) => {
      return (_0x3e6ef7["push"](_0xbaaca9), _0x3e6ef7["length"]);
    };
  (_0x2bb277("<< /Type /Catalog /Pages 2 0 R >>"), _0x2bb277(null));
  const _0x43d9e3 = _0x2bb277(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    ),
    _0x33982c = _0x2bb277(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    ),
    _0x407a3c = [];
  for (const _0x26b1d9 of _0x1856aa) {
    const _0x5c3e03 = _0x26b1d9["join"]("\x0a"),
      _0x4c05f1 = _0x2bb277(
        "<< /Length " +
          Buffer["byteLength"](_0x5c3e03, "latin1") +
          " >>\nstream\n" +
          _0x5c3e03 +
          "\nendstream",
      ),
      _0x593c87 = _0x2bb277(
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " +
          _0x411ccd +
          "\x20" +
          _0x2a2004 +
          "] /Resources << /Font << /F1 " +
          _0x43d9e3 +
          " 0 R /F2 " +
          _0x33982c +
          " 0 R >> >> /Contents " +
          _0x4c05f1 +
          " 0 R >>",
      );
    _0x407a3c["push"](_0x593c87 + " 0 R");
  }
  _0x3e6ef7[0x1] =
    "<< /Type /Pages /Kids [" +
    _0x407a3c["join"]("\x20") +
    "] /Count " +
    _0x407a3c["length"] +
    " >>";
  let _0x461481 = "%PDF-1.4\n";
  const _0x535998 = [];
  _0x3e6ef7["forEach"]((_0x3ea106, _0x16ae21) => {
    (_0x535998["push"](Buffer["byteLength"](_0x461481, "latin1")),
      (_0x461481 += _0x16ae21 + 0x1 + " 0 obj\n" + _0x3ea106 + "\nendobj\n"));
  });
  const _0x19f484 = Buffer["byteLength"](_0x461481, "latin1");
  return (
    (_0x461481 +=
      "xref\n0 " +
      (_0x3e6ef7["length"] + 0x1) +
      "\n0000000000 65535 f \n" +
      _0x535998["map"](
        (_0x244143) => String(_0x244143)["padStart"](0xa, "0") + " 00000 n \n",
      )["join"]("") +
      ("trailer\n<< /Size " +
        (_0x3e6ef7["length"] + 0x1) +
        " /Root 1 0 R >>\nstartxref\n" +
        _0x19f484 +
        "\n%%EOF\n")),
    Buffer["from"](_0x461481, "latin1")
  );
}
const FUEL_FILE = path["join"](process["cwd"](), "fuel_data.json"),
  loadFuel = () => {
    try {
      return JSON["parse"](fs["readFileSync"](FUEL_FILE, "utf8"));
    } catch (_0xa99fa3) {
      return null;
    }
  },
  CITY_TZ = {
    nairobi: "Africa/Nairobi",
    kenya: "Africa/Nairobi",
    mombasa: "Africa/Nairobi",
    kisumu: "Africa/Nairobi",
    nakuru: "Africa/Nairobi",
    eldoret: "Africa/Nairobi",
    kampala: "Africa/Kampala",
    uganda: "Africa/Kampala",
    "dar\x20es\x20salaam": "Africa/Dar_es_Salaam",
    dar: "Africa/Dar_es_Salaam",
    tanzania: "Africa/Dar_es_Salaam",
    dodoma: "Africa/Dar_es_Salaam",
    kigali: "Africa/Kigali",
    rwanda: "Africa/Kigali",
    "addis\x20ababa": "Africa/Addis_Ababa",
    ethiopia: "Africa/Addis_Ababa",
    mogadishu: "Africa/Mogadishu",
    somalia: "Africa/Mogadishu",
    lagos: "Africa/Lagos",
    nigeria: "Africa/Lagos",
    abuja: "Africa/Lagos",
    accra: "Africa/Accra",
    ghana: "Africa/Accra",
    johannesburg: "Africa/Johannesburg",
    "south\x20africa": "Africa/Johannesburg",
    "cape\x20town": "Africa/Johannesburg",
    pretoria: "Africa/Johannesburg",
    cairo: "Africa/Cairo",
    egypt: "Africa/Cairo",
    lusaka: "Africa/Lusaka",
    zambia: "Africa/Lusaka",
    harare: "Africa/Harare",
    zimbabwe: "Africa/Harare",
    kinshasa: "Africa/Kinshasa",
    "dr\x20congo": "Africa/Kinshasa",
    dakar: "Africa/Dakar",
    senegal: "Africa/Dakar",
    casablanca: "Africa/Casablanca",
    morocco: "Africa/Casablanca",
    juba: "Africa/Juba",
    london: "Europe/London",
    uk: "Europe/London",
    england: "Europe/London",
    paris: "Europe/Paris",
    france: "Europe/Paris",
    berlin: "Europe/Berlin",
    germany: "Europe/Berlin",
    madrid: "Europe/Madrid",
    spain: "Europe/Madrid",
    rome: "Europe/Rome",
    italy: "Europe/Rome",
    amsterdam: "Europe/Amsterdam",
    moscow: "Europe/Moscow",
    russia: "Europe/Moscow",
    istanbul: "Europe/Istanbul",
    turkey: "Europe/Istanbul",
    "new\x20york": "America/New_York",
    usa: "America/New_York",
    us: "America/New_York",
    chicago: "America/Chicago",
    "los\x20angeles": "America/Los_Angeles",
    la: "America/Los_Angeles",
    toronto: "America/Toronto",
    canada: "America/Toronto",
    "sao\x20paulo": "America/Sao_Paulo",
    brazil: "America/Sao_Paulo",
    mexico: "America/Mexico_City",
    dubai: "Asia/Dubai",
    uae: "Asia/Dubai",
    doha: "Asia/Qatar",
    qatar: "Asia/Qatar",
    riyadh: "Asia/Riyadh",
    "saudi\x20arabia": "Asia/Riyadh",
    mumbai: "Asia/Kolkata",
    delhi: "Asia/Kolkata",
    india: "Asia/Kolkata",
    karachi: "Asia/Karachi",
    pakistan: "Asia/Karachi",
    dhaka: "Asia/Dhaka",
    bangkok: "Asia/Bangkok",
    jakarta: "Asia/Jakarta",
    indonesia: "Asia/Jakarta",
    singapore: "Asia/Singapore",
    "hong\x20kong": "Asia/Hong_Kong",
    beijing: "Asia/Shanghai",
    shanghai: "Asia/Shanghai",
    china: "Asia/Shanghai",
    tokyo: "Asia/Tokyo",
    japan: "Asia/Tokyo",
    seoul: "Asia/Seoul",
    korea: "Asia/Seoul",
    manila: "Asia/Manila",
    sydney: "Australia/Sydney",
    australia: "Australia/Sydney",
    melbourne: "Australia/Melbourne",
    auckland: "Pacific/Auckland",
    "new\x20zealand": "Pacific/Auckland",
  };
let TZ_BY_CITY = null;
function resolveTz(_0x4131f9) {
  _0x4131f9 = _0x4131f9["trim"]()["toLowerCase"]()["replace"](/[_]+/g, "\x20");
  if (CITY_TZ[_0x4131f9]) return CITY_TZ[_0x4131f9];
  try {
    if (!TZ_BY_CITY) {
      TZ_BY_CITY = {};
      for (const _0x50cff9 of Intl["supportedValuesOf"]
        ? Intl["supportedValuesOf"]("timeZone")
        : [])
        TZ_BY_CITY[
          _0x50cff9["split"]("/")
            ["pop"]()
            ["replace"](/_/g, "\x20")
            ["toLowerCase"]()
        ] = _0x50cff9;
    }
    if (TZ_BY_CITY[_0x4131f9]) return TZ_BY_CITY[_0x4131f9];
    const _0x38e878 = _0x4131f9["replace"](/\s+/g, "_");
    return new Intl["DateTimeFormat"]("en", { timeZone: _0x38e878 })[
      "resolvedOptions"
    ]()["timeZone"];
  } catch (_0x3caa2a) {
    return null;
  }
}
function offsetMin(_0x45f9e6, _0x5bc185 = new Date()) {
  try {
    const _0x23bb5 = new Intl["DateTimeFormat"]("en-US", {
        timeZone: _0x45f9e6,
        timeZoneName: "longOffset",
      })
        ["formatToParts"](_0x5bc185)
        ["find"]((_0x554687) => _0x554687["type"] === "timeZoneName")["value"],
      _0xfa8a1e = _0x23bb5["match"](/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!_0xfa8a1e) return 0x0;
    return (
      (_0xfa8a1e[0x1] === "-" ? -0x1 : 0x1) *
      (Number(_0xfa8a1e[0x2]) * 0x3c + Number(_0xfa8a1e[0x3] || 0x0))
    );
  } catch (_0x5bebde) {
    return 0x0;
  }
}
const offLabel = (_0x70ccc0) =>
  "UTC" +
  (_0x70ccc0 < 0x0 ? "-" : "+") +
  Math["floor"](Math["abs"](_0x70ccc0) / 0x3c) +
  (Math["abs"](_0x70ccc0) % 0x3c
    ? ":" + String(Math["abs"](_0x70ccc0) % 0x3c)["padStart"](0x2, "0")
    : "");
function clock(_0x48c5cb) {
  const _0x59bec1 = new Date(),
    _0x1ef0a8 = _0x59bec1["toLocaleTimeString"]("en-GB", {
      timeZone: _0x48c5cb,
      hour: "2-digit",
      minute: "2-digit",
      hour12: ![],
    }),
    _0x26a47e = _0x59bec1["toLocaleDateString"]("en-GB", {
      timeZone: _0x48c5cb,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    _0x964de0 = Number(_0x1ef0a8["slice"](0x0, 0x2));
  return {
    time: _0x1ef0a8,
    date: _0x26a47e,
    hour: _0x964de0,
    off: offsetMin(_0x48c5cb, _0x59bec1),
    icon: _0x964de0 >= 0x6 && _0x964de0 < 0x12 ? "☀️" : "🌙",
  };
}
const NAMED = {
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  orange: "#ffa500",
  purple: "#800080",
  pink: "#ffc0cb",
  black: "#000000",
  white: "#ffffff",
  gray: "#808080",
  grey: "#808080",
  brown: "#a52a2a",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  gold: "#ffd700",
  silver: "#c0c0c0",
  navy: "#000080",
  teal: "#008080",
  maroon: "#800000",
  lime: "#00ff00",
  olive: "#808000",
  coral: "#ff7f50",
  salmon: "#fa8072",
  violet: "#ee82ee",
  indigo: "#4b0082",
  turquoise: "#40e0d0",
  beige: "#f5f5dc",
  crimson: "#dc143c",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
};
function parseColor(_0x233640) {
  let _0x195f04 = String(_0x233640 || "")
    ["trim"]()
    ["toLowerCase"]();
  if (NAMED[_0x195f04]) _0x195f04 = NAMED[_0x195f04];
  let _0x5372b2 = _0x195f04["match"](/^#?([0-9a-f]{6})$/);
  if (_0x5372b2)
    return [
      parseInt(_0x5372b2[0x1]["slice"](0x0, 0x2), 0x10),
      parseInt(_0x5372b2[0x1]["slice"](0x2, 0x4), 0x10),
      parseInt(_0x5372b2[0x1]["slice"](0x4, 0x6), 0x10),
    ];
  _0x5372b2 = _0x195f04["match"](/^#?([0-9a-f]{3})$/);
  if (_0x5372b2)
    return [..._0x5372b2[0x1]]["map"]((_0x189eee) =>
      parseInt(_0x189eee + _0x189eee, 0x10),
    );
  _0x5372b2 = _0x195f04["match"](
    /(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/,
  );
  if (_0x5372b2) {
    const _0x13370c = [_0x5372b2[0x1], _0x5372b2[0x2], _0x5372b2[0x3]]["map"](
      Number,
    );
    if (_0x13370c["every"]((_0x5eefcb) => _0x5eefcb <= 0xff)) return _0x13370c;
  }
  return null;
}
const hex2 = (_0x38501e) => _0x38501e["toString"](0x10)["padStart"](0x2, "0");
function toHsl([_0x47db9c, _0x1b0776, _0x4782c0]) {
  ((_0x47db9c /= 0xff), (_0x1b0776 /= 0xff), (_0x4782c0 /= 0xff));
  const _0x4117c9 = Math["max"](_0x47db9c, _0x1b0776, _0x4782c0),
    _0x4bc223 = Math["min"](_0x47db9c, _0x1b0776, _0x4782c0);
  let _0x32f3da = 0x0,
    _0x12a04c = 0x0;
  const _0x2aa961 = (_0x4117c9 + _0x4bc223) / 0x2;
  if (_0x4117c9 !== _0x4bc223) {
    const _0x52c01f = _0x4117c9 - _0x4bc223;
    ((_0x12a04c =
      _0x2aa961 > 0.5
        ? _0x52c01f / (0x2 - _0x4117c9 - _0x4bc223)
        : _0x52c01f / (_0x4117c9 + _0x4bc223)),
      (_0x32f3da =
        _0x4117c9 === _0x47db9c
          ? (_0x1b0776 - _0x4782c0) / _0x52c01f +
            (_0x1b0776 < _0x4782c0 ? 0x6 : 0x0)
          : _0x4117c9 === _0x1b0776
            ? (_0x4782c0 - _0x47db9c) / _0x52c01f + 0x2
            : (_0x47db9c - _0x1b0776) / _0x52c01f + 0x4),
      (_0x32f3da *= 0x3c));
  }
  return [
    Math["round"](_0x32f3da),
    Math["round"](_0x12a04c * 0x64),
    Math["round"](_0x2aa961 * 0x64),
  ];
}
function nearestName(_0x3ef024) {
  let _0x4ea7cc = null,
    _0x5e1510 = 0x3b9aca00;
  for (const [_0x48282b, _0x14ea48] of Object["entries"](NAMED)) {
    const _0xf374f0 = parseColor(_0x14ea48),
      _0x217b95 =
        (_0xf374f0[0x0] - _0x3ef024[0x0]) ** 0x2 +
        (_0xf374f0[0x1] - _0x3ef024[0x1]) ** 0x2 +
        (_0xf374f0[0x2] - _0x3ef024[0x2]) ** 0x2;
    _0x217b95 < _0x5e1510 && ((_0x5e1510 = _0x217b95), (_0x4ea7cc = _0x48282b));
  }
  return _0x4ea7cc;
}
module["exports"] = [
  {
    name: "remind",
    aliases: ["reminder", "remindme", "setreminder"],
    description:
      "Set a reminder with a tagged pop-up (.remind 30m call mum / .remind at 18:30 gym)",
    async execute(_0x1de78c, _0x96e072, _0x83b3b0) {
      const _0x1117d1 = kit["ctx"](_0x1de78c, _0x96e072, _0x83b3b0);
      grab(_0x1de78c);
      const _0x221878 = parseReminder(_0x1117d1["text"]);
      if (!_0x221878 || !_0x221878["text"])
        return _0x1117d1["reply"](
          "⏰ *" +
            BM +
            " Reminders*\n\n*.remind 30m call mum*\n*.remind 2h30m send the invoice*\n*.remind 1d pay rent*\n*.remind at 18:30 gym*   (Nairobi time)\n*.remind at 7am wake up*\n*.remind resume updates 1 am*   (time can be last too)\n\n🔔 When it is time I tag you privately and send the " +
            BM +
            " alert sound.\n🎵 Want a song instead? Add *| song name*:\n*.remind at 6am wake up | song Burna Boy Last Last*\nNo sound: *| silent*\n\nMake a song your default: *.remindtone Burna Boy Last Last*\n*.reminders* shows your list • *.unremind <number>* cancels one.",
        );
      if (_0x221878["ms"] < 0x2710)
        return _0x1117d1["reply"]("⚠️ Set it at least 10 seconds ahead.");
      if (_0x221878["ms"] > 0x1e * 0x5265c00)
        return _0x1117d1["reply"]("⚠️ Maximum is 30 days ahead.");
      const _0x2a8883 = loadRem();
      if (
        _0x2a8883["list"]["filter"](
          (_0x182ce0) => _0x182ce0["sender"] === _0x1117d1["sender"],
        )["length"] >= 0x14
      )
        return _0x1117d1["reply"](
          "⚠️ You already have 20 reminders. Cancel one with *.unremind <number>*",
        );
      ((_0x2a8883["id"] += 0x1),
        _0x2a8883["list"]["push"]({
          id: _0x2a8883["id"],
          sender: _0x1117d1["sender"],
          chat: _0x1117d1["chat"],
          at: _0x221878["at"],
          set: Date["now"](),
          text: _0x221878["text"]["slice"](0x0, 0x12c),
          tone: _0x221878["tone"] || null,
        }),
        saveRem());
      const _0x4578a9 = _0x221878["tone"] ||
          (_0x2a8883["tones"] && _0x2a8883["tones"][_0x1117d1["sender"]]) || {
            type: "alarm",
          },
        _0x28adcb =
          _0x4578a9["type"] === "song"
            ? "🎵 Song: " + _0x4578a9["query"]
            : _0x4578a9["type"] === "none"
              ? "🔕 No sound"
              : "🔔 " + BM + " alert sound";
      _0x1117d1["reply"](
        "✅ *Reminder set* ⏰\n\n📌 " +
          _0x221878["text"] +
          "\n🕒 " +
          nairobiStamp(_0x221878["at"]) +
          " (in " +
          human(_0x221878["ms"]) +
          ")\x0a" +
          _0x28adcb +
          "\n\n_I will tag you privately when it is time._",
      );
    },
  },
  {
    name: "remindtone",
    aliases: ["remindsong", "alerttone", "remindersound"],
    description:
      "Choose the song or sound for your reminders (.remindtone <song> / alarm / off)",
    async execute(_0xa1f3, _0x6d3d4, _0x57229e) {
      const _0x47d5f0 = kit["ctx"](_0xa1f3, _0x6d3d4, _0x57229e);
      grab(_0xa1f3);
      const _0x1743be = loadRem();
      _0x1743be["tones"] = _0x1743be["tones"] || {};
      const _0x41d905 = _0x47d5f0["text"],
        _0xcc5354 = _0x1743be["tones"][_0x47d5f0["sender"]];
      if (!_0x41d905)
        return _0x47d5f0["reply"](
          "🔔 *" +
            BM +
            " Reminder sound*\n\nNow: " +
            (!_0xcc5354
              ? "the " + BM + " alert sound"
              : _0xcc5354["type"] === "song"
                ? "🎵 " + _0xcc5354["query"]
                : "🔕 none") +
            "\n\n*.remindtone Burna Boy Last Last*  (play this song)\n*.remindtone alarm*  (" +
            BM +
            " alert sound)\n*.remindtone off*  (no sound)\n\nOne reminder only: *.remind 1h call mum | song Sauti Sol Sura Yako*",
        );
      if (/^(alarm|alert|default|beep|reset)$/i["test"](_0x41d905))
        return (
          delete _0x1743be["tones"][_0x47d5f0["sender"]],
          saveRem(),
          _0x47d5f0["reply"](
            "🔔 Your reminders will play the " + BM + " alert sound.",
          )
        );
      if (/^(off|none|silent|mute)$/i["test"](_0x41d905))
        return (
          (_0x1743be["tones"][_0x47d5f0["sender"]] = { type: "none" }),
          saveRem(),
          _0x47d5f0["reply"](
            "🔕 Your reminders will be silent (just the tagged message).",
          )
        );
      ((_0x1743be["tones"][_0x47d5f0["sender"]] = {
        type: "song",
        query: _0x41d905["replace"](/^(song|play|music)\b\s*:?\s*/i, "")[
          "slice"
        ](0x0, 0x64),
      }),
        saveRem(),
        _0x47d5f0["reply"](
          "🎵 Your reminders will play: *" +
            _0x1743be["tones"][_0x47d5f0["sender"]]["query"] +
            "*\n_If the song cannot be fetched, I send the " +
            BM +
            " alert sound instead._",
        ));
    },
  },
  {
    name: "reminders",
    aliases: ["myreminders", "listreminders"],
    description: "List your reminders",
    async execute(_0xe10a36, _0x526fd4, _0x50c317) {
      const _0x5d153f = kit["ctx"](_0xe10a36, _0x526fd4, _0x50c317);
      grab(_0xe10a36);
      const _0x35fa0f = loadRem()
        ["list"]["filter"](
          (_0x3e5539) => _0x3e5539["sender"] === _0x5d153f["sender"],
        )
        ["sort"]((_0x2efa5a, _0x2d260d) => _0x2efa5a["at"] - _0x2d260d["at"]);
      if (!_0x35fa0f["length"])
        return _0x5d153f["reply"](
          "You have no reminders. Set one: *.remind 30m call mum*",
        );
      _0x5d153f["reply"](
        "⏰ *Your reminders*\n\n" +
          _0x35fa0f["map"](
            (_0x2c9d9d, _0x4f0bf4) =>
              _0x4f0bf4 +
              0x1 +
              ".\x20" +
              _0x2c9d9d["text"] +
              "\n    🕒 " +
              nairobiStamp(_0x2c9d9d["at"]) +
              " (in " +
              human(_0x2c9d9d["at"] - Date["now"]()) +
              ")",
          )["join"]("\x0a\x0a") +
          "\n\n*.unremind <number>* to cancel",
      );
    },
  },
  {
    name: "unremind",
    aliases: ["cancelreminder", "delreminder"],
    description: "Cancel a reminder (.unremind 1 / .unremind all)",
    async execute(_0x68d43, _0x2ce8cd, _0x35ca62) {
      const _0x553161 = kit["ctx"](_0x68d43, _0x2ce8cd, _0x35ca62);
      grab(_0x68d43);
      const _0x52cbf6 = loadRem(),
        _0x32209f = _0x52cbf6["list"]
          ["filter"]((_0x56af33) => _0x56af33["sender"] === _0x553161["sender"])
          ["sort"]((_0x40e454, _0x4668e1) => _0x40e454["at"] - _0x4668e1["at"]),
        _0x131a6e = _0x553161["text"]["toLowerCase"]();
      if (!_0x32209f["length"])
        return _0x553161["reply"]("You have no reminders.");
      if (_0x131a6e === "all")
        return (
          (_0x52cbf6["list"] = _0x52cbf6["list"]["filter"](
            (_0x3b1277) => _0x3b1277["sender"] !== _0x553161["sender"],
          )),
          saveRem(),
          _0x553161["reply"]("🗑️ All your reminders were cancelled.")
        );
      const _0x5bdc5f = _0x32209f[Number(_0x131a6e) - 0x1];
      if (!_0x5bdc5f)
        return _0x553161["reply"](
          "Send the number from *.reminders*, e.g. *.unremind 1*",
        );
      ((_0x52cbf6["list"] = _0x52cbf6["list"]["filter"](
        (_0x15420b) => _0x15420b["id"] !== _0x5bdc5f["id"],
      )),
        saveRem(),
        _0x553161["reply"]("🗑️ Cancelled: " + _0x5bdc5f["text"]));
    },
  },
  {
    name: "igcaption",
    aliases: ["captions", "captionidea", "postcaption"],
    description:
      "Caption ideas for a post (.igcaption <topic> [funny|deep|savage|love|hustle|vibes])",
    async execute(_0x47c7e3, _0x4a118a, _0x16e24f) {
      const _0xb1b5 = kit["ctx"](_0x47c7e3, _0x4a118a, _0x16e24f);
      let _0x68e541 = (_0xb1b5["text"] || _0xb1b5["quotedText"] || "")[
        "trim"
      ]();
      const _0x15df2b = Object["keys"](CAPTIONS);
      let _0x5caf3f = (_0x68e541["match"](
        new RegExp("\\b(" + _0x15df2b["join"]("|") + ")\\b", "i"),
      ) || [])[0x1];
      if (_0x5caf3f)
        _0x68e541 = _0x68e541["replace"](
          new RegExp("\x5cb" + _0x5caf3f + "\x5cb", "i"),
          "",
        )["trim"]();
      _0x5caf3f = (_0x5caf3f || "")["toLowerCase"]();
      if (!_0x68e541 && !_0x5caf3f)
        return _0xb1b5["reply"](
          "📝 *" +
            BM +
            " Captions*\n\n*.igcaption beach day with friends*\n*.igcaption new shoes savage*\n*.igcaption gym hustle*\n\nVibes: " +
            _0x15df2b["join"](",\x20"),
        );
      let _0x7c0aa4 = await askAI(
        'Write 5 short, catchy social media captions about: "' +
          (_0x68e541 || "a nice day") +
          '". Vibe: ' +
          (_0x5caf3f || "mixed") +
          ". One per line, numbered 1-5, each with at most one emoji. Output only the 5 lines.",
      );
      if (
        !_0x7c0aa4 ||
        _0x7c0aa4["split"]("\x0a")["filter"]((_0x31eec2) =>
          /^\s*\d/["test"](_0x31eec2),
        )["length"] < 0x3
      ) {
        const _0x7dda1a =
            CAPTIONS[_0x5caf3f] || []["concat"](...Object["values"](CAPTIONS)),
          _0x651a92 = [],
          _0x1c906d = _0x7dda1a["slice"]();
        while (_0x651a92["length"] < 0x5 && _0x1c906d["length"])
          _0x651a92["push"](
            _0x1c906d["splice"](
              Math["floor"](Math["random"]() * _0x1c906d["length"]),
              0x1,
            )[0x0],
          );
        _0x7c0aa4 = _0x651a92["map"](
          (_0x164be4, _0x208377) =>
            _0x208377 +
            0x1 +
            ".\x20" +
            _0x164be4["replace"](
              " {t}",
              _0x68e541
                ? "\x20" +
                    _0x68e541["charAt"](0x0)["toUpperCase"]() +
                    _0x68e541["slice"](0x1) +
                    "."
                : "",
            )["replace"]("{t}", _0x68e541 || "this"),
        )["join"]("\x0a");
      }
      _0xb1b5["reply"](
        "📝 *" +
          BM +
          " Caption ideas*\n\n" +
          _0x7c0aa4 +
          "\n\n_Tip: add a vibe word, e.g._ *.igcaption " +
          (_0x68e541 || "my new look") +
          "\x20" +
          (_0x5caf3f || "savage") +
          "*",
      );
    },
  },
  {
    name: "hashtags",
    aliases: ["hashtag", "tags"],
    description: "Hashtags for a post (.hashtags <topic or caption>)",
    async execute(_0x5b67c7, _0x3acf80, _0xeda8f9) {
      const _0x34a02f = kit["ctx"](_0x5b67c7, _0x3acf80, _0xeda8f9),
        _0x58a4e5 = (_0x34a02f["text"] || _0x34a02f["quotedText"] || "")[
          "trim"
        ]();
      if (!_0x58a4e5)
        return _0x34a02f["reply"](
          "#️⃣ *" +
            BM +
            " Hashtags*\n\n*.hashtags nyama choma weekend*\n*.hashtags new sneakers drop in Nairobi*\n\nOr reply to a caption with *.hashtags*",
        );
      const _0x1e767a = _0x58a4e5["toLowerCase"](),
        _0x1dfc81 = [
          ...new Set(
            _0x1e767a["replace"](/[^a-z0-9\s]/g, "\x20")
              ["split"](/\s+/)
              ["filter"](
                (_0x2c8d52) =>
                  _0x2c8d52["length"] > 0x2 && !STOP["has"](_0x2c8d52),
              ),
          ),
        ]["slice"](0x0, 0x8),
        _0x297663 = _0x1dfc81["map"](
          (_0x165bb4) =>
            "#" +
            _0x165bb4["charAt"](0x0)["toUpperCase"]() +
            _0x165bb4["slice"](0x1),
        ),
        _0x390a81 =
          _0x1dfc81["length"] > 0x1
            ? [
                "#" +
                  _0x1dfc81["slice"](0x0, 0x2)
                    ["map"](
                      (_0x1c9249) =>
                        _0x1c9249["charAt"](0x0)["toUpperCase"]() +
                        _0x1c9249["slice"](0x1),
                    )
                    ["join"](""),
              ]
            : [];
      let _0x8a4498 = [];
      for (const [_0x44064d, _0x2f261a] of Object["entries"](TAGKEYS))
        if (_0x2f261a["test"](_0x1e767a))
          _0x8a4498 = _0x8a4498["concat"](TAGBANK[_0x44064d]);
      const _0x519105 = [
          "#Trending",
          "#Viral",
          "#Explore",
          "#ForYou",
          "#Reels",
          "#InstaGood",
          "#Fyp",
          "#Follow",
        ],
        _0x2f875e = [
          ...new Set([
            ..._0x297663,
            ..._0x390a81,
            ..._0x8a4498["slice"](0x0, 0xe),
            ..._0x519105,
          ]),
        ]["slice"](0x0, 0x14);
      _0x34a02f["reply"](
        "#️⃣ *" +
          BM +
          " Hashtags*\n\n" +
          _0x2f875e["join"]("\x20") +
          "\n\n_" +
          _0x2f875e["length"] +
          " tags • copy and paste under your post. Instagram works best with 8 to 15._",
      );
    },
  },
  {
    name: "mockup",
    aliases: ["productpost", "adpost", "sellpost"],
    description:
      "Ready-to-post product ad (.mockup Product | price | details | contact)",
    async execute(_0x7542b5, _0x563885, _0x51f3f0) {
      const _0x3f3f06 = kit["ctx"](_0x7542b5, _0x563885, _0x51f3f0),
        [_0x23582b, _0x1854bc, _0x44ea44, _0x5ec6ff] = _0x3f3f06["text"]
          ["split"]("|")
          ["map"]((_0x10f2f8) => _0x10f2f8["trim"]());
      if (!_0x23582b)
        return _0x3f3f06["reply"](
          "🛍️ *" +
            BM +
            " Mockup (product post)*\n\n*.mockup Product name | price | details | contact*\n\nExample:\n*.mockup Leather Sneakers | KSh 3,500 | sizes 38-45, durable, free delivery in Nairobi | 0712 345 678*\n\nDetails and contact are optional.",
        );
      const _0x48c1cf = (_0x44ea44 || "")
        ["split"](/[,;]+/)
        ["map"]((_0xdf94e2) => _0xdf94e2["trim"]())
        ["filter"](Boolean)
        ["slice"](0x0, 0x8);
      let _0x71c9a8 = await askAI(
        'Write one punchy 2-sentence sales pitch for "' +
          _0x23582b +
          "\x22" +
          (_0x44ea44 ? "\x20(" + _0x44ea44 + ")" : "") +
          " for a WhatsApp status. Friendly, Kenyan market tone, one emoji at most. Output only the pitch.",
      );
      if (!_0x71c9a8)
        _0x71c9a8 = pickOne([
          "Meet your new favourite: " +
            _0x23582b +
            ". Quality you can feel, at a price that makes sense.",
          _0x23582b +
            ": made to impress, priced to move. Grab yours before it is gone!",
          "Upgrade your day with " +
            _0x23582b +
            ". Limited stock, so do not sleep on it.",
        ]);
      const _0x534228 = [
        "🔥 *" + _0x23582b["toUpperCase"]() + "* 🔥",
        "",
        _0x71c9a8["replace"](/\s+/g, "\x20")["trim"](),
        "",
        _0x48c1cf["length"]
          ? _0x48c1cf["map"](
              (_0x578200) =>
                "✅\x20" +
                (_0x578200["charAt"](0x0)["toUpperCase"]() +
                  _0x578200["slice"](0x1)),
            )["join"]("\x0a") + "\x0a"
          : "",
        _0x1854bc ? "💰 *Price:* " + _0x1854bc : "",
        _0x5ec6ff ? "📞 *Order:* " + _0x5ec6ff : "📩 *Order now, send a DM*",
        "",
        "⚡ Limited stock. Be quick!",
        "🚚 Delivery available",
      ]
        ["filter"](
          (_0x2accc3, _0x509579, _0x4e69fe) =>
            !(_0x2accc3 === "" && _0x4e69fe[_0x509579 - 0x1] === ""),
        )
        ["join"]("\x0a");
      _0x3f3f06["reply"](_0x534228 + ("\n\n_" + BM + "_"));
    },
  },
  {
    name: "cv",
    aliases: ["resume", "makecv"],
    description:
      "Make a CV PDF (.cv Name | Title | Phone | Email | Location | Skills | Experience | Education | About)",
    async execute(_0xf4dd99, _0x15a63e, _0x458a33) {
      const _0x14e80a = kit["ctx"](_0xf4dd99, _0x15a63e, _0x458a33),
        _0x3d53ab = _0x14e80a["text"]
          ["split"]("|")
          ["map"]((_0x8b966d) => _0x8b966d["trim"]());
      if (_0x3d53ab["length"] < 0x4 || !_0x3d53ab[0x0])
        return _0x14e80a["reply"](
          "📄 *" +
            BM +
            " CV maker*\n\nSend your details in one message, separated with |\n\n*.cv Name | Job title | Phone | Email | Location | Skills | Experience | Education | About me*\n\nExample:\n*.cv Jane Wanjiru | Graphic Designer | 0712 345 678 | jane@mail.com | Nairobi | Photoshop, Illustrator, Branding | Designer at Pixel Co, 2021-2024; Intern at Studio X, 2020 | BSc Design, UoN 2020 | Creative designer who loves clean, bold work*\n\n• Skills: separate with commas\n• Experience and education: separate items with ;\n• About me is optional, I write one if you skip it.\n• You get a ready PDF.",
        );
      const [
          _0x4e3ae6,
          _0x703ee3,
          _0x3316e0,
          _0x8543ca,
          _0xa0441f,
          _0x271ad2,
          _0x45e70f,
          _0x461db7,
          _0x3fbea1,
        ] = _0x3d53ab,
        _0x3be9b5 = (_0x271ad2 || "")
          ["split"](",")
          ["map"]((_0xc1749a) => _0xc1749a["trim"]())
          ["filter"](Boolean),
        _0x3a044a = (_0x16c482) =>
          (_0x16c482 || "")
            ["split"](";")
            ["map"]((_0x3e3fc0) => _0x3e3fc0["trim"]())
            ["filter"](Boolean);
      await _0x14e80a["reply"]("📄 _Building your CV..._");
      let _0x34a60a = _0x3fbea1;
      if (!_0x34a60a) {
        _0x34a60a = await askAI(
          "Write a professional 2-sentence CV summary for " +
            _0x4e3ae6 +
            ", a " +
            (_0x703ee3 || "professional") +
            (_0x3be9b5["length"]
              ? " skilled in " + _0x3be9b5["join"](",\x20")
              : "") +
            '. First person implied, no "I". Output only the summary.',
        );
        if (!_0x34a60a)
          _0x34a60a =
            (_0x703ee3 || "Dedicated professional") +
            " with strong skills" +
            (_0x3be9b5["length"]
              ? " in " + _0x3be9b5["slice"](0x0, 0x3)["join"](",\x20")
              : "") +
            ", a reliable work ethic and a drive to deliver quality results.";
      }
      _0x34a60a = _0x34a60a["replace"](/\s+/g, "\x20")
        ["trim"]()
        ["slice"](0x0, 0x258);
      const _0xfa705 = [
        { text: _0x4e3ae6["toUpperCase"](), size: 0x18, bold: !![] },
        ...(_0x703ee3
          ? [{ text: _0x703ee3, size: 0xd, color: "0.25 0.25 0.25" }]
          : []),
        {
          text: [_0x3316e0, _0x8543ca, _0xa0441f]
            ["filter"](Boolean)
            ["join"]("   |   "),
          size: 0xa,
          color: "0.3 0.3 0.3",
        },
        { gap: 0x6, rule: !![] },
        { gap: 0x6 },
        { text: "PROFILE", size: 0xc, bold: !![] },
        { text: _0x34a60a, size: 10.5 },
        { gap: 0x8 },
      ];
      if (_0x3be9b5["length"])
        _0xfa705["push"](
          { text: "SKILLS", size: 0xc, bold: !![] },
          { text: _0x3be9b5["join"]("  -  "), size: 10.5 },
          { gap: 0x8 },
        );
      _0x3a044a(_0x45e70f)["length"] &&
        (_0xfa705["push"]({ text: "EXPERIENCE", size: 0xc, bold: !![] }),
        _0x3a044a(_0x45e70f)["forEach"]((_0x31c24a) =>
          _0xfa705["push"]({
            text: "-\x20" + _0x31c24a,
            size: 10.5,
            indent: 0x6,
          }),
        ),
        _0xfa705["push"]({ gap: 0x8 }));
      _0x3a044a(_0x461db7)["length"] &&
        (_0xfa705["push"]({ text: "EDUCATION", size: 0xc, bold: !![] }),
        _0x3a044a(_0x461db7)["forEach"]((_0x5a591c) =>
          _0xfa705["push"]({
            text: "-\x20" + _0x5a591c,
            size: 10.5,
            indent: 0x6,
          }),
        ),
        _0xfa705["push"]({ gap: 0x8 }));
      _0xfa705["push"]({
        text: "References available on request.",
        size: 0xa,
        color: "0.35 0.35 0.35",
      });
      const _0x1d1dc5 = buildPdf(_0xfa705);
      await _0x14e80a["send"]({
        document: _0x1d1dc5,
        mimetype: "application/pdf",
        fileName: _0x4e3ae6["replace"](/[^\w]+/g, "_") + "_CV.pdf",
        caption: "📄 *" + _0x4e3ae6 + "*, your CV is ready. • " + TAG,
      });
    },
  },
  {
    name: "linkcheck",
    aliases: ["checklink", "scamcheck", "isitsafe"],
    description: "Check whether a link looks like a scam (.linkcheck <url>)",
    async execute(_0x124232, _0x5b94c4, _0x569b21) {
      const _0x1b41c7 = kit["ctx"](_0x124232, _0x5b94c4, _0x569b21),
        _0x5f2b85 = _0x1b41c7["text"] + "\x20" + _0x1b41c7["quotedText"];
      let _0x49eaef = (_0x5f2b85["match"](/https?:\/\/[^\s<>"']+/i) || [])[0x0];
      if (!_0x49eaef) {
        const _0x172721 = (_0x5f2b85["match"](
          /\b[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?/i,
        ) || [])[0x0];
        if (_0x172721) _0x49eaef = "http://" + _0x172721;
      }
      if (!_0x49eaef)
        return _0x1b41c7["reply"](
          "🛡️ *" +
            BM +
            " Link check*\n\nSend a link or reply to one:\n*.linkcheck https://example.com/win-prize*\n\nI look for scam tricks. I never open anything dangerous.",
        );
      const _0x3b509a = analyseUrl(_0x49eaef);
      try {
        const _0x58d088 = await followRedirects(_0x49eaef);
        if (_0x58d088["blocked"])
          ((_0x3b509a["score"] += 0x4),
            _0x3b509a["flags"]["push"](
              "Points at a private or internal address, so I did not open it",
            ));
        else {
          if (_0x58d088["url"] !== _0x49eaef) {
            const _0x5d0fed = analyseUrl(_0x58d088["url"]);
            _0x5d0fed["host"] &&
              _0x5d0fed["host"] !== _0x3b509a["host"] &&
              ((_0x3b509a["score"] += Math["min"](_0x5d0fed["score"], 0x6)),
              _0x3b509a["flags"]["push"](
                "Redirects to a different site: *" + _0x5d0fed["host"] + "*",
              ),
              _0x5d0fed["flags"]["forEach"]((_0x56a755) =>
                _0x3b509a["flags"]["push"]("↳\x20" + _0x56a755),
              ));
          }
        }
      } catch (_0x834617) {}
      const _0x23bc3b =
        _0x3b509a["score"] >= 0x5
          ? "🚨 *LOOKS DANGEROUS*"
          : _0x3b509a["score"] >= 0x2
            ? "⚠️ *SUSPICIOUS*"
            : "✅ *Nothing alarming found*";
      _0x1b41c7["reply"](
        "🛡️ *" +
          BM +
          " Link check*\n\n🔗 " +
          _0x49eaef["slice"](0x0, 0x78) +
          "\n🌐 Site: " +
          (_0x3b509a["host"] || "?") +
          "\x0a\x0a" +
          _0x23bc3b +
          "\x0a" +
          (_0x3b509a["flags"]["length"]
            ? "\x0a" +
              _0x3b509a["flags"]
                ["map"]((_0x443130) => "•\x20" + _0x443130)
                ["join"]("\x0a") +
              "\x0a"
            : "") +
          "\n_This is a quick check of the link's shape, not a guarantee. Never enter passwords, PINs or M-Pesa codes on a link someone sent you._",
      );
    },
  },
  {
    name: "exif",
    aliases: ["photoinfo", "metadata", "stripexif"],
    description:
      "Show or remove the hidden data in a photo (.exif / .exif strip)",
    async execute(_0x154888, _0x215134, _0x2d8034) {
      const _0xb110ea = kit["ctx"](_0x154888, _0x215134, _0x2d8034),
        _0x17da14 = /strip|remove|clean|wipe/i["test"](_0xb110ea["text"]),
        _0x1c542a = makeDir("exif");
      try {
        const _0x5ba56e = await _0xb110ea["needMedia"](
          /image/,
          "🔎 *" +
            BM +
            ' EXIF*\n\nReply to a photo sent as a *Document* (long-press attach → Document) with:\n*.exif*  shows camera, date and GPS\n*.exif strip*  removes all hidden data\n\nWhatsApp deletes this data from normal photos, so only "Document" photos still have it.',
        );
        if (!_0x5ba56e) return;
        if (_0x17da14) {
          const _0x5bfd39 = path["join"](
            _0x1c542a,
            "in." + kit["extFor"](_0x5ba56e["mime"]),
          );
          fs["writeFileSync"](_0x5bfd39, _0x5ba56e["buf"]);
          const _0x37b2c0 = path["join"](_0x1c542a, "clean.jpg");
          (await ff([
            "-y",
            "-i",
            _0x5bfd39,
            "-map_metadata",
            "-1",
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0x37b2c0,
          ]),
            await _0xb110ea["send"]({
              document: fs["readFileSync"](_0x37b2c0),
              mimetype: "image/jpeg",
              fileName: "clean_photo.jpg",
              caption: "🧽 Hidden data removed • " + TAG,
            }));
          return;
        }
        const _0x25f8c2 = readExif(_0x5ba56e["buf"]);
        if (_0x25f8c2 === null)
          return _0xb110ea["reply"](
            "⚠️ I can read EXIF only from JPEG photos.",
          );
        const _0x13a473 = Object["keys"](_0x25f8c2)["filter"](
          (_0x5475ff) =>
            _0x25f8c2[_0x5475ff] !== undefined && _0x25f8c2[_0x5475ff] !== "",
        );
        if (!_0x13a473["length"])
          return _0xb110ea["reply"](
            "🔎 No hidden data found. WhatsApp removes it from normal photos. Send the photo as a *Document* to keep it.",
          );
        const _0x18cd02 = [
          _0x25f8c2["make"] || _0x25f8c2["model"]
            ? "📷 Camera: " +
              [_0x25f8c2["make"], _0x25f8c2["model"]]
                ["filter"](Boolean)
                ["join"]("\x20")
            : null,
          _0x25f8c2["taken"] ? "🕒 Taken: " + _0x25f8c2["taken"] : null,
          _0x25f8c2["width"] && _0x25f8c2["height"]
            ? "📐 Size: " + _0x25f8c2["width"] + " × " + _0x25f8c2["height"]
            : null,
          _0x25f8c2["iso"] ? "🎞️ ISO: " + _0x25f8c2["iso"] : null,
          _0x25f8c2["fnum"]
            ? "🔆 Aperture: f/" + Number(_0x25f8c2["fnum"])["toFixed"](0x1)
            : null,
          _0x25f8c2["exposure"]
            ? "⏱️ Shutter: " +
              (_0x25f8c2["exposure"] < 0x1
                ? "1/" + Math["round"](0x1 / _0x25f8c2["exposure"])
                : _0x25f8c2["exposure"]) +
              "s"
            : null,
          _0x25f8c2["focal"]
            ? "🔭 Focal length: " + Math["round"](_0x25f8c2["focal"]) + "mm"
            : null,
          _0x25f8c2["software"]
            ? "🧰 Software: " + _0x25f8c2["software"]
            : null,
          _0x25f8c2["gps"]
            ? "📍 GPS: " +
              _0x25f8c2["gps"]["lat"]["toFixed"](0x5) +
              ",\x20" +
              _0x25f8c2["gps"]["lon"]["toFixed"](0x5) +
              "\n🗺️ https://maps.google.com/?q=" +
              _0x25f8c2["gps"]["lat"]["toFixed"](0x6) +
              "," +
              _0x25f8c2["gps"]["lon"]["toFixed"](0x6)
            : null,
        ]["filter"](Boolean);
        _0xb110ea["reply"](
          "🔎 *" +
            BM +
            " Photo info*\n\n" +
            _0x18cd02["join"]("\x0a") +
            (_0x25f8c2["gps"]
              ? "\n\n⚠️ This photo shows *where it was taken*. Use *.exif strip* before sharing it publicly."
              : ""),
        );
      } catch (_0x8323c7) {
        _0xb110ea["reply"]("❌ Failed: " + _0x8323c7["message"]);
      } finally {
        rmDir(_0x1c542a);
      }
    },
  },
  {
    name: "encrypt",
    aliases: ["lock", "seal"],
    description: "Lock a message with a password (.encrypt password | message)",
    async execute(_0x116fbf, _0x2bdd70, _0x25376e) {
      const _0x13333a = kit["ctx"](_0x116fbf, _0x2bdd70, _0x25376e),
        _0x4f0049 = _0x13333a["text"],
        _0x59acd0 = _0x4f0049["indexOf"]("|"),
        _0x107bb2 =
          _0x59acd0 > 0x0 ? _0x4f0049["slice"](0x0, _0x59acd0)["trim"]() : "",
        _0x241d28 =
          _0x59acd0 > 0x0 ? _0x4f0049["slice"](_0x59acd0 + 0x1)["trim"]() : "";
      if (!_0x107bb2 || !_0x241d28)
        return _0x13333a["reply"](
          "🔐 *" +
            BM +
            " Encrypt*\n\n*.encrypt mypassword | the secret message*\n\nYou get a code that only the password can open. Send the code to a friend and tell them the password in a different way.\nBest done in a private chat with me.\n\n*.decrypt mypassword | <code>*",
        );
      if (_0x107bb2["length"] < 0x4)
        return _0x13333a["reply"](
          "⚠️ Use a password of at least 4 characters.",
        );
      try {
        const _0x4cf76e = crypto["randomBytes"](0x10),
          _0x98525d = crypto["randomBytes"](0xc),
          _0x1f3b6a = crypto["scryptSync"](_0x107bb2, _0x4cf76e, 0x20),
          _0x491a12 = crypto["createCipheriv"](
            "aes-256-gcm",
            _0x1f3b6a,
            _0x98525d,
          ),
          _0xf6ec42 = Buffer["concat"]([
            _0x491a12["update"](_0x241d28, "utf8"),
            _0x491a12["final"](),
          ]),
          _0x306a9f =
            "BMD1." +
            Buffer["concat"]([
              _0x4cf76e,
              _0x98525d,
              _0x491a12["getAuthTag"](),
              _0xf6ec42,
            ])["toString"]("base64url");
        if (_0x13333a["isGroup"])
          try {
            await _0x116fbf["sendMessage"](_0x13333a["chat"], {
              delete: _0x2bdd70["key"],
            });
          } catch (_0x108272) {}
        await _0x13333a["send"](
          {
            text:
              "🔐 *" +
              BM +
              " Encrypted*\n\n" +
              _0x306a9f +
              "\n\n_Open it with:_ *.decrypt <password> | code*" +
              (_0x13333a["isGroup"]
                ? "\n\n⚠️ Your password was visible in the group. Next time do this in a private chat with me."
                : ""),
          },
          { quoted: _0x13333a["isGroup"] ? undefined : _0x2bdd70 },
        );
      } catch (_0x8e9e41) {
        _0x13333a["reply"]("❌ Failed: " + _0x8e9e41["message"]);
      }
    },
  },
  {
    name: "decrypt",
    aliases: ["unlock", "unseal"],
    description: "Open an encrypted message (.decrypt password | code)",
    async execute(_0x3cf6d9, _0xb617e1, _0x590dbf) {
      const _0x5a05fa = kit["ctx"](_0x3cf6d9, _0xb617e1, _0x590dbf),
        _0x14d417 = _0x5a05fa["text"],
        _0x382772 = _0x14d417["indexOf"]("|");
      let _0x481f26, _0x32f9bb;
      _0x382772 > 0x0
        ? ((_0x481f26 = _0x14d417["slice"](0x0, _0x382772)["trim"]()),
          (_0x32f9bb = _0x14d417["slice"](_0x382772 + 0x1)["trim"]()))
        : ((_0x481f26 = _0x14d417["trim"]()),
          (_0x32f9bb =
            (_0x5a05fa["quotedText"]["match"](/BMD1\.[A-Za-z0-9_-]+/) ||
              [])[0x0] || ""));
      if (!_0x32f9bb) {
        const _0x1561a2 = _0x14d417["match"](/BMD1\.[A-Za-z0-9_-]+/);
        _0x1561a2 &&
          ((_0x32f9bb = _0x1561a2[0x0]),
          (_0x481f26 = _0x14d417["replace"](_0x32f9bb, "")
            ["replace"]("|", "")
            ["trim"]()));
      }
      if (!_0x481f26 || !_0x32f9bb)
        return _0x5a05fa["reply"](
          "🔓 *" +
            BM +
            " Decrypt*\n\n*.decrypt mypassword | BMD1.xxxxx*\n\nOr reply to the code with *.decrypt mypassword*",
        );
      try {
        const _0xf90f21 = Buffer["from"](
          _0x32f9bb["replace"](/^BMD1\./, ""),
          "base64url",
        );
        if (_0xf90f21["length"] < 0x2d) throw new Error("bad");
        const _0x5892c0 = _0xf90f21["subarray"](0x0, 0x10),
          _0x5819c7 = _0xf90f21["subarray"](0x10, 0x1c),
          _0x1ec9a7 = _0xf90f21["subarray"](0x1c, 0x2c),
          _0x471edc = _0xf90f21["subarray"](0x2c),
          _0x5c7d7a = crypto["createDecipheriv"](
            "aes-256-gcm",
            crypto["scryptSync"](_0x481f26, _0x5892c0, 0x20),
            _0x5819c7,
          );
        _0x5c7d7a["setAuthTag"](_0x1ec9a7);
        const _0x352ec9 = Buffer["concat"]([
          _0x5c7d7a["update"](_0x471edc),
          _0x5c7d7a["final"](),
        ])["toString"]("utf8");
        if (_0x5a05fa["isGroup"])
          try {
            await _0x3cf6d9["sendMessage"](_0x5a05fa["chat"], {
              delete: _0xb617e1["key"],
            });
          } catch (_0x5e8235) {}
        await _0x5a05fa["send"](
          { text: "🔓 *" + BM + " Decrypted*\n\n" + _0x352ec9 },
          { quoted: _0x5a05fa["isGroup"] ? undefined : _0xb617e1 },
        );
      } catch (_0x49cce8) {
        _0x5a05fa["reply"]("❌ Wrong password, or the code is damaged.");
      }
    },
  },
  {
    name: "fuel",
    aliases: ["petrol", "fuelprice", "epra", "fuelprices"],
    description: "Kenya fuel prices (.fuel, .fuel mombasa, .fuel calc 40)",
    async execute(_0x2f284a, _0x16ed76, _0x52ef8) {
      const _0x1ea5d5 = kit["ctx"](_0x2f284a, _0x16ed76, _0x52ef8),
        _0x5aeb61 = loadFuel();
      if (
        !_0x5aeb61 ||
        !_0x5aeb61["towns"] ||
        !Object["keys"](_0x5aeb61["towns"])["length"]
      )
        return _0x1ea5d5["reply"](
          "⛽ *" +
            BM +
            " Fuel*\n\nNo prices saved yet. The owner sets them after each EPRA review (the 14th of the month):\n*.fuelset nairobi 226.96 227.76 219.87*\n(super petrol, diesel, kerosene)",
        );
      const _0x259aa9 = _0x1ea5d5["text"]
          ["toLowerCase"]()
          ["split"](/\s+/)
          ["filter"](Boolean),
        _0x488e06 = _0x259aa9[0x0] === "calc" || _0x259aa9[0x0] === "cost",
        _0x5dcf83 = _0x488e06
          ? Number(
              _0x259aa9["find"]((_0x595d74) =>
                /^\d+(\.\d+)?$/["test"](_0x595d74),
              ),
            )
          : null,
        _0x3fd59b = _0x259aa9["find"]((_0x3361fc) =>
          /^(diesel|kerosene|petrol|super)$/["test"](_0x3361fc),
        ),
        _0x28c632 =
          _0x259aa9["find"]((_0x1d379e) => _0x5aeb61["towns"][_0x1d379e]) ||
          (_0x5aeb61["towns"]["nairobi"]
            ? "nairobi"
            : Object["keys"](_0x5aeb61["towns"])[0x0]),
        _0x409f08 = _0x5aeb61["towns"][_0x28c632],
        _0x4e66e8 = _0x5aeb61["updated"]
          ? Math["floor"](
              (Date["now"]() - new Date(_0x5aeb61["updated"])["getTime"]()) /
                0x5265c00,
            )
          : null,
        _0x52919a =
          _0x4e66e8 !== null && _0x4e66e8 > 0x23
            ? "\n\n⚠️ _These prices were saved " +
              _0x4e66e8 +
              " days ago, so they may be out of date._"
            : "",
        _0x405235 =
          _0x28c632["charAt"](0x0)["toUpperCase"]() + _0x28c632["slice"](0x1);
      if (_0x488e06) {
        if (!_0x5dcf83 || _0x5dcf83 <= 0x0 || _0x5dcf83 > 0x1388)
          return _0x1ea5d5["reply"](
            "⛽ Example: *.fuel calc 40*  or  *.fuel calc 25 diesel mombasa*",
          );
        const _0x4530a3 =
            _0x3fd59b === "diesel"
              ? "diesel"
              : _0x3fd59b === "kerosene"
                ? "kerosene"
                : "super",
          _0x5040e2 = _0x409f08[_0x4530a3];
        return _0x1ea5d5["reply"](
          "⛽ *" +
            BM +
            " Fuel cost*\n\n" +
            _0x5dcf83 +
            " litres of " +
            (_0x4530a3 === "super" ? "super petrol" : _0x4530a3) +
            " in " +
            _0x405235 +
            "\n💰 *KSh " +
            (_0x5dcf83 * _0x5040e2)["toLocaleString"]("en-KE", {
              maximumFractionDigits: 0x0,
            }) +
            "*\n_(at KSh " +
            _0x5040e2 +
            " per litre)_" +
            _0x52919a,
        );
      }
      const _0x2eb571 = Object["keys"](_0x5aeb61["towns"])
        ["filter"]((_0x17de3d) => _0x17de3d !== _0x28c632)
        ["map"](
          (_0x2832fd) =>
            _0x2832fd["charAt"](0x0)["toUpperCase"]() + _0x2832fd["slice"](0x1),
        );
      _0x1ea5d5["reply"](
        "⛽ *" +
          BM +
          " Fuel prices · " +
          _0x405235 +
          "*\x0a" +
          (_0x5aeb61["cycle"] ? "🗓️ " + _0x5aeb61["cycle"] + "\x0a" : "") +
          "\n🟢 Super petrol: *KSh " +
          _0x409f08["super"] +
          "*\n🟡 Diesel: *KSh " +
          _0x409f08["diesel"] +
          "*\n🔵 Kerosene: *KSh " +
          _0x409f08["kerosene"] +
          "*\n\n_per litre • EPRA maximum pump prices_" +
          (_0x2eb571["length"]
            ? "\n\nOther towns: " +
              _0x2eb571["join"](",\x20") +
              "  (e.g. *.fuel " +
              _0x2eb571[0x0]["toLowerCase"]() +
              "*)"
            : "") +
          "\nCost for a tank: *.fuel calc 40*" +
          _0x52919a,
      );
    },
  },
  {
    name: "fuelset",
    aliases: ["setfuel"],
    description:
      "Owner: save new fuel prices (.fuelset nairobi 226.96 227.76 219.87)",
    async execute(_0x5c184f, _0x51671a, _0x52f4a9) {
      const _0x592874 = kit["ctx"](_0x5c184f, _0x51671a, _0x52f4a9);
      if (!_0x592874["isOwner"]()) return _0x592874["reply"]("Owner only.");
      const _0xb23756 = _0x592874["text"],
        _0x49fc5d = loadFuel() || { towns: {} },
        _0x2ed711 = _0xb23756["match"](/^cycle\s+([\s\S]+)$/i);
      if (_0x2ed711)
        return (
          (_0x49fc5d["cycle"] = _0x2ed711[0x1]["trim"]()["slice"](0x0, 0x3c)),
          (_0x49fc5d["updated"] = new Date()["toISOString"]()),
          fs["writeFileSync"](FUEL_FILE, JSON["stringify"](_0x49fc5d)),
          _0x592874["reply"]("✅ Cycle label saved: " + _0x49fc5d["cycle"])
        );
      const _0x4559e9 = _0xb23756["match"](
        /^([a-z ]+?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/i,
      );
      if (!_0x4559e9)
        return _0x592874["reply"](
          "⛽ Format: *.fuelset <town> <super> <diesel> <kerosene>*\nExample: *.fuelset nairobi 226.96 227.76 219.87*\nLabel the period: *.fuelset cycle 15 Oct - 14 Nov 2026*",
        );
      ((_0x49fc5d["towns"] = _0x49fc5d["towns"] || {}),
        (_0x49fc5d["towns"][_0x4559e9[0x1]["trim"]()["toLowerCase"]()] = {
          super: Number(_0x4559e9[0x2]),
          diesel: Number(_0x4559e9[0x3]),
          kerosene: Number(_0x4559e9[0x4]),
        }),
        (_0x49fc5d["updated"] = new Date()["toISOString"]()),
        fs["writeFileSync"](FUEL_FILE, JSON["stringify"](_0x49fc5d)),
        _0x592874["reply"](
          "✅ Saved for *" +
            _0x4559e9[0x1]["trim"]() +
            "*: super " +
            _0x4559e9[0x2] +
            ", diesel " +
            _0x4559e9[0x3] +
            ", kerosene " +
            _0x4559e9[0x4],
        ));
    },
  },
  {
    name: "worldtime",
    aliases: ["clock", "timein", "whattime"],
    description: "Time in any city or country (.worldtime tokyo)",
    async execute(_0x207143, _0x1662d9, _0xa03153) {
      const _0x4788cd = kit["ctx"](_0x207143, _0x1662d9, _0xa03153),
        _0xd11814 = _0x4788cd["text"]["replace"](/^in\s+/i, ""),
        _0x390121 = clock("Africa/Nairobi");
      if (!_0xd11814) {
        const _0x3dd11f = [
          "Africa/Nairobi",
          "Africa/Lagos",
          "Africa/Johannesburg",
          "Europe/London",
          "Asia/Dubai",
          "Asia/Kolkata",
          "Asia/Tokyo",
          "Australia/Sydney",
          "America/New_York",
          "America/Los_Angeles",
        ];
        return _0x4788cd["reply"](
          "🕒 *" +
            BM +
            " World time*\n\n" +
            _0x3dd11f["map"]((_0x1f98e3) => {
              const _0x46d572 = clock(_0x1f98e3);
              return (
                _0x46d572["icon"] +
                "\x20" +
                _0x1f98e3["split"]("/")
                  ["pop"]()
                  ["replace"](/_/g, "\x20")
                  ["padEnd"](0xe) +
                "\x20*" +
                _0x46d572["time"] +
                "*  " +
                offLabel(_0x46d572["off"])
              );
            })["join"]("\x0a") +
            "\n\nTry *.worldtime paris* or *.worldtime Asia/Seoul*",
        );
      }
      const _0xe10132 = resolveTz(_0xd11814);
      if (!_0xe10132)
        return _0x4788cd["reply"](
          '⚠️ I do not know "' +
            _0xd11814 +
            '". Try a big city or country, e.g. *.worldtime london*, *.worldtime dubai*, or a zone like *.worldtime America/Chicago*',
        );
      const _0x241fcb = clock(_0xe10132),
        _0x22c9ac = _0x241fcb["off"] - _0x390121["off"],
        _0xb9fe2 = Math["abs"](_0x22c9ac) / 0x3c,
        _0xd67144 = CITY_TZ[_0xd11814["toLowerCase"]()]
          ? _0xd11814["replace"](/\b\w/g, (_0x3156be) =>
              _0x3156be["toUpperCase"](),
            )
          : _0xe10132["split"]("/")["pop"]()["replace"](/_/g, "\x20");
      _0x4788cd["reply"](
        "🕒 *" +
          BM +
          " Time · " +
          _0xd67144 +
          "*\n\n" +
          _0x241fcb["icon"] +
          "\x20*" +
          _0x241fcb["time"] +
          "*\n📅 " +
          _0x241fcb["date"] +
          "\n🌍 " +
          _0xe10132 +
          "\x20(" +
          offLabel(_0x241fcb["off"]) +
          ")\n\n" +
          (_0x22c9ac === 0x0
            ? "_Same time as Nairobi._"
            : "_" +
              (Number["isInteger"](_0xb9fe2)
                ? _0xb9fe2
                : _0xb9fe2["toFixed"](0x1)) +
              " hour" +
              (_0xb9fe2 === 0x1 ? "" : "s") +
              "\x20" +
              (_0x22c9ac > 0x0 ? "ahead of" : "behind") +
              " Nairobi (" +
              _0x390121["time"] +
              " there)._"),
      );
    },
  },
  {
    name: "shorten",
    aliases: ["short", "shorturl", "tinyurl"],
    description: "Shorten a link (.shorten https://... [custom-name])",
    async execute(_0x1279fa, _0x5c6df0, _0x11738c) {
      const _0x4e1837 = kit["ctx"](_0x1279fa, _0x5c6df0, _0x11738c),
        _0x149644 = _0x4e1837["text"] + "\x20" + _0x4e1837["quotedText"],
        _0x29c442 = (_0x149644["match"](/https?:\/\/\S+/i) || [])[0x0];
      if (!_0x29c442)
        return _0x4e1837["reply"](
          "🔗 Send a link: *.shorten https://example.com/a/very/long/link*\nCustom name (optional): *.shorten https://example.com myname*",
        );
      const _0x2f07f3 = (_0x4e1837["text"]
          ["replace"](_0x29c442, "")
          ["trim"]()
          ["split"](/\s+/)[0x0] || "")
          ["replace"](/[^a-zA-Z0-9_]/g, "")
          ["slice"](0x0, 0x1e),
        _0x5c6edd = [];
      if (_0x2f07f3)
        _0x5c6edd["push"]([
          "is.gd",
          "https://is.gd/create.php?format=simple&url=" +
            encodeURIComponent(_0x29c442) +
            "&shorturl=" +
            _0x2f07f3,
        ]);
      (_0x5c6edd["push"]([
        "is.gd",
        "https://is.gd/create.php?format=simple&url=" +
          encodeURIComponent(_0x29c442),
      ]),
        _0x5c6edd["push"]([
          "v.gd",
          "https://v.gd/create.php?format=simple&url=" +
            encodeURIComponent(_0x29c442),
        ]),
        _0x5c6edd["push"]([
          "tinyurl",
          "https://tinyurl.com/api-create.php?url=" +
            encodeURIComponent(_0x29c442),
        ]));
      const _0x3ab9e1 = [];
      for (const [_0x4032a1, _0x48baa4] of _0x5c6edd) {
        try {
          const _0x2d2eaa = await axios["get"](_0x48baa4, {
              timeout: 0x3a98,
              headers: { "User-Agent": UA },
              responseType: "text",
              transformResponse: [(_0xaaeda) => _0xaaeda],
            }),
            _0xb64ba7 = String(_0x2d2eaa["data"] || "")["trim"]();
          if (/^https?:\/\//i["test"](_0xb64ba7))
            return _0x4e1837["send"]({
              text:
                "🔗 *Short link*\n\n" +
                _0xb64ba7 +
                "\n\n_" +
                _0x29c442["length"] +
                " → " +
                _0xb64ba7["length"] +
                " characters_",
            });
          _0x3ab9e1["push"](
            _0x4032a1 + ":\x20" + _0xb64ba7["slice"](0x0, 0x28),
          );
        } catch (_0x47b6e7) {
          _0x3ab9e1["push"](
            _0x4032a1 +
              ":\x20" +
              String(
                _0x47b6e7["response"]?.["status"]
                  ? "HTTP " + _0x47b6e7["response"]["status"]
                  : _0x47b6e7["message"],
              )["slice"](0x0, 0x1e),
          );
        }
      }
      _0x4e1837["reply"](
        "❌ Could not shorten that link.\n\n🔎 Sources tried:\n" +
          _0x3ab9e1["join"]("\x0a"),
      );
    },
  },
  {
    name: "color",
    aliases: ["colour", "hex", "colorinfo"],
    description:
      "Show a colour and its codes (.color #ff8800 / .color 255,136,0 / .color red)",
    async execute(_0x2eedef, _0xba4fe6, _0x51bcde) {
      const _0x2d2a74 = kit["ctx"](_0x2eedef, _0xba4fe6, _0x51bcde),
        _0x23e5ae = (_0x2d2a74["text"] || _0x2d2a74["quotedText"] || "")[
          "trim"
        ](),
        _0x3c29f1 = _0x23e5ae
          ? parseColor(_0x23e5ae)
          : [rand(0x100), rand(0x100), rand(0x100)];
      if (!_0x3c29f1)
        return _0x2d2a74["reply"](
          "🎨 Send a colour:\n*.color #ff8800*\n*.color 255,136,0*\n*.color red*\n*.color* (a random one)",
        );
      const _0x56b2ce = _0x3c29f1["map"]((_0x51de00) => 0xff - _0x51de00),
        _0x5c8299 = "#" + _0x3c29f1["map"](hex2)["join"](""),
        _0x47295 = "#" + _0x56b2ce["map"](hex2)["join"](""),
        [_0x4782e8, _0x5a42f0, _0x566baf] = toHsl(_0x3c29f1),
        _0x20800e =
          (0.299 * _0x3c29f1[0x0] +
            0.587 * _0x3c29f1[0x1] +
            0.114 * _0x3c29f1[0x2]) /
          0xff,
        _0x36d08f = makeDir("col");
      try {
        const _0x53c2b8 = path["join"](_0x36d08f, "c.png");
        (await ff(
          [
            "-y",
            "-f",
            "lavfi",
            "-i",
            "color=c=0x" + _0x5c8299["slice"](0x1) + ":s=500x400",
            "-f",
            "lavfi",
            "-i",
            "color=c=0x" + _0x47295["slice"](0x1) + ":s=200x400",
            "-filter_complex",
            "hstack",
            "-frames:v",
            "1",
            _0x53c2b8,
          ],
          0x7530,
        ),
          await _0x2d2a74["send"]({
            image: fs["readFileSync"](_0x53c2b8),
            caption:
              "🎨 *" +
              _0x5c8299["toUpperCase"]() +
              "*\n\nRGB: " +
              _0x3c29f1["join"](",\x20") +
              "\nHSL: " +
              _0x4782e8 +
              "°, " +
              _0x5a42f0 +
              "%, " +
              _0x566baf +
              "%\nNearest name: " +
              nearestName(_0x3c29f1) +
              "\nBest text on it: " +
              (_0x20800e > 0.55 ? "black ⚫" : "white ⚪") +
              "\n\n_Right strip = opposite colour " +
              _0x47295["toUpperCase"]() +
              "_",
          }));
      } catch (_0x33793f) {
        _0x2d2a74["reply"]("❌ Failed: " + _0x33793f["message"]);
      } finally {
        rmDir(_0x36d08f);
      }
    },
  },
  {
    name: "meme",
    aliases: ["randommeme", "funny"],
    description:
      "A random meme (.meme, .meme kenya, .meme wholesome, .meme dank, .meme programming)",
    async execute(_0x5b6851, _0x3e1fd2, _0x3673b1) {
      const _0x411a99 = kit["ctx"](_0x5b6851, _0x3e1fd2, _0x3673b1),
        _0x84fdba = {
          kenya: "Kenya",
          wholesome: "wholesomememes",
          dank: "dankmemes",
          programming: "ProgrammerHumor",
          animals: "AnimalsBeingDerps",
          football: "soccermemes",
        },
        _0x198eb1 = _0x411a99["text"]["toLowerCase"](),
        _0x3fe711 =
          _0x198eb1 && _0x84fdba[_0x198eb1]
            ? [_0x84fdba[_0x198eb1]]
            : ["memes", "wholesomememes", "me_irl"];
      try {
        let _0x1608dc = null;
        for (let _0x15b1a0 = 0x0; _0x15b1a0 < 0x6 && !_0x1608dc; _0x15b1a0++) {
          const _0x2d0302 = _0x3fe711[_0x15b1a0 % _0x3fe711["length"]];
          try {
            const _0x505540 = await axios["get"](
                "https://meme-api.com/gimme/" + _0x2d0302,
                { timeout: 0x3a98, headers: { "User-Agent": UA } },
              ),
              _0x20c5b3 = _0x505540["data"];
            if (
              _0x20c5b3 &&
              _0x20c5b3["url"] &&
              !_0x20c5b3["nsfw"] &&
              !_0x20c5b3["spoiler"] &&
              /\.(jpe?g|png|webp)(\?|$)/i["test"](_0x20c5b3["url"])
            )
              _0x1608dc = _0x20c5b3;
          } catch (_0xa6c375) {}
        }
        if (!_0x1608dc)
          return _0x411a99["reply"](
            "😅 Could not fetch a meme right now. Try again in a moment.",
          );
        await _0x411a99["send"]({
          image: { url: _0x1608dc["url"] },
          caption:
            "😂 *" +
            (_0x1608dc["title"] || "Meme") +
            "*\n_r/" +
            (_0x1608dc["subreddit"] || "") +
            "_",
        });
      } catch (_0x5ceea3) {
        _0x411a99["reply"]("❌ Failed: " + _0x5ceea3["message"]);
      }
    },
  },
  {
    name: "roast",
    aliases: ["burn", "roastme"],
    description:
      "A playful roast (tag someone, reply to them, or roast yourself)",
    async execute(_0x454615, _0x312467, _0x1b9115) {
      const _0x3bb60a = kit["ctx"](_0x454615, _0x312467, _0x1b9115),
        _0x5eef6d =
          _0x3bb60a["mentions"][0x0] ||
          _0x3bb60a["quotedSender"] ||
          _0x3bb60a["sender"],
        _0x140363 = "@" + num(_0x5eef6d),
        _0x18a883 = _0x3bb60a["text"]
          ["replace"](/@\d+/g, "")
          ["trim"]()
          ["slice"](0x0, 0x50);
      let _0x2be80f = await askAI(
        'Write ONE short, funny, light-hearted roast (max 2 sentences) of a friend named "' +
          num(_0x5eef6d) +
          "\x22" +
          (_0x18a883 ? " who is known for: " + _0x18a883 : "") +
          ". Keep it playful and clean. No insults about family, race, tribe, religion, body, disability or death. Output only the roast.",
      );
      if (_0x2be80f)
        _0x2be80f = _0x2be80f["replace"](/^["“]|["”]$/g, "")["replace"](
          num(_0x5eef6d),
          _0x140363,
        );
      if (!_0x2be80f) _0x2be80f = pickOne(ROASTS)["replace"]("{n}", _0x140363);
      await _0x3bb60a["send"]({
        text:
          "🔥 *" +
          BM +
          " ROAST*\n\n" +
          _0x2be80f +
          "\n\n_all love, no hate_ 😈",
        mentions: [_0x5eef6d],
      });
    },
  },
];
