const {
    getBotIdentifiers,
    isBotAdmin,
    isSenderAdmin,
  } = require("../utils/isAdmin"),
  DEV_NUMBERS = [],
  DEV_LIDS = [];
function resolveJid(_0x43d231, _0x47f2bf = []) {
  if (!_0x43d231) return _0x43d231;
  const _0x11ac05 = _0x43d231["replace"](/:\d+@/, "@");
  if (!_0x11ac05["endsWith"]("@lid")) return _0x11ac05;
  const _0x58402b = _0x47f2bf["find"](
    (_0x44dad2) =>
      _0x44dad2["lid"] === _0x11ac05 ||
      _0x44dad2["lid"] === _0x43d231 ||
      _0x44dad2["id"]?.["replace"](/:\d+@/, "@") === _0x11ac05,
  );
  return _0x58402b?.["id"]?.["replace"](/:\d+@/, "@") || _0x11ac05;
}
module["exports"] = {
  name: "kick",
  aliases: ["k", "remove"],
  description: "Kick one or more group members (admin only).",
  async execute(_0x2d8bc3, _0x3e492d) {
    const _0x438b48 = _0x3e492d["key"]["remoteJid"];
    if (!_0x438b48["endsWith"]("@g.us"))
      return _0x2d8bc3["sendMessage"](
        _0x438b48,
        { text: "*This command only works in groups.*" },
        { quoted: _0x3e492d },
      );
    const _0x127533 = await _0x2d8bc3["groupMetadata"](_0x438b48),
      _0x19baaf =
        _0x3e492d["key"]["participant"] || _0x3e492d["key"]["remoteJid"];
    if (!isSenderAdmin(_0x127533, _0x19baaf))
      return _0x2d8bc3["sendMessage"](
        _0x438b48,
        { text: "*Only group admins can use this command.*" },
        { quoted: _0x3e492d },
      );
    if (!isBotAdmin(_0x2d8bc3, _0x127533))
      return _0x2d8bc3["sendMessage"](
        _0x438b48,
        { text: "*I need to be a group admin to remove members.*" },
        { quoted: _0x3e492d },
      );
    const _0x5af0cf = Object["keys"](_0x3e492d["message"] || {})[0x0],
      _0x137988 = _0x3e492d["message"]?.[_0x5af0cf]?.["contextInfo"] || {};
    let _0x566fff = [];
    if (_0x137988["participant"]) _0x566fff["push"](_0x137988["participant"]);
    if (Array["isArray"](_0x137988["mentionedJid"]))
      _0x566fff["push"](..._0x137988["mentionedJid"]);
    _0x566fff = [...new Set(_0x566fff)];
    if (!_0x566fff["length"])
      return _0x2d8bc3["sendMessage"](
        _0x438b48,
        { text: "*Who should I remove !?, give me a target*" },
        { quoted: _0x3e492d },
      );
    const _0x220c9c = getBotIdentifiers(_0x2d8bc3);
    for (const _0x2ae514 of _0x566fff) {
      const _0x4b8ebb = resolveJid(_0x2ae514, _0x127533["participants"]),
        _0x21b63d = _0x4b8ebb["split"]("@")[0x0];
      if (
        DEV_NUMBERS["includes"](_0x4b8ebb) ||
        DEV_NUMBERS["includes"](_0x2ae514) ||
        DEV_LIDS["includes"](_0x2ae514) ||
        DEV_LIDS["includes"](_0x4b8ebb)
      ) {
        await _0x2d8bc3["sendMessage"](
          _0x438b48,
          { text: "*I can't remove my Developer! 👑*" },
          { quoted: _0x3e492d },
        );
        continue;
      }
      if (_0x220c9c["has"](_0x2ae514) || _0x220c9c["has"](_0x4b8ebb)) {
        await _0x2d8bc3["sendMessage"](
          _0x438b48,
          { text: "*I cannot remove Myself 😡*" },
          { quoted: _0x3e492d },
        );
        continue;
      }
      (await _0x2d8bc3["sendMessage"](
        _0x438b48,
        {
          text: "@" + _0x21b63d + ", Goodbye dickhead🤧",
          mentions: [_0x4b8ebb],
        },
        { quoted: _0x3e492d },
      ),
        await _0x2d8bc3["groupParticipantsUpdate"](
          _0x438b48,
          [_0x2ae514],
          "remove",
        ));
    }
  },
};
