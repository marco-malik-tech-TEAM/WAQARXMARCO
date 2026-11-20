module["exports"] = {
  name: "igstory",
  aliases: ["instastory", "igstories", "igs"],
  description:
    "Download Instagram stories by username. Usage: .igstory <username>",
  async execute(_0x18f7b6, _0x5e6c11, _0x1122bb) {
    const _0x1dd133 = _0x5e6c11["key"]["remoteJid"],
      _0x599413 = _0x1122bb["join"]("\x20")["trim"]();
    if (!_0x599413)
      return _0x18f7b6["sendMessage"](
        _0x1dd133,
        {
          text: "📌 Provide an Instagram username.\nExample: .igstory username",
        },
        { quoted: _0x5e6c11 },
      );
    const _0x3f8f0d = _0x599413["replace"](/^@/, "");
    try {
      (await _0x18f7b6["sendMessage"](
        _0x1dd133,
        { text: "⏳ Fetching stories for *@" + _0x3f8f0d + "*..." },
        { quoted: _0x5e6c11 },
      ),
        await _0x18f7b6["sendMessage"](_0x1dd133, {
          react: { text: "📥", key: _0x5e6c11["key"] },
        }));
      const _0x1097ab = await fetch(
          "https://api.bk9.dev/download/igs?username=" +
            encodeURIComponent(_0x3f8f0d),
        ),
        _0x4e5dbc = await _0x1097ab["json"]();
      if (!_0x4e5dbc["status"] || !_0x4e5dbc["BK9"]) {
        try {
          const _0x58d320 = await fetch(
              "https://www.instagram.com/api/v1/users/web_profile_info/?username=" +
                encodeURIComponent(_0x3f8f0d),
              { headers: { "x-ig-app-id": "936619743392459" } },
            ),
            _0x3253ab = await _0x58d320["json"](),
            _0x386c0e = _0x3253ab?.["data"]?.["user"]?.["is_private"];
          if (_0x386c0e === !![])
            return _0x18f7b6["sendMessage"](
              _0x1dd133,
              {
                text:
                  "🔒 *@" +
                  _0x3f8f0d +
                  "* has a private account. Stories can only be downloaded from public accounts.",
              },
              { quoted: _0x5e6c11 },
            );
        } catch {}
        return _0x18f7b6["sendMessage"](
          _0x1dd133,
          { text: "📭 *@" + _0x3f8f0d + "* has no active stories right now." },
          { quoted: _0x5e6c11 },
        );
      }
      const _0x520a70 = _0x4e5dbc["BK9"]?.["stories"];
      if (!Array["isArray"](_0x520a70) || _0x520a70["length"] === 0x0)
        return _0x18f7b6["sendMessage"](
          _0x1dd133,
          { text: "❌ No active stories found for *@" + _0x3f8f0d + "*." },
          { quoted: _0x5e6c11 },
        );
      await _0x18f7b6["sendMessage"](
        _0x1dd133,
        {
          text:
            "📖 Found *" +
            _0x520a70["length"] +
            "* stor" +
            (_0x520a70["length"] === 0x1 ? "y" : "ies") +
            " for *@" +
            _0x3f8f0d +
            "*. Sending...",
        },
        { quoted: _0x5e6c11 },
      );
      for (let _0x405876 = 0x0; _0x405876 < _0x520a70["length"]; _0x405876++) {
        const _0x5d0076 = _0x520a70[_0x405876],
          _0x29bbc5 = _0x5d0076?.["download_url"] || _0x5d0076?.["url"];
        if (!_0x29bbc5) continue;
        const _0x4c3dc7 =
          _0x405876 === 0x0
            ? "📸 *@" + _0x3f8f0d + "* stories\n_via MARCO X WAQAR MD BOT_"
            : undefined;
        _0x5d0076["type"] === "video"
          ? await _0x18f7b6["sendMessage"](
              _0x1dd133,
              {
                video: { url: _0x29bbc5 },
                mimetype: "video/mp4",
                caption: _0x4c3dc7,
                gifPlayback: ![],
              },
              { quoted: _0x5e6c11 },
            )
          : await _0x18f7b6["sendMessage"](
              _0x1dd133,
              { image: { url: _0x29bbc5 }, caption: _0x4c3dc7 },
              { quoted: _0x5e6c11 },
            );
      }
    } catch (_0x81a9e8) {
      await _0x18f7b6["sendMessage"](
        _0x1dd133,
        { text: "❌ Error fetching Instagram stories." },
        { quoted: _0x5e6c11 },
      );
    }
  },
};
