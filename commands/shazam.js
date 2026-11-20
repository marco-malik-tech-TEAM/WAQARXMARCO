const axios = require("axios"),
  fs = require("fs"),
  os = require("os"),
  path = require("path"),
  crypto = require("crypto"),
  { execFile } = require("child_process"),
  { promisify } = require("util"),
  ffmpegPath = process.env.FFMPEG_PATH || require("ffmpeg-static") || "ffmpeg",
  execFileAsync = promisify(execFile),
  { KEITH_BASE } = require("../config/apis"),
  API = KEITH_BASE,
  ACR_HOST = process.env.ACR_HOST || "identify-eu-west-1.acrcloud.com",
  ACR_ACCESS_KEY =
    process.env.ACR_ACCESS_KEY || "678eed85d47920b4737382eff9adfe46",
  ACR_ACCESS_SECRET =
    process.env.ACR_ACCESS_SECRET || "l70euTw5vrswSmnKk4T0EglrtPfpUhSzVi04Evea";
function extractMediaTarget(_0x254842) {
  const _0x2d2883 = _0x254842["message"];
  if (_0x2d2883?.["audioMessage"])
    return { type: "audio", message: _0x2d2883, key: _0x254842["key"] };
  if (_0x2d2883?.["videoMessage"])
    return { type: "video", message: _0x2d2883, key: _0x254842["key"] };
  const _0x229015 = _0x2d2883?.["extendedTextMessage"]?.["contextInfo"],
    _0x3f0629 = _0x229015?.["quotedMessage"];
  if (_0x3f0629?.["audioMessage"])
    return {
      type: "audio",
      message: _0x3f0629,
      key: {
        remoteJid: _0x254842["key"]["remoteJid"],
        id: _0x229015["stanzaId"],
        fromMe: ![],
        participant: _0x229015["participant"],
      },
    };
  if (_0x3f0629?.["videoMessage"])
    return {
      type: "video",
      message: _0x3f0629,
      key: {
        remoteJid: _0x254842["key"]["remoteJid"],
        id: _0x229015["stanzaId"],
        fromMe: ![],
        participant: _0x229015["participant"],
      },
    };
  return null;
}
async function identifyWithACRCloud(_0x113bbc) {
  if (!ACR_HOST || !ACR_ACCESS_KEY || !ACR_ACCESS_SECRET)
    throw new Error("ACRCloud credentials are not configured.");
  const _0x4eac81 = "POST",
    _0x3e4090 = "/v1/identify",
    _0x293a75 = "audio",
    _0x1c0c84 = "1",
    _0x4e58fd = Math["floor"](Date["now"]() / 0x3e8)["toString"](),
    _0x504da3 = [
      _0x4eac81,
      _0x3e4090,
      ACR_ACCESS_KEY,
      _0x293a75,
      _0x1c0c84,
      _0x4e58fd,
    ]["join"]("\x0a"),
    _0x5841cc = crypto["createHmac"]("sha1", ACR_ACCESS_SECRET)
      ["update"](Buffer["from"](_0x504da3, "utf-8"))
      ["digest"]("base64"),
    _0x531480 = fs["readFileSync"](_0x113bbc),
    _0x46d378 = require("form-data"),
    _0x248902 = new _0x46d378();
  (_0x248902["append"]("sample", _0x531480, {
    filename: "sample",
    contentType: "application/octet-stream",
  }),
    _0x248902["append"]("sample_bytes", _0x531480["length"]),
    _0x248902["append"]("access_key", ACR_ACCESS_KEY),
    _0x248902["append"]("data_type", _0x293a75),
    _0x248902["append"]("signature_version", _0x1c0c84),
    _0x248902["append"]("signature", _0x5841cc),
    _0x248902["append"]("timestamp", _0x4e58fd));
  const _0x1bfb71 = await axios["post"](
    "https://" + ACR_HOST + _0x3e4090,
    _0x248902,
    { headers: _0x248902["getHeaders"]() },
  );
  return _0x1bfb71["data"];
}
module["exports"] = {
  name: "shazam",
  description:
    "Identifies a song from audio/video and downloads the full track.",
  async execute(_0x529d5c, _0x162c60) {
    const _0x26fa2a = _0x162c60["key"]["remoteJid"],
      _0x1ba44c = extractMediaTarget(_0x162c60);
    if (!_0x1ba44c)
      return await _0x529d5c["sendMessage"](
        _0x26fa2a,
        {
          text: "🎧 Reply to a voice note, audio file, or short video with *.shazam*.",
        },
        { quoted: _0x162c60 },
      );
    await _0x529d5c["sendMessage"](_0x26fa2a, {
      react: { text: "🔎", key: _0x162c60["key"] },
    });
    let _0x516b15, _0x2b7c7f;
    try {
      const {
          downloadMediaMessage: _0x3ad367,
        } = require("@whiskeysockets/baileys"),
        _0x5cfef0 = { key: _0x1ba44c["key"], message: _0x1ba44c["message"] },
        _0x3cd9dd = await _0x3ad367(
          _0x5cfef0,
          "buffer",
          {},
          { reuploadRequest: _0x529d5c["updateMediaMessage"] },
        ),
        _0x198874 = os["tmpdir"](),
        _0x5991f2 = _0x1ba44c["type"] === "video" ? "mp4" : "ogg";
      ((_0x516b15 = path["join"](
        _0x198874,
        "shazam_in_" + Date["now"]() + "." + _0x5991f2,
      )),
        (_0x2b7c7f = path["join"](
          _0x198874,
          "shazam_out_" + Date["now"]() + ".mp3",
        )),
        fs["writeFileSync"](_0x516b15, _0x3cd9dd),
        await execFileAsync(ffmpegPath, [
          "-y",
          "-i",
          _0x516b15,
          "-t",
          "20",
          "-vn",
          "-ac",
          "1",
          "-ar",
          "44100",
          "-f",
          "mp3",
          _0x2b7c7f,
        ]));
      const _0x1b4130 = await identifyWithACRCloud(_0x2b7c7f);
      if (
        _0x1b4130?.["status"]?.["code"] !== 0x0 ||
        !_0x1b4130?.["metadata"]?.["music"]?.["length"]
      )
        return await _0x529d5c["sendMessage"](
          _0x26fa2a,
          { text: "😕 Couldn't identify that track. Try a clearer clip." },
          { quoted: _0x162c60 },
        );
      const _0x1820ea = _0x1b4130["metadata"]["music"][0x0],
        _0x399076 = _0x1820ea["title"],
        _0x2a23ff =
          _0x1820ea["artists"]
            ?.["map"]((_0x275993) => _0x275993["name"])
            ["join"](",\x20") || "Unknown",
        _0xd1cd76 = _0x1820ea["album"]?.["name"],
        _0x42579d = _0x1820ea["release_date"],
        _0xff1a90 = _0x1820ea["external_metadata"]?.["spotify"]?.["track"]?.[
          "id"
        ]
          ? "https://open.spotify.com/track/" +
            _0x1820ea["external_metadata"]["spotify"]["track"]["id"]
          : null,
        _0x5da51a =
          _0x1820ea["external_metadata"]?.["apple_music"]?.["url"] || null,
        _0x48ce81 =
          _0x1820ea["external_metadata"]?.["spotify"]?.["album"]?.[
            "images"
          ]?.[0x0]?.["url"] || null,
        _0x53423b = [
          "🎵 *" + _0x399076 + "*",
          "👤 *Artist:* " + _0x2a23ff,
          _0xd1cd76 ? "💿 *Album:* " + _0xd1cd76 : null,
          _0x42579d ? "📅 *Released:* " + _0x42579d : null,
          _0xff1a90 ? "🟢 *Spotify:* " + _0xff1a90 : null,
          _0x5da51a ? "🍎 *Apple Music:* " + _0x5da51a : null,
        ]
          ["filter"](Boolean)
          ["join"]("\x0a");
      _0x48ce81
        ? await _0x529d5c["sendMessage"](
            _0x26fa2a,
            { image: { url: _0x48ce81 }, caption: _0x53423b },
            { quoted: _0x162c60 },
          )
        : await _0x529d5c["sendMessage"](
            _0x26fa2a,
            { text: _0x53423b },
            { quoted: _0x162c60 },
          );
      const _0x8024cb = _0x399076 + "\x20" + _0x2a23ff;
      await _0x529d5c["sendMessage"](
        _0x26fa2a,
        { text: "🎧 Downloading *" + _0x8024cb + "*..." },
        { quoted: _0x162c60 },
      );
      const _0x994af8 = await axios["get"](
          API + "/search/yts?query=" + encodeURIComponent(_0x8024cb),
        ),
        _0x1ec9fc = _0x994af8["data"]?.["result"];
      if (!Array["isArray"](_0x1ec9fc) || _0x1ec9fc["length"] === 0x0)
        throw new Error("Could not find the song on YouTube.");
      const _0xb87d34 = _0x1ec9fc[0x0]["url"],
        _0x584a5a = await axios["get"](
          API + "/download/audio?url=" + encodeURIComponent(_0xb87d34),
        ),
        _0x596dbe = _0x584a5a["data"]?.["result"];
      if (!_0x596dbe) throw new Error("Failed to download audio.");
      await _0x529d5c["sendMessage"](
        _0x26fa2a,
        {
          audio: { url: _0x596dbe },
          mimetype: "audio/mpeg",
          fileName: _0x399076 + ".mp3",
          ptt: ![],
        },
        { quoted: _0x162c60 },
      );
    } catch (_0x136ccf) {
      (console["error"]("[SHAZAM ERROR]", _0x136ccf),
        await _0x529d5c["sendMessage"](
          _0x26fa2a,
          { text: "⚠️ " + _0x136ccf["message"] },
          { quoted: _0x162c60 },
        ));
    } finally {
      [_0x516b15, _0x2b7c7f]["forEach"]((_0x18baa0) => {
        if (_0x18baa0 && fs["existsSync"](_0x18baa0))
          try {
            fs["unlinkSync"](_0x18baa0);
          } catch {}
      });
    }
  },
};
