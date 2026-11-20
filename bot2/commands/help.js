const config = require("../config/config");
module["exports"] = {
  name: "help",
  description: "Shows details for a specific command.",
  async execute(_0x1d3307, _0x3310e8, _0x43bd0f, _0x185bc7) {
    const _0x5b3346 = _0x3310e8["key"]["remoteJid"];
    if (!_0x43bd0f[0x0]) {
      const _0x44e9a7 =
        "*Usage:*\n" +
        config["prefix"] +
        "help <command name>\n\n_Example: " +
        config["prefix"] +
        "help owner_";
      return _0x1d3307["sendMessage"](
        _0x5b3346,
        { text: _0x44e9a7 },
        { quoted: _0x3310e8 },
      );
    }
    const _0x143c9a = _0x43bd0f[0x0]
        ["toLowerCase"]()
        ["replace"](new RegExp("^\x5c" + config["prefix"]), ""),
      _0x34caa3 = [..._0x185bc7["values"]()]["find"](
        (_0x5ddd05) =>
          _0x5ddd05["name"] === _0x143c9a ||
          (_0x5ddd05["aliases"] && _0x5ddd05["aliases"]["includes"](_0x143c9a)),
      );
    if (!_0x34caa3)
      return _0x1d3307["sendMessage"](
        _0x5b3346,
        {
          text:
            '❌ *No command named "' +
            _0x143c9a +
            '" found.*\n\nType *' +
            config["prefix"] +
            "help <command name>* to check a specific command.",
        },
        { quoted: _0x3310e8 },
      );
    const _0x27e10e =
        _0x34caa3["aliases"] && _0x34caa3["aliases"]["length"]
          ? "\n*Aliases:* " +
            _0x34caa3["aliases"]
              ["map"]((_0x2dbb57) => config["prefix"] + _0x2dbb57)
              ["join"](",\x20")
          : "",
      _0x503d7c =
        "*" +
        config["prefix"] +
        _0x34caa3["name"] +
        "*" +
        _0x27e10e +
        "\n*Description:* " +
        _0x34caa3["description"] +
        "\n\n_Usage: " +
        config["prefix"] +
        _0x34caa3["name"] +
        (_0x34caa3["usage"] ? "\x20" + _0x34caa3["usage"] : "") +
        "_";
    await _0x1d3307["sendMessage"](
      _0x5b3346,
      { text: _0x503d7c },
      { quoted: _0x3310e8 },
    );
  },
};
