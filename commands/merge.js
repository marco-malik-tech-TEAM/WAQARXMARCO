const fs = require("fs"),
  os = require("os"),
  path = require("path"),
  { execSync } = require("child_process"),
  queues = new Map();
module["exports"] = {
  name: "merge",
  description:
    "Merge queued videos. Usage: reply to video with .merge, then .merge done",
  queues: queues,
  async execute(_0x4c4463, _0x55d5d9, _0x31c23a) {
    const _0x405be0 = _0x55d5d9["key"]["remoteJid"],
      _0x534db4 = _0x31c23a[0x0]?.["toLowerCase"]();
    if (_0x534db4 === "cancel") {
      const _0x46987b = queues["get"](_0x405be0) || [];
      return (
        _0x46987b["forEach"]((_0x35f9f5) => {
          try {
            fs["unlinkSync"](_0x35f9f5);
          } catch {}
        }),
        queues["delete"](_0x405be0),
        _0x4c4463["sendMessage"](
          _0x405be0,
          { text: "🗑 Merge queue cleared." },
          { quoted: _0x55d5d9 },
        )
      );
    }
    if (_0x534db4 === "done") {
      const _0xecd924 = queues["get"](_0x405be0) || [];
      if (_0xecd924["length"] < 0x2)
        return _0x4c4463["sendMessage"](
          _0x405be0,
          {
            text: "❌ Add at least 2 videos first by replying to each with .merge",
          },
          { quoted: _0x55d5d9 },
        );
      await _0x4c4463["sendMessage"](
        _0x405be0,
        { text: "🔗 Merging " + _0xecd924["length"] + " videos..." },
        { quoted: _0x55d5d9 },
      );
      const _0x2dafee = path["join"](
          os["tmpdir"](),
          "merge_list_" + Date["now"]() + ".txt",
        ),
        _0x3eda62 = path["join"](
          os["tmpdir"](),
          "merge_out_" + Date["now"]() + ".mp4",
        );
      try {
        (fs["writeFileSync"](
          _0x2dafee,
          _0xecd924["map"]((_0x47ea81) => "file '" + _0x47ea81 + "\x27")[
            "join"
          ]("\x0a"),
        ),
          execSync(
            'ffmpeg -y -f concat -safe 0 -i "' +
              _0x2dafee +
              '" -c copy "' +
              _0x3eda62 +
              "\x22",
          ));
        const _0x31b4b7 = fs["readFileSync"](_0x3eda62);
        await _0x4c4463["sendMessage"](
          _0x405be0,
          { video: _0x31b4b7, caption: "✅ Merged video" },
          { quoted: _0x55d5d9 },
        );
      } catch (_0x460a1e) {
        await _0x4c4463["sendMessage"](
          _0x405be0,
          { text: "❌ Merge failed: " + _0x460a1e["message"] },
          { quoted: _0x55d5d9 },
        );
      } finally {
        (_0xecd924["forEach"]((_0x37bd99) => {
          try {
            fs["unlinkSync"](_0x37bd99);
          } catch {}
        }),
          [_0x2dafee, _0x3eda62]["forEach"]((_0x1758ed) => {
            try {
              fs["unlinkSync"](_0x1758ed);
            } catch {}
          }),
          queues["delete"](_0x405be0));
      }
      return;
    }
    const _0x478b79 =
        _0x55d5d9["message"]?.["extendedTextMessage"]?.["contextInfo"],
      _0x257b95 = _0x478b79?.["quotedMessage"];
    if (!_0x257b95?.["videoMessage"])
      return _0x4c4463["sendMessage"](
        _0x405be0,
        {
          text: "❌ Reply to a video with .merge to add it to the queue.\nWhen you have 2+ videos queued, run .merge done\nUse .merge cancel to clear the queue.",
        },
        { quoted: _0x55d5d9 },
      );
    try {
      const _0x1e78f7 = await _0x4c4463["downloadMediaMessage"]({
          message: _0x257b95,
          key: {
            remoteJid: _0x405be0,
            id: _0x478b79["stanzaId"],
            participant: _0x478b79["participant"],
          },
        }),
        _0x5ee710 = path["join"](
          os["tmpdir"](),
          "merge_" +
            Date["now"]() +
            "_" +
            Math["random"]()["toString"](0x24)["slice"](0x2) +
            ".mp4",
        );
      fs["writeFileSync"](_0x5ee710, _0x1e78f7);
      const _0x414a85 = queues["get"](_0x405be0) || [];
      (_0x414a85["push"](_0x5ee710),
        queues["set"](_0x405be0, _0x414a85),
        await _0x4c4463["sendMessage"](
          _0x405be0,
          {
            text:
              "✅ Added to merge queue (" +
              _0x414a85["length"] +
              " video" +
              (_0x414a85["length"] > 0x1 ? "s" : "") +
              ").\nReply to more videos, then send .merge done",
          },
          { quoted: _0x55d5d9 },
        ));
    } catch (_0x144017) {
      await _0x4c4463["sendMessage"](
        _0x405be0,
        { text: "❌ Could not add video: " + _0x144017["message"] },
        { quoted: _0x55d5d9 },
      );
    }
  },
};
