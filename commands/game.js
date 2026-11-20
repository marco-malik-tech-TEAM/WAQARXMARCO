const activeGames = new Map();
async function startNumberGame(_0x404230, _0x4f7239, _0x5f155f) {
  const _0x1998c9 = Math["floor"](Math["random"]() * 0x32) + 0x1;
  (activeGames["set"](_0x5f155f, {
    type: "number",
    target: _0x1998c9,
    attempts: 0x0,
  }),
    await _0x404230["sendMessage"](
      _0x5f155f,
      { text: "🎲 I picked a number between 1 and 50. Reply with your guess!" },
      { quoted: _0x4f7239 },
    ));
}
async function startTriviaGame(_0x58197f, _0x4d0e5, _0x29168e) {
  try {
    const _0x3493f0 = await fetch(
        "https://opentdb.com/api.php?amount=1&type=multiple",
      ),
      _0x113e82 = await _0x3493f0["json"](),
      _0x1e4dd2 = _0x113e82["results"][0x0],
      _0x2d4a71 = (_0x1e1d35) =>
        _0x1e1d35["replace"](/&quot;/g, "\x22")
          ["replace"](/&#039;/g, "\x27")
          ["replace"](/&amp;/g, "&")
          ["replace"](/&eacute;/g, "é"),
      _0xbf68a2 = [
        ..._0x1e4dd2["incorrect_answers"]["map"](_0x2d4a71),
        _0x2d4a71(_0x1e4dd2["correct_answer"]),
      ];
    for (
      let _0x3cba89 = _0xbf68a2["length"] - 0x1;
      _0x3cba89 > 0x0;
      _0x3cba89--
    ) {
      const _0x5d265c = Math["floor"](Math["random"]() * (_0x3cba89 + 0x1));
      [_0xbf68a2[_0x3cba89], _0xbf68a2[_0x5d265c]] = [
        _0xbf68a2[_0x5d265c],
        _0xbf68a2[_0x3cba89],
      ];
    }
    const _0x4924ae = ["A", "B", "C", "D"],
      _0x224c52 =
        _0x4924ae[_0xbf68a2["indexOf"](_0x2d4a71(_0x1e4dd2["correct_answer"]))];
    activeGames["set"](_0x29168e, {
      type: "trivia",
      correctLetter: _0x224c52,
      question: _0x2d4a71(_0x1e4dd2["question"]),
    });
    const _0x4d414a = _0xbf68a2["map"](
      (_0x55a079, _0x18fe65) => _0x4924ae[_0x18fe65] + ")\x20" + _0x55a079,
    )["join"]("\x0a");
    await _0x58197f["sendMessage"](
      _0x29168e,
      {
        text:
          "🧠 *Trivia* (" +
          _0x2d4a71(_0x1e4dd2["category"]) +
          ")\n\n" +
          _0x2d4a71(_0x1e4dd2["question"]) +
          "\x0a\x0a" +
          _0x4d414a +
          "\x0a\x0a" +
          "Reply with !answer A, !answer B, etc.",
      },
      { quoted: _0x4d0e5 },
    );
  } catch (_0x1c4e44) {
    await _0x58197f["sendMessage"](
      _0x29168e,
      {
        text: "❌ Could not fetch a trivia question right now, try again in a moment.",
      },
      { quoted: _0x4d0e5 },
    );
  }
}
module["exports"] = {
  name: "game",
  description: "Starts a game. Usage: !game number | !game trivia",
  activeGames: activeGames,
  async execute(_0x41a500, _0x2963a3, _0x304d0f) {
    const _0x3c0c94 = _0x2963a3["key"]["remoteJid"],
      _0x168e89 = _0x304d0f[0x0]?.["toLowerCase"]();
    if (_0x168e89 === "number")
      await startNumberGame(_0x41a500, _0x2963a3, _0x3c0c94);
    else
      _0x168e89 === "trivia"
        ? await startTriviaGame(_0x41a500, _0x2963a3, _0x3c0c94)
        : await _0x41a500["sendMessage"](
            _0x3c0c94,
            { text: "Usage: !game number   or   !game trivia" },
            { quoted: _0x2963a3 },
          );
  },
};
