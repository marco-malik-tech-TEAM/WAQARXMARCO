const config = require("../config/config"),
  settingsStore = require("../utils/settingsStore"),
  groupSettingsStore = require("../utils/groupSettingsStore");
function onOff(_0x38ab25) {
  return _0x38ab25 ? "✅ ON" : "❌ OFF";
}
module["exports"] = {
  name: "settings",
  description: "Shows the bot's current settings.",
  async execute(_0x4189e2, _0xffb9a9) {
    const _0x2ccc77 = _0xffb9a9["key"]["remoteJid"];
    let _0x179ac8 = ![],
      _0x39ccf1 = ![],
      _0x5cddd0 = "N/A",
      _0x19e9f6 = ![],
      _0x2f6909 = ![],
      _0x432108 = ![];
    _0x2ccc77["endsWith"]("@g.us") &&
      ((_0x179ac8 = groupSettingsStore["get"](_0x2ccc77, "antilink", ![])),
      (_0x39ccf1 = groupSettingsStore["get"](_0x2ccc77, "pdm", ![])),
      (_0x5cddd0 = groupSettingsStore["get"](_0x2ccc77, "antigm", "off")[
        "toUpperCase"
      ]()),
      (_0x19e9f6 = groupSettingsStore["get"](_0x2ccc77, "setgreet", ![])),
      (_0x2f6909 = groupSettingsStore["get"](_0x2ccc77, "chatbot", ![])),
      (_0x432108 =
        groupSettingsStore["get"](_0x2ccc77, "autoreact", "off") === "on"));
    const _0x341801 =
      "╔══════════════════════╗\n║     ⚙  BOT SETTINGS\n╚══════════════════════╝\n\n*🔒 Security*\n┣ AntiLink: " +
      onOff(_0x179ac8) +
      "\n┣ AntiGM: " +
      _0x5cddd0 +
      "\n┣ AntiLinkAll: " +
      onOff(settingsStore["get"]("antilinkall", ![])) +
      "\n┣ AntiDelete: " +
      onOff(settingsStore["get"]("antidelete", ![])) +
      "\n┣ AntiEdit: " +
      onOff(settingsStore["get"]("antiedit", ![])) +
      "\n┣ AntiCall: " +
      onOff(settingsStore["get"]("anticall", ![])) +
      "\n┣ AntiBot: " +
      onOff(settingsStore["get"]("antibot", ![])) +
      "\n┣ AntiTag: " +
      onOff(settingsStore["get"]("antitag", ![])) +
      "\n┗ BadWord: " +
      onOff(settingsStore["get"]("badword", ![])) +
      "\n\n*🤖 Automation*\n┣ AutoRead: " +
      onOff(settingsStore["get"]("autoread", ![])) +
      "\n┣ AutoLike: " +
      onOff(settingsStore["get"]("autolike", ![])) +
      "\n┣ AutoView: " +
      onOff(settingsStore["get"]("autoview", !![])) +
      "\n┣ AutoBio: " +
      onOff(settingsStore["get"]("autobio", ![])) +
      "\n┣ AutoRecording: " +
      onOff(settingsStore["get"]("autorecording", ![])) +
      "\n┣ AutoTyping: " +
      onOff(settingsStore["get"]("autotyping", ![])) +
      "\n┣ AutoReact (DM): " +
      onOff(settingsStore["get"]("autoreactDM", "off") === "on") +
      "\n┣ AutoReact (Group): " +
      onOff(_0x432108) +
      "\n┣ PDM: " +
      onOff(_0x39ccf1) +
      "\n┣ WelcomeGoodbye: " +
      onOff(settingsStore["get"]("welcomegoodbye", ![])) +
      "\n┣ SetGreet: " +
      onOff(_0x19e9f6) +
      "\n┣ Chatbot (DM): " +
      onOff(settingsStore["get"]("chatbotDM", ![])) +
      "\n┗ Chatbot (Group): " +
      onOff(_0x2f6909) +
      "\n\n*💬 Bot Behaviour*\n┣ Mode: 🌐 " +
      settingsStore["get"]("mode", "public")["toUpperCase"]() +
      "\n┣ Prefix: " +
      settingsStore["get"]("prefix", config["prefix"]) +
      "\n┣ MenuType: 📋 " +
      settingsStore["get"]("menutype", "list")["toUpperCase"]() +
      "\n┗ WAPresence: " +
      (settingsStore["get"]("wapresence", ![]) ? "🟢 ONLINE" : "🔴 OFFLINE");
    await _0x4189e2["sendMessage"](
      _0x2ccc77,
      { text: _0x341801 },
      { quoted: _0xffb9a9 },
    );
  },
};
