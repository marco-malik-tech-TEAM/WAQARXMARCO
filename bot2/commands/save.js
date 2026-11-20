const {
  downloadMediaMessage,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
module["exports"] = {
  name: "save",
  description:
    "Save a replied status to your DM. Usage: reply to a status with .save",
  async execute(_0x2c6d5f, _0x40e0f5) {
    const _0x18fcd5 = _0x40e0f5["key"]["remoteJid"],
      _0x2f57bc =
        _0x40e0f5["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x19cf9b = _0x2f57bc?.["quotedMessage"];
    if (!_0x19cf9b)
      return _0x2c6d5f["sendMessage"](
        _0x18fcd5,
        { text: "❌ Reply to a status with .save" },
        { quoted: _0x40e0f5 },
      );
    const _0x591296 = _0x2c6d5f["user"]?.["id"]
      ? jidNormalizedUser(_0x2c6d5f["user"]["id"])
      : _0x18fcd5;
    try {
      if (_0x19cf9b["imageMessage"]) {
        const _0x3bb406 = await downloadMediaMessage(
          {
            message: _0x19cf9b,
            key: {
              remoteJid: _0x18fcd5,
              id: _0x2f57bc["stanzaId"],
              participant: _0x2f57bc["participant"],
            },
          },
          "buffer",
          {},
        );
        await _0x2c6d5f["sendMessage"](_0x591296, {
          image: _0x3bb406,
          caption: _0x19cf9b["imageMessage"]["caption"] || "✅ Status saved",
        });
      } else {
        if (_0x19cf9b["videoMessage"]) {
          const _0x245cf5 = await downloadMediaMessage(
            {
              message: _0x19cf9b,
              key: {
                remoteJid: _0x18fcd5,
                id: _0x2f57bc["stanzaId"],
                participant: _0x2f57bc["participant"],
              },
            },
            "buffer",
            {},
          );
          await _0x2c6d5f["sendMessage"](_0x591296, {
            video: _0x245cf5,
            caption: _0x19cf9b["videoMessage"]["caption"] || "✅ Status saved",
          });
        } else {
          if (
            _0x19cf9b["conversation"] ||
            _0x19cf9b["extendedTextMessage"]?.["text"]
          ) {
            const _0x15884a =
              _0x19cf9b["conversation"] ||
              _0x19cf9b["extendedTextMessage"]["text"];
            await _0x2c6d5f["sendMessage"](_0x591296, {
              text: "💾 *Saved status:*\n\n" + _0x15884a,
            });
          } else
            return _0x2c6d5f["sendMessage"](
              _0x18fcd5,
              {
                text: "❌ Unsupported status type — only image, video, or text statuses can be saved.",
              },
              { quoted: _0x40e0f5 },
            );
        }
      }
      await _0x2c6d5f["sendMessage"](
        _0x18fcd5,
        { text: "✅ Status saved to your DM." },
        { quoted: _0x40e0f5 },
      );
    } catch (_0x150034) {
      await _0x2c6d5f["sendMessage"](
        _0x18fcd5,
        { text: "❌ Could not save status: " + _0x150034["message"] },
        { quoted: _0x40e0f5 },
      );
    }
  },
};
