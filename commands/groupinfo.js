function formatTimestamp(_0x189439) {
  const _0x48dfe2 = new Date(_0x189439 * 0x3e8),
    _0x3e5a7b = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    _0x16e946 = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  return {
    day: _0x3e5a7b[_0x48dfe2["getDay"]()],
    date: _0x48dfe2["getDate"](),
    month: _0x16e946[_0x48dfe2["getMonth"]()],
    year: _0x48dfe2["getFullYear"](),
    time: _0x48dfe2["toLocaleTimeString"]("en-US"),
  };
}
module["exports"] = {
  name: "groupinfo",
  aliases: ["gcinfo", "gcprofile"],
  description: "Shows info about the current group.",
  async execute(_0x4ba47d, _0x1a3d65) {
    const _0x23087b = _0x1a3d65["key"]["remoteJid"];
    if (!_0x23087b["endsWith"]("@g.us"))
      return _0x4ba47d["sendMessage"](
        _0x23087b,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x1a3d65 },
      );
    try {
      const _0xf2d331 = await _0x4ba47d["groupMetadata"](_0x23087b),
        _0x44458b = formatTimestamp(_0xf2d331["creation"]);
      let _0x1064ee;
      try {
        _0x1064ee = await _0x4ba47d["profilePictureUrl"](_0x23087b, "image");
      } catch {
        _0x1064ee = require("path")["join"](__dirname, "../assets/thumb.jpg");
      }
      const _0x10234b = _0xf2d331["participants"]["filter"](
          (_0x34cb4f) => _0x34cb4f["admin"] == null,
        )["length"],
        _0x4ecd6a = _0xf2d331["participants"]["length"] - _0x10234b,
        _0x369015 =
          "_Name_ : *" +
          _0xf2d331["subject"] +
          "*\n\n" +
          ("_ID_ : *" + _0xf2d331["id"] + "*\n\n") +
          ("_Group owner_ : " +
            ("@" + (_0xf2d331["owner"] || "")["split"]("@")[0x0]) +
            "\x0a\x0a") +
          ("_Group created_ : *" +
            _0x44458b["day"] +
            ",\x20" +
            _0x44458b["date"] +
            "\x20" +
            _0x44458b["month"] +
            "\x20" +
            _0x44458b["year"] +
            ",\x20" +
            _0x44458b["time"] +
            "*\n\n") +
          ("_Participants_ : *" + _0xf2d331["size"] + "*\x0a") +
          ("_Members_ : *" + _0x10234b + "*\n\n") +
          ("_Admins_ : *" + _0x4ecd6a + "*\n\n") +
          ("_Who can send message_ : *" +
            (_0xf2d331["announce"] ? "Admins" : "Everyone") +
            "*\n\n") +
          ("_Who can edit group info_ : *" +
            (_0xf2d331["restrict"] ? "Admins" : "Everyone") +
            "*\n\n") +
          ("_Who can add participants_ : *" +
            (_0xf2d331["memberAddMode"] ? "Everyone" : "Admins") +
            "*");
      await _0x4ba47d["sendMessage"](
        _0x23087b,
        {
          image: /^https?:/.test(_0x1064ee) ? { url: _0x1064ee } : require("fs")["readFileSync"](_0x1064ee),
          caption: _0x369015,
          mentions: _0xf2d331["owner"] ? [_0xf2d331["owner"]] : [],
        },
        { quoted: _0x1a3d65 },
      );
    } catch (_0x5d7f17) {
      await _0x4ba47d["sendMessage"](
        _0x23087b,
        {
          text: "❌ *Failed to fetch group info: " + _0x5d7f17["message"] + "*",
        },
        { quoted: _0x1a3d65 },
      );
    }
  },
};
