const axios = require("axios");
function formatUptime(_0x207d07) {
  const _0x10958c = Math["floor"](_0x207d07 / 0x15180),
    _0x436b7b = Math["floor"]((_0x207d07 % 0x15180) / 0xe10),
    _0xa607a7 = Math["floor"]((_0x207d07 % 0xe10) / 0x3c),
    _0x448f8b = Math["floor"](_0x207d07 % 0x3c);
  return (
    _0x10958c +
    "d\x20" +
    _0x436b7b +
    "h\x20" +
    _0xa607a7 +
    "m\x20" +
    _0x448f8b +
    "s"
  );
}
module["exports"] = {
  name: "runtime",
  aliases: ["stats"],
  description: "Check bot runtime with rich card",
  async execute(_0x27a51f, _0xb3a8dd, _0x1eeca2) {
    const _0x1f456d = _0xb3a8dd["key"]["remoteJid"],
      _0x285ef1 =
        "𝗠𝗔𝗥𝗖𝗢 𝗫 𝗪𝗔𝗤𝗔𝗥 𝗠𝗗 𝗕𝗢𝗧 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 𝘀𝗶𝗻𝗰𝗲 " + formatUptime(process["uptime"]());
    let _0x2f34f1;
    try {
      _0x2f34f1 = require("fs")["readFileSync"](
        require("path")["join"](__dirname, "../assets/thumb.jpg"),
      );
    } catch (_0x8ac620) {
      _0x2f34f1 = undefined;
    }
    await _0x27a51f["sendMessage"](
      _0x1f456d,
      {
        text: _0x285ef1,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: !![],
            title: "MARCO X WAQAR MD BOT",
            body: "https://whatsapp.com/channel/0029VbE1PSOGzzKS8DCvLM32",
            thumbnail: _0x2f34f1,
            sourceUrl: "https://whatsapp.com/channel/0029VbE1PSOGzzKS8DCvLM32",
            mediaType: 0x1,
            renderLargerThumbnail: !![],
          },
        },
      },
      { quoted: _0xb3a8dd },
    );
  },
};
