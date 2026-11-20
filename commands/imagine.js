module["exports"] = {
  name: "imagine",
  aliases: ["createimage", "dalle"],
  description: "Generate AI image (dalle/imagine)",
  async execute(_0x2893d5, _0x1dc661, _0x349cf4) {
    const _0xb286d2 = _0x1dc661["key"]["remoteJid"],
      _0x48f47f = require("../config/config");
    let _0x209082 = _0x349cf4["join"]("\x20")["trim"]();
    if (!_0x209082)
      return await _0x2893d5["sendMessage"](
        _0xb286d2,
        {
          text:
            "Usage Example: " +
            _0x48f47f["prefix"] +
            "imagine beautiful anime girl in a forest\n\nFlags you can add:\n  --wide   → landscape (1024×576)\n  --tall   → portrait (576×1024)\n  --turbo  → faster, less detail\n\nDefault size is square (512×512)",
        },
        { quoted: _0x1dc661 },
      );
    try {
      await _0x2893d5["sendMessage"](
        _0xb286d2,
        { text: "🎨 Generating your image, please wait..." },
        { quoted: _0x1dc661 },
      );
      let _0x5e12e8 = 0x200,
        _0x7ea73c = 0x200,
        _0x278701 = "flux";
      _0x209082["includes"]("--wide") &&
        ((_0x5e12e8 = 0x400),
        (_0x7ea73c = 0x240),
        (_0x209082 = _0x209082["replace"]("--wide", "")["trim"]()));
      _0x209082["includes"]("--tall") &&
        ((_0x5e12e8 = 0x240),
        (_0x7ea73c = 0x400),
        (_0x209082 = _0x209082["replace"]("--tall", "")["trim"]()));
      _0x209082["includes"]("--turbo") &&
        ((_0x278701 = "turbo"),
        (_0x209082 = _0x209082["replace"]("--turbo", "")["trim"]()));
      const _0x80ff28 = Math["floor"](Math["random"]() * 0xf423f),
        _0x4a419e =
          "https://image.pollinations.ai/prompt/" +
          encodeURIComponent(_0x209082) +
          "?model=" +
          _0x278701 +
          "&width=" +
          _0x5e12e8 +
          "&height=" +
          _0x7ea73c +
          "&seed=" +
          _0x80ff28 +
          "&nologo=true&enhance=true",
        _0x2d6575 =
          "*Model:* " +
          (_0x278701 === "turbo" ? "Flux Turbo ⚡" : "Flux ✨") +
          "\n*Size:* " +
          _0x5e12e8 +
          "×" +
          _0x7ea73c +
          "px";
      await _0x2893d5["sendMessage"](
        _0xb286d2,
        { image: { url: _0x4a419e }, caption: _0x2d6575 },
        { quoted: _0x1dc661 },
      );
    } catch (_0x1d7dc9) {
      (console["error"]("[IMAGINE ERROR]", _0x1d7dc9),
        await _0x2893d5["sendMessage"](
          _0xb286d2,
          {
            text: "❌ Something went wrong generating the image. Try again later.",
          },
          { quoted: _0x1dc661 },
        ));
    }
  },
};
