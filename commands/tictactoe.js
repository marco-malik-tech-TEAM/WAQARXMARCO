const activeTTT = new Map();
function renderBoard(_0x4b0dca) {
  const _0x30fbb6 = (_0x1f7358) =>
    _0x4b0dca[_0x1f7358] || (_0x1f7358 + 0x1)["toString"]();
  return [
    _0x30fbb6(0x0) + " | " + _0x30fbb6(0x1) + " | " + _0x30fbb6(0x2),
    "---------",
    _0x30fbb6(0x3) + " | " + _0x30fbb6(0x4) + " | " + _0x30fbb6(0x5),
    "---------",
    _0x30fbb6(0x6) + " | " + _0x30fbb6(0x7) + " | " + _0x30fbb6(0x8),
  ]["join"]("\x0a");
}
function checkWinner(_0x1540c7) {
  const _0x418ba9 = [
    [0x0, 0x1, 0x2],
    [0x3, 0x4, 0x5],
    [0x6, 0x7, 0x8],
    [0x0, 0x3, 0x6],
    [0x1, 0x4, 0x7],
    [0x2, 0x5, 0x8],
    [0x0, 0x4, 0x8],
    [0x2, 0x4, 0x6],
  ];
  for (const [_0x368888, _0x326821, _0x4c496b] of _0x418ba9) {
    if (
      _0x1540c7[_0x368888] &&
      _0x1540c7[_0x368888] === _0x1540c7[_0x326821] &&
      _0x1540c7[_0x326821] === _0x1540c7[_0x4c496b]
    )
      return _0x1540c7[_0x368888];
  }
  if (_0x1540c7["every"]((_0x2707d5) => _0x2707d5)) return "draw";
  return null;
}
module["exports"] = [
  {
    name: "tictactoe",
    aliases: ["ttt"],
    description: "Start a TicTacToe game. Usage: .tictactoe @opponent",
    activeTTT: activeTTT,
    async execute(_0x479318, _0x56a134) {
      const _0x3afcf7 = _0x56a134["key"]["remoteJid"],
        _0x2d6ad0 =
          _0x56a134["message"]?.["extendedTextMessage"]?.["contextInfo"],
        _0x25d1d8 =
          _0x2d6ad0?.["mentionedJid"]?.[0x0] || _0x2d6ad0?.["participant"],
        _0x181e6a =
          _0x56a134["key"]["participant"] || _0x56a134["key"]["remoteJid"];
      if (!_0x25d1d8)
        return _0x479318["sendMessage"](
          _0x3afcf7,
          { text: "❌ Tag your opponent. Usage: .tictactoe @opponent" },
          { quoted: _0x56a134 },
        );
      if (_0x25d1d8 === _0x181e6a)
        return _0x479318["sendMessage"](
          _0x3afcf7,
          { text: "❌ You cannot play against yourself!" },
          { quoted: _0x56a134 },
        );
      if (activeTTT["has"](_0x3afcf7))
        return _0x479318["sendMessage"](
          _0x3afcf7,
          { text: "⚠️ A game is already in progress in this chat." },
          { quoted: _0x56a134 },
        );
      activeTTT["set"](_0x3afcf7, {
        board: Array(0x9)["fill"](null),
        players: { X: _0x181e6a, O: _0x25d1d8 },
        turn: "X",
      });
      const _0x2cdaab = ("\n🎮 *TicTacToe Started!*\n\n❌ @" +
        _0x181e6a["split"]("@")[0x0] +
        " vs ⭕ @" +
        _0x25d1d8["split"]("@")[0x0] +
        "\x0a\x0a" +
        renderBoard(Array(0x9)["fill"](null)) +
        "\n\n@" +
        _0x181e6a["split"]("@")[0x0] +
        "'s turn (❌). Use *.move <1-9>* to play.")["trim"]();
      await _0x479318["sendMessage"](
        _0x3afcf7,
        { text: _0x2cdaab, mentions: [_0x181e6a, _0x25d1d8] },
        { quoted: _0x56a134 },
      );
    },
  },
  {
    name: "move",
    description: "Make a TicTacToe move. Usage: .move <1-9>",
    activeTTT: activeTTT,
    async execute(_0xb13e2a, _0x41c9d9, _0x494553) {
      const _0x400e3c = _0x41c9d9["key"]["remoteJid"],
        _0x44e4f9 = activeTTT["get"](_0x400e3c),
        _0x525e44 =
          _0x41c9d9["key"]["participant"] || _0x41c9d9["key"]["remoteJid"];
      if (!_0x44e4f9)
        return _0xb13e2a["sendMessage"](
          _0x400e3c,
          { text: "❌ No active game. Start one with .tictactoe @opponent" },
          { quoted: _0x41c9d9 },
        );
      const _0x376a87 = _0x44e4f9["players"][_0x44e4f9["turn"]];
      if (_0x525e44 !== _0x376a87)
        return _0xb13e2a["sendMessage"](
          _0x400e3c,
          { text: "⏳ It's not your turn!" },
          { quoted: _0x41c9d9 },
        );
      const _0x1c3fb4 = parseInt(_0x494553[0x0], 0xa);
      if (!_0x1c3fb4 || _0x1c3fb4 < 0x1 || _0x1c3fb4 > 0x9)
        return _0xb13e2a["sendMessage"](
          _0x400e3c,
          { text: "❌ Enter a position between 1-9. Usage: .move 5" },
          { quoted: _0x41c9d9 },
        );
      const _0x427bb0 = _0x1c3fb4 - 0x1;
      if (_0x44e4f9["board"][_0x427bb0])
        return _0xb13e2a["sendMessage"](
          _0x400e3c,
          { text: "❌ That spot is already taken!" },
          { quoted: _0x41c9d9 },
        );
      const _0x37532b = _0x44e4f9["turn"] === "X" ? "❌" : "⭕";
      _0x44e4f9["board"][_0x427bb0] = _0x37532b;
      const _0x292440 = checkWinner(_0x44e4f9["board"]);
      if (_0x292440 === "draw")
        return (
          activeTTT["delete"](_0x400e3c),
          _0xb13e2a["sendMessage"](
            _0x400e3c,
            { text: "🤝 *It's a draw!*\n\n" + renderBoard(_0x44e4f9["board"]) },
            { quoted: _0x41c9d9 },
          )
        );
      if (_0x292440) {
        const _0x1f047b =
          _0x292440 === "❌"
            ? _0x44e4f9["players"]["X"]
            : _0x44e4f9["players"]["O"];
        return (
          activeTTT["delete"](_0x400e3c),
          _0xb13e2a["sendMessage"](
            _0x400e3c,
            {
              text:
                "🎉 *@" +
                _0x1f047b["split"]("@")[0x0] +
                " wins!*\n\n" +
                renderBoard(_0x44e4f9["board"]),
              mentions: [_0x1f047b],
            },
            { quoted: _0x41c9d9 },
          )
        );
      }
      _0x44e4f9["turn"] = _0x44e4f9["turn"] === "X" ? "O" : "X";
      const _0x401f92 = _0x44e4f9["players"][_0x44e4f9["turn"]],
        _0x5c087e = _0x44e4f9["turn"] === "X" ? "❌" : "⭕";
      await _0xb13e2a["sendMessage"](
        _0x400e3c,
        {
          text:
            renderBoard(_0x44e4f9["board"]) +
            "\n\n@" +
            _0x401f92["split"]("@")[0x0] +
            "'s turn (" +
            _0x5c087e +
            "). Use *.move <1-9>*.",
          mentions: [_0x401f92],
        },
        { quoted: _0x41c9d9 },
      );
    },
  },
  {
    name: "ttend",
    description: "End the current TicTacToe game in this chat.",
    activeTTT: activeTTT,
    async execute(_0x2152d9, _0x5a74b4) {
      const _0x20daad = _0x5a74b4["key"]["remoteJid"];
      if (!activeTTT["has"](_0x20daad))
        return _0x2152d9["sendMessage"](
          _0x20daad,
          { text: "❌ No active game to end." },
          { quoted: _0x5a74b4 },
        );
      (activeTTT["delete"](_0x20daad),
        await _0x2152d9["sendMessage"](
          _0x20daad,
          { text: "🛑 TicTacToe game ended." },
          { quoted: _0x5a74b4 },
        ));
    },
  },
];
