const axios = require("axios"),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE;
module["exports"] = {
  name: "claude",
  description: "Chat with Claude AI. Usage: .claude <question>",
  async execute(_0x227eb8, _0x265913, _0x46cda3) {
    const _0xbea54b = _0x265913["key"]["remoteJid"],
      _0x5cd290 = _0x46cda3["join"]("\x20")["trim"]();
    if (!_0x5cd290)
      return await _0x227eb8["sendMessage"](
        _0xbea54b,
        { text: "🤖 *CLAUDE AI*\n\nExample:\n.claude Tell me a joke" },
        { quoted: _0x265913 },
      );
    let _0x33d1f6;
    try {
      _0x33d1f6 = await _0x227eb8["sendMessage"](
        _0xbea54b,
        { text: "🤖 Claude is thinking..." },
        { quoted: _0x265913 },
      );
      const { data: _0x35075b } = await axios["get"](
        API + "/ai/gpt?q=" + encodeURIComponent(_0x5cd290),
      );
      if (!_0x35075b["status"] || !_0x35075b["result"])
        return await _0x227eb8["sendMessage"](_0xbea54b, {
          text: "❌ Claude couldn't generate a response.",
          edit: _0x33d1f6["key"],
        });
      const _0x2a9954 =
        typeof _0x35075b["result"] === "string"
          ? _0x35075b["result"]
          : _0x35075b["result"]["response"] ||
            _0x35075b["result"]["answer"] ||
            JSON["stringify"](_0x35075b["result"], null, 0x2);
      if (_0x2a9954["length"] <= 0xfa0)
        await _0x227eb8["sendMessage"](_0xbea54b, {
          text: "🤖 *CLAUDE AI*\n\n" + _0x2a9954,
          edit: _0x33d1f6["key"],
        });
      else {
        await _0x227eb8["sendMessage"](_0xbea54b, {
          text: "🤖 *CLAUDE AI*\n\n" + _0x2a9954["slice"](0x0, 0xfa0),
          edit: _0x33d1f6["key"],
        });
        for (
          let _0x28ec5e = 0xfa0;
          _0x28ec5e < _0x2a9954["length"];
          _0x28ec5e += 0xfa0
        ) {
          await _0x227eb8["sendMessage"](_0xbea54b, {
            text: _0x2a9954["slice"](_0x28ec5e, _0x28ec5e + 0xfa0),
          });
        }
      }
    } catch (_0x539da7) {
      (console["error"]("[CLAUDE ERROR]", _0x539da7),
        await _0x227eb8["sendMessage"](_0xbea54b, {
          text: "❌ Failed to get a response from Claude AI.",
          edit: _0x33d1f6?.["key"],
        }));
    }
  },
};
