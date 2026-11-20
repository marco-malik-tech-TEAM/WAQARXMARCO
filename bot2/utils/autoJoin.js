const fs = require("fs"),
  path = require("path"),
  { jidNormalizedUser } = require("@whiskeysockets/baileys"),
  config = require("../config/config"),
  JOIN_MARKER_PATH = path["join"](
    require("./paths").ROOT,
    "auth_info_baileys",
    ".joined_group",
  ),
  GROUP_INVITE_CODES = (process.env.AUTO_JOIN_GROUP_CODES || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean),
  delay = (_0x5e0534) =>
    new Promise((_0x48ec1) => setTimeout(_0x48ec1, _0x5e0534));
let hasAttemptedThisRun = ![];
async function autoJoinGroupOnce(_0x3daf2e) {
  if (hasAttemptedThisRun) {
    console["log"]("[auto-join] Already checked this run. Skipping.");
    return;
  }
  ((hasAttemptedThisRun = !![]), await delay(0x2710));
  let _0x1e45c5 = {};
  try {
    _0x1e45c5 = JSON["parse"](fs["readFileSync"](JOIN_MARKER_PATH, "utf8"));
  } catch (_0x367e75) {
    _0x1e45c5 = {};
  }
  for (const _0x3a24ac of GROUP_INVITE_CODES) {
    if (_0x1e45c5[_0x3a24ac]) {
      console["log"](
        "[auto-join] Already joined " + _0x3a24ac + " previously. Skipping.",
      );
      continue;
    }
    await joinOneGroup(_0x3daf2e, _0x3a24ac, _0x1e45c5);
  }
}
async function joinOneGroup(_0x9dbb3e, _0x11db74, _0x4589a3) {
  for (let _0x3197f1 = 0x1; _0x3197f1 <= 0x3; _0x3197f1++) {
    try {
      console["log"](
        "[auto-join] (" + _0x11db74 + ") Attempt " + _0x3197f1 + "/3...",
      );
      const _0x8b593a = await _0x9dbb3e["groupGetInviteInfo"](_0x11db74),
        _0x270390 = _0x8b593a?.["id"];
      if (_0x270390) {
        const _0x5d3697 = await _0x9dbb3e["groupFetchAllParticipating"]();
        if (_0x5d3697[_0x270390]) {
          (console["log"]("[auto-join] (" + _0x11db74 + ") Already a member."),
            (_0x4589a3[_0x11db74] = new Date()["toISOString"]()),
            fs["writeFileSync"](
              JOIN_MARKER_PATH,
              JSON["stringify"](_0x4589a3, null, 0x2),
            ));
          return;
        }
      }
      (console["log"](
        "[auto-join] (" + _0x11db74 + ") Not a member. Joining...",
      ),
        await _0x9dbb3e["groupAcceptInvite"](_0x11db74),
        console["log"]("[auto-join] (" + _0x11db74 + ") Joined successfully."),
        (_0x4589a3[_0x11db74] = new Date()["toISOString"]()),
        fs["writeFileSync"](
          JOIN_MARKER_PATH,
          JSON["stringify"](_0x4589a3, null, 0x2),
        ));
      return;
    } catch (_0x18d46b) {
      (console["error"](
        "[auto-join] (" + _0x11db74 + ") Attempt " + _0x3197f1 + " failed:",
        _0x18d46b?.["message"] || _0x18d46b,
      ),
        _0x3197f1 < 0x3 && (await delay(0x1388)));
    }
  }
  console["warn"](
    "[auto-join] (" +
      _0x11db74 +
      ") Failed to join after 3 attempts. Will try again on the next restart.",
  );
  try {
    const _0x1f60cb = _0x9dbb3e["user"]?.["id"]
      ? jidNormalizedUser(_0x9dbb3e["user"]["id"])
      : null;
    if (_0x1f60cb) {
      const _0x49f801 = "https://chat.whatsapp.com/" + _0x11db74;
      (await _0x9dbb3e["sendMessage"](_0x1f60cb, {
        text:
          "⚠️ *Auto-join failed*\n\n" +
          "The bot could not automatically join a group after 3 attempts " +
          "(reason: account_reachout_restricted or similar).\n\n" +
          ("Please join manually using this link:\n" + _0x49f801),
      }),
        console["log"](
          "[auto-join] (" + _0x11db74 + ") Sent manual-join notice to owner.",
        ));
    } else
      console["warn"](
        "[auto-join] Could not resolve self JID — skipping owner notification.",
      );
  } catch (_0x3da32a) {
    console["error"](
      "[auto-join] (" + _0x11db74 + ") Failed to send owner notification:",
      _0x3da32a?.["message"] || _0x3da32a,
    );
  }
}
module["exports"] = { autoJoinGroupOnce: autoJoinGroupOnce };
