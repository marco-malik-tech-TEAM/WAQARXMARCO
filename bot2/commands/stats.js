const os = require("os"),
  config = require("../config/config");
module["exports"] = {
  name: "stats",
  description: "Displays detailed bot statistics.",
  async execute(_0x12790e, _0x40c8ec, _0x2327fb) {
    try {
      const _0x7b7d8f = _0x40c8ec["key"]["remoteJid"],
        _0x161b1a = process["uptime"](),
        _0x4d85bf = Math["floor"](_0x161b1a / 0xe10),
        _0xb6bb6e = Math["floor"]((_0x161b1a % 0xe10) / 0x3c),
        _0x598477 = Math["floor"](_0x161b1a % 0x3c),
        _0x2adf63 = (process["memoryUsage"]()["rss"] / 0x400 / 0x400)[
          "toFixed"
        ](0x2),
        _0x34b8e0 = "ARM Cortex-A75 + Cortex-A55",
        _0x395de7 = 0x8,
        _0x381fb7 = os["arch"](),
        _0x760e6 = (os["totalmem"]() / 0x400 / 0x400 / 0x400)["toFixed"](0x2),
        _0x59d97a = (os["freemem"]() / 0x400 / 0x400 / 0x400)["toFixed"](0x2),
        _0x19a3cc = os["type"]() + "\x20" + os["release"](),
        _0x2feae6 = process["version"],
        _0x19eab1 = new Date(),
        _0x3488ea = new Intl["DateTimeFormat"]("en-US", {
          timeZone: config["timezone"],
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: !![],
        })["format"](_0x19eab1),
        _0x3fb8f1 = new Intl["DateTimeFormat"]("en-GB", {
          timeZone: config["timezone"],
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })["format"](_0x19eab1),
        _0x4b7bf3 =
          ("\n📊 *BOT STATISTICS*\n\n🤖 *Bot:* MARCO X WAQAR\n🟢 *Status:* Online\n\n⏱ *Uptime:* " +
            _0x4d85bf +
            "h\x20" +
            _0xb6bb6e +
            "m\x20" +
            _0x598477 +
            "s\n💾 *RAM Used:* " +
            _0x2adf63 +
            " MB\n🧠 *Total RAM:* " +
            _0x760e6 +
            " GB\n📉 *Free RAM:* " +
            _0x59d97a +
            " GB\n\n🖥 *CPU:* " +
            _0x34b8e0 +
            "\n⚙️ *Cores:* " +
            _0x395de7 +
            "\n🏗 *Architecture:* " +
            _0x381fb7 +
            "\n\n🌐 *System:* " +
            _0x19a3cc +
            "\n🟩 *Node.js:* " +
            _0x2feae6 +
            "\n\n📅 *Date:* " +
            _0x3fb8f1 +
            "\n🕒 *Time:* " +
            _0x3488ea +
            "\x0a")["trim"]();
      await _0x12790e["sendMessage"](
        _0x7b7d8f,
        { text: _0x4b7bf3 },
        { quoted: _0x40c8ec },
      );
    } catch (_0x1a7f3c) {
      (console["error"]("Stats command error:", _0x1a7f3c),
        await _0x12790e["sendMessage"](
          _0x40c8ec["key"]["remoteJid"],
          { text: "❌ Error: " + _0x1a7f3c["message"] },
          { quoted: _0x40c8ec },
        ));
    }
  },
};
