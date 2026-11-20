"use strict";
const fs = require("fs"),
  path = require("path"),
  kit = require("../utils/mediaKit"),
  { num } = kit,
  CONF_FILE = path["join"](process["cwd"](), "confess_data.json");
let CONF = null;
function loadConf() {
  if (CONF) return CONF;
  try {
    CONF = JSON["parse"](fs["readFileSync"](CONF_FILE, "utf8"));
  } catch (_0x345f6c) {
    CONF = {};
  }
  return (
    (CONF["enabled"] = CONF["enabled"] || {}),
    (CONF["log"] = CONF["log"] || []),
    (CONF["last"] = CONF["last"] || {}),
    (CONF["counter"] = CONF["counter"] || 0x0),
    CONF
  );
}
const saveConf = () => {
  try {
    fs["writeFileSync"](CONF_FILE, JSON["stringify"](CONF));
  } catch (_0x1e91ec) {}
};
async function groupsFor(_0x23621e, _0x4f7ed9) {
  const _0x410ecd = await _0x23621e["groupFetchAllParticipating"](),
    _0x3bff90 = num(_0x4f7ed9);
  return Object["values"](_0x410ecd || {})
    ["filter"](
      (_0x158201) =>
        loadConf()["enabled"][_0x158201["id"]] &&
        (_0x158201["participants"] || [])["some"]((_0x3bd0e0) =>
          [
            _0x3bd0e0["id"],
            _0x3bd0e0["pn"],
            _0x3bd0e0["phoneNumber"],
            _0x3bd0e0["lid"],
          ]["some"]((_0x437928) => _0x437928 && num(_0x437928) === _0x3bff90),
        ),
    )
    ["map"]((_0x41b9bf) => ({
      id: _0x41b9bf["id"],
      subject: _0x41b9bf["subject"] || _0x41b9bf["id"],
    }))
    ["sort"]((_0x59d87f, _0x50da4c) =>
      _0x59d87f["subject"]["localeCompare"](_0x50da4c["subject"]),
    );
}
const COUNTRIES = {
  254: "Kenya 🇰🇪",
  255: "Tanzania 🇹🇿",
  256: "Uganda 🇺🇬",
  250: "Rwanda 🇷🇼",
  257: "Burundi 🇧🇮",
  251: "Ethiopia 🇪🇹",
  252: "Somalia 🇸🇴",
  211: "South Sudan 🇸🇸",
  234: "Nigeria 🇳🇬",
  233: "Ghana 🇬🇭",
  27: "South Africa 🇿🇦",
  20: "Egypt 🇪🇬",
  212: "Morocco 🇲🇦",
  260: "Zambia 🇿🇲",
  263: "Zimbabwe 🇿🇼",
  265: "Malawi 🇲🇼",
  258: "Mozambique 🇲🇿",
  243: "DR Congo 🇨🇩",
  237: "Cameroon 🇨🇲",
  221: "Senegal 🇸🇳",
  225: "Ivory Coast 🇨🇮",
  1: "USA / Canada 🇺🇸",
  44: "United Kingdom 🇬🇧",
  49: "Germany 🇩🇪",
  33: "France 🇫🇷",
  39: "Italy 🇮🇹",
  34: "Spain 🇪🇸",
  31: "Netherlands 🇳🇱",
  91: "India 🇮🇳",
  92: "Pakistan 🇵🇰",
  86: "China 🇨🇳",
  81: "Japan 🇯🇵",
  82: "South Korea 🇰🇷",
  971: "UAE 🇦🇪",
  966: "Saudi Arabia 🇸🇦",
  974: "Qatar 🇶🇦",
  61: "Australia 🇦🇺",
  55: "Brazil 🇧🇷",
  52: "Mexico 🇲🇽",
  7: "Russia 🇷🇺",
  90: "Turkey 🇹🇷",
  62: "Indonesia 🇮🇩",
  63: "Philippines 🇵🇭",
};
function countryOf(_0x472da1) {
  for (let _0x1e1534 = 0x3; _0x1e1534 >= 0x1; _0x1e1534--) {
    const _0xb404be = COUNTRIES[_0x472da1["slice"](0x0, _0x1e1534)];
    if (_0xb404be) return _0xb404be;
  }
  return "Unknown";
}
const votes = {};
function tally(_0x32c2c9) {
  const _0x2af397 = _0x32c2c9["opts"]["map"](() => 0x0);
  for (const _0x28405e of _0x32c2c9["ballots"]["values"]())
    _0x2af397[_0x28405e]++;
  const _0x1db95c = _0x2af397["reduce"](
    (_0x57b0cd, _0x2d7cd3) => _0x57b0cd + _0x2d7cd3,
    0x0,
  );
  return (
    _0x32c2c9["opts"]
      ["map"]((_0x18649a, _0x28822d) => {
        const _0xa86086 = _0x1db95c
          ? Math["round"]((_0x2af397[_0x28822d] / _0x1db95c) * 0x64)
          : 0x0;
        return (
          _0x28822d +
          0x1 +
          ".\x20" +
          _0x18649a +
          "\n   " +
          "█"["repeat"](Math["round"](_0xa86086 / 0xa)) +
          "░"["repeat"](0xa - Math["round"](_0xa86086 / 0xa)) +
          "\x20" +
          _0x2af397[_0x28822d] +
          "\x20(" +
          _0xa86086 +
          "%)"
        );
      })
      ["join"]("\x0a") +
    ("\n\n🗳️ Total votes: " + _0x1db95c)
  );
}
module["exports"] = [
  {
    name: "confessions",
    aliases: ["confessmode"],
    description: "Turn anonymous confessions on/off for this group (admins)",
    async execute(_0xc5c4e, _0x3ca83f, _0x18251b) {
      const _0x113a72 = kit["ctx"](_0xc5c4e, _0x3ca83f, _0x18251b);
      if (!_0x113a72["isGroup"])
        return _0x113a72["reply"](
          "Use this inside the group you want to switch on.",
        );
      if (!(await _0x113a72["isAdmin"]()) && !_0x113a72["isOwner"]())
        return _0x113a72["reply"]("*Only group admins can use this command.*");
      const _0x416b0b = loadConf(),
        _0x160e42 = _0x113a72["text"]["toLowerCase"]();
      if (_0x160e42 === "on")
        return (
          (_0x416b0b["enabled"][_0x113a72["chat"]] = !![]),
          saveConf(),
          _0x113a72["reply"](
            "🤫 Confessions are *ON* for this group.\nMembers can DM me *.confess* to send one anonymously.",
          )
        );
      if (_0x160e42 === "off")
        return (
          delete _0x416b0b["enabled"][_0x113a72["chat"]],
          saveConf(),
          _0x113a72["reply"]("🤫 Confessions are *OFF* for this group.")
        );
      _0x113a72["reply"](
        "🤫 Confessions are currently *" +
          (_0x416b0b["enabled"][_0x113a72["chat"]] ? "ON" : "OFF") +
          "* here.\nUse *.confessions on* or *.confessions off*.",
      );
    },
  },
  {
    name: "confess",
    aliases: ["confession", "anon"],
    description:
      "Send an anonymous confession to a group (use in a private chat with the bot)",
    async execute(_0x47fd86, _0x806978, _0x3c5aa7) {
      const _0x4d05a4 = kit["ctx"](_0x47fd86, _0x806978, _0x3c5aa7);
      if (_0x4d05a4["isGroup"])
        return _0x4d05a4["reply"](
          "🤫 Send this to me in a *private chat*, so nobody sees who you are.",
        );
      const _0x15e8c7 = loadConf(),
        _0x453785 = await groupsFor(_0x47fd86, _0x4d05a4["sender"]);
      if (!_0x453785["length"])
        return _0x4d05a4["reply"](
          "🤫 No groups with confessions turned on that you are in.\nAn admin can switch it on with *.confessions on* in the group.",
        );
      const _0x21deee = _0x4d05a4["text"]["match"](/^\s*#?(\d+)\s+([\s\S]+)$/);
      if (!_0x21deee)
        return _0x4d05a4["reply"](
          "🤫 *Anonymous confession*\n\n" +
            _0x453785["map"](
              (_0x31d684, _0x404cde) =>
                _0x404cde + 0x1 + ".\x20" + _0x31d684["subject"],
            )["join"]("\x0a") +
            "\n\nSend: *.confess <number> <your confession>*\nExample: *.confess 1 I still love jollof more than ugali*\n\n_Members of the group cannot see who you are. The bot owner can review confessions if someone reports abuse._",
        );
      const _0x4a2a85 = _0x453785[Number(_0x21deee[0x1]) - 0x1],
        _0xa188f6 = _0x21deee[0x2]["trim"]();
      if (!_0x4a2a85)
        return _0x4d05a4["reply"](
          "❌ Wrong number. Send *.confess* to see the list.",
        );
      if (_0xa188f6["length"] < 0x5)
        return _0x4d05a4["reply"]("⚠️ Write a bit more.");
      if (_0xa188f6["length"] > 0x3e8)
        return _0x4d05a4["reply"]("⚠️ Too long (max 1000 characters).");
      const _0x1962bc = Date["now"]();
      if (
        _0x15e8c7["last"][_0x4d05a4["sender"]] &&
        _0x1962bc - _0x15e8c7["last"][_0x4d05a4["sender"]] < 0xea60
      )
        return _0x4d05a4["reply"](
          "⏳ Slow down. Wait a minute between confessions.",
        );
      ((_0x15e8c7["last"][_0x4d05a4["sender"]] = _0x1962bc),
        (_0x15e8c7["counter"] += 0x1),
        _0x15e8c7["log"]["push"]({
          id: _0x15e8c7["counter"],
          sender: _0x4d05a4["sender"],
          name: _0x4d05a4["pushName"] || "",
          group: _0x4a2a85["id"],
          time: _0x1962bc,
          text: _0xa188f6["slice"](0x0, 0x12c),
        }));
      if (_0x15e8c7["log"]["length"] > 0xc8) _0x15e8c7["log"]["shift"]();
      saveConf();
      try {
        (await _0x47fd86["sendMessage"](_0x4a2a85["id"], {
          text:
            "🤫 *Anonymous confession #" +
            _0x15e8c7["counter"] +
            "*\n\n“" +
            _0xa188f6 +
            "”\n\n_Want to confess? DM me *.confess*_",
        }),
          await _0x4d05a4["reply"](
            "✅ Sent to *" +
              _0x4a2a85["subject"] +
              "* as confession #" +
              _0x15e8c7["counter"] +
              ". Nobody in the group can see who you are.",
          ));
      } catch (_0x4b404b) {
        _0x4d05a4["reply"]("❌ Could not post it: " + _0x4b404b["message"]);
      }
    },
  },
  {
    name: "confesslog",
    aliases: [],
    description:
      "Owner only: see who sent the latest confessions (for moderation)",
    async execute(_0x8db6c0, _0x5af1aa, _0x41aa39) {
      const _0x3d436f = kit["ctx"](_0x8db6c0, _0x5af1aa, _0x41aa39);
      if (!_0x3d436f["isOwner"]()) return;
      const _0x554953 = loadConf()["log"]["slice"](-0xa)["reverse"]();
      if (!_0x554953["length"])
        return _0x3d436f["reply"]("No confessions yet.");
      _0x3d436f["reply"](
        "🗂️ *Latest confessions*\n\n" +
          _0x554953["map"](
            (_0x5f0f6e) =>
              "#" +
              _0x5f0f6e["id"] +
              " • +" +
              num(_0x5f0f6e["sender"]) +
              "\x20" +
              (_0x5f0f6e["name"] ? "(" + _0x5f0f6e["name"] + ")" : "") +
              "\x0a" +
              _0x5f0f6e["text"]["slice"](0x0, 0x50),
          )["join"]("\x0a\x0a"),
      );
    },
  },
  {
    name: "userinfo",
    aliases: ["whoisthis", "profile"],
    description:
      "Info about a person (tag them, reply to them, or give a number)",
    async execute(_0x1e1696, _0xd679ab, _0x1ff621) {
      const _0x33426c = kit["ctx"](_0x1e1696, _0xd679ab, _0x1ff621);
      let _0x10a4d2 =
        _0x33426c["mentions"][0x0] || _0x33426c["quotedSender"] || null;
      const _0x1891e9 = _0x33426c["text"]["replace"](/[^0-9]/g, "");
      if (!_0x10a4d2 && _0x1891e9["length"] >= 0x8)
        _0x10a4d2 = _0x1891e9 + "@s.whatsapp.net";
      if (!_0x10a4d2) _0x10a4d2 = _0x33426c["sender"];
      try {
        let _0x5e3828 = num(_0x10a4d2),
          _0x216f2e = "",
          _0x193284 = null;
        if (_0x33426c["isGroup"])
          try {
            const _0x1d55d2 = await _0x1e1696["groupMetadata"](
                _0x33426c["chat"],
              ),
              _0x5aa8f4 = _0x1d55d2["participants"]["find"]((_0x5d9e69) =>
                [
                  _0x5d9e69["id"],
                  _0x5d9e69["pn"],
                  _0x5d9e69["phoneNumber"],
                  _0x5d9e69["lid"],
                ]["some"](
                  (_0x5e0a1c) => _0x5e0a1c && num(_0x5e0a1c) === num(_0x10a4d2),
                ),
              );
            _0x5aa8f4 &&
              ((_0x216f2e =
                _0x5aa8f4["admin"] === "superadmin"
                  ? "👑 Group owner"
                  : _0x5aa8f4["admin"]
                    ? "🛡️ Admin"
                    : "👤 Member"),
              (_0x193284 =
                _0x5aa8f4["pn"] || _0x5aa8f4["phoneNumber"] || null));
          } catch (_0x114f58) {}
        if (String(_0x10a4d2)["endsWith"]("@lid") && _0x193284)
          _0x5e3828 = num(_0x193284);
        const _0x5dae72 =
          _0x10a4d2 === _0x33426c["sender"] ? _0x33426c["pushName"] : "";
        let _0x2e4893 = "",
          _0x47a820 = "";
        try {
          const _0x25884f = await _0x1e1696["fetchStatus"](_0x10a4d2),
            _0x36c165 = Array["isArray"](_0x25884f)
              ? _0x25884f[0x0]?.["status"] || _0x25884f[0x0]
              : _0x25884f;
          _0x2e4893 =
            (_0x36c165 && (_0x36c165["status"] || _0x36c165["text"])) || "";
          if (typeof _0x2e4893 !== "string") _0x2e4893 = "";
          const _0x1248e9 =
            _0x36c165 && (_0x36c165["setAt"] || _0x36c165["set_at"]);
          if (_0x1248e9)
            _0x47a820 = new Date(_0x1248e9)["toLocaleDateString"]("en-GB");
        } catch (_0x34fff5) {}
        let _0xb6ca2 = "";
        try {
          const _0x531048 = await _0x1e1696["onWhatsApp"](_0x10a4d2);
          _0xb6ca2 =
            _0x531048 && _0x531048[0x0]
              ? _0x531048[0x0]["exists"]
                ? "✅ Yes"
                : "❌ No"
              : "";
        } catch (_0x4b0d3a) {}
        let _0x3e02bf = null;
        try {
          _0x3e02bf = await _0x1e1696["profilePictureUrl"](_0x10a4d2, "image");
        } catch (_0xa4334f) {}
        const _0x5cd76c = [
          "🔎 *WHO IS THIS?*",
          "",
          _0x5dae72 ? "📛 Name: " + _0x5dae72 : null,
          "📱 Number: +" + _0x5e3828,
          "🌍 Country: " + countryOf(_0x5e3828),
          _0xb6ca2 ? "💬 On WhatsApp: " + _0xb6ca2 : null,
          _0x216f2e ? "🏷️ Role here: " + _0x216f2e : null,
          _0x2e4893
            ? "📝 About: " +
              _0x2e4893 +
              (_0x47a820 ? "\x20(" + _0x47a820 + ")" : "")
            : null,
        ]
          ["filter"](Boolean)
          ["join"]("\x0a");
        if (_0x3e02bf)
          await _0x33426c["send"]({
            image: { url: _0x3e02bf },
            caption: _0x5cd76c,
            mentions: [_0x10a4d2],
          });
        else
          await _0x33426c["send"]({ text: _0x5cd76c, mentions: [_0x10a4d2] });
      } catch (_0x215262) {
        _0x33426c["reply"](
          "❌ Could not look that person up: " + _0x215262["message"],
        );
      }
    },
  },
  {
    name: "vote",
    aliases: ["poll2", "ballot"],
    description:
      "Start a vote (.vote Question | Option1 | Option2) and vote with .vote 1",
    async execute(_0x52334b, _0x52fdb3, _0x2bc29e) {
      const _0x3a5f60 = kit["ctx"](_0x52334b, _0x52fdb3, _0x2bc29e),
        _0x37a179 = _0x3a5f60["chat"],
        _0x115c60 = _0x3a5f60["text"],
        _0x5d419a = votes[_0x37a179];
      if (!_0x115c60) {
        if (_0x5d419a)
          return _0x3a5f60["reply"](
            "🗳️ *" +
              _0x5d419a["q"] +
              "*\n\n" +
              tally(_0x5d419a) +
              "\n\nVote with *.vote <number>* • end with *.vote end*",
          );
        return _0x3a5f60["reply"](
          "🗳️ *Vote*\n\n.vote Who should host? | Amina | Brian | Cara\n.vote Pizza tonight?    (Yes / No)\n\nThen everyone sends *.vote 1* (or 2, 3…).\n*.vote end* closes it. It also closes by itself after 15 minutes.",
        );
      }
      if (/^(end|close|stop|result|results)$/i["test"](_0x115c60)) {
        if (!_0x5d419a) return _0x3a5f60["reply"]("No vote is running.");
        if (/^(result|results)$/i["test"](_0x115c60))
          return _0x3a5f60["reply"](
            "🗳️ *" + _0x5d419a["q"] + "*\n\n" + tally(_0x5d419a),
          );
        if (
          _0x3a5f60["sender"] !== _0x5d419a["starter"] &&
          !(await _0x3a5f60["isAdmin"]()) &&
          !_0x3a5f60["isOwner"]()
        )
          return _0x3a5f60["reply"](
            "Only the person who started it (or an admin) can end the vote.",
          );
        return (
          clearTimeout(_0x5d419a["timer"]),
          delete votes[_0x37a179],
          _0x3a5f60["send"]({
            text:
              "🏁 *VOTE CLOSED*\n\n*" +
              _0x5d419a["q"] +
              "*\n\n" +
              tally(_0x5d419a),
          })
        );
      }
      if (
        _0x5d419a &&
        (/^\d{1,2}$/["test"](_0x115c60) || /^(yes|no)$/i["test"](_0x115c60))
      ) {
        const _0x2b0f2e = /^\d+$/["test"](_0x115c60)
          ? Number(_0x115c60) - 0x1
          : _0x5d419a["opts"]["findIndex"](
              (_0x4a7817) =>
                _0x4a7817["toLowerCase"]() === _0x115c60["toLowerCase"](),
            );
        if (_0x2b0f2e < 0x0 || _0x2b0f2e >= _0x5d419a["opts"]["length"])
          return _0x3a5f60["reply"](
            "Pick a number from 1 to " + _0x5d419a["opts"]["length"] + ".",
          );
        const _0xe38cbd = _0x5d419a["ballots"]["has"](_0x3a5f60["sender"]);
        return (
          _0x5d419a["ballots"]["set"](_0x3a5f60["sender"], _0x2b0f2e),
          _0x3a5f60["reply"](
            "✅\x20" +
              (_0xe38cbd ? "Vote changed" : "Vote counted") +
              ": *" +
              _0x5d419a["opts"][_0x2b0f2e] +
              "*  (" +
              _0x5d419a["ballots"]["size"] +
              " voted)",
          )
        );
      }
      if (_0x5d419a)
        return _0x3a5f60["reply"](
          "A vote is already running here. Finish it first with *.vote end*",
        );
      const _0x184462 = _0x115c60["split"]("|")
          ["map"]((_0x52e868) => _0x52e868["trim"]())
          ["filter"](Boolean),
        _0x5c0b8e = _0x184462["shift"]();
      let _0x597084 = _0x184462;
      if (!_0x597084["length"]) _0x597084 = ["Yes", "No"];
      if (_0x597084["length"] < 0x2 || _0x597084["length"] > 0x8)
        return _0x3a5f60["reply"](
          "Give between 2 and 8 options, separated with |",
        );
      const _0x187d5f = {
        q: _0x5c0b8e,
        opts: _0x597084,
        ballots: new Map(),
        starter: _0x3a5f60["sender"],
        timer: null,
      };
      ((votes[_0x37a179] = _0x187d5f),
        (_0x187d5f["timer"] = setTimeout(
          () => {
            if (votes[_0x37a179] !== _0x187d5f) return;
            (delete votes[_0x37a179],
              _0x52334b["sendMessage"](_0x37a179, {
                text:
                  "⌛ *VOTE CLOSED*\n\n*" +
                  _0x5c0b8e +
                  "*\n\n" +
                  tally(_0x187d5f),
              })["catch"](() => {}));
          },
          0xf * 0x3c * 0x3e8,
        )),
        await _0x3a5f60["send"]({
          text:
            "🗳️ *NEW VOTE*\n\n*" +
            _0x5c0b8e +
            "*\n\n" +
            _0x597084["map"](
              (_0x4f81c3, _0x2450fa) => _0x2450fa + 0x1 + ".\x20" + _0x4f81c3,
            )["join"]("\x0a") +
            "\n\nVote with *.vote 1* (or 2, 3…)\n⏱️ Closes in 15 minutes or with *.vote end*",
        }));
    },
  },
];
