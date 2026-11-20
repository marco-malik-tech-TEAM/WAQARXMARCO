const https = require("https");
function downloadBuffer(_0xca82f3) {
  return new Promise((_0x204810, _0x289724) => {
    https["get"](_0xca82f3, (_0x26abbc) => {
      if (
        _0x26abbc["statusCode"] >= 0x12c &&
        _0x26abbc["statusCode"] < 0x190 &&
        _0x26abbc["headers"]["location"]
      )
        return downloadBuffer(_0x26abbc["headers"]["location"])
          ["then"](_0x204810)
          ["catch"](_0x289724);
      const _0x448f1a = [];
      (_0x26abbc["on"]("data", (_0x448547) => _0x448f1a["push"](_0x448547)),
        _0x26abbc["on"]("end", () => _0x204810(Buffer["concat"](_0x448f1a))),
        _0x26abbc["on"]("error", _0x289724));
    })["on"]("error", _0x289724);
  });
}
function getLastSeen(_0x5594c6, _0x32a349) {
  return new Promise((_0x4888bb) => {
    let _0x485a62 = ![];
    const _0x574bab = (_0x11bec0) => {
      if (_0x485a62) return;
      const _0x40b786 = _0x11bec0["presences"]?.[_0x32a349];
      _0x40b786 &&
        ((_0x485a62 = !![]),
        _0x5594c6["ev"]["off"]("presence.update", _0x574bab),
        _0x4888bb(_0x40b786));
    };
    (_0x5594c6["ev"]["on"]("presence.update", _0x574bab),
      _0x5594c6["presenceSubscribe"](_0x32a349)["catch"](() => {}),
      setTimeout(() => {
        if (_0x485a62) return;
        ((_0x485a62 = !![]),
          _0x5594c6["ev"]["off"]("presence.update", _0x574bab),
          _0x4888bb(null));
      }, 0xfa0));
  });
}
module["exports"] = {
  name: "ison",
  description:
    "Check if a phone number is on WhatsApp and view their info. Usage: .ison 923001234567",
  async execute(_0x32ba3b, _0x29f224, _0x45d80d) {
    const _0x17441b = _0x29f224["key"]["remoteJid"],
      _0x56a7df = _0x45d80d[0x0]?.["replace"](/[^0-9]/g, "");
    if (!_0x56a7df)
      return _0x32ba3b["sendMessage"](
        _0x17441b,
        { text: "❌ Usage: .ison 923001234567" },
        { quoted: _0x29f224 },
      );
    const _0x2f54c5 = _0x56a7df + "@s.whatsapp.net";
    try {
      const _0x133f8e = await _0x32ba3b["onWhatsApp"](_0x2f54c5),
        _0x51e526 = _0x133f8e?.[0x0];
      if (!_0x51e526?.["exists"])
        return _0x32ba3b["sendMessage"](
          _0x17441b,
          { text: "❌ +" + _0x56a7df + " is not on WhatsApp." },
          { quoted: _0x29f224 },
        );
      const _0x5068fe = _0x51e526["jid"] || _0x2f54c5;
      let _0x208719 = null;
      try {
        _0x208719 = _0x51e526["notify"] || null;
      } catch {}
      let _0xc3f84 = null,
        _0x5d86c1 = null;
      try {
        const _0x2f78b2 = await _0x32ba3b["fetchStatus"](_0x5068fe),
          _0x2153aa = Array["isArray"](_0x2f78b2) ? _0x2f78b2[0x0] : _0x2f78b2;
        ((_0xc3f84 = _0x2153aa?.["status"]?.["status"] || null),
          (_0x5d86c1 = _0x2153aa?.["status"]?.["setAt"] || null));
      } catch {}
      let _0x16d411 = "Not shared / unavailable";
      try {
        const _0x1c007e = await getLastSeen(_0x32ba3b, _0x5068fe);
        if (_0x1c007e?.["lastKnownPresence"] === "available")
          _0x16d411 = "Online now";
        else
          _0x1c007e?.["lastSeen"] &&
            (_0x16d411 = new Date(_0x1c007e["lastSeen"] * 0x3e8)[
              "toLocaleString"
            ]());
      } catch {}
      const _0x186438 = [
        "✅ *+" + _0x56a7df + " is on WhatsApp*",
        _0x208719 ? "👤 *Name:* " + _0x208719 : null,
        "📝 *About:* " +
          (_0xc3f84 || "Not available") +
          (_0x5d86c1
            ? " _(set " + new Date(_0x5d86c1)["toLocaleDateString"]() + ")_"
            : ""),
        "🕒 *Last seen:* " + _0x16d411,
      ]
        ["filter"](Boolean)
        ["join"]("\x0a");
      try {
        const _0x571f23 = await _0x32ba3b["profilePictureUrl"](
            _0x5068fe,
            "image",
          ),
          _0x11b746 = await downloadBuffer(_0x571f23);
        await _0x32ba3b["sendMessage"](
          _0x17441b,
          { image: _0x11b746, caption: _0x186438 },
          { quoted: _0x29f224 },
        );
      } catch {
        await _0x32ba3b["sendMessage"](
          _0x17441b,
          { text: _0x186438 + "\n\n🖼 No profile picture available." },
          { quoted: _0x29f224 },
        );
      }
    } catch (_0x3ed957) {
      await _0x32ba3b["sendMessage"](
        _0x17441b,
        { text: "❌ Could not check number: " + _0x3ed957["message"] },
        { quoted: _0x29f224 },
      );
    }
  },
};
