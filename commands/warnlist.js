const fs = require("fs"),
  path = require("path"),
  FILE_PATH = path["join"](require("../utils/paths").ROOT, "data", "warnings.json");
module["exports"] = {
  name: "warnlist",
  description:
    "Lists all members with active warnings in this group (admin only).",
  async execute(_0x5af659, _0x2b9248) {
    const _0x3cdf67 = _0x2b9248["key"]["remoteJid"];
    if (!_0x3cdf67["endsWith"]("@g.us")) {
      await _0x5af659["sendMessage"](
        _0x3cdf67,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x2b9248 },
      );
      return;
    }
    const _0x483d97 = await _0x5af659["groupMetadata"](_0x3cdf67),
      _0x4aff4f =
        _0x2b9248["key"]["participant"] || _0x2b9248["key"]["remoteJid"],
      { isSenderAdmin: _0x48b004 } = require("../utils/isAdmin");
    if (!_0x48b004(_0x483d97, _0x4aff4f)) {
      await _0x5af659["sendMessage"](
        _0x3cdf67,
        { text: "❌ *Only group admins can use this command.*" },
        { quoted: _0x2b9248 },
      );
      return;
    }
    let _0x45d0f2 = {};
    if (fs["existsSync"](FILE_PATH))
      try {
        _0x45d0f2 = JSON["parse"](fs["readFileSync"](FILE_PATH, "utf-8"));
      } catch {
        _0x45d0f2 = {};
      }
    const _0xba01c1 = _0x3cdf67 + "::",
      _0x4a3040 = Object["entries"](_0x45d0f2)
        ["filter"](
          ([_0x290d79, _0x39043e]) =>
            _0x290d79["startsWith"](_0xba01c1) && _0x39043e > 0x0,
        )
        ["map"](([_0x3cabbf, _0x468257]) => ({
          userJid: _0x3cabbf["slice"](_0xba01c1["length"]),
          count: _0x468257,
        }));
    if (_0x4a3040["length"] === 0x0) {
      await _0x5af659["sendMessage"](
        _0x3cdf67,
        { text: "ℹ️ *No one in this group has any warnings.*" },
        { quoted: _0x2b9248 },
      );
      return;
    }
    const _0x1eb338 = _0x4a3040["map"]((_0x5db56a) => _0x5db56a["userJid"]),
      _0x4567f8 = _0x4a3040["map"](
        (_0x1eea89) =>
          "• @" +
          _0x1eea89["userJid"]["split"]("@")[0x0] +
          " — " +
          _0x1eea89["count"] +
          "/3 — *Reason:* Going against group rules",
      );
    await _0x5af659["sendMessage"](
      _0x3cdf67,
      {
        text:
          "⚠️ *Active warnings in this group:*\n\n" + _0x4567f8["join"]("\x0a"),
        mentions: _0x1eb338,
      },
      { quoted: _0x2b9248 },
    );
  },
};
