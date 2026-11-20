const fs = require("fs"),
  path = require("path");
module["exports"] = {
  name: "uptime",
  aliases: ["up"],
  description: "Shows how long the bot has been running, with an audio clip.",
  async execute(_0x5362fe, _0xf4f1f2) {
    console["log"]("[UPTIME] execute started");
    const _0x27802a = _0xf4f1f2["key"]["remoteJid"],
      _0xdea536 =
        _0x27802a["endsWith"]("@lid") && _0xf4f1f2["key"]["remoteJidAlt"]
          ? _0xf4f1f2["key"]["remoteJidAlt"]
          : _0x27802a,
      _0x3d8b9a = process["uptime"](),
      _0x35d091 = Math["floor"](_0x3d8b9a / 0x15180),
      _0x5044d6 = Math["floor"]((_0x3d8b9a % 0x15180) / 0xe10),
      _0x10617f = Math["floor"]((_0x3d8b9a % 0xe10) / 0x3c),
      _0x5a3bf8 = Math["floor"](_0x3d8b9a % 0x3c),
      _0x24c14e = [];
    if (_0x35d091) _0x24c14e["push"](_0x35d091 + "d");
    if (_0x5044d6) _0x24c14e["push"](_0x5044d6 + "h");
    if (_0x10617f) _0x24c14e["push"](_0x10617f + "m");
    _0x24c14e["push"](_0x5a3bf8 + "s");
    const _0x3f7a91 = "⏱ *Uptime:* " + _0x24c14e["join"]("\x20");
    await _0x5362fe["sendMessage"](
      _0xdea536,
      { text: _0x3f7a91 },
      { quoted: _0xf4f1f2 },
    );
    const _0x355ddd = path["join"](__dirname, "../assets/uptime.m4a");
    fs["existsSync"](_0x355ddd) &&
      (await _0x5362fe["sendMessage"](_0xdea536, {
        audio: fs["readFileSync"](_0x355ddd),
        mimetype: "audio/mp4",
        ptt: ![],
      }));
  },
};
