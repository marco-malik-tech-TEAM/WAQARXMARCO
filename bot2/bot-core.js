((globalThis["crypto"] = require("node:crypto")["webcrypto"]),
  require("dotenv")["config"]());
const path = require("path"),
  { groupCache } = require("./utils/groupCache"),
  figlet = require("figlet"),
  chalk = require("chalk"),
  {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    proto,
  } = require("@whiskeysockets/baileys"),
  config = require("./config/config"),
  logger = require("./utils/logger"),
  baileysLogger = require("pino")({ level: "silent" }),
  { loadCommands } = require("./utils/commandLoader"),
  { registerConnectionHandler } = require("./events/connection"),
  { registerMessageHandler } = require("./events/messages"),
  { fetchCore } = require("./utils/fetchCore"),
  { acquireLock, releaseLock } = require("./utils/instanceLock"),
  heartbeat = require("./utils/heartbeat"),
  { isBotAdmin, getBotIdentifiers } = require("./utils/isAdmin"),
  fs = require("fs");
(acquireLock(), heartbeat["start"]());
function restoreSettingsFromEnv() {
  const _0x8c4acf = path["join"](require("./utils/paths").ROOT, "config", "botSettings.json");
  if (config["botSettingsData"] && !fs["existsSync"](_0x8c4acf))
    try {
      const _0x38290c = Buffer["from"](config["botSettingsData"], "base64")[
        "toString"
      ]("utf8");
      (fs["writeFileSync"](_0x8c4acf, _0x38290c),
        logger["info"]("✅ Restored bot settings from BOT_SETTINGS_DATA."));
    } catch (_0x31798e) {
      logger["error"](
        "[restoreSettingsFromEnv] Failed to restore settings: " +
          _0x31798e["message"],
      );
    }
}
function restoreSessionFromEnv() {
  const _0x2cf0ec = path["join"](require("./utils/paths").ROOT, "auth_info_baileys"),
    _0x14dd3d = path["join"](_0x2cf0ec, "creds.json");
  if (fs["existsSync"](_0x14dd3d)) return;
  try {
    const _0x48dc42 = require("./utils/settingsStore");
    if (_0x48dc42["get"]("_sessionLoggedOut", ![])) {
      (logger["warn"](
        "[restoreSession] Last session was logged out. Skipping restoration — fresh pair required.",
      ),
        _0x48dc42["set"]("_sessionLoggedOut", ![]));
      return;
    }
  } catch {}
  let _0x13b37b = config["sessionId"];
  if (!_0x13b37b)
    try {
      const _0x363dee = require("./utils/settingsStore");
      _0x13b37b = _0x363dee["get"]("_sessionBackup", null);
      if (_0x13b37b) logger["info"]("✅ Restored session from DB backup.");
    } catch {}
  if (!_0x13b37b) return;
  try {
    if (!fs["existsSync"](_0x2cf0ec))
      fs["mkdirSync"](_0x2cf0ec, { recursive: !![] });
    const _0x3e79a0 = Buffer["from"](
      _0x13b37b["replace"](/^[A-Za-z0-9_-]+:~/, ""),
      "base64",
    );
    (fs["writeFileSync"](_0x14dd3d, _0x3e79a0),
      logger["info"]("✅ Restored session from SESSION_ID."));
  } catch (_0x1fa710) {
    logger["error"](
      "[restoreSessionFromEnv] Failed to restore session: " +
        _0x1fa710["message"],
    );
  }
}
const commandsPath = path["join"](__dirname, "commands");
let commands = {},
  wapresenceInterval = null,
  autobioInterval = null,
  activeSock = null;
