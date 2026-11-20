const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "fixtures",
  aliases: ["standings", "matches"],
  description: "Show upcoming football matches",
  async execute(_0x56cdc4, _0x2d31eb, _0x2ee229) {
    const _0x569c90 = _0x2d31eb["key"]["remoteJid"],
      _0x6cd3b5 = {
        epl: "epl",
        bundesliga: "bundesliga",
        laliga: "laliga",
        seriea: "seriea",
        ligue1: "ligue1",
        ucl: "ucl",
        euros: "euros",
        fifa: "fifa",
      };
    if (!_0x2ee229[0x0] || !_0x6cd3b5[_0x2ee229[0x0]["toLowerCase"]()])
      return await _0x56cdc4["sendMessage"](
        _0x569c90,
        {
          text: "⚽ *Upcoming Football Matches*\n\nUsage:\n.fixtures epl\n.fixtures bundesliga\n.fixtures laliga\n.fixtures seriea\n.fixtures ligue1\n.fixtures ucl\n.fixtures euros\n.fixtures fifa",
        },
        { quoted: _0x2d31eb },
      );
    const _0xd77997 = _0x6cd3b5[_0x2ee229[0x0]["toLowerCase"]()];
    try {
      const _0xc42222 = KEITH_BASE + "/" + _0xd77997 + "/upcomingmatches",
        { data: _0x2439f8 } = await axios["get"](_0xc42222);
      if (!_0x2439f8["status"] || !_0x2439f8["result"])
        return await _0x56cdc4["sendMessage"](
          _0x569c90,
          { text: "❌ No upcoming matches found." },
          { quoted: _0x2d31eb },
        );
      const _0x31fa7c =
          _0x2439f8["result"]["competition"] || _0xd77997["toUpperCase"](),
        _0x261ab6 = _0x2439f8["result"]["upcomingMatches"];
      if (!Array["isArray"](_0x261ab6) || _0x261ab6["length"] === 0x0)
        return await _0x56cdc4["sendMessage"](
          _0x569c90,
          { text: "❌ No upcoming matches found." },
          { quoted: _0x2d31eb },
        );
      const _0x3f0db2 = Math["min"](
          ..._0x261ab6["map"]((_0x5583ad) => _0x5583ad["matchday"]),
        ),
        _0x15fc36 = _0x261ab6["filter"](
          (_0x396092) => _0x396092["matchday"] === _0x3f0db2,
        );
      let _0x5a5489 =
        "🏆 *" +
        _0x31fa7c +
        " Upcoming Matches*\n" +
        ("📅 *Matchday " + _0x3f0db2 + "*\n\n");
      for (const _0x543c16 of _0x15fc36) {
        const _0x351c45 = new Date(_0x543c16["date"]),
          _0x4ea74c = _0x351c45["toLocaleDateString"]("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          _0x2386b9 = _0x351c45["toLocaleTimeString"]("en-GB", {
            hour: "numeric",
            minute: "2-digit",
            hour12: !![],
          });
        _0x5a5489 +=
          "⚽\x20" +
          _0x543c16["homeTeam"] +
          " vs " +
          _0x543c16["awayTeam"] +
          "\n🗓️ " +
          _0x4ea74c +
          "\n🕖 " +
          _0x2386b9 +
          "\x0a\x0a";
      }
      await _0x56cdc4["sendMessage"](
        _0x569c90,
        { text: _0x5a5489["trim"]() },
        { quoted: _0x2d31eb },
      );
    } catch (_0x3afe36) {
      (console["error"]("[standings] API error:", _0x3afe36["message"]),
        await _0x56cdc4["sendMessage"](
          _0x569c90,
          { text: "❌ Failed to fetch upcoming matches." },
          { quoted: _0x2d31eb },
        ));
    }
  },
};
