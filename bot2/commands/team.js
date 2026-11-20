const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis");
module["exports"] = {
  name: "teamsearch",
  description: "Search for a football team. Usage: .teamsearch Arsenal",
  async execute(_0x453cad, _0x573436, _0x156702) {
    const _0x591cc6 = _0x573436["key"]["remoteJid"],
      _0x45df4d = _0x156702["join"]("\x20")["trim"]();
    if (!_0x45df4d)
      return _0x453cad["sendMessage"](
        _0x591cc6,
        { text: "⚽ *TEAM SEARCH*\n\nExample:\n.teamsearch Arsenal" },
        { quoted: _0x573436 },
      );
    let _0xea8741;
    try {
      _0xea8741 = await _0x453cad["sendMessage"](
        _0x591cc6,
        { text: "🔍 Searching for team..." },
        { quoted: _0x573436 },
      );
      const { data: _0xf1ae0a } = await axios["get"](
        KEITH_BASE + "/sport/teamsearch?q=" + encodeURIComponent(_0x45df4d),
      );
      if (!_0xf1ae0a["status"] || !_0xf1ae0a["result"])
        return _0x453cad["sendMessage"](_0x591cc6, {
          text: "❌ Team not found.",
          edit: _0xea8741["key"],
        });
      const _0x4300e = Array["isArray"](_0xf1ae0a["result"])
        ? _0xf1ae0a["result"][0x0]
        : _0xf1ae0a["result"];
      let _0x5b201a = "⚽ *TEAM INFORMATION*\n\n";
      if (_0x4300e["name"])
        _0x5b201a += "🏟️ *Name:* " + _0x4300e["name"] + "\x0a";
      if (_0x4300e["country"])
        _0x5b201a += "🌍 *Country:* " + _0x4300e["country"] + "\x0a";
      if (_0x4300e["league"])
        _0x5b201a += "🏆 *League:* " + _0x4300e["league"] + "\x0a";
      if (_0x4300e["founded"])
        _0x5b201a += "📅 *Founded:* " + _0x4300e["founded"] + "\x0a";
      if (_0x4300e["stadium"])
        _0x5b201a += "🏟️ *Stadium:* " + _0x4300e["stadium"] + "\x0a";
      if (_0x4300e["coach"])
        _0x5b201a += "👔 *Coach:* " + _0x4300e["coach"] + "\x0a";
      if (_0x4300e["website"])
        _0x5b201a += "🌐 *Website:* " + _0x4300e["website"] + "\x0a";
      _0x4300e["logo"]
        ? await _0x453cad["sendMessage"](_0x591cc6, {
            image: { url: _0x4300e["logo"] },
            caption: _0x5b201a,
            edit: _0xea8741["key"],
          })
        : await _0x453cad["sendMessage"](_0x591cc6, {
            text: _0x5b201a,
            edit: _0xea8741["key"],
          });
    } catch (_0x20e6bd) {
      (console["error"]("[TEAMSEARCH ERROR]", _0x20e6bd),
        await _0x453cad["sendMessage"](_0x591cc6, {
          text: "❌ Failed to search team.",
          edit: _0xea8741?.["key"],
        }));
    }
  },
};
