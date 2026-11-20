const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "blocklist",
  description: "Show blocked contacts (owner only)",
  async execute(_0x2f8c21, _0x2e9ae4) {
    const _0x5e851b = _0x2e9ae4["key"]["remoteJid"];
    if (!isOwner(_0x2e9ae4))
      return _0x2f8c21["sendMessage"](
        _0x5e851b,
        { text: "❌ *Only the bot owner can use this command.*" },
        { quoted: _0x2e9ae4 },
      );
    try {
      const _0x5171d9 = await _0x2f8c21["fetchBlocklist"]();
      if (!_0x5171d9 || _0x5171d9["length"] === 0x0)
        return _0x2f8c21["sendMessage"](
          _0x5e851b,
          { text: "*You have no blocked contacts.*" },
          { quoted: _0x2e9ae4 },
        );
      let _0x4220c6 = "*Blocked Contacts (" + _0x5171d9["length"] + ")*\n\n";
      (_0x5171d9["forEach"]((_0x5f22ee, _0x5d9d20) => {
        _0x4220c6 +=
          _0x5d9d20 + 0x1 + ". +" + _0x5f22ee["replace"](/@.+/, "") + "\x0a";
      }),
        await _0x2f8c21["sendMessage"](
          _0x5e851b,
          { text: _0x4220c6["trim"]() },
          { quoted: _0x2e9ae4 },
        ));
    } catch (_0x11e493) {
      await _0x2f8c21["sendMessage"](
        _0x5e851b,
        { text: "❌ *Error fetching blocklist: " + _0x11e493["message"] + "*" },
        { quoted: _0x2e9ae4 },
      );
    }
  },
};
