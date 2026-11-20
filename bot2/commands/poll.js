module["exports"] = {
  name: "poll",
  description: "Sends a poll with a question and up to 12 options.",
  async execute(_0x3ffe95, _0x1ea568, _0x130f50) {
    const _0x123d9b = _0x1ea568["key"]["remoteJid"];
    if (!_0x123d9b["endsWith"]("@g.us")) {
      await _0x3ffe95["sendMessage"](
        _0x123d9b,
        { text: "❌ This command only works in groups." },
        { quoted: _0x1ea568 },
      );
      return;
    }
    const _0x1f59d = _0x130f50["join"]("\x20")
        ["split"]("|")
        ["map"]((_0x45974b) => _0x45974b["trim"]())
        ["filter"](Boolean),
      _0x41f175 = _0x1f59d[0x0],
      _0x13b0e1 = _0x1f59d["slice"](0x1);
    if (!_0x41f175 || _0x13b0e1["length"] < 0x2) {
      await _0x3ffe95["sendMessage"](
        _0x123d9b,
        { text: "❌ Usage: .poll Question? | Option 1 | Option 2 | Option 3" },
        { quoted: _0x1ea568 },
      );
      return;
    }
    try {
      await _0x3ffe95["sendMessage"](
        _0x123d9b,
        { poll: { name: _0x41f175, values: _0x13b0e1, selectableCount: 0x1 } },
        { quoted: _0x1ea568 },
      );
    } catch (_0x51e498) {
      await _0x3ffe95["sendMessage"](
        _0x123d9b,
        { text: "❌ Failed to send poll: " + _0x51e498["message"] },
        { quoted: _0x1ea568 },
      );
    }
  },
};
