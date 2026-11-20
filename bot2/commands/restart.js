const { isOwner } = require("../utils/isOwner");
module["exports"] = {
  name: "restart",
  aliases: ["reboot", "boot"],
  description: "Restarts the bot process (owner only).",
  async execute(_0x172f25, _0x16d0f2) {
    const _0xcef9d9 = _0x16d0f2["key"]["remoteJid"];
    if (!isOwner(_0x16d0f2))
      return _0x172f25["sendMessage"](
        _0xcef9d9,
        { text: "*❌ Are you my owner ?.*" },
        { quoted: _0x16d0f2 },
      );
    (await _0x172f25["sendMessage"](
      _0xcef9d9,
      { text: "*🔄 System reboot initiated, Restarting bot....*" },
      { quoted: _0x16d0f2 },
    ),
      setTimeout(() => process["exit"](0x0), 0x3e8));
  },
};
