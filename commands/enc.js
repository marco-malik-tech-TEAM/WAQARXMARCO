const { isOwner } = require("../utils/isOwner"),
  { isSudo } = require("../utils/isSudo");
module["exports"] = {
  name: "enc",
  aliases: ["encrypte"],
  description:
    "Obfuscate/encrypt JavaScript code. Quote a message containing JS code with .enc",
  async execute(_0x361b76, _0x3c1acb) {
    const _0x224aed = _0x3c1acb["key"]["remoteJid"];
    if (!isOwner(_0x3c1acb) && !isSudo(_0x3c1acb))
      return _0x361b76["sendMessage"](
        _0x224aed,
        { text: "*Command meant for the owner*" },
        { quoted: _0x3c1acb },
      );
    const _0x20d7f6 =
        _0x3c1acb["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x2fe1ff = _0x20d7f6?.["quotedMessage"],
      _0x23e41 =
        _0x2fe1ff?.["conversation"] ||
        _0x2fe1ff?.["extendedTextMessage"]?.["text"] ||
        "";
    if (!_0x23e41)
      return _0x361b76["sendMessage"](
        _0x224aed,
        { text: "Quote/Tag a valid JavaScript code to encrypt!" },
        { quoted: _0x3c1acb },
      );
    try {
      const _0x318f4 = require("javascript-obfuscator"),
        _0x2c60cc = _0x318f4["obfuscate"](_0x23e41, {
          compact: !![],
          controlFlowFlattening: !![],
          controlFlowFlatteningThreshold: 0x1,
          numbersToExpressions: !![],
          simplify: !![],
          stringArrayShuffle: !![],
          splitStrings: !![],
          stringArrayThreshold: 0x1,
        });
      await _0x361b76["sendMessage"](
        _0x224aed,
        { text: _0x2c60cc["getObfuscatedCode"]() },
        { quoted: _0x3c1acb },
      );
    } catch (_0x577782) {
      (console["error"]("[ENC ERROR]", _0x577782["message"]),
        await _0x361b76["sendMessage"](
          _0x224aed,
          { text: "❌ Obfuscation failed: " + _0x577782["message"] },
          { quoted: _0x3c1acb },
        ));
    }
  },
};
