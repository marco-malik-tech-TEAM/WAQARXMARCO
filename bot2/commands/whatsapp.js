const { downloadMediaMessage } = require("@whiskeysockets/baileys"),
  { isOwner } = require("../utils/isOwner"),
  { isBotAdmin, getBotIdentifiers } = require("../utils/isAdmin");
function resolveJid(_0x1ff65c) {
  const _0x22fddf = _0x1ff65c["key"]["remoteJid"];
  return _0x22fddf["endsWith"]("@lid") && _0x1ff65c["key"]["remoteJidAlt"]
    ? _0x1ff65c["key"]["remoteJidAlt"]
    : _0x22fddf;
}
function getQuoted(_0x49f717, _0x4ecbea) {
  const _0x16ee5b = resolveJid(_0x4ecbea),
    _0x2249f7 = _0x4ecbea["message"]?.["extendedTextMessage"]?.["contextInfo"],
    _0x9dd13a = _0x2249f7?.["quotedMessage"];
  if (!_0x9dd13a)
    return { jid: _0x16ee5b, ctx: null, quotedMessage: null, quotedKey: null };
  const _0x543052 =
      _0x2249f7["participantPn"] ||
      _0x2249f7["participantAlt"] ||
      _0x2249f7["participant"],
    _0x5ba058 = _0x49f717["user"]?.["id"]?.["split"](":")[0x0],
    _0x4bbb6d = {
      remoteJid: _0x16ee5b,
      id: _0x2249f7["stanzaId"],
      fromMe: !!_0x5ba058 && !!_0x543052 && _0x543052["startsWith"](_0x5ba058),
      participant: _0x2249f7["participant"],
    };
  return {
    jid: _0x16ee5b,
    ctx: _0x2249f7,
    quotedMessage: _0x9dd13a,
    quotedKey: _0x4bbb6d,
  };
}
function digitsOf(_0x25e3c2) {
  if (!_0x25e3c2) return null;
  return _0x25e3c2["split"]("@")[0x0]["split"](":")[0x0];
}
function findParticipant(_0x42ff01, _0x293d8f) {
  if (!_0x293d8f) return null;
  return _0x42ff01["participants"]["find"]((_0x9ca9ef) => {
    const _0x17bf46 = [_0x9ca9ef["id"], _0x9ca9ef["jid"], _0x9ca9ef["lid"]][
      "filter"
    ](Boolean);
    return _0x17bf46["some"]((_0x4cc6e0) => digitsOf(_0x4cc6e0) === _0x293d8f);
  });
}
let cachedBotBio = null;
module["exports"] = [
  {
    name: "poll",
    description: "Create a poll. Usage: .poll Question | Option1 | Option2",
    async execute(_0x524dbd, _0x29e1eb, _0x4500c9) {
      const _0x503535 = resolveJid(_0x29e1eb),
        _0x1cf8ea = _0x4500c9["join"]("\x20"),
        _0x4774db = _0x1cf8ea["split"]("|")["map"]((_0x3ab8d6) =>
          _0x3ab8d6["trim"](),
        );
      if (_0x4774db["length"] < 0x3)
        return _0x524dbd["sendMessage"](
          _0x503535,
          { text: "❌ Usage: .poll Question | Option1 | Option2 | ..." },
          { quoted: _0x29e1eb },
        );
      const _0x12c28f = _0x4774db[0x0],
        _0x403b38 = _0x4774db["slice"](0x1);
      await _0x524dbd["sendMessage"](_0x503535, {
        poll: { name: _0x12c28f, values: _0x403b38, selectableCount: 0x1 },
      });
    },
  },
  {
    name: "del",
    aliases: ["delete"],
    description: "Delete a message. Reply to a message with .del",
    async execute(_0x489492, _0x5178a7) {
      const {
        jid: _0x28b18b,
        ctx: _0xe08cdd,
        quotedMessage: _0xff1514,
        quotedKey: _0x3fc84f,
      } = getQuoted(_0x489492, _0x5178a7);
      if (!_0xff1514)
        return _0x489492["sendMessage"](
          _0x28b18b,
          { text: "*Which message should I delete ?*" },
          { quoted: _0x5178a7 },
        );
      const _0x83ab41 =
          _0xe08cdd["participantPn"] ||
          _0xe08cdd["participantAlt"] ||
          _0xe08cdd["participant"],
        _0x47ea2f = digitsOf(_0x83ab41),
        _0x5e3d4b =
          digitsOf(_0x489492["user"]?.["id"]) ||
          digitsOf(_0x489492["user"]?.["lid"]),
        _0x12653e = !!_0x5e3d4b && _0x47ea2f === _0x5e3d4b,
        _0x489a46 =
          _0x5178a7["key"]["participantPn"] ||
          _0x5178a7["key"]["participantAlt"] ||
          _0x5178a7["key"]["participant"] ||
          _0x5178a7["key"]["remoteJid"],
        _0x598918 = digitsOf(_0x489a46),
        _0x5a5fe5 = !_0x12653e && !!_0x598918 && _0x47ea2f === _0x598918;
      if (_0x28b18b["endsWith"]("@g.us") && !_0x12653e && !_0x5a5fe5) {
        const _0xc2ebec = await _0x489492["groupMetadata"](_0x28b18b),
          _0x2857bb = findParticipant(_0xc2ebec, _0x5e3d4b),
          _0x320c2a =
            _0x2857bb &&
            (_0x2857bb["admin"] === "admin" ||
              _0x2857bb["admin"] === "superadmin");
        if (!_0x320c2a)
          return _0x489492["sendMessage"](
            _0x28b18b,
            {
              text: "❌ *I need to be a group admin to delete other members' messages.*",
            },
            { quoted: _0x5178a7 },
          );
        const _0x2847ab = findParticipant(_0xc2ebec, _0x598918),
          _0x50f56f =
            _0x2847ab &&
            (_0x2847ab["admin"] === "admin" ||
              _0x2847ab["admin"] === "superadmin");
        if (!_0x50f56f)
          return _0x489492["sendMessage"](
            _0x28b18b,
            {
              text: "❌ *Only group admins can delete other members' messages.*",
            },
            { quoted: _0x5178a7 },
          );
      }
      await _0x489492["sendMessage"](_0x28b18b, {
        delete: { ..._0x3fc84f, fromMe: _0x12653e },
      });
    },
  },
  {
    name: "react",
    description:
      "React to a message with an emoji. Reply to a message with .react 😂",
    async execute(_0x22e9a6, _0x59dd36, _0x2489c9) {
      const {
        jid: _0x27e2b6,
        quotedMessage: _0x2819af,
        quotedKey: _0x2f3056,
      } = getQuoted(_0x22e9a6, _0x59dd36);
      if (!_0x2819af)
        return _0x22e9a6["sendMessage"](
          _0x27e2b6,
          { text: "❌ Reply to a message with .react <emoji>" },
          { quoted: _0x59dd36 },
        );
      const _0x57f309 = _0x2489c9[0x0];
      if (!_0x57f309)
        return _0x22e9a6["sendMessage"](
          _0x27e2b6,
          { text: "❌ Provide an emoji. Example: .react 😂" },
          { quoted: _0x59dd36 },
        );
      await _0x22e9a6["sendMessage"](_0x27e2b6, {
        react: { text: _0x57f309, key: _0x2f3056 },
      });
    },
  },
  {
    name: "setstatus",
    aliases: ["poststatus"],
    description:
      "Reply to text/image/video/audio/sticker with .setstatus [caption] to post it to WhatsApp Status. With no reply, .setstatus <text> updates the bot's profile bio instead.",
    async execute(_0x54baf2, _0x4c59ef, _0x364d0a) {
      const {
          jid: _0xfa8f28,
          ctx: _0x205ba2,
          quotedMessage: _0x37239e,
        } = getQuoted(_0x54baf2, _0x4c59ef),
        _0x52a71d = _0x364d0a["join"]("\x20")["trim"]();
      if (!_0x37239e) {
        if (!_0x52a71d)
          return _0x54baf2["sendMessage"](
            _0xfa8f28,
            {
              text: "❌ *Usage:*\n• Reply to text/image/video/audio/sticker with `.setstatus [caption]` to post to Status.\n• Use `.setstatus <text>` with no reply to update the profile bio.",
            },
            { quoted: _0x4c59ef },
          );
        try {
          return (
            await _0x54baf2["updateProfileStatus"](_0x52a71d),
            (cachedBotBio = _0x52a71d),
            _0x54baf2["sendMessage"](
              _0xfa8f28,
              {
                text:
                  "✅ Profile status (bio) updated to:\n*" + _0x52a71d + "*",
              },
              { quoted: _0x4c59ef },
            )
          );
        } catch (_0x5d7042) {
          return _0x54baf2["sendMessage"](
            _0xfa8f28,
            { text: "❌ Failed to update bio: " + _0x5d7042["message"] },
            { quoted: _0x4c59ef },
          );
        }
      }
      try {
        const _0x477ed0 = "status@broadcast";
        let _0x832090 = [
          _0x54baf2["user"]?.["id"]?.["split"](":")[0x0] + "@s.whatsapp.net",
        ];
        try {
          const _0x31c277 = await Promise["race"]([
              _0x54baf2["groupFetchAllParticipating"](),
              new Promise((_0x20568c, _0x5c454c) =>
                setTimeout(
                  () => _0x5c454c(new Error("group lookup timed out")),
                  0x2710,
                ),
              ),
            ]),
            _0x354536 = new Set(_0x832090);
          for (const _0x2368c8 of Object["values"](_0x31c277 || {})) {
            for (const _0x23b035 of _0x2368c8["participants"] || []) {
              if (
                _0x23b035["id"] &&
                _0x23b035["id"]["endsWith"]("@s.whatsapp.net")
              )
                _0x354536["add"](_0x23b035["id"]);
            }
          }
          _0x832090 = Array["from"](_0x354536);
        } catch (_0x42c1d4) {
          console["error"](
            "[SETSTATUS] Could not build recipient list, sending to bot only:",
            _0x42c1d4["message"],
          );
        }
        const _0x434637 =
          _0x37239e["conversation"] ||
          _0x37239e["extendedTextMessage"]?.["text"];
        if (_0x434637)
          return (
            await _0x54baf2["sendMessage"](
              _0x477ed0,
              { text: _0x52a71d || _0x434637 },
              {
                backgroundColor: "#075E54",
                font: 0x1,
                statusJidList: _0x832090,
              },
            ),
            _0x54baf2["sendMessage"](
              _0xfa8f28,
              {
                text:
                  "✅ Text posted to WhatsApp Status! (" +
                  _0x832090["length"] +
                  " recipient(s))",
              },
              { quoted: _0x4c59ef },
            )
          );
        const _0x46c66b = Object["keys"](_0x37239e)["find"]((_0xd8f48b) =>
          ["imageMessage", "videoMessage", "audioMessage", "stickerMessage"][
            "includes"
          ](_0xd8f48b),
        );
        if (!_0x46c66b)
          return _0x54baf2["sendMessage"](
            _0xfa8f28,
            {
              text: "❌ Unsupported message type for status. Reply to text, image, video, audio, or a sticker.",
            },
            { quoted: _0x4c59ef },
          );
        const _0x4eb0c3 = await downloadMediaMessage(
          {
            message: _0x37239e,
            key: {
              remoteJid: _0xfa8f28,
              id: _0x205ba2["stanzaId"],
              participant:
                _0x205ba2["participant"] || _0x4c59ef["key"]["participant"],
            },
          },
          "buffer",
          {},
        );
        if (!_0x4eb0c3)
          return _0x54baf2["sendMessage"](
            _0xfa8f28,
            { text: "❌ Failed to download the replied media." },
            { quoted: _0x4c59ef },
          );
        const _0x452a85 = _0x52a71d || _0x37239e[_0x46c66b]?.["caption"] || "";
        if (_0x46c66b === "imageMessage")
          await _0x54baf2["sendMessage"](_0x477ed0, {
            image: _0x4eb0c3,
            caption: _0x452a85,
            statusJidList: _0x832090,
          });
        else {
          if (_0x46c66b === "videoMessage")
            await _0x54baf2["sendMessage"](_0x477ed0, {
              video: _0x4eb0c3,
              caption: _0x452a85,
              statusJidList: _0x832090,
            });
          else {
            if (_0x46c66b === "audioMessage") {
              const _0x2f4b43 =
                _0x37239e["audioMessage"]?.["mimetype"] || "audio/mp4";
              await _0x54baf2["sendMessage"](_0x477ed0, {
                audio: _0x4eb0c3,
                mimetype: _0x2f4b43,
                statusJidList: _0x832090,
              });
            } else
              _0x46c66b === "stickerMessage" &&
                (await _0x54baf2["sendMessage"](_0x477ed0, {
                  sticker: _0x4eb0c3,
                  statusJidList: _0x832090,
                }));
          }
        }
        return _0x54baf2["sendMessage"](
          _0xfa8f28,
          {
            text:
              "✅ Media posted to WhatsApp Status! (" +
              _0x832090["length"] +
              " recipient(s))",
          },
          { quoted: _0x4c59ef },
        );
      } catch (_0x4aae5c) {
        return (
          console["error"]("[SETSTATUS ERROR]", _0x4aae5c),
          _0x54baf2["sendMessage"](
            _0xfa8f28,
            { text: "❌ Failed to post status: " + _0x4aae5c["message"] },
            { quoted: _0x4c59ef },
          )
        );
      }
    },
  },
  {
    name: "status",
    description:
      "Get the profile status/bio of the bot, a tagged user, or a replied user.",
    async execute(_0x14872b, _0x19abed, _0x150b2a) {
      const _0x36b274 = resolveJid(_0x19abed),
        _0x339825 =
          _0x19abed["message"]?.["extendedTextMessage"]?.["contextInfo"];
      let _0x367dee =
        _0x339825?.["mentionedJid"]?.[0x0] ||
        (_0x150b2a[0x0] && _0x150b2a[0x0]["includes"]("@")
          ? _0x150b2a[0x0]["replace"](/[^0-9]/g, "") + "@s.whatsapp.net"
          : null) ||
        _0x339825?.["participantPn"] ||
        _0x339825?.["participantAlt"] ||
        _0x339825?.["participant"];
      const _0x11aedd =
        (_0x14872b["user"]?.["id"] || _0x14872b["user"]?.["jid"] || "")[
          "split"
        ](":")[0x0] + "@s.whatsapp.net";
      if (!_0x367dee) _0x367dee = _0x11aedd;
      const _0x3022df = _0x367dee === _0x11aedd,
        _0x507ba8 = _0x367dee["split"]("@")[0x0],
        _0x1d6542 = _0x3022df ? "Bio" : "@" + _0x507ba8 + "'s status";
      if (_0x3022df) {
        const _0x370602 =
          cachedBotBio || "No bio set yet — set one with .setstatus <text>.";
        return _0x14872b["sendMessage"](
          _0x36b274,
          { text: _0x1d6542 + ":\x20" + _0x370602 },
          { quoted: _0x19abed },
        );
      }
      try {
        const _0x4e5cd6 = await _0x14872b["fetchStatus"](_0x367dee),
          _0x3a320d = Array["isArray"](_0x4e5cd6) ? _0x4e5cd6[0x0] : _0x4e5cd6,
          _0x597966 = ((typeof _0x3a320d?.["status"] === "string" &&
            _0x3a320d["status"]) ||
            _0x3a320d?.["status"]?.["status"] ||
            "")["trim"](),
          _0x2566a6 = _0x3a320d?.["setAt"] || _0x3a320d?.["status"]?.["setAt"],
          _0x192e10 = _0x597966
            ? _0x1d6542 +
              ":\x20" +
              _0x597966 +
              (_0x2566a6
                ? " (set " + new Date(_0x2566a6)["toLocaleDateString"]() + ")"
                : "")
            : _0x1d6542 +
              ": no status set, or it's hidden by their privacy settings.";
        await _0x14872b["sendMessage"](
          _0x36b274,
          { text: _0x192e10, mentions: [_0x367dee] },
          { quoted: _0x19abed },
        );
      } catch (_0x54ed03) {
        await _0x14872b["sendMessage"](
          _0x36b274,
          {
            text: "❌ Could not fetch status for @" + _0x507ba8 + ".",
            mentions: [_0x367dee],
          },
          { quoted: _0x19abed },
        );
      }
    },
  },
  {
    name: "caption",
    description:
      "Add/change caption on a media message. Reply to media with .caption <text>",
    async execute(_0x87f3ab, _0x18ba78, _0x226243) {
      const {
        jid: _0x22baa4,
        ctx: _0x53a87f,
        quotedMessage: _0x55dad1,
      } = getQuoted(_0x87f3ab, _0x18ba78);
      if (!_0x55dad1)
        return _0x87f3ab["sendMessage"](
          _0x22baa4,
          { text: "❌ Reply to an image or video with .caption <text>" },
          { quoted: _0x18ba78 },
        );
      const _0x2d6d6b = _0x226243["join"]("\x20");
      if (!_0x2d6d6b)
        return _0x87f3ab["sendMessage"](
          _0x22baa4,
          { text: "❌ Provide a caption text." },
          { quoted: _0x18ba78 },
        );
      const _0x16436e = _0x55dad1["imageMessage"]
        ? "image"
        : _0x55dad1["videoMessage"]
          ? "video"
          : null;
      if (!_0x16436e)
        return _0x87f3ab["sendMessage"](
          _0x22baa4,
          { text: "❌ Only images and videos are supported." },
          { quoted: _0x18ba78 },
        );
      const _0x272f0e = await downloadMediaMessage(
        {
          message: _0x55dad1,
          key: {
            remoteJid: _0x22baa4,
            id: _0x53a87f["stanzaId"],
            participant: _0x53a87f["participant"],
          },
        },
        "buffer",
        {},
      );
      await _0x87f3ab["sendMessage"](
        _0x22baa4,
        { [_0x16436e]: _0x272f0e, caption: _0x2d6d6b },
        { quoted: _0x18ba78 },
      );
    },
  },
  {
    name: "doc",
    description: "Send a media file as a document. Reply to media with .doc",
    async execute(_0x3c3d48, _0x36d947) {
      const {
        jid: _0x385554,
        ctx: _0x3e9d6b,
        quotedMessage: _0x106def,
      } = getQuoted(_0x3c3d48, _0x36d947);
      if (!_0x106def)
        return _0x3c3d48["sendMessage"](
          _0x385554,
          {
            text: "❌ Reply to a media message (image, video, audio, or document) with *.doc*",
          },
          { quoted: _0x36d947 },
        );
      const _0x38c4b4 = Object["keys"](_0x106def)["find"]((_0x338224) =>
        [
          "imageMessage",
          "videoMessage",
          "audioMessage",
          "documentMessage",
          "stickerMessage",
        ]["includes"](_0x338224),
      );
      if (!_0x38c4b4)
        return _0x3c3d48["sendMessage"](
          _0x385554,
          {
            text: "❌ The replied message is not a media file (image, video, audio, or document).",
          },
          { quoted: _0x36d947 },
        );
      try {
        const _0x21c04a = await downloadMediaMessage(
          {
            message: _0x106def,
            key: {
              remoteJid: _0x385554,
              id: _0x3e9d6b["stanzaId"],
              participant:
                _0x3e9d6b["participant"] || _0x36d947["key"]["participant"],
            },
          },
          "buffer",
          {},
        );
        if (!_0x21c04a)
          return _0x3c3d48["sendMessage"](
            _0x385554,
            { text: "❌ Failed to download media file." },
            { quoted: _0x36d947 },
          );
        const _0x78cac6 = _0x106def[_0x38c4b4],
          _0x24ea1e = _0x78cac6?.["mimetype"] || "application/octet-stream",
          _0x1606ef =
            _0x24ea1e["split"]("/")[0x1]?.["split"](";")[0x0] || "bin",
          _0x1db66d =
            _0x78cac6?.["fileName"] ||
            "file_" + Date["now"]() + "." + _0x1606ef;
        await _0x3c3d48["sendMessage"](
          _0x385554,
          { document: _0x21c04a, mimetype: _0x24ea1e, fileName: _0x1db66d },
          { quoted: _0x36d947 },
        );
      } catch (_0x76d022) {
        await _0x3c3d48["sendMessage"](
          _0x385554,
          {
            text:
              "❌ Failed to convert media to document: " + _0x76d022["message"],
          },
          { quoted: _0x36d947 },
        );
      }
    },
  },
  {
    name: "cinfo",
    description: "Get info about a contact. Usage: .cinfo @user",
    async execute(_0x3873b2, _0x159fe9) {
      const _0x3c729d = resolveJid(_0x159fe9),
        _0x2a3d59 =
          _0x159fe9["message"]?.["extendedTextMessage"]?.["contextInfo"],
        _0x14f4e5 =
          _0x2a3d59?.["mentionedJid"]?.[0x0] ||
          _0x2a3d59?.["participantPn"] ||
          _0x2a3d59?.["participantAlt"] ||
          _0x2a3d59?.["participant"];
      if (!_0x14f4e5)
        return _0x3873b2["sendMessage"](
          _0x3c729d,
          { text: "❌ Tag or reply to a user. Example: .cinfo @user" },
          { quoted: _0x159fe9 },
        );
      try {
        const _0x1216df = await _0x3873b2["onWhatsApp"](_0x14f4e5),
          _0x1d1ba0 = await _0x3873b2["fetchStatus"](_0x14f4e5),
          _0x38202e = await _0x3873b2["profilePictureUrl"](_0x14f4e5, "image")[
            "catch"
          ](() => null),
          _0xd771e6 = ("\n╭──〔 👤 CONTACT INFO 〕──╮\n📱 *Number:* +" +
            _0x14f4e5["split"]("@")[0x0] +
            "\n✅ *On WhatsApp:* " +
            (_0x1216df?.[0x0]?.["exists"] ? "Yes" : "No") +
            "\n📝 *Status:* " +
            (_0x1d1ba0?.["status"] || "None") +
            "\n🖼 *Profile Pic:* " +
            (_0x38202e ? _0x38202e : "Not available") +
            "\n╰──────────────────╯")["trim"]();
        await _0x3873b2["sendMessage"](
          _0x3c729d,
          { text: _0xd771e6, mentions: [_0x14f4e5] },
          { quoted: _0x159fe9 },
        );
      } catch {
        await _0x3873b2["sendMessage"](
          _0x3c729d,
          { text: "❌ Could not fetch contact info." },
          { quoted: _0x159fe9 },
        );
      }
    },
  },
  {
    name: "clear",
    aliases: ["clearchat", "deletechat"],
    description: "Clears all messages in this chat.",
    async execute(_0x2ac8c3, _0x271c4b) {
      const _0xa656f0 = resolveJid(_0x271c4b);
      if (!isOwner(_0x271c4b))
        return await _0x2ac8c3["sendMessage"](
          _0xa656f0,
          { text: "❌ *Only the bot owner can clear chats.*" },
          { quoted: _0x271c4b },
        );
      try {
        (await _0x2ac8c3["chatModify"]({ clear: "all" }, _0xa656f0),
          await _0x2ac8c3["sendMessage"](_0xa656f0, {
            text: "🧹 *Chat history cleared successfully.*",
          }));
      } catch (_0x533a48) {
        console["error"]("[CLEAR CHAT ERROR]", _0x533a48);
        try {
          (await _0x2ac8c3["chatModify"](
            {
              clear: {
                messages: [
                  {
                    id: _0x271c4b["key"]["id"],
                    fromMe: _0x271c4b["key"]["fromMe"] || ![],
                    timestamp: _0x271c4b["messageTimestamp"],
                  },
                ],
              },
            },
            _0xa656f0,
          ),
            await _0x2ac8c3["sendMessage"](_0xa656f0, {
              text: "🧹 *Chat history cleared successfully.*",
            }));
        } catch (_0xeef155) {
          (console["error"]("[CLEAR CHAT FALLBACK ERROR]", _0xeef155),
            await _0x2ac8c3["sendMessage"](
              _0xa656f0,
              {
                text: "❌ *Failed to clear chat:* WhatsApp multi-device session sync restricted this action.",
              },
              { quoted: _0x271c4b },
            ));
        }
      }
    },
  },
  {
    name: "save1",
    aliases: ["savestatus", "statusdownload"],
    description:
      "Saves and forwards a quoted WhatsApp status to the current chat.",
    async execute(_0x5683ed, _0x519f32) {
      const { jid: _0x212a9a, quotedMessage: _0x3ad812 } = getQuoted(
        _0x5683ed,
        _0x519f32,
      );
      if (!_0x3ad812)
        return await _0x5683ed["sendMessage"](
          _0x212a9a,
          { text: "⚠️ *Please reply to a WhatsApp status with .save1*" },
          { quoted: _0x519f32 },
        );
      try {
        const _0x13ad48 = _0x3ad812["imageMessage"],
          _0x204331 = _0x3ad812["videoMessage"],
          _0x2966ed = _0x3ad812["audioMessage"],
          _0x54eaf0 = _0x3ad812["stickerMessage"],
          _0x4eb722 =
            _0x3ad812["conversation"] ||
            _0x3ad812["extendedTextMessage"]?.["text"];
        if (_0x13ad48 || _0x204331 || _0x2966ed || _0x54eaf0) {
          const _0x1e0493 = await downloadMediaMessage(
              { message: _0x3ad812 },
              "buffer",
              {},
            ),
            _0x117a66 = _0x13ad48?.["caption"] || _0x204331?.["caption"] || "";
          if (_0x13ad48)
            await _0x5683ed["sendMessage"](
              _0x212a9a,
              { image: _0x1e0493, caption: _0x117a66 },
              { quoted: _0x519f32 },
            );
          else {
            if (_0x204331)
              await _0x5683ed["sendMessage"](
                _0x212a9a,
                { video: _0x1e0493, caption: _0x117a66 },
                { quoted: _0x519f32 },
              );
            else {
              if (_0x2966ed)
                await _0x5683ed["sendMessage"](
                  _0x212a9a,
                  { audio: _0x1e0493, mimetype: "audio/mp4" },
                  { quoted: _0x519f32 },
                );
              else
                _0x54eaf0 &&
                  (await _0x5683ed["sendMessage"](
                    _0x212a9a,
                    { sticker: _0x1e0493 },
                    { quoted: _0x519f32 },
                  ));
            }
          }
        } else
          _0x4eb722
            ? await _0x5683ed["sendMessage"](
                _0x212a9a,
                { text: "📝 *Status Text:*\n\n" + _0x4eb722 },
                { quoted: _0x519f32 },
              )
            : await _0x5683ed["sendMessage"](
                _0x212a9a,
                { text: "❌ *Unsupported status format.*" },
                { quoted: _0x519f32 },
              );
      } catch (_0xcdf647) {
        (console["error"]("[SAVE1 ERROR]", _0xcdf647),
          await _0x5683ed["sendMessage"](
            _0x212a9a,
            {
              text: "❌ *Failed to download status media. Make sure it has not expired.*",
            },
            { quoted: _0x519f32 },
          ));
      }
    },
  },
  {
    name: "rgpp",
    aliases: ["removegpp", "deletegpp", "cleargpp"],
    description: "Remove group profile picture",
    async execute(_0x3206c2, _0x14e812) {
      const _0x18eeba = resolveJid(_0x14e812);
      if (!isOwner(_0x14e812))
        return _0x3206c2["sendMessage"](
          _0x18eeba,
          { text: "❌ Owner Only Command!" },
          { quoted: _0x14e812 },
        );
      if (!_0x18eeba["endsWith"]("@g.us"))
        return _0x3206c2["sendMessage"](
          _0x18eeba,
          { text: "❌ This command can only be used in a group!" },
          { quoted: _0x14e812 },
        );
      try {
        const _0x3ff68b = await _0x3206c2["groupMetadata"](_0x18eeba);
        return (
          await _0x3206c2["removeProfilePicture"](_0x3ff68b["id"]),
          _0x3206c2["sendMessage"](
            _0x18eeba,
            { text: "🗑️ Group profile picture removed successfully!" },
            { quoted: _0x14e812 },
          )
        );
      } catch (_0x44696a) {
        return (
          console["error"]("rgpp error:", _0x44696a),
          _0x3206c2["sendMessage"](
            _0x18eeba,
            {
              text:
                "❌ Failed to remove group profile picture.\nError: " +
                _0x44696a["message"],
            },
            { quoted: _0x14e812 },
          )
        );
      }
    },
  },
  {
    name: "rpp",
    aliases: ["removepic", "deletepp", "clearpp"],
    description: "Remove your own profile picture",
    async execute(_0xc1887c, _0x349bb5) {
      const _0x1897c1 = resolveJid(_0x349bb5);
      if (!isOwner(_0x349bb5))
        return _0xc1887c["sendMessage"](
          _0x1897c1,
          { text: "❌ Owner Only Command!" },
          { quoted: _0x349bb5 },
        );
      try {
        const _0x3fea27 = {
          tag: "iq",
          attrs: {
            to: "@s.whatsapp.net",
            type: "set",
            xmlns: "w:profile:picture",
          },
          content: [{ tag: "picture", attrs: { type: "image" }, content: [] }],
        };
        return (
          await _0xc1887c["query"](_0x3fea27),
          _0xc1887c["sendMessage"](
            _0x1897c1,
            { text: "🗑️ Profile picture removed successfully!" },
            { quoted: _0x349bb5 },
          )
        );
      } catch (_0x4881cf) {
        return (
          console["error"]("rpp error:", _0x4881cf),
          _0xc1887c["sendMessage"](
            _0x1897c1,
            {
              text:
                "❌ Failed to remove profile picture.\nError: " +
                _0x4881cf["message"],
            },
            { quoted: _0x349bb5 },
          )
        );
      }
    },
  },
  {
    name: "togroupstatus",
    aliases: ["groupstatus", "statusgroup", "gstatus"],
    description:
      "Post quoted text or media as a Group Status. In a group it posts there; in DM add a group link/JID first (falls back to a scoped personal Status if unsupported)",
    async execute(_0x434eb5, _0x3aae76, _0x100ddd) {
      const {
        jid: _0x1cd2d4,
        ctx: _0x1743c9,
        quotedMessage: _0x3e5ca7,
      } = getQuoted(_0x434eb5, _0x3aae76);
      if (!isOwner(_0x3aae76))
        return _0x434eb5["sendMessage"](
          _0x1cd2d4,
          { text: "❌ Owner Only Command!" },
          { quoted: _0x3aae76 },
        );
      const _0x15206e = _0x1cd2d4["endsWith"]("@g.us"),
        _0x5db2b7 = _0x100ddd[0x0] || "",
        _0x521665 =
          /chat\.whatsapp\.com\//i["test"](_0x5db2b7) ||
          _0x5db2b7["endsWith"]("@g.us");
      let _0x1b15d3 = _0x1cd2d4,
        _0x481fda = _0x100ddd;
      if (_0x521665) {
        try {
          if (_0x5db2b7["endsWith"]("@g.us")) _0x1b15d3 = _0x5db2b7;
          else {
            const _0x55ec04 = _0x5db2b7["match"](
              /chat\.whatsapp\.com\/(?:invite\/)?([A-Za-z0-9_-]{10,40})/i,
            );
            if (!_0x55ec04) throw new Error("bad link");
            const _0x4d5969 = await _0x434eb5["groupGetInviteInfo"](
              _0x55ec04[0x1]["split"]("?")[0x0]["split"]("#")[0x0],
            );
            if (!_0x4d5969?.["id"]) throw new Error("invite did not resolve");
            _0x1b15d3 = _0x4d5969["id"];
          }
        } catch (_0x152fa1) {
          return _0x434eb5["sendMessage"](
            _0x1cd2d4,
            {
              text:
                "❌ Could not resolve that group link/JID: " +
                _0x152fa1["message"],
            },
            { quoted: _0x3aae76 },
          );
        }
        _0x481fda = _0x100ddd["slice"](0x1);
      } else {
        if (!_0x15206e)
          return _0x434eb5["sendMessage"](
            _0x1cd2d4,
            {
              text:
                "📌 In DM use:\n" +
                "• Reply to media with .togroupstatus <group-link|JID> [caption]\n" +
                "• Or .togroupstatus <group-link|JID> <text>",
            },
            { quoted: _0x3aae76 },
          );
      }
      const _0x12ffc6 = _0x481fda["join"]("\x20")["trim"]();
      if (!_0x12ffc6 && !_0x3e5ca7)
        return _0x434eb5["sendMessage"](
          _0x1cd2d4,
          {
            text:
              "📌 Usage:\n" +
              "• .togroupstatus <text>\n" +
              "• Reply to an image/video/audio with .togroupstatus <caption>\n" +
              "• In DM: .togroupstatus <group-link|JID> [caption] (reply to media)",
          },
          { quoted: _0x3aae76 },
        );
      async function _0x585faf(_0x229761) {
        const _0x5ae61a = require("crypto"),
          {
            generateWAMessageContent: _0x31d649,
            generateMessageIDV2: _0x3f5cab,
          } = require("@whiskeysockets/baileys");
        let _0x55edde;
        if (_0x229761["text"])
          _0x55edde = {
            extendedTextMessage: {
              text: _0x229761["text"],
              font: 0x0,
              textArgb: 0xffffffff,
              backgroundArgb: 0xff075e54,
            },
          };
        else {
          if (_0x229761["image"] || _0x229761["video"] || _0x229761["audio"]) {
            const _0x1f5759 = _0x229761["image"]
              ? {
                  image: _0x229761["image"],
                  caption: _0x229761["caption"] || "",
                }
              : _0x229761["video"]
                ? {
                    video: _0x229761["video"],
                    caption: _0x229761["caption"] || "",
                  }
                : {
                    audio: _0x229761["audio"],
                    mimetype: _0x229761["mimetype"] || "audio/mp4",
                    ptt: !![],
                  };
            _0x55edde = await _0x31d649(_0x1f5759, {
              upload: _0x434eb5["waUploadToServer"],
            });
          } else throw new Error("Unsupported content for group status.");
        }
        const _0x4d1c2c = _0x5ae61a["randomBytes"](0x20),
          _0x48039a = {
            messageContextInfo: { messageSecret: _0x4d1c2c },
            groupStatusMessageV2: {
              message: {
                ..._0x55edde,
                messageContextInfo: { messageSecret: _0x4d1c2c },
              },
            },
          };
        console["log"](
          "[togroupstatus] relaying groupStatusMessageV2 to",
          _0x1b15d3,
          Object["keys"](_0x55edde),
        );
        const _0x42687c = _0x3f5cab(_0x434eb5["user"]?.["id"]);
        await _0x434eb5["relayMessage"](_0x1b15d3, _0x48039a, {
          messageId: _0x42687c,
        });
      }
      async function _0x4f1d93(_0x5cc2b1) {
        const _0x2b3245 = await _0x434eb5["groupMetadata"](_0x1b15d3),
          _0x527327 = _0x2b3245["participants"]
            ["map"]((_0x540fdd) => _0x540fdd["id"])
            [
              "filter"
            ]((_0x2415f8) => _0x2415f8 && _0x2415f8["endsWith"]("@s.whatsapp.net")),
          _0x411ca7 =
            (_0x434eb5["user"]?.["id"] || "")["split"](":")[0x0] +
            "@s.whatsapp.net";
        if (!_0x527327["includes"](_0x411ca7)) _0x527327["push"](_0x411ca7);
        if (!_0x527327["length"])
          throw new Error(
            "No resolvable phone numbers in this group to send status to.",
          );
        return (
          await _0x434eb5["sendMessage"]("status@broadcast", _0x5cc2b1, {
            backgroundColor: "#075E54",
            font: 0x1,
            statusJidList: _0x527327,
            broadcast: !![],
          }),
          _0x527327["length"]
        );
      }
      try {
        let _0x19c99e, _0x23f4de, _0x3826fe, _0x2d23f2;
        if (_0x3e5ca7) {
          const _0x1e4938 = {
            remoteJid: _0x1cd2d4,
            id: _0x1743c9["stanzaId"],
            participant:
              _0x1743c9["participant"] || _0x3aae76["key"]["participant"],
          };
          ((_0x2d23f2 =
            _0x3e5ca7["conversation"] ||
            _0x3e5ca7["extendedTextMessage"]?.["text"]),
            (_0x23f4de = Object["keys"](_0x3e5ca7)["find"]((_0x278910) =>
              ["imageMessage", "videoMessage", "audioMessage"]["includes"](
                _0x278910,
              ),
            )));
          if (!_0x2d23f2 && _0x23f4de) {
            _0x19c99e = await downloadMediaMessage(
              { message: _0x3e5ca7, key: _0x1e4938 },
              "buffer",
              {},
              {
                reuploadRequest: (_0x304e63) =>
                  _0x434eb5["updateMediaMessage"](_0x304e63),
              },
            );
            if (!_0x19c99e?.["length"])
              throw new Error("WhatsApp returned an empty media file");
            _0x3826fe = _0x12ffc6 || _0x3e5ca7[_0x23f4de]?.["caption"] || "";
          } else {
            if (!_0x2d23f2 && !_0x23f4de)
              return _0x434eb5["sendMessage"](
                _0x1cd2d4,
                {
                  text: "❌ Unsupported message type. Reply to text, image, video, or audio.",
                },
                { quoted: _0x3aae76 },
              );
          }
        }
        const _0x17bdfc =
          _0x15206e && _0x1b15d3 === _0x1cd2d4 ? "" : " to the target group";
        try {
          if (_0x2d23f2) await _0x585faf({ text: _0x12ffc6 || _0x2d23f2 });
          else {
            if (_0x23f4de === "imageMessage")
              await _0x585faf({ image: _0x19c99e, caption: _0x3826fe });
            else {
              if (_0x23f4de === "videoMessage")
                await _0x585faf({ video: _0x19c99e, caption: _0x3826fe });
              else
                _0x23f4de === "audioMessage"
                  ? await _0x585faf({
                      audio: _0x19c99e,
                      mimetype: _0x3e5ca7["audioMessage"]?.["mimetype"],
                    })
                  : await _0x585faf({ text: _0x12ffc6 });
            }
          }
          return _0x434eb5["sendMessage"](
            _0x1cd2d4,
            { text: "✅ Posted as a Group Status" + _0x17bdfc + "." },
            { quoted: _0x3aae76 },
          );
        } catch (_0x5ebeea) {
          console["warn"](
            "[togroupstatus] groupStatusMessageV2 failed, falling back:",
            _0x5ebeea["message"],
          );
          let _0x5c6d07;
          if (_0x2d23f2)
            _0x5c6d07 = await _0x4f1d93({ text: _0x12ffc6 || _0x2d23f2 });
          else {
            if (_0x23f4de === "imageMessage")
              _0x5c6d07 = await _0x4f1d93({
                image: _0x19c99e,
                caption: _0x3826fe,
              });
            else {
              if (_0x23f4de === "videoMessage")
                _0x5c6d07 = await _0x4f1d93({
                  video: _0x19c99e,
                  caption: _0x3826fe,
                });
              else {
                if (_0x23f4de === "audioMessage") {
                  const _0x5b1ad5 =
                    _0x3e5ca7["audioMessage"]?.["mimetype"] || "audio/mp4";
                  _0x5c6d07 = await _0x4f1d93({
                    audio: _0x19c99e,
                    mimetype: _0x5b1ad5,
                  });
                } else _0x5c6d07 = await _0x4f1d93({ text: _0x12ffc6 });
              }
            }
          }
          return _0x434eb5["sendMessage"](
            _0x1cd2d4,
            {
              text:
                "⚠️ Group Status wasn't supported on this connection — posted as a personal Status instead, visible to " +
                _0x5c6d07 +
                " member(s).",
            },
            { quoted: _0x3aae76 },
          );
        }
      } catch (_0x1ad43f) {
        return (
          console["error"]("togroupstatus error:", _0x1ad43f),
          _0x434eb5["sendMessage"](
            _0x1cd2d4,
            { text: "❌ Error posting status: " + _0x1ad43f["message"] },
            { quoted: _0x3aae76 },
          )
        );
      }
    },
  },
  {
    name: "creategc",
    aliases: ["creategroup"],
    description: "Create a new WhatsApp group with optional participants",
    async execute(_0x2a581d, _0x13e1f9, _0x380a1d) {
      const _0x3cf68f = resolveJid(_0x13e1f9),
        _0x4518a3 =
          _0x13e1f9["key"]["participant"] || _0x13e1f9["key"]["remoteJid"],
        _0x38e59b = _0x380a1d["join"]("\x20")["trim"]();
      if (!isOwner(_0x13e1f9))
        return _0x2a581d["sendMessage"](
          _0x3cf68f,
          { text: "❌ Owner Only Command!" },
          { quoted: _0x13e1f9 },
        );
      if (!_0x38e59b)
        return _0x2a581d["sendMessage"](
          _0x3cf68f,
          {
            text: "✏️ Usage: .creategc GroupName\nOr: .creategc GroupName 1234567890,9876543210",
          },
          { quoted: _0x13e1f9 },
        );
      try {
        let _0x7ffcb4 = _0x38e59b,
          _0x5355f1 = [_0x4518a3];
        const _0x118b74 = _0x38e59b["split"](/\s+/);
        if (
          _0x118b74["length"] > 0x1 &&
          _0x118b74[_0x118b74["length"] - 0x1]["match"](/\d{10,}/)
        ) {
          _0x7ffcb4 = _0x118b74["slice"](0x0, -0x1)["join"]("\x20");
          const _0x1da1ca = _0x118b74[_0x118b74["length"] - 0x1]["split"](",");
          for (const _0xb4f1f4 of _0x1da1ca) {
            const _0x70d97 = _0xb4f1f4["replace"](/[^0-9]/g, "");
            _0x70d97["length"] >= 0xa &&
              _0x5355f1["push"](_0x70d97 + "@s.whatsapp.net");
          }
        }
        const _0x16662b = await _0x2a581d["groupCreate"](_0x7ffcb4, _0x5355f1),
          _0x28d2cb = await _0x2a581d["groupInviteCode"](_0x16662b["id"]),
          _0x4e1b6f =
            "✅ *Group Created!*\n\n" +
            ("*Name*: " + _0x7ffcb4 + "\x0a") +
            ("*Members*: " + _0x5355f1["length"] + "\x0a") +
            ("*Link*: https://chat.whatsapp.com/" + _0x28d2cb + "\x0a\x0a") +
            "The group has been created with you as the admin.";
        return _0x2a581d["sendMessage"](
          _0x3cf68f,
          { text: _0x4e1b6f },
          { quoted: _0x13e1f9 },
        );
      } catch (_0xfa64d5) {
        return (
          console["error"]("creategc error:", _0xfa64d5),
          _0x2a581d["sendMessage"](
            _0x3cf68f,
            { text: "❌ Failed to create group: " + _0xfa64d5["message"] },
            { quoted: _0x13e1f9 },
          )
        );
      }
    },
  },
  {
    name: "demoteall",
    aliases: ["demoteadmins", "stripadmins"],
    description: "Demote all group admins",
    async execute(_0x39a091, _0x2f085d) {
      const _0x4803e3 = resolveJid(_0x2f085d);
      if (!isOwner(_0x2f085d))
        return _0x39a091["sendMessage"](
          _0x4803e3,
          { text: "❌ Owner Only Command!" },
          { quoted: _0x2f085d },
        );
      if (!_0x4803e3["endsWith"]("@g.us"))
        return _0x39a091["sendMessage"](
          _0x4803e3,
          { text: "❌ This command only works in groups!" },
          { quoted: _0x2f085d },
        );
      const _0x2e5713 = await _0x39a091["groupMetadata"](_0x4803e3);
      if (!isBotAdmin(_0x39a091, _0x2e5713))
        return _0x39a091["sendMessage"](
          _0x4803e3,
          { text: "❌ Bot must be admin to demote others." },
          { quoted: _0x2f085d },
        );
      try {
        const _0x3d56ce = getBotIdentifiers(_0x39a091),
          _0x1afb9f = _0x2e5713["participants"]["filter"](
            (_0x247527) =>
              _0x247527["admin"] === "admin" ||
              _0x247527["admin"] === "superadmin",
          ),
          _0x28e750 = _0x1afb9f["map"]((_0x1c3da0) => _0x1c3da0["id"])[
            "filter"
          ]((_0x229e4e) => !_0x3d56ce["has"](_0x229e4e));
        if (_0x28e750["length"] === 0x0)
          return _0x39a091["sendMessage"](
            _0x4803e3,
            { text: "ℹ️ No admins found to demote." },
            { quoted: _0x2f085d },
          );
        return (
          await _0x39a091["groupParticipantsUpdate"](
            _0x4803e3,
            _0x28e750,
            "demote",
          ),
          _0x39a091["sendMessage"](
            _0x4803e3,
            {
              text:
                "🔻 All admins have been demoted (" +
                _0x28e750["length"] +
                ").",
              mentions: _0x28e750,
            },
            { quoted: _0x2f085d },
          )
        );
      } catch (_0x2692db) {
        return (
          console["error"]("demoteall error:", _0x2692db),
          _0x39a091["sendMessage"](
            _0x4803e3,
            { text: "❌ Failed to demote admins: " + _0x2692db["message"] },
            { quoted: _0x2f085d },
          )
        );
      }
    },
  },
  {
    name: "promoteall",
    aliases: ["promotemembers", "makeadmins"],
    description: "Promote all non-admin members to group admin",
    async execute(_0x45a657, _0xfe1ebd) {
      const _0x2ca3a0 = resolveJid(_0xfe1ebd);
      if (!_0x2ca3a0["endsWith"]("@g.us"))
        return _0x45a657["sendMessage"](
          _0x2ca3a0,
          { text: "❌ This command only works in groups!" },
          { quoted: _0xfe1ebd },
        );
      if (!isOwner(_0xfe1ebd))
        return _0x45a657["sendMessage"](
          _0x2ca3a0,
          { text: "❌ Only the bot owner can use this command." },
          { quoted: _0xfe1ebd },
        );
      const _0x5f3311 = await _0x45a657["groupMetadata"](_0x2ca3a0);
      if (!isBotAdmin(_0x45a657, _0x5f3311))
        return _0x45a657["sendMessage"](
          _0x2ca3a0,
          { text: "❌ I need to be a group admin to promote others." },
          { quoted: _0xfe1ebd },
        );
      try {
        const _0x45e76c = getBotIdentifiers(_0x45a657),
          _0x57f752 = _0x5f3311["participants"]
            ["map"]((_0x31c0ac) => _0x31c0ac["id"])
            [
              "filter"
            ]((_0x486baa) => !_0x45e76c["has"](_0x486baa) && !_0x5f3311["participants"]["find"]((_0x263abb) => _0x263abb["id"] === _0x486baa && (_0x263abb["admin"] === "admin" || _0x263abb["admin"] === "superadmin")));
        if (_0x57f752["length"] === 0x0)
          return _0x45a657["sendMessage"](
            _0x2ca3a0,
            { text: "ℹ️ No non-admin members to promote." },
            { quoted: _0xfe1ebd },
          );
        return (
          await _0x45a657["groupParticipantsUpdate"](
            _0x2ca3a0,
            _0x57f752,
            "promote",
          ),
          _0x45a657["sendMessage"](
            _0x2ca3a0,
            {
              text:
                "⬆️ All members have been promoted (" +
                _0x57f752["length"] +
                ").",
              mentions: _0x57f752,
            },
            { quoted: _0xfe1ebd },
          )
        );
      } catch (_0x4d3602) {
        return (
          console["error"]("promoteall error:", _0x4d3602),
          _0x45a657["sendMessage"](
            _0x2ca3a0,
            { text: "❌ Failed to promote members: " + _0x4d3602["message"] },
            { quoted: _0xfe1ebd },
          )
        );
      }
    },
  },
  {
    name: "toviewonce",
    aliases: ["tovo", "tovv"],
    description: "Send quoted media (image/video/audio) as view-once message",
    async execute(_0x50c5be, _0x1f4a96) {
      const {
        jid: _0x5031d6,
        ctx: _0x4c345d,
        quotedMessage: _0x26ea9c,
      } = getQuoted(_0x50c5be, _0x1f4a96);
      if (!_0x26ea9c)
        return _0x50c5be["sendMessage"](
          _0x5031d6,
          {
            text: "❌ Reply to an image, video, or audio message to make it view-once.",
          },
          { quoted: _0x1f4a96 },
        );
      const _0x419e25 = Object["keys"](_0x26ea9c)["find"]((_0x124d7f) =>
        ["imageMessage", "videoMessage", "audioMessage"]["includes"](_0x124d7f),
      );
      if (!_0x419e25)
        return _0x50c5be["sendMessage"](
          _0x5031d6,
          { text: "❌ That message isn't an image, video, or audio message." },
          { quoted: _0x1f4a96 },
        );
      try {
        const _0x227245 = {
            remoteJid: _0x5031d6,
            id: _0x4c345d["stanzaId"],
            participant:
              _0x4c345d["participant"] || _0x1f4a96["key"]["participant"],
          },
          _0x5decd6 = await downloadMediaMessage(
            { message: _0x26ea9c, key: _0x227245 },
            "buffer",
            {},
          );
        if (_0x419e25 === "imageMessage") {
          const _0x40d0dc = _0x26ea9c["imageMessage"]["caption"] || "";
          await _0x50c5be["sendMessage"](
            _0x5031d6,
            { image: _0x5decd6, caption: _0x40d0dc, viewOnce: !![] },
            { quoted: _0x1f4a96 },
          );
        } else {
          if (_0x419e25 === "videoMessage") {
            const _0x40273f = _0x26ea9c["videoMessage"]["caption"] || "";
            await _0x50c5be["sendMessage"](
              _0x5031d6,
              { video: _0x5decd6, caption: _0x40273f, viewOnce: !![] },
              { quoted: _0x1f4a96 },
            );
          } else
            _0x419e25 === "audioMessage" &&
              (await _0x50c5be["sendMessage"](
                _0x5031d6,
                {
                  audio: _0x5decd6,
                  mimetype: "audio/mpeg",
                  ptt: !![],
                  viewOnce: !![],
                },
                { quoted: _0x1f4a96 },
              ));
        }
      } catch (_0x2ee22b) {
        return (
          console["error"]("toviewonce command error:", _0x2ee22b),
          _0x50c5be["sendMessage"](
            _0x5031d6,
            { text: "❌ Couldn't send the media. Try again." },
            { quoted: _0x1f4a96 },
          )
        );
      }
    },
  },
];
