const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE + "/livescore",
  MAJOR_CATEGORIES = [
    "england",
    "spain",
    "italy",
    "germany",
    "france",
    "turkey",
    "netherlands",
    "portugal",
    "saudi arabia",
    "europe",
    "world",
    "international",
    "usa",
    "brazil",
    "argentina",
  ],
  MAJOR_LEAGUES = [
    "premier league",
    "championship",
    "la liga",
    "laliga",
    "serie a",
    "bundesliga",
    "ligue 1",
    "super lig",
    "süper lig",
    "eredivisie",
    "primeira liga",
    "champions league",
    "europa league",
    "conference league",
    "super cup",
    "copa libertadores",
    "saudi pro league",
    "mls",
    "world cup",
    "euros",
    "afcon",
    "nations league",
    "fa cup",
    "copa del rey",
  ];
module["exports"] = {
  name: "livescore",
  description:
    "Shows current football live scores for top leagues with general fallback.",
  async execute(_0x58fe5d, _0x213b45) {
    const _0x17b0d5 = _0x213b45["key"]["remoteJid"],
      _0x3fb58c = await _0x58fe5d["sendMessage"](
        _0x17b0d5,
        { text: "⚽ Fetching live matches..." },
        { quoted: _0x213b45 },
      );
    try {
      const { data: _0x2b8698 } = await axios["get"](API);
      if (
        !_0x2b8698["status"] ||
        !_0x2b8698["result"] ||
        !_0x2b8698["result"]["games"]
      )
        return _0x58fe5d["sendMessage"](_0x17b0d5, {
          text: "❌ Failed to fetch live scores.",
          edit: _0x3fb58c["key"],
        });
      const _0x3c7885 = Object["values"](_0x2b8698["result"]["games"]);
      if (!_0x3c7885["length"])
        return _0x58fe5d["sendMessage"](_0x17b0d5, {
          text: "📭 No matches found.",
          edit: _0x3fb58c["key"],
        });
      const _0x280383 = _0x3c7885["filter"]((_0xa55438) => {
          const _0xafe00c = (_0xa55438["cn"] || "")["toLowerCase"](),
            _0x29d947 = (_0xa55438["L"] ||
              _0xa55438["league"] ||
              _0xa55438["sn"] ||
              "")["toLowerCase"](),
            _0x58e071 = _0xafe00c + "\x20" + _0x29d947,
            _0x29538c = MAJOR_CATEGORIES["some"]((_0x52f190) =>
              _0xafe00c["includes"](_0x52f190),
            ),
            _0x489fe2 = MAJOR_LEAGUES["some"]((_0x164109) =>
              _0x58e071["includes"](_0x164109),
            );
          return (
            _0x489fe2 ||
            (_0x29538c &&
              !_0x29d947["includes"]("division") &&
              !_0x29d947["includes"]("reserve") &&
              !_0x29d947["includes"]("u19") &&
              !_0x29d947["includes"]("u21"))
          );
        }),
        _0x58368e = _0x280383["length"] > 0x0 ? _0x280383 : _0x3c7885,
        _0x3336d8 = _0x280383["length"] > 0x0;
      let _0x22d9e9 = _0x3336d8
        ? "⚽ *LIVE SCORES (MAJOR LEAGUES)*\n\n"
        : "⚽ *LIVE SCORES (OTHER MATCHES)*\n\n";
      for (const _0xc0d1de of _0x58368e["slice"](0x0, 0x32)) {
        const _0xb7f20f = _0xc0d1de["R"]?.["st"] || "NS",
          _0x647d0c = _0xc0d1de["p1"],
          _0x5ebdf3 = _0xc0d1de["p2"],
          _0xc28a49 = _0xc0d1de["R"]?.["r1"] ?? "0",
          _0x299a60 = _0xc0d1de["R"]?.["r2"] ?? "0";
        let _0x8eabb9 = "⏳";
        if (_0xb7f20f === "FT") _0x8eabb9 = "✅";
        else {
          if (_0xb7f20f === "2T" || _0xb7f20f === "1T") _0x8eabb9 = "🔴";
        }
        ((_0x22d9e9 +=
          _0x8eabb9 +
          "\x20*" +
          _0x647d0c +
          "*\x20" +
          _0xc28a49 +
          " - " +
          _0x299a60 +
          "\x20*" +
          _0x5ebdf3 +
          "*\x0a"),
          (_0x22d9e9 += "⏱\x20" + _0xb7f20f + "\x0a\x0a"));
      }
      (_0x58368e["length"] > 0x32 &&
        (_0x22d9e9 += "📄 Showing 50 of " + _0x58368e["length"] + " matches."),
        await _0x58fe5d["sendMessage"](_0x17b0d5, {
          text: _0x22d9e9,
          edit: _0x3fb58c["key"],
        }));
    } catch (_0x42f028) {
      (console["error"](_0x42f028),
        await _0x58fe5d["sendMessage"](_0x17b0d5, {
          text: "❌ Failed to fetch live scores.",
          edit: _0x3fb58c["key"],
        }));
    }
  },
};
