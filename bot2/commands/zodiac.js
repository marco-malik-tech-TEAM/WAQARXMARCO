module["exports"] = {
  name: "zodiac",
  description: "Get zodiac sign by birth month and day",
  async execute(_0x1da3fa, _0x243e1a, _0x2b3bd7) {
    const _0x2fdb8e = _0x243e1a["key"]["remoteJid"];
    if (
      _0x2b3bd7["length"] !== 0x2 ||
      isNaN(_0x2b3bd7[0x0]) ||
      isNaN(_0x2b3bd7[0x1])
    )
      return await _0x1da3fa["sendMessage"](
        _0x2fdb8e,
        {
          text: "Please provide your birth month and date\n*Example:* .zodiac 8 23 (for August 23)",
        },
        { quoted: _0x243e1a },
      );
    const _0x31c62f = parseInt(_0x2b3bd7[0x0], 0xa),
      _0x559441 = parseInt(_0x2b3bd7[0x1], 0xa);
    if (
      _0x31c62f < 0x1 ||
      _0x31c62f > 0xc ||
      _0x559441 < 0x1 ||
      _0x559441 > 0x1f
    )
      return await _0x1da3fa["sendMessage"](
        _0x2fdb8e,
        { text: "Invalid date. Please check your month (1-12) and day (1-31)" },
        { quoted: _0x243e1a },
      );
    let _0x96f38c = "",
      _0x33ad10 = "";
    if (
      (_0x31c62f === 0x3 && _0x559441 >= 0x15) ||
      (_0x31c62f === 0x4 && _0x559441 <= 0x13)
    )
      ((_0x96f38c = "Aries"),
        (_0x33ad10 =
          "Adventurous, energetic, courageous, enthusiastic, confident, dynamic, quick-witted"));
    else {
      if (
        (_0x31c62f === 0x4 && _0x559441 >= 0x14) ||
        (_0x31c62f === 0x5 && _0x559441 <= 0x14)
      )
        ((_0x96f38c = "Taurus"),
          (_0x33ad10 =
            "Patient, reliable, warmhearted, loving, persistent, determined, placid, security loving"));
      else {
        if (
          (_0x31c62f === 0x5 && _0x559441 >= 0x15) ||
          (_0x31c62f === 0x6 && _0x559441 <= 0x14)
        )
          ((_0x96f38c = "Gemini"),
            (_0x33ad10 =
              "Adaptable, versatile, communicative, witty, intellectual, eloquent, youthful, lively"));
        else {
          if (
            (_0x31c62f === 0x6 && _0x559441 >= 0x15) ||
            (_0x31c62f === 0x7 && _0x559441 <= 0x16)
          )
            ((_0x96f38c = "Cancer"),
              (_0x33ad10 =
                "Emotional, loving, intuitive, imaginative, shrewd, cautious, protective, sympathetic"));
          else {
            if (
              (_0x31c62f === 0x7 && _0x559441 >= 0x17) ||
              (_0x31c62f === 0x8 && _0x559441 <= 0x16)
            )
              ((_0x96f38c = "Leo"),
                (_0x33ad10 =
                  "Generous, warmhearted, creative, enthusiastic, broad-minded, expansive, faithful, loving"));
            else {
              if (
                (_0x31c62f === 0x8 && _0x559441 >= 0x17) ||
                (_0x31c62f === 0x9 && _0x559441 <= 0x16)
              )
                ((_0x96f38c = "Virgo"),
                  (_0x33ad10 =
                    "Modest, shy, meticulous, reliable, practical, diligent, intelligent, analytical"));
              else {
                if (
                  (_0x31c62f === 0x9 && _0x559441 >= 0x17) ||
                  (_0x31c62f === 0xa && _0x559441 <= 0x16)
                )
                  ((_0x96f38c = "Libra"),
                    (_0x33ad10 =
                      "Diplomatic, urbane, romantic, charming, easygoing, sociable, idealistic, peaceable"));
                else {
                  if (
                    (_0x31c62f === 0xa && _0x559441 >= 0x17) ||
                    (_0x31c62f === 0xb && _0x559441 <= 0x15)
                  )
                    ((_0x96f38c = "Scorpio"),
                      (_0x33ad10 =
                        "Determined, forceful, emotional, intuitive, powerful, passionate, exciting, magnetic"));
                  else {
                    if (
                      (_0x31c62f === 0xb && _0x559441 >= 0x16) ||
                      (_0x31c62f === 0xc && _0x559441 <= 0x15)
                    )
                      ((_0x96f38c = "Sagittarius"),
                        (_0x33ad10 =
                          "Optimistic, freedom-loving, jovial, good-humored, honest, straightforward, intellectual"));
                    else {
                      if (
                        (_0x31c62f === 0xc && _0x559441 >= 0x16) ||
                        (_0x31c62f === 0x1 && _0x559441 <= 0x13)
                      )
                        ((_0x96f38c = "Capricorn"),
                          (_0x33ad10 =
                            "Practical, prudent, ambitious, disciplined, patient, careful, humorous, reserved"));
                      else {
                        if (
                          (_0x31c62f === 0x1 && _0x559441 >= 0x14) ||
                          (_0x31c62f === 0x2 && _0x559441 <= 0x12)
                        )
                          ((_0x96f38c = "Aquarius"),
                            (_0x33ad10 =
                              "Friendly, humanitarian, honest, loyal, original, inventive, independent, intellectual"));
                        else {
                          if (
                            (_0x31c62f === 0x2 && _0x559441 >= 0x13) ||
                            (_0x31c62f === 0x3 && _0x559441 <= 0x14)
                          )
                            ((_0x96f38c = "Pisces"),
                              (_0x33ad10 =
                                "Imaginative, sensitive, compassionate, kind, selfless, unworldly, intuitive, sympathetic"));
                          else
                            return await _0x1da3fa["sendMessage"](
                              _0x2fdb8e,
                              {
                                text: "Could not determine zodiac sign. Please check your birth date.",
                              },
                              { quoted: _0x243e1a },
                            );
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    const _0x5db490 =
        _0x243e1a["key"]["participant"] || _0x243e1a["key"]["remoteJid"],
      _0x191891 = _0x243e1a["pushName"] || _0x5db490["split"]("@")[0x0],
      _0x513079 =
        "*Zodiac Sign*\n\n" +
        ("*Birth Date:* " + _0x31c62f + "/" + _0x559441 + "\x0a") +
        ("*Sign:* " + _0x96f38c + "\x0a") +
        ("*Traits:* " + _0x33ad10 + "\x0a\x0a") +
        ("_Requested by " + _0x191891 + "_");
    await _0x1da3fa["sendMessage"](
      _0x2fdb8e,
      { text: _0x513079 },
      { quoted: _0x243e1a },
    );
  },
};
