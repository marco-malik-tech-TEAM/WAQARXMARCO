const activeWordGames = new Map(),
  activeMathGames = new Map(),
  WORDS = [
    "javascript",
    "whatsapp",
    "baileys",
    "computer",
    "elephant",
    "mountain",
    "sandwich",
    "umbrella",
    "keyboard",
    "dolphin",
    "butterfly",
    "chocolate",
    "astronaut",
    "telescope",
    "adventure",
    "harmony",
    "volcano",
    "penguin",
  ];
function maskWord(_0x3842dd, _0x458554) {
  return _0x3842dd["split"]("")
    ["map"]((_0x7a544e) => (_0x458554["includes"](_0x7a544e) ? _0x7a544e : "_"))
    ["join"]("\x20");
}
module["exports"] = [
  {
    name: "rps",
    description:
      "Play Rock Paper Scissors against the bot. Usage: .rps rock/paper/scissors",
    async execute(_0x126e45, _0x4e3d6b, _0x3789b5) {
      const _0x129eea = _0x4e3d6b["key"]["remoteJid"],
        _0x2376bf = _0x3789b5[0x0]?.["toLowerCase"](),
        _0x2b60f6 = ["rock", "paper", "scissors"];
      if (!_0x2b60f6["includes"](_0x2376bf))
        return _0x126e45["sendMessage"](
          _0x129eea,
          { text: "❌ Usage: .rps rock | .rps paper | .rps scissors" },
          { quoted: _0x4e3d6b },
        );
      const _0x37b103 = _0x2b60f6[Math["floor"](Math["random"]() * 0x3)],
        _0x35ceb1 = { rock: "🪨", paper: "📄", scissors: "✂️" };
      let _0x11d531;
      if (_0x2376bf === _0x37b103) _0x11d531 = "🤝 It's a draw!";
      else
        (_0x2376bf === "rock" && _0x37b103 === "scissors") ||
        (_0x2376bf === "paper" && _0x37b103 === "rock") ||
        (_0x2376bf === "scissors" && _0x37b103 === "paper")
          ? (_0x11d531 = "🎉 You win!")
          : (_0x11d531 = "🤖 Bot wins!");
      await _0x126e45["sendMessage"](
        _0x129eea,
        {
          text:
            _0x35ceb1[_0x2376bf] +
            " *You* vs *Bot* " +
            _0x35ceb1[_0x37b103] +
            "\n\nYou chose: " +
            _0x2376bf +
            "\nBot chose: " +
            _0x37b103 +
            "\x0a\x0a" +
            _0x11d531,
        },
        { quoted: _0x4e3d6b },
      );
    },
  },
  {
    name: "wordguess",
    aliases: ["wg"],
    description: "Start a word guessing game. Usage: .wordguess",
    activeWordGames: activeWordGames,
    async execute(_0x11c8d7, _0x1c649d) {
      const _0x57cb1e = _0x1c649d["key"]["remoteJid"];
      if (activeWordGames["has"](_0x57cb1e))
        return _0x11c8d7["sendMessage"](
          _0x57cb1e,
          {
            text: "⚠️ A word guess game is already running. Use .guess <letter> to play, or .wgend to stop.",
          },
          { quoted: _0x1c649d },
        );
      const _0x43b319 =
        WORDS[Math["floor"](Math["random"]() * WORDS["length"])];
      (activeWordGames["set"](_0x57cb1e, {
        word: _0x43b319,
        guessed: [],
        attemptsLeft: 0x6,
      }),
        await _0x11c8d7["sendMessage"](
          _0x57cb1e,
          {
            text:
              "🔤 *Word Guess Started!*\n\n" +
              maskWord(_0x43b319, []) +
              "\n\n❤️ Attempts left: 6\nUse *.guess <letter>* to guess a letter.",
          },
          { quoted: _0x1c649d },
        ));
    },
  },
  {
    name: "guess",
    description: "Guess a letter in the word guess game. Usage: .guess a",
    activeWordGames: activeWordGames,
    async execute(_0x3a2f2d, _0x55a85d, _0x35475d) {
      const _0x7a7d07 = _0x55a85d["key"]["remoteJid"],
        _0x509aff = activeWordGames["get"](_0x7a7d07);
      if (!_0x509aff)
        return _0x3a2f2d["sendMessage"](
          _0x7a7d07,
          { text: "❌ No active word guess game. Start one with .wordguess" },
          { quoted: _0x55a85d },
        );
      const _0x2728da = _0x35475d[0x0]?.["toLowerCase"]();
      if (
        !_0x2728da ||
        _0x2728da["length"] !== 0x1 ||
        !/[a-z]/["test"](_0x2728da)
      )
        return _0x3a2f2d["sendMessage"](
          _0x7a7d07,
          { text: "❌ Usage: .guess <single letter>" },
          { quoted: _0x55a85d },
        );
      if (_0x509aff["guessed"]["includes"](_0x2728da))
        return _0x3a2f2d["sendMessage"](
          _0x7a7d07,
          { text: '⚠️ You already guessed "' + _0x2728da + "\x22." },
          { quoted: _0x55a85d },
        );
      _0x509aff["guessed"]["push"](_0x2728da);
      !_0x509aff["word"]["includes"](_0x2728da) &&
        (_0x509aff["attemptsLeft"] -= 0x1);
      if (_0x509aff["attemptsLeft"] <= 0x0)
        return (
          activeWordGames["delete"](_0x7a7d07),
          _0x3a2f2d["sendMessage"](
            _0x7a7d07,
            {
              text: "💀 *Game Over!* The word was: *" + _0x509aff["word"] + "*",
            },
            { quoted: _0x55a85d },
          )
        );
      const _0x3ba730 = maskWord(_0x509aff["word"], _0x509aff["guessed"]);
      if (!_0x3ba730["includes"]("_"))
        return (
          activeWordGames["delete"](_0x7a7d07),
          _0x3a2f2d["sendMessage"](
            _0x7a7d07,
            { text: "🎉 *You won!* The word was: *" + _0x509aff["word"] + "*" },
            { quoted: _0x55a85d },
          )
        );
      await _0x3a2f2d["sendMessage"](
        _0x7a7d07,
        {
          text:
            _0x3ba730 +
            "\n\n❤️ Attempts left: " +
            _0x509aff["attemptsLeft"] +
            "\nGuessed: " +
            (_0x509aff["guessed"]["join"](",\x20") || "none"),
        },
        { quoted: _0x55a85d },
      );
    },
  },
  {
    name: "wgend",
    description: "End the current word guess game.",
    activeWordGames: activeWordGames,
    async execute(_0x151085, _0x2cd996) {
      const _0x443a7e = _0x2cd996["key"]["remoteJid"];
      if (!activeWordGames["has"](_0x443a7e))
        return _0x151085["sendMessage"](
          _0x443a7e,
          { text: "❌ No active game to end." },
          { quoted: _0x2cd996 },
        );
      const _0x5e825a = activeWordGames["get"](_0x443a7e);
      (activeWordGames["delete"](_0x443a7e),
        await _0x151085["sendMessage"](
          _0x443a7e,
          { text: "🛑 Game ended. The word was: *" + _0x5e825a["word"] + "*" },
          { quoted: _0x2cd996 },
        ));
    },
  },
  {
    name: "mathquiz",
    aliases: ["mq"],
    description: "Start a math quiz. Usage: .mathquiz",
    activeMathGames: activeMathGames,
    async execute(_0x1bfb54, _0x5e8672) {
      const _0x48ce9c = _0x5e8672["key"]["remoteJid"],
        _0x384b1c = Math["floor"](Math["random"]() * 0x32) + 0x1,
        _0x1e79aa = Math["floor"](Math["random"]() * 0x32) + 0x1,
        _0x36e962 = ["+", "-", "*"],
        _0x4fc70a =
          _0x36e962[Math["floor"](Math["random"]() * _0x36e962["length"])];
      let _0x443471;
      if (_0x4fc70a === "+") _0x443471 = _0x384b1c + _0x1e79aa;
      else {
        if (_0x4fc70a === "-") _0x443471 = _0x384b1c - _0x1e79aa;
        else _0x443471 = _0x384b1c * _0x1e79aa;
      }
      (activeMathGames["set"](_0x48ce9c, {
        answer: _0x443471,
        expression: _0x384b1c + "\x20" + _0x4fc70a + "\x20" + _0x1e79aa,
        startedAt: Date["now"](),
      }),
        await _0x1bfb54["sendMessage"](
          _0x48ce9c,
          {
            text:
              "🧮 *Math Quiz!*\n\nWhat is: " +
              _0x384b1c +
              "\x20" +
              _0x4fc70a +
              "\x20" +
              _0x1e79aa +
              " = ?\n\nReply with *.mans <number>*",
          },
          { quoted: _0x5e8672 },
        ));
    },
  },
  {
    name: "mans",
    description: "Answer the math quiz. Usage: .mans <number>",
    activeMathGames: activeMathGames,
    async execute(_0x345280, _0x4eb250, _0x90270) {
      const _0x252f60 = _0x4eb250["key"]["remoteJid"],
        _0x579267 = activeMathGames["get"](_0x252f60);
      if (!_0x579267)
        return _0x345280["sendMessage"](
          _0x252f60,
          { text: "❌ No active math quiz. Start one with .mathquiz" },
          { quoted: _0x4eb250 },
        );
      const _0x434802 = parseInt(_0x90270[0x0], 0xa);
      if (isNaN(_0x434802))
        return _0x345280["sendMessage"](
          _0x252f60,
          { text: "❌ Usage: .mans <number>" },
          { quoted: _0x4eb250 },
        );
      const _0x1aaf58 = ((Date["now"]() - _0x579267["startedAt"]) / 0x3e8)[
        "toFixed"
      ](0x1);
      _0x434802 === _0x579267["answer"]
        ? (activeMathGames["delete"](_0x252f60),
          await _0x345280["sendMessage"](
            _0x252f60,
            {
              text:
                "🎉 Correct! " +
                _0x579267["expression"] +
                " = " +
                _0x579267["answer"] +
                "\n⏱ Solved in " +
                _0x1aaf58 +
                "s",
            },
            { quoted: _0x4eb250 },
          ))
        : await _0x345280["sendMessage"](
            _0x252f60,
            { text: "❌ Wrong, try again!" },
            { quoted: _0x4eb250 },
          );
    },
  },
];
