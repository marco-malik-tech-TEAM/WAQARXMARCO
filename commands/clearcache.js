const messageCache = require("../utils/messageCache"),
  { groupCache } = require("../utils/groupCache"),
  { isOwner } = require("../utils/isOwner");
function runClearCache(_0x186120) {
  const _0x3589fd = {};
  _0x3589fd["messages"] = messageCache["clear"]();
  const _0x1647e6 = groupCache["keys"]()["length"];
  (groupCache["flushAll"](), (_0x3589fd["groups"] = _0x1647e6));
  const _0x18975b = _0x186120?.["get"]("game");
  _0x18975b?.["activeGames"] &&
    ((_0x3589fd["games"] = _0x18975b["activeGames"]["size"]),
    _0x18975b["activeGames"]["clear"]());
  const _0x176311 = _0x186120?.["get"]("wordguess");
  _0x176311?.["activeWordGames"] &&
    ((_0x3589fd["wordGames"] = _0x176311["activeWordGames"]["size"]),
    _0x176311["activeWordGames"]["clear"]());
  const _0x2c9dd7 = _0x186120?.["get"]("mathquiz");
  _0x2c9dd7?.["activeMathGames"] &&
    ((_0x3589fd["mathGames"] = _0x2c9dd7["activeMathGames"]["size"]),
    _0x2c9dd7["activeMathGames"]["clear"]());
  const _0x454cd9 = _0x186120?.["get"]("worm");
  return (
    _0x454cd9?.["sessions"] &&
      ((_0x3589fd["wormSessions"] = _0x454cd9["sessions"]["size"]),
      _0x454cd9["sessions"]["clear"]()),
    _0x3589fd
  );
}
module["exports"] = {
  name: "clearcache",
  description: "Clear all in-memory caches to free up memory (owner only).",
  runClearCache: runClearCache,
  async execute(_0x5ec15a, _0x306a6a, _0x336a4a, _0x2591a4) {
    const _0xb2e6a2 = _0x306a6a["key"]["remoteJid"];
    if (!isOwner(_0x306a6a))
      return _0x5ec15a["sendMessage"](
        _0xb2e6a2,
        { text: "❌ Only the owner can use this command." },
        { quoted: _0x306a6a },
      );
    const _0x3a2ded = process["memoryUsage"]()["rss"],
      _0xe7a983 = runClearCache(_0x2591a4),
      _0x3668e4 = process["memoryUsage"]()["rss"],
      _0x107aff = ((_0x3a2ded - _0x3668e4) / 0x400 / 0x400)["toFixed"](0x1),
      _0x35e6ac = [
        "💾 Messages cached: " + (_0xe7a983["messages"] ?? 0x0),
        "👥 Group metadata entries: " + (_0xe7a983["groups"] ?? 0x0),
        "🎮 Active games: " + (_0xe7a983["games"] ?? 0x0),
        "🔤 Word-guess games: " + (_0xe7a983["wordGames"] ?? 0x0),
        "🧮 Math quizzes: " + (_0xe7a983["mathGames"] ?? 0x0),
        "🪱 WormGPT sessions: " + (_0xe7a983["wormSessions"] ?? 0x0),
      ];
    await _0x5ec15a["sendMessage"](
      _0xb2e6a2,
      {
        text:
          "🧹 *Cache cleared*\n\n" +
          _0x35e6ac["join"]("\x0a") +
          "\x0a\x0a" +
          (_0x107aff > 0x0
            ? "📉 RSS memory freed: ~" + _0x107aff + " MB"
            : "ℹ️ Memory freed may not show immediately — Node reclaims it gradually."),
      },
      { quoted: _0x306a6a },
    );
  },
};
