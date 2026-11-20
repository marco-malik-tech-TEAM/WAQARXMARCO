const axios = require("axios");
module["exports"] = {
  name: "gitclone",
  aliases: ["clone"],
  description: "Download a GitHub repo as ZIP",
  async execute(_0x562169, _0x586214, _0x26b7a1) {
    const _0x33608d = _0x586214["key"]["remoteJid"],
      _0x59694d = _0x26b7a1["join"]("\x20")["trim"]();
    if (!_0x59694d)
      return await _0x562169["sendMessage"](
        _0x33608d,
        { text: "Where is the link?" },
        { quoted: _0x586214 },
      );
    if (!_0x59694d["includes"]("github.com"))
      return await _0x562169["sendMessage"](
        _0x33608d,
        { text: "Is that a GitHub repo link?" },
        { quoted: _0x586214 },
      );
    const _0x326df4 =
        /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i,
      _0x9ddb2c = _0x59694d["match"](_0x326df4);
    if (!_0x9ddb2c)
      return await _0x562169["sendMessage"](
        _0x33608d,
        { text: "❌ Could not parse that GitHub link." },
        { quoted: _0x586214 },
      );
    const [, _0x54d7c6, _0x415a26] = _0x9ddb2c,
      _0x4300f3 = _0x415a26["replace"](/\.git$/, "")["replace"](/\/$/, ""),
      _0x50f2b8 =
        "https://api.github.com/repos/" +
        _0x54d7c6 +
        "/" +
        _0x4300f3 +
        "/zipball";
    try {
      const _0x1b2b51 = await axios["head"](_0x50f2b8, {
          headers: { "User-Agent": "MARCO X WAQAR MD BOT" },
          maxRedirects: 0x5,
        }),
        _0x51b298 = _0x1b2b51["headers"]["content-disposition"],
        _0x1e6f54 = _0x51b298?.["match"](/attachment; filename=(.*)/),
        _0x2e46e6 = _0x1e6f54 ? _0x1e6f54[0x1] : _0x54d7c6 + "-" + _0x4300f3;
      await _0x562169["sendMessage"](
        _0x33608d,
        {
          document: { url: _0x50f2b8 },
          fileName: _0x2e46e6 + ".zip",
          mimetype: "application/zip",
        },
        { quoted: _0x586214 },
      );
    } catch (_0x55dc81) {
      (console["error"]("[GITCLONE ERROR]", _0x55dc81),
        await _0x562169["sendMessage"](
          _0x33608d,
          {
            text: "❌ Could not fetch that repo. Check the link and try again.",
          },
          { quoted: _0x586214 },
        ));
    }
  },
};
