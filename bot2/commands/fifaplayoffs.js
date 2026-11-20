const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "fifaplayoffs",
  description: "Shows current FIFA World Cup playoff/knockout results.",
  async execute(_0x42ec18, _0x556358) {
    const _0x4e48ce = _0x556358["key"]["remoteJid"],
      _0x34e5ff = await _0x42ec18["sendMessage"](
        _0x4e48ce,
        { text: "🏆 Fetching FIFA playoffs..." },
        { quoted: _0x556358 },
      );
    try {
      const { data: _0x38df1c } = await axios["get"](
        KEITH_BASE + "/fifa/playoffs",
      );
      if (!_0x38df1c["status"] || !_0x38df1c["result"])
        throw new Error("No playoff data available.");
      const _0x1a171f = Array["isArray"](_0x38df1c["result"])
        ? _0x38df1c["result"]
        : _0x38df1c["result"]["matches"] || [];
      if (!_0x1a171f["length"]) throw new Error("No playoff matches found.");
      let _0x1c07fc = "🏆 *FIFA World Cup — Playoffs*\n\n";
      (_0x1a171f["forEach"]((_0x29be9d) => {
        _0x1c07fc +=
          "" +
          (_0x29be9d["round"] ? "*" + _0x29be9d["round"] + "*\x0a" : "") +
          (_0x29be9d["homeTeam"] || _0x29be9d["home"]) +
          "\x20" +
          (_0x29be9d["homeScore"] ?? "") +
          " - " +
          (_0x29be9d["awayScore"] ?? "") +
          "\x20" +
          (_0x29be9d["awayTeam"] || _0x29be9d["away"]) +
          "\x0a\x0a";
      }),
        await _0x42ec18["sendMessage"](_0x4e48ce, {
          text: _0x1c07fc,
          edit: _0x34e5ff["key"],
        }));
    } catch (_0x5c68ab) {
      await _0x42ec18["sendMessage"](_0x4e48ce, {
        text: "❌ Failed to fetch playoffs.\n\n" + _0x5c68ab["message"],
        edit: _0x34e5ff["key"],
      });
    }
  },
};
