const { activeGames } = require("./game");
module["exports"] = {
  name: "answer",
  description: "Answers the active trivia question. Usage: !answer A",
  async execute(_0x341cad, _0x2e480, _0x50c652) {
    const _0x578b41 = _0x2e480["key"]["remoteJid"],
      _0x1bbabf = activeGames["get"](_0x578b41);
    if (!_0x1bbabf || _0x1bbabf["type"] !== "trivia") {
      await _0x341cad["sendMessage"](
        _0x578b41,
        {
          text: "❌ There is no active trivia question. Start one with !game trivia.",
        },
        { quoted: _0x2e480 },
      );
      return;
    }
    const _0x1202f7 = _0x50c652[0x0]?.["toUpperCase"]();
    if (!["A", "B", "C", "D"]["includes"](_0x1202f7)) {
      await _0x341cad["sendMessage"](
        _0x578b41,
        { text: "Usage: !answer A (or B, C, D)" },
        { quoted: _0x2e480 },
      );
      return;
    }
    (activeGames["delete"](_0x578b41),
      _0x1202f7 === _0x1bbabf["correctLetter"]
        ? await _0x341cad["sendMessage"](
            _0x578b41,
            {
              text:
                "✅ Correct! The answer was " +
                _0x1bbabf["correctLetter"] +
                ".",
            },
            { quoted: _0x2e480 },
          )
        : await _0x341cad["sendMessage"](
            _0x578b41,
            {
              text:
                "❌ Wrong. The correct answer was " +
                _0x1bbabf["correctLetter"] +
                ".",
            },
            { quoted: _0x2e480 },
          ));
  },
};
