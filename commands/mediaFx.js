"use strict";
const fs = require("fs"),
  path = require("path"),
  kit = require("../utils/mediaKit"),
  {
    ff,
    probe,
    makeDir,
    rmDir,
    extFor,
    parseTime,
    stamp,
    textStrip,
    textLayer,
    kb,
    even,
    parseHex,
    COLOR_WORDS,
    THEMES,
    audioJob,
  } = kit,
  BM = kit["BRAND"],
  TAG = kit["TAG"],
  stitchQueues = new Map();
function dropStitch(_0x2fbc2d) {
  const _0x2bb0b6 = stitchQueues["get"](_0x2fbc2d);
  _0x2bb0b6 &&
    (clearTimeout(_0x2bb0b6["timer"]),
    rmDir(_0x2bb0b6["dir"]),
    stitchQueues["delete"](_0x2fbc2d));
}
module["exports"] = [
  {
    name: "tovn",
    aliases: ["tovoice", "toptt", "voicenote"],
    description: "Convert audio / video / a song into a voice note",
    async execute(_0x345e32, _0x1534de, _0x26f8ae) {
      const _0x2ddb4e = kit["ctx"](_0x345e32, _0x1534de, _0x26f8ae);
      try {
        const _0x2246ae = await _0x2ddb4e["needMedia"](
          /audio|video/,
          "🎙️ Reply to an *audio*, *song* or *video* with *.tovn* to send it as a voice note.",
        );
        if (!_0x2246ae) return;
        await _0x2ddb4e["reply"]("🎙️ _Making a voice note..._");
        const _0x4bac47 = await kit["makeVoiceNote"](
          _0x2246ae["buf"],
          _0x2246ae["mime"],
        );
        await _0x2ddb4e["send"]({
          audio: _0x4bac47["buf"],
          mimetype: "audio/ogg; codecs=opus",
          ptt: !![],
          seconds: _0x4bac47["seconds"],
        });
      } catch (_0xc6b785) {
        _0x2ddb4e["reply"]("❌ Failed: " + _0xc6b785["message"]);
      }
    },
  },
  {
    name: "subtitle",
    aliases: ["addsub", "subs"],
    description:
      "Burn text onto a video (.subtitle <text> or .subtitle 2-6 <text>)",
    async execute(_0x103f0a, _0x3b8804, _0x342be0) {
      const _0x516a8c = kit["ctx"](_0x103f0a, _0x3b8804, _0x342be0);
      let _0x1cd91e = _0x516a8c["text"];
      if (!_0x1cd91e)
        return _0x516a8c["reply"](
          "💬 Reply to a video with *.subtitle Your text here*\n\nOnly for part of the video: *.subtitle 2-6 Your text* (seconds 2 to 6)",
        );
      let _0x39969c = null,
        _0xf37a2b = null;
      const _0x4cf737 = _0x1cd91e["match"](
        /^(\S+)\s*(?:-|–|—)\s*(\S+)\s+([\s\S]+)$/,
      );
      _0x4cf737 &&
        parseTime(_0x4cf737[0x1]) != null &&
        parseTime(_0x4cf737[0x2]) != null &&
        ((_0x39969c = parseTime(_0x4cf737[0x1])),
        (_0xf37a2b = parseTime(_0x4cf737[0x2])),
        (_0x1cd91e = _0x4cf737[0x3]["trim"]()));
      if (_0x1cd91e["length"] > 0xc8)
        return _0x516a8c["reply"]("⚠️ Text is too long (max 200 characters).");
      const _0x38f707 = makeDir("sub");
      try {
        const _0x254d95 = await _0x516a8c["needMedia"](
          /video|gif/,
          "💬 Reply to a *video* with *.subtitle <text>*",
        );
        if (!_0x254d95) return;
        await _0x516a8c["reply"]("💬 _Adding subtitles..._");
        const _0x6bed4f = path["join"](_0x38f707, "in.mp4");
        fs["writeFileSync"](_0x6bed4f, _0x254d95["buf"]);
        const _0xadd3aa = await probe(_0x6bed4f);
        if (!_0xadd3aa["w"] || !_0xadd3aa["h"])
          throw new Error("could not read the video size");
        if (_0xadd3aa["seconds"] > 0xb4)
          return _0x516a8c["reply"](
            "⚠️ Video too long. Use one of 3 minutes or less.",
          );
        const _0x4de0c6 = await textStrip(_0x1cd91e, _0xadd3aa["w"], {
            maxHeight: Math["round"](_0xadd3aa["h"] / 0x3),
          }),
          _0x2b17ee = path["join"](_0x38f707, "sub.png");
        fs["writeFileSync"](_0x2b17ee, _0x4de0c6["png"]);
        const _0x425228 = Math["max"](
            0x0,
            _0xadd3aa["h"] -
              _0x4de0c6["h"] -
              Math["round"](_0xadd3aa["h"] * 0.07),
          ),
          _0x247e18 =
            _0x39969c != null
              ? ":enable='between(t," + _0x39969c + "," + _0xf37a2b + ")\x27"
              : "",
          _0x464a6f = path["join"](_0x38f707, "out.mp4"),
          _0x5a2e28 =
            "[0:v][1:v]overlay=0:" +
            _0x425228 +
            _0x247e18 +
            ",scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p[v]",
          _0x5d2a2b = [
            "-filter_complex",
            _0x5a2e28,
            "-map",
            "[v]",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "24",
            "-movflags",
            "faststart",
          ];
        try {
          await ff([
            "-y",
            "-i",
            _0x6bed4f,
            "-i",
            _0x2b17ee,
            ..._0x5d2a2b,
            "-map",
            "0:a?",
            "-c:a",
            "copy",
            _0x464a6f,
          ]);
        } catch (_0x274d65) {
          await ff([
            "-y",
            "-i",
            _0x6bed4f,
            "-i",
            _0x2b17ee,
            ..._0x5d2a2b,
            "-an",
            _0x464a6f,
          ]);
        }
        await _0x516a8c["send"]({
          video: fs["readFileSync"](_0x464a6f),
          mimetype: "video/mp4",
          caption: "💬 Subtitled",
        });
      } catch (_0x39906e) {
        _0x516a8c["reply"]("❌ Failed: " + _0x39906e["message"]);
      } finally {
        rmDir(_0x38f707);
      }
    },
  },
  {
    name: "vidframe",
    aliases: ["grabframe", "videoframe", "framegrab"],
    description: "Get a still picture from a video at a time (.vidframe 0:12)",
    async execute(_0x10cade, _0x896d55, _0x504d14) {
      const _0x100792 = kit["ctx"](_0x10cade, _0x896d55, _0x504d14),
        _0x19b4cd = _0x100792["text"]["toLowerCase"](),
        _0x46ae3a = makeDir("shot");
      try {
        const _0x3dfbea = await _0x100792["needMedia"](
          /video|gif/,
          "🖼️ Reply to a video with *.vidframe 0:12*  (or *.vidframe mid* for the middle)",
        );
        if (!_0x3dfbea) return;
        const _0x5bbdbe = path["join"](_0x46ae3a, "in.mp4");
        fs["writeFileSync"](_0x5bbdbe, _0x3dfbea["buf"]);
        const _0x53249f = await probe(_0x5bbdbe);
        let _0x2d5baa =
          _0x19b4cd === "mid" || _0x19b4cd === "middle"
            ? _0x53249f["seconds"] / 0x2
            : _0x19b4cd
              ? parseTime(_0x19b4cd)
              : 0x1;
        if (_0x2d5baa == null)
          return _0x100792["reply"](
            "⚠️ I did not understand that time. Try *.vidframe 0:12* or *.vidframe 12*",
          );
        if (_0x53249f["seconds"] && _0x2d5baa > _0x53249f["seconds"])
          _0x2d5baa = Math["max"](0x0, _0x53249f["seconds"] - 0.1);
        const _0x4bad07 = path["join"](_0x46ae3a, "frame.jpg");
        await ff([
          "-y",
          "-ss",
          String(_0x2d5baa),
          "-i",
          _0x5bbdbe,
          "-frames:v",
          "1",
          "-q:v",
          "2",
          _0x4bad07,
        ]);
        if (!fs["existsSync"](_0x4bad07))
          throw new Error("no picture at that time");
        await _0x100792["send"]({
          image: fs["readFileSync"](_0x4bad07),
          caption: "🖼️ Frame at " + stamp(_0x2d5baa),
        });
      } catch (_0x4bbe5a) {
        _0x100792["reply"]("❌ Failed: " + _0x4bbe5a["message"]);
      } finally {
        rmDir(_0x46ae3a);
      }
    },
  },
  {
    name: "stitch",
    aliases: ["collage", "joinimages", "combine"],
    description:
      "Join pictures into one (reply to each with .stitch, then .stitch done [h|v|grid])",
    async execute(_0x3ca345, _0x3a855d, _0x4b3def) {
      const _0x14f7f5 = kit["ctx"](_0x3ca345, _0x3a855d, _0x4b3def),
        _0x2113cd = _0x14f7f5["text"]["toLowerCase"](),
        _0xa1ccc = stitchQueues["get"](_0x14f7f5["sender"]);
      if (_0x2113cd === "clear")
        return (
          dropStitch(_0x14f7f5["sender"]),
          _0x14f7f5["reply"]("🗑️ Stitch list cleared.")
        );
      if (/^(done|go|h|v|grid|side|stack)/["test"](_0x2113cd)) {
        if (!_0xa1ccc || _0xa1ccc["files"]["length"] < 0x2)
          return _0x14f7f5["reply"](
            "⚠️ Add at least 2 pictures first: reply to each with *.stitch*",
          );
        const _0x2323bf =
          /^(v|stack)/["test"](_0x2113cd) || /\sv$/["test"](_0x2113cd)
            ? "v"
            : /grid/["test"](_0x2113cd)
              ? "grid"
              : /^(h|side)/["test"](_0x2113cd) || /\sh$/["test"](_0x2113cd)
                ? "h"
                : _0xa1ccc["files"]["length"] > 0x3
                  ? "grid"
                  : "h";
        try {
          await _0x14f7f5["reply"]("🧩 _Stitching..._");
          const _0x6c5e70 = _0xa1ccc["files"]["length"],
            _0x336c8d = _0xa1ccc["files"]["flatMap"]((_0x4c536c) => [
              "-i",
              _0x4c536c,
            ]);
          let _0x499002;
          if (_0x2323bf === "h")
            _0x499002 =
              _0xa1ccc["files"]
                [
                  "map"
                ]((_0x2e1d22, _0x9d0247) => "[" + _0x9d0247 + ":v]scale=-2:900[s" + _0x9d0247 + "]")
                ["join"](";") +
              ";" +
              _0xa1ccc["files"]
                ["map"]((_0x2991f3, _0x585918) => "[s" + _0x585918 + "]")
                ["join"]("") +
              ("hstack=inputs=" + _0x6c5e70 + ",scale='min(2400,iw)':-2[v]");
          else {
            if (_0x2323bf === "v")
              _0x499002 =
                _0xa1ccc["files"]
                  [
                    "map"
                  ]((_0x50be2a, _0x412314) => "[" + _0x412314 + ":v]scale=1000:-2[s" + _0x412314 + "]")
                  ["join"](";") +
                ";" +
                _0xa1ccc["files"]
                  ["map"]((_0x264aa7, _0x3f269c) => "[s" + _0x3f269c + "]")
                  ["join"]("") +
                ("vstack=inputs=" + _0x6c5e70 + ",scale=-2:'min(2400,ih)'[v]");
            else {
              const _0x3314e5 = Math["ceil"](Math["sqrt"](_0x6c5e70)),
                _0x572cdd = 0x2bc,
                _0x2ccfa6 = _0xa1ccc["files"]
                  [
                    "map"
                  ]((_0x4327bc, _0x290d70) => (_0x290d70 % _0x3314e5 === 0x0 ? 0x0 : Array["from"]({ length: _0x290d70 % _0x3314e5 }, (_0x314833, _0x30a6db) => "w" + (_0x290d70 - (_0x290d70 % _0x3314e5) + _0x30a6db))["join"]("+")) + "_" + (Math["floor"](_0x290d70 / _0x3314e5) === 0x0 ? 0x0 : Array["from"]({ length: Math["floor"](_0x290d70 / _0x3314e5) }, (_0x43a9a1, _0x85f210) => "h" + ((_0x290d70 % _0x3314e5) + _0x85f210 * _0x3314e5))["join"]("+")))
                  ["join"]("|");
              _0x499002 =
                _0xa1ccc["files"]
                  [
                    "map"
                  ]((_0x4a3b67, _0x581d29) => "[" + _0x581d29 + ":v]scale=" + _0x572cdd + ":" + _0x572cdd + ":force_original_aspect_ratio=increase,crop=" + _0x572cdd + ":" + _0x572cdd + "[s" + _0x581d29 + "]")
                  ["join"](";") +
                ";" +
                _0xa1ccc["files"]
                  ["map"]((_0x4dd772, _0x3545cf) => "[s" + _0x3545cf + "]")
                  ["join"]("") +
                ("xstack=inputs=" +
                  _0x6c5e70 +
                  ":layout=" +
                  _0x2ccfa6 +
                  ":fill=black[v]");
            }
          }
          const _0x889d93 = path["join"](_0xa1ccc["dir"], "stitched.jpg");
          (await ff([
            "-y",
            ..._0x336c8d,
            "-filter_complex",
            _0x499002,
            "-map",
            "[v]",
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0x889d93,
          ]),
            await _0x14f7f5["send"]({
              image: fs["readFileSync"](_0x889d93),
              caption: "🧩 " + _0x6c5e70 + " pictures stitched • " + TAG,
            }));
        } catch (_0x460054) {
          _0x14f7f5["reply"]("❌ Failed: " + _0x460054["message"]);
        } finally {
          dropStitch(_0x14f7f5["sender"]);
        }
        return;
      }
      const _0x3e6f8d = _0x14f7f5["media"](),
        _0x49a10d = _0x3e6f8d ? _0x3e6f8d["mime"] : "";
      if (!_0x3e6f8d || !/image/["test"](_0x49a10d))
        return _0x14f7f5["reply"](
          "🧩 *" +
            BM +
            " Stitch*\n\n1) Reply to a picture with *.stitch* (do it for each one, up to 9)\n2) Send *.stitch done*\n    *.stitch done h*  side by side\n    *.stitch done v*  stacked\n    *.stitch done grid*  tiles\n\n*.stitch clear* starts over.",
        );
      try {
        let _0x521667 = stitchQueues["get"](_0x14f7f5["sender"]);
        !_0x521667 &&
          ((_0x521667 = { dir: makeDir("stitch"), files: [], timer: null }),
          stitchQueues["set"](_0x14f7f5["sender"], _0x521667));
        if (_0x521667["files"]["length"] >= 0x9)
          return _0x14f7f5["reply"](
            "⚠️ Max 9 pictures. Send *.stitch done* now.",
          );
        const _0x56e9f9 = await _0x14f7f5["download"](_0x3e6f8d),
          _0x48830e = path["join"](
            _0x521667["dir"],
            _0x521667["files"]["length"] + "." + extFor(_0x49a10d),
          );
        (fs["writeFileSync"](_0x48830e, _0x56e9f9),
          _0x521667["files"]["push"](_0x48830e),
          clearTimeout(_0x521667["timer"]),
          (_0x521667["timer"] = setTimeout(
            () => dropStitch(_0x14f7f5["sender"]),
            0xf * 0x3c * 0x3e8,
          )),
          _0x14f7f5["reply"](
            "✅ Added (" +
              _0x521667["files"]["length"] +
              "). Reply to the next one, or send *.stitch done*  (h / v / grid)",
          ));
      } catch (_0x589a1d) {
        _0x14f7f5["reply"]("❌ Failed: " + _0x589a1d["message"]);
      }
    },
  },
  {
    name: "compress",
    aliases: ["shrink", "reducesize"],
    description:
      "Make a video / picture / audio smaller (.compress low|medium|high)",
    async execute(_0x1f46d9, _0x562d61, _0x2a89d5) {
      const _0x18f7da = kit["ctx"](_0x1f46d9, _0x562d61, _0x2a89d5),
        _0x4ebc90 = /high|max|extreme/i["test"](_0x18f7da["text"])
          ? "high"
          : /low|light/i["test"](_0x18f7da["text"])
            ? "low"
            : "medium",
        _0x362f3e = makeDir("cmp");
      try {
        const _0x57af35 = await _0x18f7da["needMedia"](
          /video|image|audio/,
          "🗜️ Reply to a *video*, *picture* or *audio* with *.compress*\n\n*.compress low*  (best quality)\n*.compress medium*\n*.compress high*  (smallest file)",
        );
        if (!_0x57af35) return;
        await _0x18f7da["reply"]("🗜️ _Compressing..._");
        const _0x301137 = path["join"](
          _0x362f3e,
          "in." + extFor(_0x57af35["mime"]),
        );
        fs["writeFileSync"](_0x301137, _0x57af35["buf"]);
        if (/video/["test"](_0x57af35["mime"])) {
          const _0x55e6e7 = { low: 0x2d0, medium: 0x21c, high: 0x168 }[
              _0x4ebc90
            ],
            _0x2794c5 = { low: 0x1a, medium: 0x1e, high: 0x23 }[_0x4ebc90],
            _0x40b754 = path["join"](_0x362f3e, "out.mp4"),
            _0x4d89d7 = [
              "-y",
              "-i",
              _0x301137,
              "-vf",
              "scale=-2:'min(" +
                _0x55e6e7 +
                ",ih)',scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              String(_0x2794c5),
              "-movflags",
              "faststart",
            ];
          try {
            await ff(
              [
                ..._0x4d89d7,
                "-c:a",
                "aac",
                "-b:a",
                _0x4ebc90 === "high" ? "48k" : "80k",
                _0x40b754,
              ],
              0x3a980,
            );
          } catch (_0x28b7bb) {
            await ff([..._0x4d89d7, "-an", _0x40b754], 0x3a980);
          }
          const _0x59f4af = fs["readFileSync"](_0x40b754);
          await _0x18f7da["send"]({
            video: _0x59f4af,
            mimetype: "video/mp4",
            caption:
              "🗜️ " +
              kb(_0x57af35["buf"]["length"]) +
              " → *" +
              kb(_0x59f4af["length"]) +
              "* (" +
              Math["max"](
                0x0,
                Math["round"](
                  (0x1 - _0x59f4af["length"] / _0x57af35["buf"]["length"]) *
                    0x64,
                ),
              ) +
              "% smaller) • " +
              TAG,
          });
        } else {
          if (/image/["test"](_0x57af35["mime"])) {
            const _0x5d5be7 = { low: 0x7d0, medium: 0x578, high: 0x384 }[
                _0x4ebc90
              ],
              _0x3d0afc = { low: 0x4, medium: 0x8, high: 0xe }[_0x4ebc90],
              _0x57ea29 = path["join"](_0x362f3e, "out.jpg");
            await ff([
              "-y",
              "-i",
              _0x301137,
              "-vf",
              "scale='min(" + _0x5d5be7 + ",iw)':-2",
              "-q:v",
              String(_0x3d0afc),
              "-frames:v",
              "1",
              _0x57ea29,
            ]);
            const _0x27fea0 = fs["readFileSync"](_0x57ea29);
            await _0x18f7da["send"]({
              image: _0x27fea0,
              caption:
                "🗜️ " +
                kb(_0x57af35["buf"]["length"]) +
                " → *" +
                kb(_0x27fea0["length"]) +
                "* • " +
                TAG,
            });
          } else {
            const _0x56c00c = path["join"](_0x362f3e, "out.mp3");
            await ff([
              "-y",
              "-i",
              _0x301137,
              "-vn",
              "-c:a",
              "libmp3lame",
              "-b:a",
              { low: "128k", medium: "96k", high: "64k" }[_0x4ebc90],
              "-ac",
              "1",
              _0x56c00c,
            ]);
            const _0x1646fa = fs["readFileSync"](_0x56c00c);
            (await _0x18f7da["send"]({
              audio: _0x1646fa,
              mimetype: "audio/mpeg",
              ptt: ![],
              fileName: "compressed.mp3",
            }),
              await _0x18f7da["reply"](
                "🗜️ " +
                  kb(_0x57af35["buf"]["length"]) +
                  " → *" +
                  kb(_0x1646fa["length"]) +
                  "*",
              ));
          }
        }
      } catch (_0x2a5010) {
        _0x18f7da["reply"]("❌ Failed: " + _0x2a5010["message"]);
      } finally {
        rmDir(_0x362f3e);
      }
    },
  },
  {
    name: "crop",
    aliases: ["cropto", "resizeto"],
    description:
      "Crop a picture / video to a shape (.crop 1:1, 9:16, 16:9, 4:5)",
    async execute(_0x463c5a, _0x4ead41, _0x291cf9) {
      const _0x57414e = kit["ctx"](_0x463c5a, _0x4ead41, _0x291cf9),
        _0x4c46dc = _0x57414e["text"]
          ["toLowerCase"]()
          ["split"](/\s+/)
          ["filter"](Boolean),
        _0x55b097 = {
          square: "1:1",
          story: "9:16",
          status: "9:16",
          tall: "9:16",
          wide: "16:9",
          landscape: "16:9",
          portrait: "4:5",
          insta: "4:5",
          cinema: "21:9",
        };
      let _0x564130 = null,
        _0x5a9da3 = "center";
      for (const _0x274f94 of _0x4c46dc) {
        if (/^\d+(\.\d+)?[:x/]\d+(\.\d+)?$/["test"](_0x274f94))
          _0x564130 = _0x274f94["split"](/[:x/]/)["map"](Number);
        else {
          if (_0x55b097[_0x274f94])
            _0x564130 = _0x55b097[_0x274f94]["split"](":")["map"](Number);
          else {
            if (/^(top|bottom|left|right|center|centre)$/["test"](_0x274f94))
              _0x5a9da3 = _0x274f94;
          }
        }
      }
      if (!_0x564130 || !_0x564130[0x0] || !_0x564130[0x1])
        return _0x57414e["reply"](
          "✂️ *" +
            BM +
            " Crop*\n\nReply to a picture or video:\n*.crop 1:1*  square\n*.crop 9:16*  story / status\n*.crop 16:9*  wide\n*.crop 4:5*  portrait\n\nChoose which part to keep: *.crop 1:1 top* (top / bottom / left / right / center)",
        );
      const _0x18badd = makeDir("crop");
      try {
        const _0x3ce7ea = await _0x57414e["needMedia"](
          /image|video/,
          "✂️ Reply to a *picture* or *video* with *.crop 1:1*",
        );
        if (!_0x3ce7ea) return;
        const _0x13802d = /video/["test"](_0x3ce7ea["mime"]),
          _0x17dc07 = path["join"](
            _0x18badd,
            "in." + extFor(_0x3ce7ea["mime"]),
          );
        fs["writeFileSync"](_0x17dc07, _0x3ce7ea["buf"]);
        const [_0x73d6c1, _0x5aa830] = _0x564130,
          _0x39aa9a =
            _0x5a9da3 === "left" ? 0x0 : _0x5a9da3 === "right" ? 0x1 : 0.5,
          _0xb0823f =
            _0x5a9da3 === "top" ? 0x0 : _0x5a9da3 === "bottom" ? 0x1 : 0.5,
          _0x2bf23d = "min(iw\\,ih*" + _0x73d6c1 + "/" + _0x5aa830 + ")",
          _0x30648f = "min(ih\\,iw*" + _0x5aa830 + "/" + _0x73d6c1 + ")",
          _0x2b7707 =
            "crop=w=trunc(" +
            _0x2bf23d +
            "/2)*2:h=trunc(" +
            _0x30648f +
            "/2)*2:x=(iw-trunc(" +
            _0x2bf23d +
            "/2)*2)*" +
            _0x39aa9a +
            ":y=(ih-trunc(" +
            _0x30648f +
            "/2)*2)*" +
            _0xb0823f;
        if (_0x13802d) {
          const _0xbde811 = path["join"](_0x18badd, "out.mp4"),
            _0x56f897 = [
              "-y",
              "-i",
              _0x17dc07,
              "-vf",
              _0x2b7707 + ",format=yuv420p",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "23",
              "-movflags",
              "faststart",
            ];
          try {
            await ff([..._0x56f897, "-c:a", "copy", _0xbde811]);
          } catch (_0x172fc0) {
            await ff([..._0x56f897, "-an", _0xbde811]);
          }
          await _0x57414e["send"]({
            video: fs["readFileSync"](_0xbde811),
            mimetype: "video/mp4",
            caption:
              "✂️ Cropped to " + _0x73d6c1 + ":" + _0x5aa830 + " • " + TAG,
          });
        } else {
          const _0x3a80ec = path["join"](_0x18badd, "out.jpg");
          (await ff([
            "-y",
            "-i",
            _0x17dc07,
            "-vf",
            _0x2b7707,
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0x3a80ec,
          ]),
            await _0x57414e["send"]({
              image: fs["readFileSync"](_0x3a80ec),
              caption:
                "✂️ Cropped to " + _0x73d6c1 + ":" + _0x5aa830 + " • " + TAG,
            }));
        }
      } catch (_0x38170e) {
        _0x57414e["reply"]("❌ Failed: " + _0x38170e["message"]);
      } finally {
        rmDir(_0x18badd);
      }
    },
  },
  {
    name: "sketch",
    aliases: ["pencil", "drawing"],
    description:
      "Turn a picture / video into a pencil sketch (.sketch or .sketch color)",
    async execute(_0x25b48e, _0x20d51e, _0x5ecc55) {
      const _0x1f8a3b = kit["ctx"](_0x25b48e, _0x20d51e, _0x5ecc55),
        _0x399211 = /colou?r/i["test"](_0x1f8a3b["text"]),
        _0x23be03 = makeDir("skt");
      try {
        const _0x14b64f = await _0x1f8a3b["needMedia"](
          /image|video/,
          "✏️ Reply to a *picture* or *video* with *.sketch*  (or *.sketch color*)",
        );
        if (!_0x14b64f) return;
        await _0x1f8a3b["reply"]("✏️ _Sketching..._");
        const _0x38e20a = /video/["test"](_0x14b64f["mime"]),
          _0x11237a = path["join"](
            _0x23be03,
            "in." + extFor(_0x14b64f["mime"]),
          );
        fs["writeFileSync"](_0x11237a, _0x14b64f["buf"]);
        const _0x4433ac = _0x399211
          ? "[0:v]split=2[a][b];[b]format=gray,negate,gblur=sigma=10[c];[a]format=gbrp[a2];[c]format=gbrp[c2];[a2][c2]blend=all_mode=divide,eq=contrast=1.15:saturation=1.3,format=yuv420p[v]"
          : "[0:v]format=gray,split=2[a][b];[b]negate,gblur=sigma=10[c];[a][c]blend=all_mode=divide,eq=contrast=1.25,format=yuv420p[v]";
        if (_0x38e20a) {
          const _0xb28f24 = await probe(_0x11237a);
          if (_0xb28f24["seconds"] > 0x3c)
            return _0x1f8a3b["reply"]("⚠️ Use a video of 60 seconds or less.");
          const _0x464e4b = path["join"](_0x23be03, "out.mp4"),
            _0x56fd6e = [
              "-y",
              "-i",
              _0x11237a,
              "-filter_complex",
              _0x4433ac["replace"]("[v]", "[v0]") +
                ";[v0]scale=trunc(iw/2)*2:trunc(ih/2)*2[v]",
              "-map",
              "[v]",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "24",
              "-movflags",
              "faststart",
            ];
          try {
            await ff(
              [..._0x56fd6e, "-map", "0:a?", "-c:a", "copy", _0x464e4b],
              0x3a980,
            );
          } catch (_0x704255) {
            await ff([..._0x56fd6e, "-an", _0x464e4b], 0x3a980);
          }
          await _0x1f8a3b["send"]({
            video: fs["readFileSync"](_0x464e4b),
            mimetype: "video/mp4",
            caption: "✏️ Sketch • " + TAG,
          });
        } else {
          const _0x54f96a = path["join"](_0x23be03, "out.jpg");
          (await ff([
            "-y",
            "-i",
            _0x11237a,
            "-filter_complex",
            _0x4433ac,
            "-map",
            "[v]",
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0x54f96a,
          ]),
            await _0x1f8a3b["send"]({
              image: fs["readFileSync"](_0x54f96a),
              caption: "✏️ Sketch • " + TAG,
            }));
        }
      } catch (_0x18884e) {
        _0x1f8a3b["reply"]("❌ Failed: " + _0x18884e["message"]);
      } finally {
        rmDir(_0x23be03);
      }
    },
  },
  {
    name: "pitch",
    aliases: ["voicepitch", "voicechanger"],
    description:
      "Change the voice pitch (.pitch deep | chipmunk | up | down | -12..12)",
    async execute(_0x359da2, _0x53db07, _0x2a22cd) {
      const _0x3f8daf = kit["ctx"](_0x359da2, _0x53db07, _0x2a22cd),
        _0x57d5c1 = {
          deep: -0x6,
          low: -0x5,
          monster: -0xa,
          down: -0x4,
          up: 0x4,
          high: 0x5,
          chipmunk: 0x8,
          baby: 0xa,
          girl: 0x4,
          boy: -0x4,
        },
        _0x49ae37 = _0x3f8daf["text"]["toLowerCase"]();
      let _0x442a73 =
        _0x57d5c1[_0x49ae37] !== undefined
          ? _0x57d5c1[_0x49ae37]
          : /^[+-]?\d+(\.\d+)?$/["test"](_0x49ae37)
            ? Number(_0x49ae37)
            : null;
      if (_0x442a73 === null)
        return _0x3f8daf["reply"](
          "🎚️ *" +
            BM +
            " Pitch*\n\nReply to a voice note, song or video:\n*.pitch deep*  •  *.pitch monster*\n*.pitch chipmunk*  •  *.pitch baby*\n*.pitch up*  •  *.pitch down*\n*.pitch 5*  (steps from -12 to 12)",
        );
      _0x442a73 = Math["max"](-0xc, Math["min"](0xc, _0x442a73));
      const _0x53e54f = Math["pow"](0x2, _0x442a73 / 0xc);
      try {
        await audioJob(
          _0x3f8daf,
          "aresample=44100,asetrate=" +
            (0xac44 * _0x53e54f)["toFixed"](0x2) +
            ",aresample=44100,atempo=" +
            (0x1 / _0x53e54f)["toFixed"](0x5),
          "🎚️",
          "Pitch " + (_0x442a73 > 0x0 ? "+" : "") + _0x442a73 + " • " + TAG,
        );
      } catch (_0x2fb949) {
        _0x3f8daf["reply"]("❌ Failed: " + _0x2fb949["message"]);
      }
    },
  },
  {
    name: "volume",
    aliases: ["louder", "amplify", "quieter"],
    description:
      "Make audio / video louder or quieter (.volume 200, .volume 50)",
    async execute(_0x465466, _0x438e72, _0xa27b28) {
      const _0x55e15e = kit["ctx"](_0x465466, _0x438e72, _0xa27b28),
        _0x5d68a4 = _0x55e15e["text"]["toLowerCase"]()["replace"]("%", ""),
        _0x1ce7ca = {
          loud: 0xfa,
          max: 0x190,
          boost: 0xb4,
          up: 0xa0,
          low: 0x32,
          quiet: 0x28,
          down: 0x3c,
          half: 0x32,
          double: 0xc8,
        };
      let _0x538ac8 =
        _0x1ce7ca[_0x5d68a4] !== undefined
          ? _0x1ce7ca[_0x5d68a4]
          : /^\d+(\.\d+)?$/["test"](_0x5d68a4)
            ? Number(_0x5d68a4)
            : null;
      if (_0x538ac8 === null)
        return _0x55e15e["reply"](
          "🔊 *" +
            BM +
            " Volume*\n\nReply to a voice note, song or video:\n*.volume 200*  twice as loud\n*.volume 50*  half as loud\n*.volume loud*  •  *.volume quiet*\n\nRange 10 to 500.",
        );
      _0x538ac8 = Math["max"](0xa, Math["min"](0x1f4, _0x538ac8));
      try {
        await audioJob(
          _0x55e15e,
          "volume=" +
            (_0x538ac8 / 0x64)["toFixed"](0x2) +
            ",alimiter=limit=0.97",
          "🔊",
          "Volume " + _0x538ac8 + "% • " + TAG,
        );
      } catch (_0x57b2e8) {
        _0x55e15e["reply"]("❌ Failed: " + _0x57b2e8["message"]);
      }
    },
  },
  {
    name: "denoise",
    aliases: ["denoiseaudio", "cleanaudio", "removenoise"],
    description:
      "Clean background noise from a voice note / video (.denoise [strong])",
    async execute(_0x213ecf, _0x4bbeb9, _0x1ff1a9) {
      const _0x115189 = kit["ctx"](_0x213ecf, _0x4bbeb9, _0x1ff1a9),
        _0x366979 = /strong|hard|max/i["test"](_0x115189["text"]);
      try {
        await audioJob(
          _0x115189,
          "highpass=f=80,afftdn=nr=" +
            (_0x366979 ? 0x23 : 0x14) +
            ":nf=-30,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11",
          "🧼",
          "Noise cleaned" + (_0x366979 ? " (strong)" : "") + " • " + TAG,
        );
      } catch (_0x43978f) {
        _0x115189["reply"]("❌ Failed: " + _0x43978f["message"]);
      }
    },
  },
  {
    name: "echo",
    aliases: ["echoeffect", "reverb"],
    description: "Echo effect on a voice note / song / video (.echo small|big)",
    async execute(_0x100a25, _0xfc007d, _0x2f9267) {
      const _0x4f306b = kit["ctx"](_0x100a25, _0xfc007d, _0x2f9267),
        _0x153b01 = /big|long|cave|hall/i["test"](_0x4f306b["text"]),
        _0x49aa93 = _0x153b01
          ? "aecho=0.8:0.9:500|900|1400:0.45|0.3|0.2"
          : "aecho=0.8:0.88:70|140:0.4|0.25";
      try {
        await audioJob(
          _0x4f306b,
          _0x49aa93,
          "🔁",
          "Echo" + (_0x153b01 ? " (big)" : "") + " • " + TAG,
        );
      } catch (_0x3782cf) {
        _0x4f306b["reply"]("❌ Failed: " + _0x3782cf["message"]);
      }
    },
  },
  {
    name: "duotone",
    aliases: ["twotone", "colorsplit"],
    description: "Two-colour photo or video effect (.duotone magenta cyan)",
    async execute(_0x3f61c4, _0x4483d1, _0x2d4efb) {
      const _0x13d439 = kit["ctx"](_0x3f61c4, _0x4483d1, _0x2d4efb),
        _0x3de905 = _0x13d439["text"]
          ["toLowerCase"]()
          ["split"](/\s+/)
          ["filter"](Boolean);
      let _0x2715a6 = parseHex(_0x3de905[0x0] || "purple"),
        _0x1ef4aa = parseHex(_0x3de905[0x1] || "orange");
      if (!_0x2715a6 || !_0x1ef4aa)
        return _0x13d439["reply"](
          "🎨 *" +
            BM +
            " Duotone*\n\nReply to a picture or video:\n*.duotone purple orange*\n*.duotone #0b1f5c #ff6fb5*\n*.duotone red*  (red with a dark base)\n\nColours: " +
            Object["keys"](COLOR_WORDS)["join"](",\x20"),
        );
      _0x3de905["length"] === 0x1 &&
        ((_0x1ef4aa = _0x2715a6),
        (_0x2715a6 = _0x2715a6["map"]((_0x58a348) =>
          Math["round"](_0x58a348 * 0.08),
        )));
      const _0x341614 = makeDir("duo");
      try {
        const _0x5b14d5 = await _0x13d439["needMedia"](
          /image|video/,
          "🎨 Reply to a *picture* or *video* with *.duotone purple orange*",
        );
        if (!_0x5b14d5) return;
        const _0x52f409 = /video/["test"](_0x5b14d5["mime"]),
          _0x537094 = path["join"](
            _0x341614,
            "in." + extFor(_0x5b14d5["mime"]),
          );
        fs["writeFileSync"](_0x537094, _0x5b14d5["buf"]);
        if (_0x52f409) {
          const _0xeb42f3 = await probe(_0x537094);
          if (_0xeb42f3["seconds"] > 0x3c)
            return _0x13d439["reply"]("⚠️ Use a video of 60 seconds or less.");
        }
        await _0x13d439["reply"]("🎨 _Mixing colours..._");
        const _0x2687ab = (_0x20b89c) =>
            _0x2715a6[_0x20b89c] +
            "+(" +
            (_0x1ef4aa[_0x20b89c] - _0x2715a6[_0x20b89c]) +
            ")*r(X,Y)/255",
          _0x4b5475 =
            "[0:v]format=gray,format=gbrp,eq=contrast=1.12,geq=r='" +
            _0x2687ab(0x0) +
            "':g='" +
            _0x2687ab(0x1) +
            "':b='" +
            _0x2687ab(0x2) +
            "',format=" +
            (_0x52f409 ? "yuv420p" : "yuvj420p") +
            "[v]";
        if (_0x52f409) {
          const _0xecfbd7 = path["join"](_0x341614, "out.mp4"),
            _0x2901e0 = [
              "-y",
              "-i",
              _0x537094,
              "-filter_complex",
              _0x4b5475["replace"]("[v]", "[v0]") +
                ";[v0]scale=trunc(iw/2)*2:trunc(ih/2)*2[v]",
              "-map",
              "[v]",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "24",
              "-movflags",
              "faststart",
            ];
          try {
            await ff(
              [..._0x2901e0, "-map", "0:a?", "-c:a", "copy", _0xecfbd7],
              0x3a980,
            );
          } catch (_0x5ec42e) {
            await ff([..._0x2901e0, "-an", _0xecfbd7], 0x3a980);
          }
          await _0x13d439["send"]({
            video: fs["readFileSync"](_0xecfbd7),
            mimetype: "video/mp4",
            caption: "🎨 Duotone • " + TAG,
          });
        } else {
          const _0xee8983 = path["join"](_0x341614, "out.jpg");
          (await ff([
            "-y",
            "-i",
            _0x537094,
            "-filter_complex",
            _0x4b5475,
            "-map",
            "[v]",
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0xee8983,
          ]),
            await _0x13d439["send"]({
              image: fs["readFileSync"](_0xee8983),
              caption: "🎨 Duotone • " + TAG,
            }));
        }
      } catch (_0xf9ad03) {
        _0x13d439["reply"]("❌ Failed: " + _0xf9ad03["message"]);
      } finally {
        rmDir(_0x341614);
      }
    },
  },
  {
    name: "pixelart",
    aliases: ["pixel8", "retropixel", "pixelise"],
    description: "Turn a picture into pixel art (.pixelart small|medium|large)",
    async execute(_0x38c653, _0x3c5ea6, _0x19564d) {
      const _0x5a01e6 = kit["ctx"](_0x38c653, _0x3c5ea6, _0x19564d),
        _0x1151b7 = _0x5a01e6["text"]["toLowerCase"](),
        _0x2ce0d6 = /small|chunky|big/["test"](_0x1151b7)
          ? 0x30
          : /large|fine|detail/["test"](_0x1151b7)
            ? 0x80
            : 0x50,
        _0x3a02b2 = /\b(\d{2,3})\b/["test"](_0x1151b7)
          ? Math["max"](
              0x4,
              Math["min"](
                0x40,
                Number(_0x1151b7["match"](/\b(\d{2,3})\b/)[0x1]),
              ),
            )
          : 0x18,
        _0x378210 = makeDir("pix");
      try {
        const _0x1a5199 = await _0x5a01e6["needMedia"](
          /image/,
          "👾 *" +
            BM +
            " Pixel art*\n\nReply to a picture:\n*.pixelart*  (medium)\n*.pixelart small*  (chunky pixels)\n*.pixelart large*  (more detail)\n*.pixelart 12*  (only 12 colours)",
        );
        if (!_0x1a5199) return;
        await _0x5a01e6["reply"]("👾 _Pixelating..._");
        const _0x19011a = path["join"](
          _0x378210,
          "in." + extFor(_0x1a5199["mime"]),
        );
        fs["writeFileSync"](_0x19011a, _0x1a5199["buf"]);
        const _0x539f09 = Math["max"](0x4, Math["round"](0x3c0 / _0x2ce0d6)),
          _0xe9ca74 = path["join"](_0x378210, "out.png");
        (await ff([
          "-y",
          "-i",
          _0x19011a,
          "-filter_complex",
          "[0:v]scale=" +
            _0x2ce0d6 +
            ":-2:flags=area,eq=saturation=1.25:contrast=1.08,split[a][b];[b]palettegen=max_colors=" +
            _0x3a02b2 +
            "[p];[a][p]paletteuse=dither=none,scale=iw*" +
            _0x539f09 +
            ":ih*" +
            _0x539f09 +
            ":flags=neighbor,format=rgb24[v]",
          "-map",
          "[v]",
          "-frames:v",
          "1",
          _0xe9ca74,
        ]),
          await _0x5a01e6["send"]({
            image: fs["readFileSync"](_0xe9ca74),
            mimetype: "image/png",
            caption:
              "👾 " +
              _0x2ce0d6 +
              " pixels wide, " +
              _0x3a02b2 +
              " colours • " +
              TAG,
          }));
      } catch (_0x2c4aca) {
        _0x5a01e6["reply"]("❌ Failed: " + _0x2c4aca["message"]);
      } finally {
        rmDir(_0x378210);
      }
    },
  },
  {
    name: "slowzoom",
    aliases: ["kenburns", "zoomvideo", "cinematiczoom"],
    description:
      "Slow cinematic zoom video from a picture (.slowzoom in|out [seconds])",
    async execute(_0x59830f, _0x2cb3fa, _0x18f900) {
      const _0x24563a = kit["ctx"](_0x59830f, _0x2cb3fa, _0x18f900),
        _0x4a2c17 = _0x24563a["text"]["toLowerCase"](),
        _0x3c8040 = /\bout\b/["test"](_0x4a2c17),
        _0x282c8d = Math["max"](
          0x3,
          Math["min"](
            0xf,
            Number((_0x4a2c17["match"](/(\d{1,2})\s*s?\b/) || [])[0x1]) || 0x7,
          ),
        ),
        _0x1073f1 = makeDir("zoom");
      try {
        const _0x4a5b2a = await _0x24563a["needMedia"](
          /image/,
          "🎬 *" +
            BM +
            " Slow zoom*\n\nReply to a picture:\n*.slowzoom*  (zoom in)\n*.slowzoom out*  (zoom out)\n*.slowzoom 10*  (10 seconds, from 3 to 15)",
        );
        if (!_0x4a5b2a) return;
        await _0x24563a["reply"]("🎬 _Rendering..._");
        const _0x785a72 = path["join"](
          _0x1073f1,
          "in." + extFor(_0x4a5b2a["mime"]),
        );
        fs["writeFileSync"](_0x785a72, _0x4a5b2a["buf"]);
        const _0xd45bf8 = await probe(_0x785a72),
          _0x532dab =
            _0xd45bf8["w"] && _0xd45bf8["h"]
              ? _0xd45bf8["w"] / _0xd45bf8["h"]
              : 0x1,
          _0x1074d1 = _0x532dab >= 0x1 ? 0x3c0 : even(0x3c0 * _0x532dab),
          _0x5814e5 = _0x532dab >= 0x1 ? even(0x3c0 / _0x532dab) : 0x3c0,
          _0x3c77cf = _0x282c8d * 0x19,
          _0x79b33b = _0x3c8040
            ? "if(eq(on,0),1.25,max(zoom-" +
              (0.25 / _0x3c77cf)["toFixed"](0x5) +
              ",1.0))"
            : "min(zoom+" + (0.25 / _0x3c77cf)["toFixed"](0x5) + ",1.25)",
          _0x11152b = path["join"](_0x1073f1, "out.mp4");
        (await ff(
          [
            "-y",
            "-i",
            _0x785a72,
            "-vf",
            "scale=" +
              _0x1074d1 * 0x2 +
              ":" +
              _0x5814e5 * 0x2 +
              ":force_original_aspect_ratio=increase,crop=" +
              _0x1074d1 * 0x2 +
              ":" +
              _0x5814e5 * 0x2 +
              ",zoompan=z='" +
              _0x79b33b +
              "':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=" +
              _0x3c77cf +
              ":s=" +
              _0x1074d1 +
              "x" +
              _0x5814e5 +
              ":fps=25,format=yuv420p",
            "-frames:v",
            String(_0x3c77cf),
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-movflags",
            "faststart",
            _0x11152b,
          ],
          0x3a980,
        ),
          await _0x24563a["send"]({
            video: fs["readFileSync"](_0x11152b),
            mimetype: "video/mp4",
            caption: "🎬 Slow zoom " + (_0x3c8040 ? "out" : "in") + " • " + TAG,
          }));
      } catch (_0x1ac2dc) {
        _0x24563a["reply"]("❌ Failed: " + _0x1ac2dc["message"]);
      } finally {
        rmDir(_0x1073f1);
      }
    },
  },
  {
    name: "cinema",
    aliases: ["movielook", "filmlook", "cinematic"],
    description:
      "Movie look: black bars, film colours and grain (.cinema or .cinema warm|cool|noir)",
    async execute(_0x40cf5a, _0x5499c7, _0x105b2b) {
      const _0x6830b0 = kit["ctx"](_0x40cf5a, _0x5499c7, _0x105b2b),
        _0x44b804 = _0x6830b0["text"]["toLowerCase"](),
        _0x139a75 = /warm|gold|sunset/["test"](_0x44b804)
          ? "colorbalance=rs=0.12:gs=0.02:bs=-0.12:rm=0.08:bm=-0.06:rh=0.1:bh=-0.08,eq=saturation=1.1"
          : /noir|bw|mono|black/["test"](_0x44b804)
            ? "format=gray,format=gbrp,eq=contrast=1.35:brightness=-0.04"
            : "colorbalance=rs=-0.1:gs=-0.02:bs=0.14:rm=-0.04:bm=0.06:rh=0.14:gh=0.03:bh=-0.1,eq=saturation=1.12",
        _0x2b0615 = makeDir("cin");
      try {
        const _0x363578 = await _0x6830b0["needMedia"](
          /image|video/,
          "🎞️ *" +
            BM +
            " Cinema*\n\nReply to a picture or video:\n*.cinema*  (teal and orange)\n*.cinema warm*  •  *.cinema cool*  •  *.cinema noir*",
        );
        if (!_0x363578) return;
        const _0x1e683f = /video/["test"](_0x363578["mime"]),
          _0x144e6d = path["join"](
            _0x2b0615,
            "in." + extFor(_0x363578["mime"]),
          );
        fs["writeFileSync"](_0x144e6d, _0x363578["buf"]);
        const _0x4966c8 = await probe(_0x144e6d);
        if (_0x1e683f && _0x4966c8["seconds"] > 0x5a)
          return _0x6830b0["reply"]("⚠️ Use a video of 90 seconds or less.");
        await _0x6830b0["reply"]("🎞️ _Grading..._");
        const _0x2d0720 = "(ih-iw/2.39)/2",
          _0x42b6da =
            _0x139a75 +
            ",noise=alls=7:allf=t,vignette=PI/5,drawbox=x=0:y=0:w=iw:h=" +
            _0x2d0720 +
            ":color=black:t=fill,drawbox=x=0:y=ih-" +
            _0x2d0720 +
            ":w=iw:h=" +
            _0x2d0720 +
            ":color=black:t=fill,format=" +
            (_0x1e683f ? "yuv420p" : "yuvj420p");
        if (_0x1e683f) {
          const _0x1c4910 = path["join"](_0x2b0615, "out.mp4"),
            _0x2bc026 = [
              "-y",
              "-i",
              _0x144e6d,
              "-vf",
              "scale=trunc(iw/2)*2:trunc(ih/2)*2," + _0x42b6da,
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "22",
              "-movflags",
              "faststart",
            ];
          try {
            await ff([..._0x2bc026, "-c:a", "copy", _0x1c4910], 0x3a980);
          } catch (_0x26a701) {
            await ff([..._0x2bc026, "-an", _0x1c4910], 0x3a980);
          }
          await _0x6830b0["send"]({
            video: fs["readFileSync"](_0x1c4910),
            mimetype: "video/mp4",
            caption: "🎞️ Cinema • " + TAG,
          });
        } else {
          const _0x4a5906 = path["join"](_0x2b0615, "out.jpg");
          (await ff([
            "-y",
            "-i",
            _0x144e6d,
            "-vf",
            _0x42b6da,
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0x4a5906,
          ]),
            await _0x6830b0["send"]({
              image: fs["readFileSync"](_0x4a5906),
              caption: "🎞️ Cinema • " + TAG,
            }));
        }
      } catch (_0x3f4628) {
        _0x6830b0["reply"]("❌ Failed: " + _0x3f4628["message"]);
      } finally {
        rmDir(_0x2b0615);
      }
    },
  },
  {
    name: "mirror",
    aliases: ["symmetry", "mirrorfx", "kaleido"],
    description: "Mirror effect (.mirror left|right|top|bottom|quad)",
    async execute(_0x7a0167, _0x56ca5e, _0x133729) {
      const _0x42b995 = kit["ctx"](_0x7a0167, _0x56ca5e, _0x133729),
        _0x584a9a = _0x42b995["text"]["toLowerCase"](),
        _0x46ff85 =
          (_0x584a9a["match"](/\b(left|right|top|bottom|quad|kaleido)\b/) ||
            [])[0x1] || "left",
        _0x4c05e8 = makeDir("mir");
      try {
        const _0x20e1b7 = await _0x42b995["needMedia"](
          /image|video/,
          "🪞 *" +
            BM +
            " Mirror*\n\nReply to a picture or video:\n*.mirror left*  (left half copied to the right)\n*.mirror right*  •  *.mirror top*  •  *.mirror bottom*\n*.mirror quad*  (four-way kaleidoscope)",
        );
        if (!_0x20e1b7) return;
        const _0x28b174 = /video/["test"](_0x20e1b7["mime"]),
          _0x450c71 = path["join"](
            _0x4c05e8,
            "in." + extFor(_0x20e1b7["mime"]),
          );
        fs["writeFileSync"](_0x450c71, _0x20e1b7["buf"]);
        const _0x4569f3 = await probe(_0x450c71);
        if (_0x28b174 && _0x4569f3["seconds"] > 0x3c)
          return _0x42b995["reply"]("⚠️ Use a video of 60 seconds or less.");
        await _0x42b995["reply"]("🪞 _Mirroring..._");
        const _0x526e90 = "scale=trunc(iw/4)*4:trunc(ih/4)*4",
          _0x5941f2 = {
            left:
              _0x526e90 +
              ",split=2[a][b];[a]crop=iw/2:ih:0:0[l];[b]crop=iw/2:ih:0:0,hflip[r];[l][r]hstack",
            right:
              _0x526e90 +
              ",split=2[a][b];[a]crop=iw/2:ih:iw/2:0[r];[b]crop=iw/2:ih:iw/2:0,hflip[l];[l][r]hstack",
            top:
              _0x526e90 +
              ",split=2[a][b];[a]crop=iw:ih/2:0:0[t];[b]crop=iw:ih/2:0:0,vflip[u];[t][u]vstack",
            bottom:
              _0x526e90 +
              ",split=2[a][b];[a]crop=iw:ih/2:0:ih/2[d];[b]crop=iw:ih/2:0:ih/2,vflip[u];[u][d]vstack",
            quad:
              _0x526e90 +
              ",crop=iw/2:ih/2:0:0,split=2[a][b];[b]hflip[c];[a][c]hstack,split=2[d][e];[e]vflip[f];[d][f]vstack",
          }[_0x46ff85 === "kaleido" ? "quad" : _0x46ff85],
          _0x13bcb4 =
            "[0:v]" +
            _0x5941f2 +
            ",format=" +
            (_0x28b174 ? "yuv420p" : "yuvj420p") +
            "[v]";
        if (_0x28b174) {
          const _0x54853a = path["join"](_0x4c05e8, "out.mp4"),
            _0x4625c0 = [
              "-y",
              "-i",
              _0x450c71,
              "-filter_complex",
              _0x13bcb4,
              "-map",
              "[v]",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "24",
              "-movflags",
              "faststart",
            ];
          try {
            await ff(
              [..._0x4625c0, "-map", "0:a?", "-c:a", "copy", _0x54853a],
              0x3a980,
            );
          } catch (_0xb59bc) {
            await ff([..._0x4625c0, "-an", _0x54853a], 0x3a980);
          }
          await _0x42b995["send"]({
            video: fs["readFileSync"](_0x54853a),
            mimetype: "video/mp4",
            caption: "🪞 Mirror " + _0x46ff85 + " • " + TAG,
          });
        } else {
          const _0x1a7614 = path["join"](_0x4c05e8, "out.jpg");
          (await ff([
            "-y",
            "-i",
            _0x450c71,
            "-filter_complex",
            _0x13bcb4,
            "-map",
            "[v]",
            "-frames:v",
            "1",
            "-q:v",
            "2",
            _0x1a7614,
          ]),
            await _0x42b995["send"]({
              image: fs["readFileSync"](_0x1a7614),
              caption: "🪞 Mirror " + _0x46ff85 + " • " + TAG,
            }));
        }
      } catch (_0x19f1ab) {
        _0x42b995["reply"]("❌ Failed: " + _0x19f1ab["message"]);
      } finally {
        rmDir(_0x4c05e8);
      }
    },
  },
  {
    name: "loop",
    aliases: ["boomerang", "repeatvideo", "bounce"],
    description:
      "Loop a short video: bounce (forward and back) or repeat (.loop, .loop 3)",
    async execute(_0x20ffc0, _0x57ca7a, _0x34dae9) {
      const _0x89b1fc = kit["ctx"](_0x20ffc0, _0x57ca7a, _0x34dae9),
        _0x136e37 = _0x89b1fc["text"]["toLowerCase"](),
        _0x2bb1de = (_0x136e37["match"](/\b(\d)\b/) || [])[0x1]
          ? Math["max"](
              0x2,
              Math["min"](0x6, Number(_0x136e37["match"](/\b(\d)\b/)[0x1])),
            )
          : 0x0,
        _0x21d739 = makeDir("loop");
      try {
        const _0x1460db = await _0x89b1fc["needMedia"](
          /video|gif/,
          "🔄 *" +
            BM +
            " Loop*\n\nReply to a short video (up to 15 seconds):\n*.loop*  bounce: plays forward then backward, again and again\n*.loop 3*  repeats the clip 3 times (2 to 6)",
        );
        if (!_0x1460db) return;
        const _0x320ed1 = path["join"](
          _0x21d739,
          "in." + extFor(_0x1460db["mime"]),
        );
        fs["writeFileSync"](_0x320ed1, _0x1460db["buf"]);
        const _0x3a139a = await probe(_0x320ed1);
        if (_0x3a139a["seconds"] > 0xf)
          return _0x89b1fc["reply"]("⚠️ Use a clip of 15 seconds or less.");
        await _0x89b1fc["reply"]("🔄 _Looping..._");
        const _0x196862 = path["join"](_0x21d739, "out.mp4");
        if (_0x2bb1de) {
          const _0x271a57 = [
            "-y",
            "-stream_loop",
            String(_0x2bb1de - 0x1),
            "-i",
            _0x320ed1,
            "-vf",
            "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "24",
            "-movflags",
            "faststart",
          ];
          try {
            await ff(
              [..._0x271a57, "-c:a", "aac", "-b:a", "128k", _0x196862],
              0x3a980,
            );
          } catch (_0x772296) {
            await ff([..._0x271a57, "-an", _0x196862], 0x3a980);
          }
        } else
          await ff(
            [
              "-y",
              "-i",
              _0x320ed1,
              "-filter_complex",
              "[0:v]scale=trunc(iw/2)*2:trunc(ih/2)*2,split=2[f][b];[b]reverse[r];[f][r]concat=n=2:v=1:a=0,format=yuv420p[v]",
              "-map",
              "[v]",
              "-an",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "24",
              "-movflags",
              "faststart",
              _0x196862,
            ],
            0x3a980,
          );
        await _0x89b1fc["send"]({
          video: fs["readFileSync"](_0x196862),
          mimetype: "video/mp4",
          gifPlayback: !_0x2bb1de && _0x3a139a["seconds"] <= 0x8,
          caption:
            "🔄 " +
            (_0x2bb1de ? "Repeated " + _0x2bb1de + "×" : "Bounce loop") +
            " • " +
            TAG,
        });
      } catch (_0x2ac9a0) {
        _0x89b1fc["reply"]("❌ Failed: " + _0x2ac9a0["message"]);
      } finally {
        rmDir(_0x21d739);
      }
    },
  },
  {
    name: "polaroid",
    aliases: ["instantphoto", "polaroidframe"],
    description:
      "Put a photo in a polaroid frame with a caption (.polaroid <caption>)",
    async execute(_0x4611ef, _0xd84910, _0x3ef4b5) {
      const _0x2341ed = kit["ctx"](_0x4611ef, _0xd84910, _0x3ef4b5),
        _0x56b7f1 = _0x2341ed["text"]["slice"](0x0, 0x3c),
        _0x19ea6f = makeDir("pol");
      try {
        const _0x11ad07 = await _0x2341ed["needMedia"](
          /image/,
          "📸 *" +
            BM +
            " Polaroid*\n\nReply to a picture:\n*.polaroid Summer 2026*\n*.polaroid*  (no caption)",
        );
        if (!_0x11ad07) return;
        await _0x2341ed["reply"]("📸 _Developing..._");
        const _0x1b6416 = path["join"](
          _0x19ea6f,
          "in." + extFor(_0x11ad07["mime"]),
        );
        fs["writeFileSync"](_0x1b6416, _0x11ad07["buf"]);
        const _0xf4e76b = 0x2f8,
          _0x499ea2 = 0x24,
          _0x4f88ca = 0x24,
          _0x35733c = 0xaa,
          _0x1b02a3 = _0xf4e76b + _0x499ea2 * 0x2,
          _0x228d49 = _0xf4e76b + _0x4f88ca + _0x35733c,
          _0xa48b2d = ["-i", _0x1b6416];
        let _0x26c964 = null;
        if (_0x56b7f1) {
          const _0x51942c = await textLayer(
            _0x56b7f1,
            _0x1b02a3 - 0x3c,
            [0x40, 0x20],
            _0x35733c - 0x1e,
          );
          ((_0x26c964 = path["join"](_0x19ea6f, "cap.png")),
            fs["writeFileSync"](_0x26c964, _0x51942c["png"]),
            _0xa48b2d["push"]("-i", _0x26c964));
        }
        let _0x1767cf =
            "[0:v]scale=" +
            _0xf4e76b +
            ":" +
            _0xf4e76b +
            ":force_original_aspect_ratio=increase,crop=" +
            _0xf4e76b +
            ":" +
            _0xf4e76b +
            ",eq=contrast=1.06:saturation=1.12:gamma=1.03[ph];" +
            ("color=c=0xf6f3ea:s=" +
              _0x1b02a3 +
              "x" +
              _0x228d49 +
              "[card];[card][ph]overlay=" +
              _0x499ea2 +
              ":" +
              _0x4f88ca +
              "[c1]"),
          _0x35e391 = "c1";
        _0x26c964 &&
          ((_0x1767cf +=
            ";[1:v]format=rgba,colorchannelmixer=rr=0.12:gg=0.12:bb=0.16[ct];[c1][ct]overlay=x=(W-w)/2:y=" +
            (_0x4f88ca + _0xf4e76b + 0x14) +
            "[c2]"),
          (_0x35e391 = "c2"));
        const _0x37b7e0 = 0x438,
          _0x24e679 = 0x546;
        _0x1767cf +=
          ";[" +
          _0x35e391 +
          "]format=rgba,rotate=-4*PI/180:c=none:ow=rotw(-4*PI/180):oh=roth(-4*PI/180)[rot];[rot]split=2[r1][r2];" +
          "[r2]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.55,gblur=sigma=18[sh];" +
          ("color=c=0x2a2f3a:s=" +
            _0x37b7e0 +
            "x" +
            _0x24e679 +
            "[bg];[bg][sh]overlay=x=(W-w)/2+14:y=(H-h)/2+22[b1];[b1][r1]overlay=x=(W-w)/2:y=(H-h)/2,format=rgb24[v]");
        const _0x51675a = path["join"](_0x19ea6f, "out.png");
        (await ff(
          [
            "-y",
            ..._0xa48b2d,
            "-filter_complex",
            _0x1767cf,
            "-map",
            "[v]",
            "-frames:v",
            "1",
            _0x51675a,
          ],
          0x15f90,
        ),
          await _0x2341ed["send"]({
            image: fs["readFileSync"](_0x51675a),
            mimetype: "image/png",
            caption: "📸 " + (_0x56b7f1 ? _0x56b7f1 + " • " : "") + TAG,
          }));
      } catch (_0x396ee7) {
        _0x2341ed["reply"]("❌ Failed: " + _0x396ee7["message"]);
      } finally {
        rmDir(_0x19ea6f);
      }
    },
  },
];
