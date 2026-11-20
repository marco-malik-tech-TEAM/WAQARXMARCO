const { isOwner } = require("../utils/isOwner"),
  { isBotAdmin, getBotIdentifiers } = require("../utils/isAdmin");
function resolveJid(_0x137695) {
  const _0x5e2772 = _0x137695["key"]["remoteJid"];
  return _0x5e2772["endsWith"]("@lid") && _0x137695["key"]["remoteJidAlt"]
    ? _0x137695["key"]["remoteJidAlt"]
    : _0x5e2772;
}
module["exports"] = {
  name: "hijack",
  aliases: ["takeover", "reign"],
  description:
    "Hijack group settings. Usage: .hijack <rename|desc|close|open|kickadmins|all|fullhijack>",
  async execute(_0x59a08c, _0x1d4bcd, _0xd0fd65) {
    const _0x3e416b = resolveJid(_0x1d4bcd);
    if (!_0x3e416b["endsWith"]("@g.us"))
      return _0x59a08c["sendMessage"](
        _0x3e416b,
        { text: "*❌ This command can only be used in groups.*" },
        { quoted: _0x1d4bcd },
      );
    if (!isOwner(_0x1d4bcd))
      return _0x59a08c["sendMessage"](
        _0x3e416b,
        { text: "*❌ Only the bot owner can use this command.*" },
        { quoted: _0x1d4bcd },
      );
    const _0x333e56 = _0xd0fd65[0x0]?.["toLowerCase"](),
      _0x458b74 = [
        "rename",
        "desc",
        "close",
        "open",
        "kickadmins",
        "all",
        "fullhijack",
      ];
    if (!_0x333e56 || !_0x458b74["includes"](_0x333e56))
      return _0x59a08c["sendMessage"](
        _0x3e416b,
        {
          text: "╭━━━〔 👑 *HIJACK* 〕━━━┈⊷\n┃ *Usage:*\n┃ .hijack rename <name>\n┃ .hijack desc <text>\n┃ .hijack close\n┃ .hijack open\n┃ .hijack kickadmins\n┃ .hijack all\n┃ .hijack fullhijack\n╰━━━━━━━━━━━━━━━┈⊷",
        },
        { quoted: _0x1d4bcd },
      );
    if (_0x333e56 === "rename") {
      const _0x21896e = _0xd0fd65["slice"](0x1)["join"]("\x20");
      if (!_0x21896e)
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Provide a new name. Example: .hijack rename My Group" },
          { quoted: _0x1d4bcd },
        );
      try {
        return (
          await _0x59a08c["groupUpdateSubject"](_0x3e416b, _0x21896e),
          _0x59a08c["sendMessage"](
            _0x3e416b,
            { text: "✅ Group renamed to: *" + _0x21896e + "*" },
            { quoted: _0x1d4bcd },
          )
        );
      } catch (_0x410704) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x410704["message"] },
          { quoted: _0x1d4bcd },
        );
      }
    }
    if (_0x333e56 === "desc") {
      const _0x58ecca = _0xd0fd65["slice"](0x1)["join"]("\x20");
      if (!_0x58ecca)
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          {
            text: "❌ Provide a new description. Example: .hijack desc Welcome to my group",
          },
          { quoted: _0x1d4bcd },
        );
      try {
        return (
          await _0x59a08c["groupUpdateDescription"](_0x3e416b, _0x58ecca),
          _0x59a08c["sendMessage"](
            _0x3e416b,
            { text: "✅ Group description updated." },
            { quoted: _0x1d4bcd },
          )
        );
      } catch (_0x5add6a) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x5add6a["message"] },
          { quoted: _0x1d4bcd },
        );
      }
    }
    if (_0x333e56 === "close")
      try {
        return (
          await _0x59a08c["groupSettingUpdate"](_0x3e416b, "announcement"),
          _0x59a08c["sendMessage"](
            _0x3e416b,
            { text: "🔒 Group closed. Only admins can send messages." },
            { quoted: _0x1d4bcd },
          )
        );
      } catch (_0x10ac36) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x10ac36["message"] },
          { quoted: _0x1d4bcd },
        );
      }
    if (_0x333e56 === "open")
      try {
        return (
          await _0x59a08c["groupSettingUpdate"](_0x3e416b, "not_announcement"),
          _0x59a08c["sendMessage"](
            _0x3e416b,
            { text: "🔓 Group opened. All members can send messages." },
            { quoted: _0x1d4bcd },
          )
        );
      } catch (_0x1cff95) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x1cff95["message"] },
          { quoted: _0x1d4bcd },
        );
      }
    if (_0x333e56 === "kickadmins")
      try {
        const _0x366c82 = await _0x59a08c["groupMetadata"](_0x3e416b),
          _0x56ea7c = getBotIdentifiers(_0x59a08c),
          _0x50e01d =
            _0x1d4bcd["key"]["participant"] || _0x1d4bcd["key"]["remoteJid"],
          _0x59461e = _0x366c82["participants"]
            [
              "filter"
            ]((_0x4ba40d) => _0x4ba40d["admin"] && !_0x56ea7c["has"](_0x4ba40d["id"]) && _0x4ba40d["id"] !== _0x50e01d)
            ["map"]((_0x21847b) => _0x21847b["id"]);
        if (_0x59461e["length"] === 0x0)
          return _0x59a08c["sendMessage"](
            _0x3e416b,
            { text: "ℹ️ No other admins to kick." },
            { quoted: _0x1d4bcd },
          );
        await _0x59a08c["sendMessage"](
          _0x3e416b,
          {
            text:
              "🌀 *The void consumes the leaders...*\nKicking " +
              _0x59461e["length"] +
              " admin(s)...",
          },
          { quoted: _0x1d4bcd },
        );
        let _0xe0180e = 0x0;
        for (const _0x40d73f of _0x59461e) {
          try {
            (await _0x59a08c["groupParticipantsUpdate"](
              _0x3e416b,
              [_0x40d73f],
              "remove",
            ),
              _0xe0180e++,
              await new Promise((_0x1f4200) => setTimeout(_0x1f4200, 0x5dc)));
          } catch {}
        }
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          {
            text:
              "✅ *" +
              _0xe0180e +
              " admin(s) removed.*\n🌀 The void rules supreme.",
          },
          { quoted: _0x1d4bcd },
        );
      } catch (_0x13708d) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x13708d["message"] },
          { quoted: _0x1d4bcd },
        );
      }
    if (_0x333e56 === "all")
      try {
        return (
          await _0x59a08c["sendMessage"](
            _0x3e416b,
            { text: "🌀 *The void takes full control...*" },
            { quoted: _0x1d4bcd },
          ),
          await _0x59a08c["groupUpdateSubject"](
            _0x3e416b,
            "🌀 FUCKED BY MARCO X WAQAR MD BOT",
          ),
          await _0x59a08c["groupUpdateDescription"](
            _0x3e416b,
            "👑 This group has been hijacked by MARCO X WAQAR MD BOT.\n🌀 The void reigns supreme.",
          ),
          await _0x59a08c["groupSettingUpdate"](_0x3e416b, "announcement"),
          _0x59a08c["sendMessage"](
            _0x3e416b,
            {
              text: "✅ *Full hijack complete.*\n📌 Name changed\n📌 Description changed\n📌 Group closed",
            },
            { quoted: _0x1d4bcd },
          )
        );
      } catch (_0x4dd78a) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x4dd78a["message"] },
          { quoted: _0x1d4bcd },
        );
      }
    if (_0x333e56 === "fullhijack")
      try {
        const _0x3c79b5 = await _0x59a08c["groupMetadata"](_0x3e416b),
          _0x3feebf = getBotIdentifiers(_0x59a08c),
          _0x1e244b =
            _0x1d4bcd["key"]["participant"] || _0x1d4bcd["key"]["remoteJid"];
        (await _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "🌀 *Ultimate hijack initiated...*" },
          { quoted: _0x1d4bcd },
        ),
          await _0x59a08c["groupUpdateSubject"](
            _0x3e416b,
            "🌀 FUCKED BY MARCO X WAQAR MD BOT",
          ),
          await _0x59a08c["groupUpdateDescription"](
            _0x3e416b,
            "👑 This group has been hijacked by MARCO X WAQAR MD BOT.\n🌀 The void reigns supreme.\n\n☠️ All admins have been purged.",
          ));
        const _0xf0f224 = _0x3c79b5["participants"]
          [
            "filter"
          ]((_0x471a65) => _0x471a65["admin"] && !_0x3feebf["has"](_0x471a65["id"]) && _0x471a65["id"] !== _0x1e244b)
          ["map"]((_0x581d9b) => _0x581d9b["id"]);
        for (const _0x4ecf3e of _0xf0f224) {
          try {
            (await _0x59a08c["groupParticipantsUpdate"](
              _0x3e416b,
              [_0x4ecf3e],
              "remove",
            ),
              await new Promise((_0x4b5473) => setTimeout(_0x4b5473, 0x3e8)));
          } catch {}
        }
        return (
          await _0x59a08c["groupSettingUpdate"](_0x3e416b, "announcement"),
          _0x59a08c["sendMessage"](
            _0x3e416b,
            {
              text:
                "✅ *Ultimate hijack complete.*\n📌 Name changed\n📌 Description changed\n📌 " +
                _0xf0f224["length"] +
                " admin(s) removed\n📌 Group closed\n\n🌀 The void consumes all.",
            },
            { quoted: _0x1d4bcd },
          )
        );
      } catch (_0x529a89) {
        return _0x59a08c["sendMessage"](
          _0x3e416b,
          { text: "❌ Failed: " + _0x529a89["message"] },
          { quoted: _0x1d4bcd },
        );
      }
  },
};
