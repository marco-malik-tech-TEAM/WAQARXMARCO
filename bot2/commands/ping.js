const REACTION_SEQUENCE = [
    "🤕",
    "😂",
    "👀",
    "🔥",
    "😈",
    "🌚",
    "💀",
    "🖕",
    "⚡",
    "😡",
    "🤬",
    "🐛",
    "✅",
  ],
  REACTION_DELAY_MS = 0x50;
function delay(_0x5dd1a6) {
  return new Promise((_0x5784a0) => setTimeout(_0x5784a0, _0x5dd1a6));
}
async function react(_0x2cfb6d, _0x10c61a, _0x12d907) {
  await _0x2cfb6d["sendMessage"](_0x10c61a["key"]["remoteJid"], {
    react: { text: _0x12d907, key: _0x10c61a["key"] },
  });
}
module["exports"] = {
  name: "ping",
  aliases: ["speed"],
  description: "Shows bot response speed.",
  async execute(_0x1b5ebc, _0x23196f, _0x3a9ee6) {
    const _0x503b5e = _0x23196f["key"]["remoteJid"],
      _0x405baf =
        _0x503b5e["endsWith"]("@lid") && _0x23196f["key"]["senderPn"]
          ? _0x23196f["key"]["senderPn"]
          : _0x503b5e,
      _0x15d552 = process["hrtime"]["bigint"](),
      _0x2ff78c = (async () => {
        for (const _0xe63974 of REACTION_SEQUENCE) {
          (await react(_0x1b5ebc, _0x23196f, _0xe63974),
            await delay(REACTION_DELAY_MS));
        }
        await react(_0x1b5ebc, _0x23196f, "");
      })(),
      _0x1d6b94 = !![];
    let _0x58120e;
    try {
      _0x58120e = await _0x1b5ebc["sendMessage"](
        _0x405baf,
        { text: "𝗣𝗶𝗻𝗴𝗶𝗻𝗴..." },
        { quoted: _0x23196f },
      );
    } catch (_0x5d9f8f) {
      console["error"]("[ping] Failed to send placeholder message:", _0x5d9f8f);
      return;
    }
    const _0x31be65 = process["hrtime"]["bigint"](),
      _0x55b95b = (Number(_0x31be65 - _0x15d552) / 0xf4240)["toFixed"](0x4),
      _0x38dee4 = process["uptime"](),
      _0x16a7f0 = Math["floor"](_0x38dee4 / 0xe10),
      _0x155f3e = Math["floor"]((_0x38dee4 % 0xe10) / 0x3c),
      _0x54874f = Math["floor"](_0x38dee4 % 0x3c),
      _0x1adde3 = _0x16a7f0 + "h\x20" + _0x155f3e + "m\x20" + _0x54874f + "s",
      _0x18e14e =
        "╭─❖ *P O N G !* ❖─╮\n│\n│  😡 *Speed:*  " +
        _0x55b95b +
        " ms\n│  ⏱️ *Uptime:*  " +
        _0x1adde3 +
        "\n│  🖥️ *Status:*  Online ✅\n│\n╰────────────────╯";
    if (_0x1d6b94)
      try {
        await _0x1b5ebc["sendMessage"](_0x405baf, {
          text: _0x18e14e,
          edit: _0x58120e["key"],
        });
      } catch (_0xab04e7) {
        (console["error"](
          "[ping] Edit failed, falling back to new message:",
          _0xab04e7,
        ),
          await _0x1b5ebc["sendMessage"](
            _0x405baf,
            { text: _0x18e14e },
            { quoted: _0x23196f },
          ));
      }
    else
      try {
        await _0x1b5ebc["sendMessage"](
          _0x405baf,
          { text: _0x18e14e },
          { quoted: _0x23196f },
        );
      } catch (_0x26a65f) {
        console["error"]("[ping] Failed to send final message:", _0x26a65f);
      }
    await _0x2ff78c;
  },
};
