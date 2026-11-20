const { isBotAdmin, getBotIdentifiers } = require("../utils/isAdmin"),
  { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "kill",
  description: "Removes all members from the group (owner only, destructive).",
  async execute(_0x423ec9, _0x5e1c68, _0x45f7af) {
    const _0x418cf5 = _0x5e1c68["key"]["remoteJid"];
    if (!_0x418cf5["endsWith"]("@g.us"))
      return _0x423ec9["sendMessage"](
        _0x418cf5,
        { text: "❌ This command only works in groups." },
        { quoted: _0x5e1c68 },
      );
    if (!isOwner(_0x5e1c68))
      return _0x423ec9["sendMessage"](
        _0x418cf5,
        { text: "❌ Only the bot owner can use this command." },
        { quoted: _0x5e1c68 },
      );
    const _0x4b1e9c = await _0x423ec9["groupMetadata"](_0x418cf5),
      _0x37405d =
        _0x5e1c68["key"]["participant"] || _0x5e1c68["key"]["remoteJid"];
    if (!isBotAdmin(_0x423ec9, _0x4b1e9c))
      return _0x423ec9["sendMessage"](
        _0x418cf5,
        { text: "❌ I need to be a group admin to remove members." },
        { quoted: _0x5e1c68 },
      );
    if (_0x45f7af[0x0] !== "ok")
      return _0x423ec9["sendMessage"](
        _0x418cf5,
        {
          text:
            "⚠️ *DANGER ZONE* ⚠️\n\n" +
            "Listen up human, this will remove *every other member* from this group. This action is irreversible.\n\n" +
            "If you are absolutely sure, type:\n*.kill ok*",
        },
        { quoted: _0x5e1c68 },
      );
    const _0x137f46 = getBotIdentifiers(_0x423ec9),
      _0x1f489d = _0x4b1e9c["participants"]
        ["map"]((_0x4108ec) => _0x4108ec["id"])
        [
          "filter"
        ]((_0x458aa2) => !_0x137f46["has"](_0x458aa2) && _0x458aa2 !== _0x37405d);
    if (_0x1f489d["length"] === 0x0)
      return _0x423ec9["sendMessage"](
        _0x418cf5,
        { text: "ℹ️ No other members to remove." },
        { quoted: _0x5e1c68 },
      );
    await _0x423ec9["sendMessage"](
      _0x418cf5,
      { text: "💀 Removing " + _0x1f489d["length"] + " member(s)..." },
      { quoted: _0x5e1c68 },
    );
    let _0x42662a = 0x0,
      _0x5ca4f9 = 0x0;
    const _0x227335 = 0x1e;
    for (
      let _0x130bb2 = 0x0;
      _0x130bb2 < _0x1f489d["length"];
      _0x130bb2 += _0x227335
    ) {
      const _0x245e87 = _0x1f489d["slice"](_0x130bb2, _0x130bb2 + _0x227335);
      try {
        (await _0x423ec9["groupParticipantsUpdate"](
          _0x418cf5,
          _0x245e87,
          "remove",
        ),
          (_0x42662a += _0x245e87["length"]));
      } catch (_0x2210e7) {
        _0x5ca4f9 += _0x245e87["length"];
      }
      await new Promise((_0x4e8732) => setTimeout(_0x4e8732, 0x5dc));
    }
    await _0x423ec9["sendMessage"](
      _0x418cf5,
      { text: "✅ Done.\nRemoved: " + _0x42662a + "\nFailed: " + _0x5ca4f9 },
      { quoted: _0x5e1c68 },
    );
  },
};
