const { proto, downloadMediaMessage } = require("@whiskeysockets/baileys"),
  config = require("../config/config"),
  logger = require("../utils/logger"),
  settingsStore = require("../utils/settingsStore"),
  groupSettingsStore = require("../utils/groupSettingsStore"),
  fs = require("fs"),
  path = require("path"),
  cutoffFile = path["join"](
    require("../utils/paths").ROOT,
    "auth_info_baileys/.first_boot_cutoff",
  );
let CUTOFF_TIME;
try {
  CUTOFF_TIME = Number(fs["readFileSync"](cutoffFile, "utf8")["trim"]());
  if (!CUTOFF_TIME) throw new Error("invalid cutoff value");
} catch {
  CUTOFF_TIME = Math["floor"](Date["now"]() / 0x3e8);
  try {
    (fs["mkdirSync"](path["dirname"](cutoffFile), { recursive: !![] }),
      fs["writeFileSync"](cutoffFile, String(CUTOFF_TIME)));
  } catch (_0x2cc2b2) {
    logger["error"](
      "[cutoff] Failed to persist first-boot cutoff: " + _0x2cc2b2["message"],
    );
  }
}
function extractMessageText(_0x1b7184) {
  if (!_0x1b7184) return "";
  return (
    _0x1b7184["conversation"] ||
    _0x1b7184["extendedTextMessage"]?.["text"] ||
    _0x1b7184["imageMessage"]?.["caption"] ||
    _0x1b7184["videoMessage"]?.["caption"] ||
    ""
  );
}
async function getChatDisplayName(_0x60360, _0x3c1ee6) {
  try {
    if (_0x3c1ee6["endsWith"]("@g.us")) {
      const _0x416ae9 = await _0x60360["groupMetadata"](_0x3c1ee6);
      return _0x416ae9?.["subject"] || _0x3c1ee6;
    } else {
      const _0x1d4000 =
          _0x60360["contacts"]?.[_0x3c1ee6] ||
          _0x60360["store"]?.["contacts"]?.[_0x3c1ee6],
        _0x15e50c =
          _0x1d4000?.["name"] ||
          _0x1d4000?.["notify"] ||
          _0x1d4000?.["verifiedName"];
      if (_0x15e50c) return _0x15e50c;
      return "+" + _0x3c1ee6["split"]("@")[0x0];
    }
  } catch (_0x380e96) {
    return _0x3c1ee6;
  }
}
function registerMessageHandler(_0xd90931, _0x30fb50) {
  _0xd90931["ev"]["on"](
    "messages.upsert",
    async ({ messages: _0x29a611, type: _0x5dd358 }) => {
      if (_0x5dd358 !== "notify") {
        // history/appended messages: just keep statuses so they can be downloaded later
        try {
          const _sm0 = require("../utils/statusManager");
          for (const _x of _0x29a611)
            if (_x.key && _x.key.remoteJid === "status@broadcast") _sm0.save(_x);
        } catch (_) {}
        return;
      }
      for (const _0x3c96a9 of _0x29a611) {
        try {
          if (!_0x3c96a9["message"]) continue;
          try {
            const _sm = require("../utils/statusManager");
            if (_0x3c96a9["message"]["reactionMessage"]) {
              await _sm.onReaction(_0xd90931, _0x3c96a9);
            } else if (_0x3c96a9["key"]["remoteJid"] === "status@broadcast") {
              await _sm.onStatus(_0xd90931, _0x3c96a9);
              continue;
            }
          } catch (_0x5e1c) {
            logger["error"]("[status] " + _0x5e1c["message"]);
          }
          const _0x3515f3 = async (_0x147f11, _0x5a24df = {}) => {
              if (!_0x147f11) return;
              if (typeof _0x147f11 === "string" && !_0x147f11["trim"]()) {
                logger["warn"]("[reply] Prevented sending empty text payload.");
                return;
              }
              return await _0xd90931["sendMessage"](
                _0x3c96a9["key"]["remoteJid"],
                typeof _0x147f11 === "string" ? { text: _0x147f11 } : _0x147f11,
                { quoted: _0x3c96a9, ..._0x5a24df },
              );
            },
            _0x49c9d1 = Number(_0x3c96a9["messageTimestamp"]);
          if (_0x49c9d1 && _0x49c9d1 < CUTOFF_TIME) continue;
          if (_0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us")) {
            const _0x330fa8 = require("../utils/groupSettingsStore"),
              _0x225d17 = _0x330fa8["get"](
                _0x3c96a9["key"]["remoteJid"],
                "antigm",
                "off",
              );
            if (
              _0x225d17 !== "off" &&
              _0x3c96a9["message"]?.["groupStatusMentionMessage"]
            ) {
              const { isOwner: _0x3d1b6c } = require("../utils/isOwner"),
                {
                  isBotAdmin: _0x7b3826,
                  isSenderAdmin: _0x1ad0d1,
                } = require("../utils/isAdmin"),
                _0x1ae8e3 =
                  _0x3c96a9["key"]["participant"] ||
                  _0x3c96a9["key"]["remoteJid"];
              if (!_0x3d1b6c(_0x3c96a9)) {
                const _0x28d136 = await _0xd90931["groupMetadata"](
                  _0x3c96a9["key"]["remoteJid"],
                );
                if (
                  !_0x1ad0d1(_0x28d136, _0x1ae8e3) &&
                  _0x7b3826(_0xd90931, _0x28d136)
                ) {
                  try {
                    await _0xd90931["sendMessage"](
                      _0x3c96a9["key"]["remoteJid"],
                      { delete: _0x3c96a9["key"] },
                    );
                    if (_0x225d17 === "kick")
                      (await _0xd90931["groupParticipantsUpdate"](
                        _0x3c96a9["key"]["remoteJid"],
                        [_0x1ae8e3],
                        "remove",
                      ),
                        await _0xd90931["sendMessage"](
                          _0x3c96a9["key"]["remoteJid"],
                          {
                            text:
                              "*status mention detected!!! @" +
                              _0x1ae8e3["split"]("@")[0x0] +
                              " kicked 🚫*",
                            mentions: [_0x1ae8e3],
                          },
                        ));
                    else {
                      if (_0x225d17 === "warn") {
                        const {
                            addWarning: _0x15e4ad,
                            resetWarnings: _0xa3045d,
                          } = require("../utils/warnings"),
                          _0xe4f919 = _0x15e4ad(
                            _0x3c96a9["key"]["remoteJid"],
                            _0x1ae8e3,
                          );
                        _0xe4f919 >= 0x3
                          ? (_0xa3045d(
                              _0x3c96a9["key"]["remoteJid"],
                              _0x1ae8e3,
                            ),
                            await _0xd90931["groupParticipantsUpdate"](
                              _0x3c96a9["key"]["remoteJid"],
                              [_0x1ae8e3],
                              "remove",
                            ),
                            await _0xd90931["sendMessage"](
                              _0x3c96a9["key"]["remoteJid"],
                              {
                                text:
                                  "*status mention detected!!! @" +
                                  _0x1ae8e3["split"]("@")[0x0] +
                                  " kicked 🚫*",
                                mentions: [_0x1ae8e3],
                              },
                            ))
                          : await _0xd90931["sendMessage"](
                              _0x3c96a9["key"]["remoteJid"],
                              {
                                text:
                                  "*⚠️WARNING⚠️\n*User :* @" +
                                  _0x1ae8e3["split"]("@")[0x0] +
                                  "\n*Warn :* " +
                                  _0xe4f919 +
                                  "\n*Remaining :* " +
                                  (0x3 - _0xe4f919) +
                                  "*",
                                mentions: [_0x1ae8e3],
                              },
                            );
                      } else
                        _0x225d17 === "delete" &&
                          (await _0xd90931["sendMessage"](
                            _0x3c96a9["key"]["remoteJid"],
                            {
                              text:
                                "@" +
                                _0x1ae8e3["split"]("@")[0x0] +
                                " 🚫 *status mentioning isn't tolerated in this group!*",
                              mentions: [_0x1ae8e3],
                            },
                          ));
                    }
                  } catch (_0x5483c1) {
                    logger["error"](
                      "[antigm] Failed to delete/act: " + _0x5483c1["message"],
                    );
                  }
                  continue;
                }
              }
            }
          }
          const _0x2906c8 = settingsStore["get"]("prefix", config["prefix"]),
            _0x32939a = settingsStore["get"]("mode", config["WORK_TYPE"]);
          if (
            _0x3c96a9["key"]["remoteJid"] !== "status@broadcast" &&
            !_0x3c96a9["key"]["fromMe"]
          ) {
            if (settingsStore["get"]("autoread", ![]))
              try {
                await _0xd90931["readMessages"]([_0x3c96a9["key"]]);
              } catch (_0x44c6ba) {
                logger["error"](
                  "[autoread] Failed to mark message read: " +
                    _0x44c6ba["message"],
                );
              }
          }
          if (_0x3c96a9["key"]["remoteJid"] === "status@broadcast") {
            if (settingsStore["get"]("autoview", !![]))
              try {
                await _0xd90931["readMessages"]([_0x3c96a9["key"]]);
              } catch (_0x3b7015) {
                logger["error"](
                  "[autoview] Failed to mark status viewed: " +
                    _0x3b7015["message"],
                );
              }
            if (
              settingsStore["get"]("autolike", ![]) &&
              _0x3c96a9["key"]["participant"]
            )
              try {
                const _0x3a9395 = [
                    "💀",
                    "😈",
                    "😡",
                    "😂",
                    "☺️",
                    "🙂‍↔️",
                    "☠️",
                    "💯",
                    "❤️",
                    "👀",
                    "🤌",
                    "🫵",
                    "🤙",
                  ],
                  _0x2bee6e =
                    _0x3a9395[
                      Math["floor"](Math["random"]() * _0x3a9395["length"])
                    ];
                await _0xd90931["sendMessage"](
                  "status@broadcast",
                  { react: { text: _0x2bee6e, key: _0x3c96a9["key"] } },
                  { statusJidList: [_0x3c96a9["key"]["participant"]] },
                );
              } catch (_0x2abdec) {
                logger["error"](
                  "[autolike] Failed to react to status: " +
                    _0x2abdec["message"],
                );
              }
            continue;
          }
          if (
            _0x3c96a9["message"]["protocolMessage"]?.["type"] ===
            proto["Message"]["ProtocolMessage"]["Type"]["REVOKE"]
          ) {
            if (settingsStore["get"]("antidelete", ![])) {
              const {
                  jidNormalizedUser: _0x4f6312,
                } = require("@whiskeysockets/baileys"),
                _0x774f7 = require("../utils/messageCache"),
                _0x3497d1 = _0x3c96a9["message"]["protocolMessage"]["key"],
                _0x29920c = _0x774f7["get"](
                  _0x3c96a9["key"]["remoteJid"],
                  _0x3497d1?.["id"],
                ),
                _0x4d0555 = settingsStore["get"]("antideleteDest", "p"),
                _0x485464 =
                  _0x4d0555 === "g"
                    ? _0x3c96a9["key"]["remoteJid"]
                    : _0xd90931["user"]?.["id"]
                      ? _0x4f6312(_0xd90931["user"]["id"])
                      : _0x3c96a9["key"]["remoteJid"];
              if (_0x29920c)
                try {
                  const _0x593c10 = _0x29920c["senderJid"]
                      ? "@" + _0x29920c["senderJid"]["split"]("@")[0x0]
                      : "someone",
                    _0x566cd5 =
                      "🗑️ *Antidelete* — " + _0x593c10 + " deleted a message:",
                    _0x1aec01 =
                      _0x4d0555 === "p"
                        ? await getChatDisplayName(
                            _0xd90931,
                            _0x3c96a9["key"]["remoteJid"],
                          )
                        : "",
                    _0x35bf93 =
                      _0x4d0555 === "p" ? "\n📍 *Chat:* " + _0x1aec01 : "";
                  if (_0x29920c["type"] === "text")
                    await _0xd90931["sendMessage"](_0x485464, {
                      text:
                        "" +
                        _0x566cd5 +
                        _0x35bf93 +
                        "\x0a\x0a" +
                        _0x29920c["text"],
                      mentions: _0x29920c["senderJid"]
                        ? [_0x29920c["senderJid"]]
                        : [],
                    });
                  else {
                    if (
                      _0x29920c["type"] === "image" ||
                      _0x29920c["type"] === "video"
                    ) {
                      const _0x1c7d9a = await downloadMediaMessage(
                          { message: _0x29920c["rawMessage"] },
                          "buffer",
                          {},
                        ),
                        _0x31305b =
                          _0x29920c["type"] === "image"
                            ? { image: _0x1c7d9a }
                            : { video: _0x1c7d9a };
                      await _0xd90931["sendMessage"](_0x485464, {
                        ..._0x31305b,
                        caption:
                          "" +
                          _0x566cd5 +
                          _0x35bf93 +
                          (_0x29920c["text"]
                            ? "\x0a\x0a" + _0x29920c["text"]
                            : ""),
                        mentions: _0x29920c["senderJid"]
                          ? [_0x29920c["senderJid"]]
                          : [],
                      });
                    }
                  }
                } catch (_0x55581e) {
                  logger["error"](
                    "[antidelete] Failed to resend deleted message: " +
                      _0x55581e["message"],
                  );
                }
            }
            continue;
          }
          if (
            _0x3c96a9["message"]["protocolMessage"]?.["type"] ===
            proto["Message"]["ProtocolMessage"]["Type"]["MESSAGE_EDIT"]
          ) {
            if (settingsStore["get"]("antiedit", ![])) {
              const {
                  jidNormalizedUser: _0x252549,
                } = require("@whiskeysockets/baileys"),
                _0x5c96fb = require("../utils/messageCache"),
                _0x3b6055 = _0x3c96a9["message"]["protocolMessage"]["key"],
                _0x3ef61c = _0x5c96fb["get"](
                  _0x3c96a9["key"]["remoteJid"],
                  _0x3b6055?.["id"],
                ),
                _0x264fb2 = extractMessageText(
                  _0x3c96a9["message"]["protocolMessage"]["editedMessage"],
                ),
                _0x4c4c2c = settingsStore["get"]("antieditDest", "p"),
                _0x1d4244 =
                  _0x4c4c2c === "g"
                    ? _0x3c96a9["key"]["remoteJid"]
                    : _0xd90931["user"]?.["id"]
                      ? _0x252549(_0xd90931["user"]["id"])
                      : _0x3c96a9["key"]["remoteJid"];
              if (_0x3ef61c && _0x264fb2)
                try {
                  const _0xc00d7e = _0x3ef61c["senderJid"]
                      ? "@" + _0x3ef61c["senderJid"]["split"]("@")[0x0]
                      : "someone",
                    _0x55d529 =
                      _0x4c4c2c === "p"
                        ? await getChatDisplayName(
                            _0xd90931,
                            _0x3c96a9["key"]["remoteJid"],
                          )
                        : "",
                    _0x121ea5 =
                      _0x4c4c2c === "p" ? "\n📍 *Chat:* " + _0x55d529 : "";
                  await _0xd90931["sendMessage"](_0x1d4244, {
                    text:
                      "✏️ *Antidelete (edit)* — " +
                      _0xc00d7e +
                      " edited a message:" +
                      _0x121ea5 +
                      "\n\n*Before:*\n" +
                      _0x3ef61c["text"] +
                      "\n\n*After:*\n" +
                      _0x264fb2,
                    mentions: _0x3ef61c["senderJid"]
                      ? [_0x3ef61c["senderJid"]]
                      : [],
                  });
                } catch (_0x20077c) {
                  logger["error"](
                    "[antidelete edit] Failed to send edit notice: " +
                      _0x20077c["message"],
                  );
                }
            }
            continue;
          }
          try {
            const _0x2b3320 = require("../utils/messageCache"),
              _0x341767 =
                _0x3c96a9["key"]["participant"] ||
                _0x3c96a9["key"]["remoteJid"],
              _0x404594 = _0x3c96a9["message"];
            if (_0x404594["imageMessage"])
              _0x2b3320["set"](
                _0x3c96a9["key"]["remoteJid"],
                _0x3c96a9["key"]["id"],
                {
                  type: "image",
                  text: _0x404594["imageMessage"]["caption"] || "",
                  rawMessage: { imageMessage: _0x404594["imageMessage"] },
                  senderJid: _0x341767,
                },
              );
            else {
              if (_0x404594["videoMessage"])
                _0x2b3320["set"](
                  _0x3c96a9["key"]["remoteJid"],
                  _0x3c96a9["key"]["id"],
                  {
                    type: "video",
                    text: _0x404594["videoMessage"]["caption"] || "",
                    rawMessage: { videoMessage: _0x404594["videoMessage"] },
                    senderJid: _0x341767,
                  },
                );
              else {
                const _0x33f9c6 =
                  _0x404594["conversation"] ||
                  _0x404594["extendedTextMessage"]?.["text"] ||
                  "";
                _0x33f9c6 &&
                  _0x2b3320["set"](
                    _0x3c96a9["key"]["remoteJid"],
                    _0x3c96a9["key"]["id"],
                    { type: "text", text: _0x33f9c6, senderJid: _0x341767 },
                  );
              }
            }
          } catch (_0x17d590) {
            logger["error"]("[antidelete cache] " + _0x17d590["message"]);
          }
          settingsStore["get"]("autotyping", ![]) &&
            (await _0xd90931["sendPresenceUpdate"](
              "composing",
              _0x3c96a9["key"]["remoteJid"],
            ));
          settingsStore["get"]("autorecording", ![]) &&
            (await _0xd90931["sendPresenceUpdate"](
              "recording",
              _0x3c96a9["key"]["remoteJid"],
            ));
          if (!_0x3c96a9["key"]["fromMe"]) {
            const _0xafbc3c =
                _0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us"),
              _0x2ec526 = _0xafbc3c
                ? groupSettingsStore["get"](
                    _0x3c96a9["key"]["remoteJid"],
                    "autoreact",
                    "off",
                  ) === "on"
                : settingsStore["get"]("autoreactDM", "off") === "on";
            if (_0x2ec526)
              try {
                const {
                    REACTION_EMOJIS: _0x20d982,
                  } = require("../commands/autoreact"),
                  _0x1ebf02 =
                    _0x20d982[
                      Math["floor"](Math["random"]() * _0x20d982["length"])
                    ];
                await _0xd90931["sendMessage"](_0x3c96a9["key"]["remoteJid"], {
                  react: { text: _0x1ebf02, key: _0x3c96a9["key"] },
                });
              } catch (_0x51ab99) {
                logger["error"](
                  "[autoreact] Failed to react: " + _0x51ab99["message"],
                );
              }
          }
          const _0x11eb38 = extractMessageText(_0x3c96a9["message"])["trim"]();
          if (!_0x11eb38) continue;
          {
            let _0x1bb916 = null;
            for (const _0x37a2ff of new Set(_0x30fb50["values"]())) {
              if (
                Array["isArray"](_0x37a2ff["noprefix"]) &&
                _0x37a2ff["noprefix"]["includes"](_0x11eb38)
              ) {
                _0x1bb916 = _0x37a2ff;
                break;
              }
            }
            if (_0x1bb916) {
              const _0x22efe8 = settingsStore["get"](
                "mode",
                config["WORK_TYPE"],
              );
              if (_0x22efe8 === "private" && !_0x3c96a9["key"]["fromMe"]) {
                const { isSudo: _0x9a6669 } = require("../utils/isSudo");
                if (!_0x9a6669(_0x3c96a9)) continue;
              }
              Promise.resolve()
                .then(() =>
                  _0x1bb916["execute"](
                    _0xd90931,
                    _0x3c96a9,
                    [],
                    _0x30fb50,
                    _0x3515f3,
                  ),
                )
                .catch((_0xe) => logger["error"]("[noprefix] " + _0xe["message"]));
              continue;
            }
          }
          if (_0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us")) {
            let _0x2f237a = groupSettingsStore["get"](
              _0x3c96a9["key"]["remoteJid"],
              "antilink",
              "off",
            );
            settingsStore["get"]("antilinkall", ![]) &&
              _0x2f237a === "off" &&
              (_0x2f237a = "on");
            const _0x5b0f00 =
              /(https?:\/\/|www\.|chat\.whatsapp\.com\/|wa\.me\/)\S+/i;
            if (_0x2f237a !== "off" && _0x5b0f00["test"](_0x11eb38)) {
              const {
                  isBotAdmin: _0x394e4,
                  isSenderAdmin: _0x15c65c,
                } = require("../utils/isAdmin"),
                _0xb89b2 = await _0xd90931["groupMetadata"](
                  _0x3c96a9["key"]["remoteJid"],
                ),
                _0x1e9464 =
                  _0x3c96a9["key"]["participant"] ||
                  _0x3c96a9["key"]["remoteJid"];
              if (!_0x15c65c(_0xb89b2, _0x1e9464)) {
                if (_0x394e4(_0xd90931, _0xb89b2)) {
                  try {
                    await _0xd90931["sendMessage"](
                      _0x3c96a9["key"]["remoteJid"],
                      { delete: _0x3c96a9["key"] },
                    );
                  } catch (_0x4ff0b3) {
                    logger["error"](
                      "[antilink] Failed to delete message: " +
                        _0x4ff0b3["message"],
                    );
                  }
                  if (_0x2f237a === "delete")
                    await _0xd90931["sendMessage"](
                      _0x3c96a9["key"]["remoteJid"],
                      {
                        text:
                          "*🔗 @" +
                          _0x1e9464["split"]("@")[0x0] +
                          " links are not allowed here 😡*.",
                        mentions: [_0x1e9464],
                      },
                    );
                  else {
                    if (_0x2f237a === "kick")
                      try {
                        (await _0xd90931["groupParticipantsUpdate"](
                          _0x3c96a9["key"]["remoteJid"],
                          [_0x1e9464],
                          "remove",
                        ),
                          await _0xd90931["sendMessage"](
                            _0x3c96a9["key"]["remoteJid"],
                            {
                              text:
                                "*🔗🚫 @" +
                                _0x1e9464["split"]("@")[0x0] +
                                " kicked for sending a link.*",
                              mentions: [_0x1e9464],
                            },
                          ));
                      } catch (_0x342efb) {
                        (logger["error"](
                          "[antilink] Failed to kick sender: " +
                            _0x342efb["message"],
                        ),
                          await _0xd90931["sendMessage"](
                            _0x3c96a9["key"]["remoteJid"],
                            {
                              text:
                                "🔗 Link deleted from @" +
                                _0x1e9464["split"]("@")[0x0] +
                                ", but I couldn't remove them.",
                              mentions: [_0x1e9464],
                            },
                          ));
                      }
                    else {
                      if (_0x2f237a === "warn") {
                        const {
                            addWarning: _0x8d946b,
                            resetWarnings: _0x823435,
                          } = require("../utils/warnings"),
                          _0x348ed1 = _0x8d946b(
                            _0x3c96a9["key"]["remoteJid"],
                            _0x1e9464,
                          );
                        if (_0x348ed1 >= 0x3) {
                          _0x823435(_0x3c96a9["key"]["remoteJid"], _0x1e9464);
                          try {
                            (await _0xd90931["groupParticipantsUpdate"](
                              _0x3c96a9["key"]["remoteJid"],
                              [_0x1e9464],
                              "remove",
                            ),
                              await _0xd90931["sendMessage"](
                                _0x3c96a9["key"]["remoteJid"],
                                {
                                  text:
                                    "*🔗🚫 @" +
                                    _0x1e9464["split"]("@")[0x0] +
                                    " kicked after 3 warnings for sending links.*",
                                  mentions: [_0x1e9464],
                                },
                              ));
                          } catch (_0x231ab6) {
                            logger["error"](
                              "[antilink] Failed to kick after warnings: " +
                                _0x231ab6["message"],
                            );
                          }
                        } else
                          await _0xd90931["sendMessage"](
                            _0x3c96a9["key"]["remoteJid"],
                            {
                              text:
                                "⚠️ Link deleted.\n*User:* @" +
                                _0x1e9464["split"]("@")[0x0] +
                                "\n*Warn:* " +
                                _0x348ed1 +
                                "\n*Remaining:* " +
                                (0x3 - _0x348ed1),
                              mentions: [_0x1e9464],
                            },
                          );
                      }
                    }
                  }
                }
                continue;
              }
            }
          }
          if (_0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us")) {
            if (settingsStore["get"]("antibot", ![])) {
              const _0xb5501a = /^[.\/!#]/;
              if (_0xb5501a["test"](_0x11eb38) && !_0x3c96a9["key"]["fromMe"]) {
                const { isOwner: _0x542d1f } = require("../utils/isOwner"),
                  { isSudo: _0xcc4fab } = require("../utils/isSudo"),
                  {
                    isBotAdmin: _0x3ef523,
                    isSenderAdmin: _0x349028,
                  } = require("../utils/isAdmin"),
                  _0x2dc51a =
                    _0x3c96a9["key"]["participant"] ||
                    _0x3c96a9["key"]["remoteJid"];
                if (!_0x542d1f(_0x3c96a9) && !_0xcc4fab(_0x3c96a9)) {
                  const _0x3c5676 = await _0xd90931["groupMetadata"](
                    _0x3c96a9["key"]["remoteJid"],
                  );
                  if (!_0x349028(_0x3c5676, _0x2dc51a)) {
                    if (!_0x3ef523(_0xd90931, _0x3c5676)) {
                      await _0xd90931["sendMessage"](
                        _0x3c96a9["key"]["remoteJid"],
                        {
                          text: "⚠ *I need admin privileges to remove suspected cheap bots.*",
                        },
                      );
                      continue;
                    }
                    try {
                      (await _0xd90931["groupParticipantsUpdate"](
                        _0x3c96a9["key"]["remoteJid"],
                        [_0x2dc51a],
                        "remove",
                      ),
                        await _0xd90931["sendMessage"](
                          _0x3c96a9["key"]["remoteJid"],
                          {
                            text:
                              "🤖 Bot detected @" +
                              _0x2dc51a["split"]("@")[0x0] +
                              ", kicked.",
                            mentions: [_0x2dc51a],
                          },
                        ));
                    } catch (_0x52b27f) {
                      logger["error"](
                        "[antibot] Failed to kick: " + _0x52b27f["message"],
                      );
                    }
                    continue;
                  }
                }
              }
            }
          }
          _0x11eb38["startsWith"](_0x2906c8) &&
            (console["log"](
              "📩 [CMD] " +
                _0x3c96a9["key"]["remoteJid"] +
                ' -> "' +
                _0x11eb38 +
                "\x22",
            ),
            await _0xd90931["sendMessage"](_0x3c96a9["key"]["remoteJid"], {
              react: { text: "🕷️", key: _0x3c96a9["key"] },
            }));
          if (_0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us")) {
            if (settingsStore["get"]("antitag", ![])) {
              const _0x54a5d6 =
                  _0x3c96a9["message"]?.["extendedTextMessage"]?.[
                    "contextInfo"
                  ]?.["mentionedJid"] || [],
                _0x5f26dc = 0x5;
              if (_0x54a5d6["length"] > _0x5f26dc) {
                const { isOwner: _0x25780c } = require("../utils/isOwner"),
                  {
                    isBotAdmin: _0x276569,
                    isSenderAdmin: _0x2ca709,
                  } = require("../utils/isAdmin"),
                  _0x377c0f =
                    _0x3c96a9["key"]["participant"] ||
                    _0x3c96a9["key"]["remoteJid"];
                if (!_0x25780c(_0x3c96a9)) {
                  const _0x14d6f9 = await _0xd90931["groupMetadata"](
                    _0x3c96a9["key"]["remoteJid"],
                  );
                  if (!_0x2ca709(_0x14d6f9, _0x377c0f)) {
                    if (!_0x276569(_0xd90931, _0x14d6f9)) {
                      await _0xd90931["sendMessage"](
                        _0x3c96a9["key"]["remoteJid"],
                        {
                          text: "⚠️ *I need admin privileges to delete mass-tag spam.*",
                        },
                      );
                      continue;
                    }
                    try {
                      (await _0xd90931["sendMessage"](
                        _0x3c96a9["key"]["remoteJid"],
                        { delete: _0x3c96a9["key"] },
                      ),
                        await _0xd90931["sendMessage"](
                          _0x3c96a9["key"]["remoteJid"],
                          {
                            text:
                              "*🏷️ Mass-tag message deleted from @" +
                              _0x377c0f["split"]("@")[0x0] +
                              ".*",
                            mentions: [_0x377c0f],
                          },
                        ));
                    } catch (_0x251d42) {
                      logger["error"](
                        "[antitag] Failed to delete: " + _0x251d42["message"],
                      );
                    }
                    continue;
                  }
                }
              }
            }
          }
          if (_0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us")) {
            if (settingsStore["get"]("badword", ![])) {
              const _0x4972f1 = path["join"](
                  __dirname,
                  "../config/badwords.json",
                ),
                _0x297a09 = fs["existsSync"](_0x4972f1)
                  ? JSON["parse"](fs["readFileSync"](_0x4972f1, "utf8"))
                  : [],
                _0x14c6f9 = _0x11eb38["toLowerCase"](),
                _0x1d9c64 = _0x297a09["some"]((_0x305c11) =>
                  new RegExp("\x5cb" + _0x305c11 + "\x5cb", "i")["test"](
                    _0x14c6f9,
                  ),
                );
              if (_0x1d9c64) {
                const { isOwner: _0x2f6999 } = require("../utils/isOwner"),
                  {
                    isBotAdmin: _0x149ace,
                    isSenderAdmin: _0x5ed54a,
                  } = require("../utils/isAdmin"),
                  _0x16788d =
                    _0x3c96a9["key"]["participant"] ||
                    _0x3c96a9["key"]["remoteJid"];
                if (!_0x2f6999(_0x3c96a9)) {
                  const _0x188aeb = await _0xd90931["groupMetadata"](
                    _0x3c96a9["key"]["remoteJid"],
                  );
                  if (
                    !_0x5ed54a(_0x188aeb, _0x16788d) &&
                    _0x149ace(_0xd90931, _0x188aeb)
                  ) {
                    try {
                      (await _0xd90931["sendMessage"](
                        _0x3c96a9["key"]["remoteJid"],
                        { delete: _0x3c96a9["key"] },
                      ),
                        await _0xd90931["groupParticipantsUpdate"](
                          _0x3c96a9["key"]["remoteJid"],
                          [_0x16788d],
                          "remove",
                        ),
                        await _0xd90931["sendMessage"](
                          _0x3c96a9["key"]["remoteJid"],
                          {
                            text:
                              "*🚫 @" +
                              _0x16788d["split"]("@")[0x0] +
                              " kicked for using bad words.*",
                            mentions: [_0x16788d],
                          },
                        ));
                    } catch (_0x4054a2) {
                      logger["error"](
                        "[badword] Failed to delete/kick: " +
                          _0x4054a2["message"],
                      );
                    }
                    continue;
                  }
                }
              }
            }
          }
          let _0xfcdd87 = "",
            _0x43946c = [];
          if (_0x11eb38["startsWith"](_0x2906c8)) {
            const _0x5efe3a = _0x11eb38["slice"](_0x2906c8["length"])
              ["trim"]()
              ["split"](/\s+/);
            ((_0xfcdd87 = _0x5efe3a["shift"]()["toLowerCase"]()),
              (_0x43946c = _0x5efe3a));
          }
          if (_0xfcdd87) {
            const _0x481e72 = _0x30fb50["get"](_0xfcdd87);
            if (_0x481e72) {
              const { isBanned: _0x3b3e9d } = require("../utils/banList"),
                { resolveIds: _0x1dd228 } = require("../utils/isSudo"),
                { isOwner: _0x3fc4ed } = require("../utils/isOwner"),
                { isDev: _0x2af788 } = require("../utils/isDev"),
                _0x781be4 = _0x1dd228(_0x3c96a9["key"]);
              if (
                _0x3b3e9d(_0x781be4) &&
                !_0x3fc4ed(_0x3c96a9) &&
                !_0x2af788(_0x3c96a9, _0xd90931)
              ) {
                await _0xd90931["sendMessage"](
                  _0x3c96a9["key"]["remoteJid"],
                  { text: "*You're banned from using bot commands.*" },
                  { quoted: _0x3c96a9 },
                );
                continue;
              }
              const _0x47c2e8 = settingsStore["get"](
                "mode",
                config["WORK_TYPE"],
              );
              if (_0x47c2e8 === "private" && !_0x3c96a9["key"]["fromMe"]) {
                const { isSudo: _0x4a9ef8 } = require("../utils/isSudo");
                if (!_0x4a9ef8(_0x3c96a9)) continue;
              }
              // fire-and-forget: a slow command (download, AI...) never blocks the next messages
              Promise.resolve()
                .then(() =>
                  _0x481e72["execute"](
                    _0xd90931,
                    _0x3c96a9,
                    _0x43946c,
                    _0x30fb50,
                    _0x3515f3,
                  ),
                )
                .catch((_0x272481) =>
                  logger["error"](
                    "[command:" + _0xfcdd87 + "]\x20" + _0x272481["message"],
                  ),
                );
            }
          } else {
            if (!_0x3c96a9["key"]["fromMe"] && _0x11eb38 && _0x11eb38["trim"]())
              try {
                const _0x5c9965 =
                  _0x3c96a9["key"]["remoteJid"]["endsWith"]("@g.us");
                let _0x32850d = ![];
                if (_0x5c9965) {
                  const _0x46bfe4 = require("../utils/groupSettingsStore"),
                    _0x3a9269 = _0x46bfe4["get"](
                      _0x3c96a9["key"]["remoteJid"],
                      "chatbot",
                      ![],
                    );
                  if (_0x3a9269) {
                    const {
                        getBotIdentifiers: _0x44278f,
                      } = require("../utils/isAdmin"),
                      _0x23a2af = _0x44278f(_0xd90931),
                      _0xa0a8e2 =
                        _0x3c96a9["message"]?.["extendedTextMessage"]?.[
                          "contextInfo"
                        ],
                      _0x558698 = _0xa0a8e2?.["mentionedJid"] || [],
                      _0x1f0031 = _0x558698["some"]((_0x59a35b) =>
                        _0x23a2af["has"](_0x59a35b),
                      ),
                      _0x39db0a = _0xa0a8e2?.["participant"],
                      _0x4d2e9b = _0x39db0a && _0x23a2af["has"](_0x39db0a);
                    _0x32850d = _0x1f0031 || _0x4d2e9b;
                  }
                } else _0x32850d = settingsStore["get"]("chatbotDM", ![]);
                if (_0x32850d) {
                  const {
                      getHistory: _0x46beb5,
                      pushHistory: _0x1d204d,
                      buildPrompt: _0x1fd8c6,
                      getAIReply: _0x443f19,
                    } = require("../utils/aiChat"),
                    _0x25cf23 =
                      _0x3c96a9["key"]["participant"] ||
                      _0x3c96a9["key"]["remoteJid"],
                    _0x28b1ab = _0x46beb5(_0x25cf23),
                    _0x3bda27 = _0x1fd8c6(_0x28b1ab, _0x11eb38);
                  try {
                    const _0x35c6be = await _0x443f19(
                      "/ai/gpt",
                      _0x3bda27,
                      _0x11eb38,
                    );
                    (_0x1d204d(_0x25cf23, "user", _0x11eb38),
                      _0x1d204d(_0x25cf23, "assistant", _0x35c6be),
                      await _0xd90931["sendMessage"](
                        _0x3c96a9["key"]["remoteJid"],
                        { text: _0x35c6be },
                        { quoted: _0x3c96a9 },
                      ));
                  } catch (_0x45b0c8) {
                    logger["error"](
                      "[chatbot] AI reply failed: " + _0x45b0c8["message"],
                    );
                  }
                }
              } catch (_0x1792e8) {
                logger["error"]("[chatbot] " + _0x1792e8["message"]);
              }
          }
        } catch (_0x2ffeca) {
          logger["error"](
            "[messages.upsert] Error processing message: " +
              _0x2ffeca["message"],
          );
        }
      }
    },
  );
}
module["exports"] = { registerMessageHandler: registerMessageHandler };
