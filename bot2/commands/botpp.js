const axios = require("axios"),
  fs = require("fs"),
  path = require("path"),
  { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { isOwner } = require("../utils/isOwner"),
  settingsStore = require("../utils/settingsStore");
module["exports"] = {
  name: "botpp",
  aliases: ["setmenu", "setmenupp"],
  description:
    "Update menu banner using an image reply, text reply, or user mention.",
  async execute(_0x494d10, _0x2b1a46, _0x1d6fb0) {
    const _0x1a17a7 = _0x2b1a46["key"]["remoteJid"],
      _0x4fe346 =
        _0x1a17a7["endsWith"]("@lid") && _0x2b1a46["key"]["remoteJidAlt"]
          ? _0x2b1a46["key"]["remoteJidAlt"]
          : _0x1a17a7;
    if (!isOwner(_0x2b1a46))
      return await _0x494d10["sendMessage"](
        _0x4fe346,
        { text: "❌ *Only the bot owner can change the menu picture.*" },
        { quoted: _0x2b1a46 },
      );
    const _0x9d1d29 =
        _0x2b1a46["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x1c788b = _0x9d1d29?.["quotedMessage"],
      _0x5c40b7 =
        _0x9d1d29?.["mentionedJid"]?.[0x0] ||
        (_0x1d6fb0[0x0] && _0x1d6fb0[0x0]["includes"]("@")
          ? _0x1d6fb0[0x0]["replace"](/[^0-9]/g, "") + "@s.whatsapp.net"
          : null),
      _0x44e515 = _0x5c40b7 || _0x9d1d29?.["participant"];
    if (!_0x1c788b && !_0x44e515)
      return await _0x494d10["sendMessage"](
        _0x4fe346,
        {
          text: "❌ *Usage:* Reply to an image, reply to a user's message, or tag someone with `.botpp @user`",
        },
        { quoted: _0x2b1a46 },
      );
    let _0x376297 = null;
    try {
      if (_0x1c788b?.["imageMessage"])
        _0x376297 = await downloadMediaMessage(
          { message: _0x1c788b },
          "buffer",
          {},
        );
      else {
        if (_0x44e515) {
          let _0x25599f;
          try {
            _0x25599f = await _0x494d10["profilePictureUrl"](
              _0x44e515,
              "image",
            );
          } catch {
            return await _0x494d10["sendMessage"](
              _0x4fe346,
              {
                text: "❌ *Could not fetch profile picture. The user might have hidden it.*",
              },
              { quoted: _0x2b1a46 },
            );
          }
          const _0x539525 = await axios["get"](_0x25599f, {
            responseType: "arraybuffer",
          });
          _0x376297 = Buffer["from"](_0x539525["data"]);
        }
      }
      if (!_0x376297)
        return await _0x494d10["sendMessage"](
          _0x4fe346,
          { text: "❌ *Could not process image.*" },
          { quoted: _0x2b1a46 },
        );
      const _0x2bdeec = _0x376297["toString"]("base64");
      settingsStore["set"]("menu_banner", _0x2bdeec);
      const _0x4d34b4 = path["join"](__dirname, "../assets");
      (!fs["existsSync"](_0x4d34b4) &&
        fs["mkdirSync"](_0x4d34b4, { recursive: !![] }),
        fs["writeFileSync"](path["join"](_0x4d34b4, "script.jpg"), _0x376297),
        await _0x494d10["sendMessage"](
          _0x4fe346,
          {
            text: "✅ *Menu image updated successfully! Type menu to verify.*",
          },
          { quoted: _0x2b1a46 },
        ));
    } catch (_0x2cee9d) {
      (console["error"]("[BOTPP ERROR]", _0x2cee9d),
        await _0x494d10["sendMessage"](
          _0x4fe346,
          { text: "❌ *Failed to update menu image:* " + _0x2cee9d["message"] },
          { quoted: _0x2b1a46 },
        ));
    }
  },
};
