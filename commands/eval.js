const config = require("../config/config"),
  apis = require("../config/apis"),
  { isDev } = require("../utils/isDev"),
  settingsStore = require("../utils/settingsStore"),
  util = require("util"),
  fs = require("fs"),
  path = require("path"),
  os = require("os"),
  axios = require("axios");
module["exports"] = {
  name: "eval",
  aliases: ["=>"],
  description:
    "Runs raw JavaScript for debugging (dev only). Shortcuts: .eval api | settings | uptime | version | commands | env",
  async execute(_0x3ebf6e, _0x3cbadb, _0x339e31, _0x4017ea) {
    const _0x4414c5 = _0x3cbadb["key"]["remoteJid"];
    if (!isDev(_0x3cbadb, _0x3ebf6e))
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        {
          text: "❌ Only the dev, ᴾᴬᴾᴾᴵ ᴵˢᴬᴬᶜ can execute this command dumbass.",
        },
        { quoted: _0x3cbadb },
      );
    const _0x4b836b = _0x339e31["join"]("\x20");
    if (!_0x4b836b)
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        { text: "❌ Provide code to run.\n\nUsage: *.eval 1 + 1*" },
        { quoted: _0x3cbadb },
      );
    const _0x119e65 = _0x339e31[0x0]?.["toLowerCase"]();
    if (_0x119e65 === "api")
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        { text: "🔗 *Current API:*\n" + JSON["stringify"](apis, null, 0x2) },
        { quoted: _0x3cbadb },
      );
    if (_0x119e65 === "settings")
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        {
          text:
            "⚙️ *Settings:*\n" +
            JSON["stringify"](settingsStore["getAll"](), null, 0x2),
        },
        { quoted: _0x3cbadb },
      );
    if (_0x119e65 === "uptime") {
      const _0x537d73 = process["uptime"](),
        _0x2ae3fd = Math["floor"](_0x537d73 / 0xe10),
        _0xe8950f = Math["floor"]((_0x537d73 % 0xe10) / 0x3c),
        _0x32dac1 = Math["floor"](_0x537d73 % 0x3c),
        _0x4898ee = process["memoryUsage"](),
        _0x3e229b =
          "⏱️ *Uptime:* " +
          _0x2ae3fd +
          "h\x20" +
          _0xe8950f +
          "m\x20" +
          _0x32dac1 +
          "s\n\n" +
          "💾 *Memory:*\n" +
          ("RSS: " +
            (_0x4898ee["rss"] / 0x400 / 0x400)["toFixed"](0x1) +
            " MB\n") +
          ("Heap Used: " +
            (_0x4898ee["heapUsed"] / 0x400 / 0x400)["toFixed"](0x1) +
            " MB\n") +
          ("Heap Total: " +
            (_0x4898ee["heapTotal"] / 0x400 / 0x400)["toFixed"](0x1) +
            " MB");
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        { text: _0x3e229b },
        { quoted: _0x3cbadb },
      );
    }
    if (_0x119e65 === "version") {
      let _0x50d5e2 = "unknown",
        _0x3c1830 = "unknown";
      try {
        _0x50d5e2 = require("@whiskeysockets/baileys/package.json")["version"];
      } catch {}
      try {
        _0x3c1830 = require("../package.json")["version"];
      } catch {}
      const _0x4a40d1 =
        "📦 *Versions:*\n" +
        ("Node.js: " + process["version"] + "\x0a") +
        ("Baileys: " + _0x50d5e2 + "\x0a") +
        ("MARCO X WAQAR MD BOT: " + _0x3c1830);
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        { text: _0x4a40d1 },
        { quoted: _0x3cbadb },
      );
    }
    if (_0x119e65 === "commands") {
      const _0x50e11c = new Set(_0x4017ea["values"]()),
        _0x2e0090 = [..._0x50e11c]
          ["map"]((_0xcf5a81) => _0xcf5a81["name"])
          ["sort"](),
        _0x7c0992 =
          "🔌 *Loaded Commands (" +
          _0x2e0090["length"] +
          "):*\n" +
          _0x2e0090["join"](",\x20");
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        {
          text:
            _0x7c0992["length"] > 0xfa0
              ? _0x7c0992["slice"](0x0, 0xfa0)
              : _0x7c0992,
        },
        { quoted: _0x3cbadb },
      );
    }
    if (_0x119e65 === "env") {
      const _0x41d23c = Object["keys"](process.env)["sort"]();
      return _0x3ebf6e["sendMessage"](
        _0x4414c5,
        {
          text:
            "🔑 *Environment Variable Names (" +
            _0x41d23c["length"] +
            "):*\n" +
            _0x41d23c["join"](",\x20"),
        },
        { quoted: _0x3cbadb },
      );
    }
    try {
      let _0x26126b;
      const _0x5ad974 = [
          "sock",
          "msg",
          "jid",
          "config",
          "apis",
          "commands",
          "settingsStore",
          "util",
          "fs",
          "path",
          "os",
          "axios",
          "process",
          "Buffer",
          "require",
          "JSON",
          "Math",
          "Date",
          "Promise",
          "Object",
          "Array",
          "String",
          "Number",
          "Boolean",
          "RegExp",
          "Map",
          "Set",
          "fetch",
          "console",
          "isDev",
        ],
        _0x5b3e82 = [
          _0x3ebf6e,
          _0x3cbadb,
          _0x4414c5,
          config,
          apis,
          _0x4017ea,
          settingsStore,
          util,
          fs,
          path,
          os,
          axios,
          process,
          Buffer,
          require,
          JSON,
          Math,
          Date,
          Promise,
          Object,
          Array,
          String,
          Number,
          Boolean,
          RegExp,
          Map,
          Set,
          fetch,
          console,
          isDev,
        ];
      if (_0x4b836b["includes"]("await")) {
        const _0x528f6a = Object["getPrototypeOf"](async function () {})[
            "constructor"
          ],
          _0x1e35db = new _0x528f6a(..._0x5ad974, "return " + _0x4b836b);
        _0x26126b = await _0x1e35db(..._0x5b3e82);
      } else {
        const _0xc1cb77 = new Function(..._0x5ad974, "return " + _0x4b836b);
        _0x26126b = _0xc1cb77(..._0x5b3e82);
      }
      typeof _0x26126b !== "string" &&
        (_0x26126b = util["inspect"](_0x26126b, { depth: 0x2 }));
      if (_0x26126b["length"] <= 0xfa0)
        await _0x3ebf6e["sendMessage"](
          _0x4414c5,
          { text: _0x26126b },
          { quoted: _0x3cbadb },
        );
      else {
        await _0x3ebf6e["sendMessage"](
          _0x4414c5,
          { text: _0x26126b["slice"](0x0, 0xfa0) },
          { quoted: _0x3cbadb },
        );
        for (
          let _0x43f5dd = 0xfa0;
          _0x43f5dd < _0x26126b["length"];
          _0x43f5dd += 0xfa0
        ) {
          await _0x3ebf6e["sendMessage"](_0x4414c5, {
            text: _0x26126b["slice"](_0x43f5dd, _0x43f5dd + 0xfa0),
          });
        }
      }
    } catch (_0x46aeb8) {
      await _0x3ebf6e["sendMessage"](
        _0x4414c5,
        { text: "⚠️ " + _0x46aeb8["message"] },
        { quoted: _0x3cbadb },
      );
    }
  },
};
