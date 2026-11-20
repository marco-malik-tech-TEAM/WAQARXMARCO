const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "playersearch",
  description: "Search for a football player. Usage: .playersearch Bukayo Saka",
  async execute(_0xf55b13, _0x5d792f, _0x46ae20) {
    const _0x5b6674 = _0x5d792f["key"]["remoteJid"],
      _0x21bd1c = _0x46ae20["join"]("\x20")["trim"]();
    if (!_0x21bd1c)
      return _0xf55b13["sendMessage"](
        _0x5b6674,
        { text: "⚽ *PLAYER SEARCH*\n\nExample:\n.playersearch Bukayo Saka" },
        { quoted: _0x5d792f },
      );
    let _0xdd29f;
    try {
      _0xdd29f = await _0xf55b13["sendMessage"](
        _0x5b6674,
        { text: "🔍 Searching for player..." },
        { quoted: _0x5d792f },
      );
      const { data: _0x4ee4dc } = await axios["get"](
        KEITH_BASE + "/sport/playersearch?q=" + encodeURIComponent(_0x21bd1c),
      );
      if (!_0x4ee4dc["status"] || !_0x4ee4dc["result"])
        return _0xf55b13["sendMessage"](_0x5b6674, {
          text: "❌ Player not found.",
          edit: _0xdd29f["key"],
        });
      const _0x25b8ac = Array["isArray"](_0x4ee4dc["result"])
        ? _0x4ee4dc["result"][0x0]
        : _0x4ee4dc["result"];
      let _0x33ddbf = "⚽ *PLAYER INFORMATION*\n\n";
      if (_0x25b8ac["name"])
        _0x33ddbf += "👤 *Name:* " + _0x25b8ac["name"] + "\x0a";
      if (_0x25b8ac["fullName"])
        _0x33ddbf += "📝 *Full Name:* " + _0x25b8ac["fullName"] + "\x0a";
      if (_0x25b8ac["team"])
        _0x33ddbf += "🏟️ *Club:* " + _0x25b8ac["team"] + "\x0a";
      if (_0x25b8ac["country"])
        _0x33ddbf += "🌍 *Country:* " + _0x25b8ac["country"] + "\x0a";
      if (_0x25b8ac["nationality"])
        _0x33ddbf += "🌎 *Nationality:* " + _0x25b8ac["nationality"] + "\x0a";
      if (_0x25b8ac["position"])
        _0x33ddbf += "🎯 *Position:* " + _0x25b8ac["position"] + "\x0a";
      if (_0x25b8ac["age"])
        _0x33ddbf += "🎂 *Age:* " + _0x25b8ac["age"] + "\x0a";
      if (_0x25b8ac["height"])
        _0x33ddbf += "📏 *Height:* " + _0x25b8ac["height"] + "\x0a";
      if (_0x25b8ac["weight"])
        _0x33ddbf += "⚖️ *Weight:* " + _0x25b8ac["weight"] + "\x0a";
      if (_0x25b8ac["number"])
        _0x33ddbf += "🔢 *Shirt:* " + _0x25b8ac["number"] + "\x0a";
      if (_0x25b8ac["foot"])
        _0x33ddbf += "🦶 *Preferred Foot:* " + _0x25b8ac["foot"] + "\x0a";
      if (_0x25b8ac["value"])
        _0x33ddbf += "💰 *Market Value:* " + _0x25b8ac["value"] + "\x0a";
      _0x25b8ac["photo"] || _0x25b8ac["image"]
        ? await _0xf55b13["sendMessage"](_0x5b6674, {
            image: { url: _0x25b8ac["photo"] || _0x25b8ac["image"] },
            caption: _0x33ddbf,
            edit: _0xdd29f["key"],
          })
        : await _0xf55b13["sendMessage"](_0x5b6674, {
            text: _0x33ddbf,
            edit: _0xdd29f["key"],
          });
    } catch (_0x45e191) {
      (console["error"]("[PLAYERSEARCH ERROR]", _0x45e191),
        await _0xf55b13["sendMessage"](_0x5b6674, {
          text: "❌ Failed to search player.",
          edit: _0xdd29f?.["key"],
        }));
    }
  },
};
