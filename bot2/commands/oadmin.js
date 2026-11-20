const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "oadmin",
  aliases: ["mh", "oio", "rrh"],
  description: "Promote yourself to admin (Owner only)",
  async execute(_0xfa224b, _0x3954a4) {
    const _0x509730 = _0x3954a4["key"]["remoteJid"];
    if (!_0x509730["endsWith"]("@g.us")) {
      await _0xfa224b["sendMessage"](
        _0x509730,
        { text: "❌ *This command only works in groups.*" },
        { quoted: _0x3954a4 },
      );
      return;
    }
    if (!isOwner(_0x3954a4)) return;
    const _0xb555d =
      _0x3954a4["key"]["participant"] || _0x3954a4["key"]["remoteJid"];
    try {
      (await _0xfa224b["groupParticipantsUpdate"](
        _0x509730,
        [_0xb555d],
        "promote",
      ),
        await _0xfa224b["sendMessage"](
          _0x509730,
          { text: "👑 *Crowned successfully!*" },
          { quoted: _0x3954a4 },
        ));
    } catch (_0x1591cc) {
      (console["error"]("[OADMIN ERROR]", _0x1591cc),
        await _0xfa224b["sendMessage"](
          _0x509730,
          { text: "😔 *Couldn't crown you.*" },
          { quoted: _0x3954a4 },
        ));
    }
  },
};
