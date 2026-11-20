"use strict";
const fetch = require("node-fetch"),
  { randomUUID } = require("crypto"),
  USER_AGENT =
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
async function askUncensored(_0x3ead19) {
  const _0x37b689 = await fetch("https://uncensored.chat/", {
      compress: ![],
      headers: { "User-Agent": USER_AGENT, "Accept-Encoding": "identity" },
    }),
    _0x34ebe2 = await _0x37b689["text"](),
    _0xd4164f = _0x34ebe2["match"](
      /<meta name="csrf-token" content="([^"]+)">/,
    ),
    _0x2693e7 = _0xd4164f ? _0xd4164f[0x1] : "";
  let _0x4ce528 = "";
  if (typeof _0x37b689["headers"]["getSetCookie"] === "function")
    _0x4ce528 = _0x37b689["headers"]
      ["getSetCookie"]()
      ["map"]((_0x29b9b5) => _0x29b9b5["split"](";")[0x0])
      ["join"](";\x20");
  else {
    const _0x5ea42d = _0x37b689["headers"]["get"]("set-cookie");
    if (_0x5ea42d)
      _0x4ce528 = _0x5ea42d["split"](",")
        ["map"]((_0x508112) => _0x508112["split"](";")[0x0])
        ["join"](";\x20");
  }
  const _0x408ea6 = await fetch("https://uncensored.chat/chats/start", {
      method: "POST",
      redirect: "manual",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": _0x2693e7,
        "X-Requested-With": "XMLHttpRequest",
        Cookie: _0x4ce528,
      },
      body: JSON["stringify"]({
        character_id: 0x57,
        message: _0x3ead19,
        think_mode: ![],
        api_version: "v1",
      }),
    }),
    _0x2334ef = _0x408ea6["headers"]["get"]("location");
  if (!_0x2334ef) throw new Error("Failed to create chat session");
  const _0x1f0cb3 = _0x2334ef["split"]("/")["pop"](),
    _0x5712ed = randomUUID()["replace"](/-/g, "")["substring"](0x0, 0x15),
    _0x5ccc6d = await fetch(
      "https://uncensored.chat/chats/" + _0x1f0cb3 + "/stream",
      {
        method: "POST",
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/event-stream",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": _0x2693e7,
          "X-Stream-ID": _0x5712ed,
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://uncensored.chat",
          Referer: _0x2334ef,
          Cookie: _0x4ce528,
        },
        body: JSON["stringify"]({
          messages: [{ role: "user", content: _0x3ead19, type: "text" }],
          api_version: "v1",
        }),
      },
    ),
    _0x2b2ed2 = await _0x5ccc6d["text"]();
  let _0x483044 = "";
  for (const _0x5748e7 of _0x2b2ed2["split"]("\x0a")) {
    if (_0x5748e7["startsWith"]('data: {"content":'))
      try {
        const _0x5a3161 = JSON["parse"](_0x5748e7["substring"](0x6));
        if (_0x5a3161["content"]) _0x483044 += _0x5a3161["content"];
      } catch {}
  }
  return _0x483044["trim"]() || "No response from AI.";
}
module["exports"] = { askUncensored: askUncensored };