function printBanner() {
  (console["log"](
    chalk["green"](
      figlet["textSync"]("MARCO X WAQAR", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    ),
  ),
    console["log"](chalk["cyan"]("🤖 MARCO X WAQAR MD BOT is starting up...")));
}
async function startBot() {
  try {
    (restoreSessionFromEnv(), restoreSettingsFromEnv());
    const { state: _0x2477f1, saveCreds: _0x40020d } =
        await useMultiFileAuthState(
          path["join"](require("./utils/paths").ROOT, "auth_info_baileys"),
        ),
      _0x459066 = _0x2477f1["creds"]["registered"],
      { version: _0x2fa31c } = await fetchLatestBaileysVersion();
    let _0x4a5761 = null;
    if (!_0x2477f1["creds"]["registered"]) {
      if (process.env.PAIR_NUMBER && process.env.PAIR_NUMBER.trim()) {
        _0x4a5761 = process.env.PAIR_NUMBER.trim();
      } else if (process["stdin"]["isTTY"]) {
        const _0x1a7eb3 = require("readline"),
          _0x138bdf = _0x1a7eb3["createInterface"]({
            input: process["stdin"],
            output: process["stdout"],
          });
        _0x4a5761 = await new Promise((_0x5d7d5e) => {
          _0x138bdf["question"](
            "Enter your WhatsApp number with country code (e.g. 923001234567), or press Enter to use QR instead: ",
            (_0x2539eb) => {
              (_0x138bdf["close"](),
                _0x5d7d5e(
                  _0x2539eb && _0x2539eb["trim"]() ? _0x2539eb["trim"]() : null,
                ));
            },
          );
        });
      }
    }
    if (activeSock) {
      try {
        (activeSock["ev"]["removeAllListeners"](),
          activeSock["end"](new Error("Superseded by new socket")),
          logger["info"](
            "[socketCleanup] Previous socket closed before reconnect.",
          ));
      } catch (_0x44dff9) {
        logger["warn"](
          "[socketCleanup] Failed to close previous socket: " +
            _0x44dff9["message"],
        );
      }
      activeSock = null;
    }
    const _0x1b5cbb = makeWASocket({
      version: _0x2fa31c,
      auth: {
        creds: _0x2477f1["creds"],
        keys: makeCacheableSignalKeyStore(_0x2477f1["keys"], baileysLogger),
      },
      logger: baileysLogger,
      defaultQueryTimeoutMs: 0x15f90,
      connectTimeoutMs: 0x15f90,
      keepAliveIntervalMs: 0x3a98,
      retryRequestDelayMs: 0xfa,
      generateHighQualityLinkPreview: ![],
      maxMsgRetryCount: 3,
      syncFullHistory: ![],
      shouldSyncHistoryMessage: () => ![],
      markOnlineOnConnect: ![],
      browser: ["Ubuntu", "Chrome", "120.0.6099.130"],
      cachedGroupMetadata: async (_0x49883d) => groupCache["get"](_0x49883d),
      getMessage: async (_0x2fbb3b) => {
        const _0x243252 = require("./utils/messageCache"),
          _0x5be882 = _0x243252["get"](_0x2fbb3b["remoteJid"], _0x2fbb3b["id"]);
        if (_0x5be882?.["rawMessage"]) return _0x5be882["rawMessage"];
        if (_0x5be882?.["type"] === "text" && _0x5be882["text"])
          return { conversation: _0x5be882["text"] };
        return proto["Message"]["fromObject"]({});
      },
    });
    // Group metadata cache: every group command used to ask WhatsApp again on every message.
    (() => {
      const _gm = _0x1b5cbb["groupMetadata"]["bind"](_0x1b5cbb),
        _cache = new Map(),
        _wait = new Map(),
        _TTL = 5 * 60 * 1000;
      _0x1b5cbb["groupMetadata"] = async (_jid) => {
        const _c = _cache.get(_jid);
        if (_c && Date.now() - _c.t < _TTL) return _c.v;
        if (_wait.has(_jid)) return _wait.get(_jid);
        const _p = _gm(_jid)
          .then((_v) => (_cache.set(_jid, { v: _v, t: Date.now() }), _wait.delete(_jid), _v))
          .catch((_e) => (_wait.delete(_jid), Promise.reject(_e)));
        _wait.set(_jid, _p);
        return _p;
      };
      _0x1b5cbb["ev"]["on"]("groups.update", (_u) => (_u || []).forEach((_x) => _x && _x.id && _cache.delete(_x.id)));
      _0x1b5cbb["ev"]["on"]("group-participants.update", (_u) => _u && _cache.delete(_u.id));
    })();
    ((activeSock = _0x1b5cbb),
      _0x1b5cbb["ev"]["on"]("creds.update", _0x40020d),
      _0x1b5cbb["ev"]["on"]("creds.update", async () => {
        try {
          const _0x596b63 = require("./utils/settingsStore"),
            _0x291c02 = path["join"](require("./utils/paths").ROOT, "auth_info_baileys",
              "creds.json",
            );
          if (fs["existsSync"](_0x291c02)) {
            const _0x12e060 =
              "MARCO-X-WAQAR-MD:~" +
              fs["readFileSync"](_0x291c02)["toString"]("base64");
            // session backup intentionally disabled: no session ID is created
            void _0x12e060;
          }
        } catch (_0x5c4b69) {
          logger["warn"](
            "[sessionBackup] Could not back up session to DB:",
            _0x5c4b69["message"],
          );
        }
      }));
    let _0xb2e9d3 = ![];
    (_0x1b5cbb["ev"]["on"](
      "connection.update",
      async ({ connection: _0x4e7d10, lastDisconnect: _0x544eee }) => {
        if (_0x4e7d10 === "connecting") heartbeat["setState"]("connecting");
        if (_0x4e7d10 === "open") heartbeat["setState"]("running");
        if (_0x4e7d10 === "connecting" && _0x4a5761 && !_0xb2e9d3) {
          _0xb2e9d3 = !![];
          try {
            await new Promise((_0x42b2c0) => setTimeout(_0x42b2c0, 0xbb8));
            const _0x3f351e = await _0x1b5cbb["requestPairingCode"](_0x4a5761);
            (console["log"]("\n========================================"),
              console["log"]("   YOUR PAIRING CODE: " + _0x3f351e),
              console["log"]("========================================\n"),
              logger["info"](
                "Enter this code in WhatsApp > Linked Devices > Link with phone number.",
              ));
            if (process.send) {
              try {
                process.send({
                  type: "pairing_code",
                  requestId: process.env.PAIR_REQUEST_ID || null,
                  code: _0x3f351e,
                });
              } catch {}
            }
          } catch (_0x5ee0e6) {
            logger["error"]("[pairing] " + _0x5ee0e6["message"]);
            if (process.send) {
              try {
                process.send({
                  type: "pairing_error",
                  requestId: process.env.PAIR_REQUEST_ID || null,
                  message: _0x5ee0e6["message"],
                });
              } catch {}
            }
          }
        }
        if (_0x4e7d10 === "close") {
          const _0x286bb9 = _0x544eee?.["error"]?.["output"]?.["statusCode"];
          if (_0x286bb9 === DisconnectReason["loggedOut"]) {
            (heartbeat["setState"]("logged_out"), releaseLock());
            try {
              const _0xec69b = require("./utils/settingsStore");
              (_0xec69b["set"]("_sessionBackup", null),
                _0xec69b["set"]("_sessionLoggedOut", !![]),
                logger["info"](
                  "[sessionBackup] DB backup cleared after logout.",
                ));
            } catch {}
            try {
              const _0x2c7c5b = path["join"](require("./utils/paths").ROOT, "auth_info_baileys");
              (fs["rmSync"](_0x2c7c5b, { recursive: !![], force: !![] }),
                logger["info"](
                  "[session] Auth folder deleted — ready for fresh pair on restart.",
                ));
            } catch {}
          }
        }
      },
    ),
      _0x1b5cbb["ev"]["on"]("groups.update", async ([_0x3de3d4]) => {
        try {
          if (!_0x3de3d4?.["id"]) return;
          const _0x4fed97 = await _0x1b5cbb["groupMetadata"](_0x3de3d4["id"]);
          groupCache["set"](_0x3de3d4["id"], _0x4fed97);
        } catch (_0x17f744) {
          logger["error"](
            "[groupCache] Failed to update metadata for " +
              _0x3de3d4?.["id"] +
              ":\x20" +
              _0x17f744["message"],
          );
        }
      }));
    async function _0x547163(_0x563722, _0x32e65b, _0x62e553) {
      if (
        !(
          (_0x32e65b["action"] === "demote" ||
            _0x32e65b["action"] === "promote") &&
          _0x32e65b["author"]
        )
      )
        return;
      try {
        const _0x22fd54 = require("./utils/groupSettingsStore"),
          _0x3101ba = getBotIdentifiers(_0x563722);
        if (_0x3101ba["has"](_0x32e65b["author"])) return;
        const _0x20598a = _0x32e65b["participants"]["some"]((_0x3c3def) => {
          const _0x4e2696 =
            _0x3c3def["phoneNumber"] || _0x3c3def["id"] || _0x3c3def;
          return _0x3101ba["has"](_0x4e2696);
        });
        if (_0x20598a && _0x32e65b["action"] === "demote") {
          await _0x563722["sendMessage"](_0x32e65b["id"], {
            text: "*⚠️ I was just demoted and can no longer enforce antidemote in this group. A human admin needs to restore my admin rights.*",
          });
          return;
        }
        if (!isBotAdmin(_0x563722, _0x62e553)) return;
        const _0x593a13 = String(_0x32e65b["author"])
          ["split"]("@")[0x0]
          ["split"](":")[0x0];
        if (_0x593a13 === config["ownerNumber"]) return;
        const _0x2a36ee = [
          ...new Set([
            _0x32e65b["author"],
            ..._0x32e65b["participants"]["map"](
              (_0x379732) =>
                _0x379732["phoneNumber"] || _0x379732["id"] || _0x379732,
            ),
          ]),
        ];
        if (_0x32e65b["action"] === "demote") {
          const _0x2c3114 = _0x22fd54["get"](_0x32e65b["id"], "antidemote", {
            enabled: ![],
            action: "promote",
          });
          if (!_0x2c3114["enabled"]) return;
          if (_0x2c3114["action"] === "promote") {
            await _0x563722["groupParticipantsUpdate"](
              _0x32e65b["id"],
              _0x32e65b["participants"]["map"](
                (_0x4b5722) =>
                  _0x4b5722["phoneNumber"] || _0x4b5722["id"] || _0x4b5722,
              ),
              "promote",
            );
            const _0x2da090 = _0x62e553["participants"]["find"](
              (_0x58690f) =>
                _0x58690f["id"] === _0x32e65b["author"] &&
                (_0x58690f["admin"] === "admin" ||
                  _0x58690f["admin"] === "superadmin"),
            );
            (_0x2da090 &&
              (await _0x563722["groupParticipantsUpdate"](
                _0x32e65b["id"],
                [_0x32e65b["author"]],
                "demote",
              )),
              await _0x563722["sendMessage"](_0x32e65b["id"], {
                text: "*🔄 Unauthorized demotion detected — victim re-promoted, demoter demoted.*",
                mentions: _0x2a36ee,
              }));
          }
          _0x2c3114["action"] === "remove" &&
            (await _0x563722["groupParticipantsUpdate"](
              _0x32e65b["id"],
              _0x2a36ee,
              "remove",
            ),
            await _0x563722["sendMessage"](_0x32e65b["id"], {
              text: "*🚫 Unauthorized demotion detected — both users removed.*",
              mentions: _0x2a36ee,
            }));
        }
        if (_0x32e65b["action"] === "promote") {
          const _0x287629 = _0x22fd54["get"](_0x32e65b["id"], "antipromote", {
            enabled: ![],
            action: "demote",
          });
          if (!_0x287629["enabled"]) return;
          (_0x287629["action"] === "demote" &&
            (await _0x563722["groupParticipantsUpdate"](
              _0x32e65b["id"],
              _0x2a36ee,
              "demote",
            ),
            await _0x563722["sendMessage"](_0x32e65b["id"], {
              text: "*⬇️ Unauthorized promotion detected — both users demoted.*",
              mentions: _0x2a36ee,
            })),
            _0x287629["action"] === "remove" &&
              (await _0x563722["groupParticipantsUpdate"](
                _0x32e65b["id"],
                _0x2a36ee,
                "remove",
              ),
              await _0x563722["sendMessage"](_0x32e65b["id"], {
                text: "*🚫 Unauthorized promotion detected — both users removed.*",
                mentions: _0x2a36ee,
              })));
        }
      } catch (_0x6d3989) {
        console["error"]("[antidemote/antipromote]", _0x6d3989["message"]);
      }
    }
    _0x1b5cbb["ev"]["on"]("group-participants.update", async (_0xe8c00e) => {
      try {
        if (!_0xe8c00e?.["id"]) return;
        const _0xcb4957 = await _0x1b5cbb["groupMetadata"](_0xe8c00e["id"]);
        (groupCache["set"](_0xe8c00e["id"], _0xcb4957),
          await _0x547163(_0x1b5cbb, _0xe8c00e, _0xcb4957));
        const _0x5d46dd = require("./utils/settingsStore"),
          _0x4728ae = require("./utils/groupSettingsStore"),
          _0x1cb1aa = _0x4728ae["getAll"](_0xe8c00e["id"]);
        if (
          _0x1cb1aa["pdm"] &&
          (_0xe8c00e["action"] === "promote" ||
            _0xe8c00e["action"] === "demote")
        ) {
          const _0x528960 = _0xe8c00e["author"] || "",
            _0x27f94c = _0x528960
              ? "@" + _0x528960["split"]("@")[0x0]
              : "an Admin";
          for (const _0x2b1786 of _0xe8c00e["participants"]) {
            const _0x139fa7 =
                _0x2b1786["phoneNumber"] || _0x2b1786["id"] || _0x2b1786,
              _0x3c8cd7 = "@" + _0x139fa7["split"]("@")[0x0],
              _0xe75102 = [_0x139fa7];
            if (_0x528960) _0xe75102["push"](_0x528960);
            (_0xe8c00e["action"] === "promote" &&
              (await _0x1b5cbb["sendMessage"](_0xe8c00e["id"], {
                text: "*👑 " + _0x27f94c + " has crowned " + _0x3c8cd7 + ".*",
                mentions: _0xe75102,
              })),
              _0xe8c00e["action"] === "demote" &&
                (await _0x1b5cbb["sendMessage"](_0xe8c00e["id"], {
                  text: "*📉 " + _0x27f94c + " has demoted " + _0x3c8cd7 + ".*",
                  mentions: _0xe75102,
                })));
          }
          return;
        }
        if (_0x5d46dd["get"]("welcomegoodbye", ![])) {
          const _0x155d90 = require("./utils/groupSettingsStore")["getAll"](_0xe8c00e["id"]);
          await require("./utils/welcomeGreeter").handle(_0x1b5cbb, _0xe8c00e, _0xcb4957, _0x155d90);
        }
        if (_0x1cb1aa["setgreet"] && _0xe8c00e["action"] === "add")
          for (const _0x1a3740 of _0xe8c00e["participants"]) {
            const _0x41b551 =
              _0x1a3740["phoneNumber"] || _0x1a3740["id"] || _0x1a3740;
            await _0x1b5cbb["sendMessage"](_0xe8c00e["id"], {
              text:
                "*Hi @" +
                _0x41b551["split"]("@")[0x0] +
                ", this is MARCO X WAQAR MD BOT, glad to have you here*\n> powered by 𝗠𝗔𝗥𝗖𝗢 𝗫 𝗪𝗔𝗤𝗔𝗥",
              mentions: [_0x41b551],
            });
          }
      } catch (_0x225eeb) {
        logger["error"](
          "[groupCache] Failed to update metadata for " +
            _0xe8c00e?.["id"] +
            ":\x20" +
            _0x225eeb["message"],
        );
      }
    });
    if (autobioInterval) clearInterval(autobioInterval);
    ((autobioInterval = setInterval(async () => {
      try {
        const _0x5f3219 = require("./utils/settingsStore");
        if (!_0x5f3219["get"]("autobio", ![])) return;
        const _0x98c263 = JSON["parse"](
            fs["readFileSync"](
              path["join"](__dirname, "config", "autobioQuotes.json"),
              "utf8",
            ),
          ),
          _0x54914b =
            Math["floor"](Date["now"]() / (0xc * 0x3c * 0x3c * 0x3e8)) %
            _0x98c263["length"],
          _0x2bae93 = _0x98c263[_0x54914b],
          _0x49b576 = new Date(),
          _0x2ba224 = new Intl["DateTimeFormat"]("en-GB", {
            timeZone: config["timezone"],
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: ![],
          })["format"](_0x49b576),
          _0x33d59e = new Intl["DateTimeFormat"]("en-GB", {
            timeZone: config["timezone"],
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })["format"](_0x49b576);
        await _0x1b5cbb["updateProfileStatus"](
          "MARCO X WAQAR MD BOT is alive now\n" +
            _0x33d59e +
            "\x20" +
            _0x2ba224 +
            "\x0a\x22" +
            _0x2bae93 +
            "\x22",
        );
      } catch (_0x2a544a) {
        logger["error"](
          "[autobio] Failed to update bio: " + _0x2a544a["message"],
        );
      }
    }, 0x3c * 0x3e8)),
      _0x1b5cbb["ev"]["on"]("call", async (_0x1e4132) => {
        try {
          const _0xecf4b = require("./utils/settingsStore");
          if (!_0xecf4b["get"]("anticall", ![])) return;
          for (const _0x4d0d0c of _0x1e4132) {
            _0x4d0d0c["status"] === "offer" &&
              (await _0x1b5cbb["rejectCall"](
                _0x4d0d0c["id"],
                _0x4d0d0c["from"],
              ),
              !_0x4d0d0c["isGroup"] &&
                (await _0x1b5cbb["sendMessage"](_0x4d0d0c["from"], {
                  text: "*🚫 Call blocked !!! anticall is active! Only text messages are allowed*",
                })),
              logger["info"](
                "[anticall] Rejected incoming call from " + _0x4d0d0c["from"],
              ));
          }
        } catch (_0x1dcc2d) {
          logger["error"](
            "[anticall] Failed to reject call: " + _0x1dcc2d["message"],
          );
        }
      }));
    if (wapresenceInterval) clearInterval(wapresenceInterval);
    ((wapresenceInterval = setInterval(async () => {
      try {
        const _0x2ed70a = require("./utils/settingsStore");
        _0x2ed70a["get"]("wapresence", ![]) &&
          (await _0x1b5cbb["sendPresenceUpdate"]("available"));
      } catch (_0x54846c) {
        logger["error"](
          "[wapresence] Failed to update presence: " + _0x54846c["message"],
        );
      }
    }, 0x1e * 0x3e8)),
      registerConnectionHandler(_0x1b5cbb, startBot, _0x459066),
      registerMessageHandler(_0x1b5cbb, commands),
      !global["__cacheClearScheduled"] &&
        ((global["__cacheClearScheduled"] = !![]),
        setInterval(
          () => {
            const _0x14d72f = global["runClearCache"](commands);
            logger["info"](
              "[clearcache] Automatic cache clear: " +
                JSON["stringify"](_0x14d72f),
            );
          },
          0x6 * 0x3c * 0x3c * 0x3e8,
        )));
  } catch (_0x1d2845) {
    logger["error"](
      "[startBot] Failed to start the bot: " + _0x1d2845["message"],
    );
  }
}
(process["on"]("uncaughtException", (_0x38be2a) => {
  logger["error"](
    "[uncaughtException] " + (_0x38be2a["stack"] || _0x38be2a["message"]),
  );
}),
  process["on"]("unhandledRejection", (_0x1e7d54) => {
    logger["error"]("[unhandledRejection] " + _0x1e7d54);
  }));
const startupDelay = parseInt(process.env.BOT_RESTART_DELAY_MS || "0", 0xa);
setTimeout(async () => {
  (printBanner(), await fetchCore(), (commands = loadCommands(commandsPath)));
  const { runClearCache: _0x287f34 } = require("./commands/clearcache");
  ((global["runClearCache"] = _0x287f34),
    await require("./utils/settingsStore")["ready"],
    startBot());
}, startupDelay);
