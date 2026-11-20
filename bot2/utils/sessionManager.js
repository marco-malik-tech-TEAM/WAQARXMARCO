"use strict";
/**
 * UNLIMITED pairing.
 * Every WhatsApp number that pairs gets its OWN bot process with its OWN login,
 * settings and data (sessions/<engine>/<number>/). Nobody shares anything.
 *
 *   engine 1 = "Bot 1" (this folder)      engine 2 = "Bot 2" (./bot2)
 *
 * - requestPairing(engine, number, tgUserId)  -> resolves with the 8-letter pairing code
 * - autoStartAll()                            -> relaunches every linked session after a restart
 * - remove(engine, number)                    -> logs a session out and deletes it
 *
 * Limit: MAX_SESSIONS env (default 0 = unlimited). Each session needs roughly
 * 150-250 MB of RAM, so the real ceiling is the RAM of your server.
 */
const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");

let PROJECT = path.join(__dirname, "..");
if (path.basename(PROJECT) === "bot2") PROJECT = path.dirname(PROJECT); // when loaded from inside ./bot2
const ENGINES = { 1: PROJECT, 2: path.join(PROJECT, "bot2") };
const SESSIONS_DIR = process.env.SESSIONS_DIR ? path.resolve(process.env.SESSIONS_DIR) : process.env.DATA_DIR ? path.join(path.resolve(process.env.DATA_DIR), "sessions") : path.join(PROJECT, "sessions");
const MAX_SESSIONS = parseInt(process.env.MAX_SESSIONS || "0", 10) || 0;
const CODE_TIMEOUT_MS = 60000;
const LINK_WAIT_MS = 3 * 60 * 1000;
const OWNERS_FILE = path.join(SESSIONS_DIR, "owners.json");

const running = new Map(); // key -> { child, engine, number, restarts, lastStart }
const pending = new Map(); // requestId -> { resolve, reject, timer }
let owners = {};
try { owners = JSON.parse(fs.readFileSync(OWNERS_FILE, "utf8")); } catch (_) {}

const keyOf = (engine, number) => engine + ":" + number;
const dirOf = (engine, number) => path.join(SESSIONS_DIR, "e" + engine, String(number));
const credsOf = (engine, number) => path.join(dirOf(engine, number), "auth_info_baileys", "creds.json");

function saveOwners() {
  try { fs.mkdirSync(SESSIONS_DIR, { recursive: true }); fs.writeFileSync(OWNERS_FILE, JSON.stringify(owners)); } catch (_) {}
}
function isLinked(engine, number) {
  try { return !!JSON.parse(fs.readFileSync(credsOf(engine, number), "utf8")).registered; } catch (_) { return false; }
}
const isRunning = (engine, number) => running.has(keyOf(engine, number));

function spawnSession(engine, number, extraEnv = {}) {
  const key = keyOf(engine, number);
  if (running.has(key)) return running.get(key).child;
  const entry = ENGINES[engine];
  const dir = dirOf(engine, number);
  fs.mkdirSync(path.join(dir, "auth_info_baileys"), { recursive: true });
  fs.mkdirSync(path.join(dir, "data"), { recursive: true });
  fs.mkdirSync(path.join(dir, "config"), { recursive: true });

  const env = { ...process.env, UV_THREADPOOL_SIZE: "16", SESSIONS_DIR, ...extraEnv, SESSION_DIR: dir, OWNER_NUMBER: String(number) };
  for (const k of ["HOST_API_URL", "BOT_KEY", "SESSION_ID", "BOT_SETTINGS_DATA", "PAIR_NUMBER_MAIN"]) delete env[k];
  const child = fork(path.join(entry, "bot-core.js"), [], { cwd: entry, env, execArgv: ["--max-old-space-size=384"], silent: false });
  const rec = { child, engine, number: String(number), lastStart: Date.now(), linkTimer: null };
  running.set(key, rec);

  // if the user never finishes linking, free the slot
  if (!isLinked(engine, number)) {
    rec.linkTimer = setTimeout(() => {
      if (!isLinked(engine, number)) { try { child.kill(); } catch (_) {} try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {} }
    }, LINK_WAIT_MS);
  }

  child.on("message", (msg) => {
    if (!msg || !msg.requestId || !pending.has(msg.requestId)) return;
    const p = pending.get(msg.requestId);
    clearTimeout(p.timer);
    pending.delete(msg.requestId);
    if (msg.type === "pairing_code") p.resolve(msg.code);
    else if (msg.type === "pairing_error") p.reject(new Error(msg.message || "Pairing failed."));
  });
  child.on("exit", (code) => {
    clearTimeout(rec.linkTimer);
    running.delete(key);
    console.log(`[sessions] ${key} exited (code ${code})`);
    for (const [id, p] of pending) if (p.number === String(number) && p.engine === engine) { clearTimeout(p.timer); p.reject(new Error("The session closed before the code was ready. Try again.")); pending.delete(id); }
    // keep linked sessions alive (crash/restart), with a small back-off
    if (isLinked(engine, number) && !rec.removed) {
      const fast = Date.now() - rec.lastStart < 15000;
      setTimeout(() => { if (isLinked(engine, number) && !running.has(key)) try { spawnSession(engine, number); } catch (_) {} }, fast ? 15000 : 3000);
    }
  });
  child.on("error", (e) => console.error(`[sessions] ${key} error:`, e.message));
  return child;
}

function count() { return running.size; }

function requestPairing(engine, number, tgUserId) {
  number = String(number).replace(/\D/g, "");
  if (!ENGINES[engine] || !fs.existsSync(path.join(ENGINES[engine], "bot-core.js"))) return Promise.reject(new Error("Bot " + engine + " files are missing."));
  if (isLinked(engine, number)) {
    if (!isRunning(engine, number)) { try { spawnSession(engine, number); } catch (_) {} }
    return Promise.reject(new Error("This number is already linked to Bot " + engine + " and running ✅"));
  }
  if (isRunning(engine, number)) return Promise.reject(new Error("A pairing for this number is already in progress. Wait a minute and try again."));
  if (MAX_SESSIONS && running.size >= MAX_SESSIONS) return Promise.reject(new Error("The server is full right now (" + MAX_SESSIONS + " sessions). Try later."));

  // start from a clean slate for half-finished attempts
  try { fs.rmSync(dirOf(engine, number), { recursive: true, force: true }); } catch (_) {}
  const requestId = Date.now() + "-" + Math.random().toString(36).slice(2);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      const rec = running.get(keyOf(engine, number));
      if (rec && !isLinked(engine, number)) { rec.removed = true; try { rec.child.kill(); } catch (_) {} }
      reject(new Error("Timed out waiting for the pairing code. Please try again."));
    }, CODE_TIMEOUT_MS);
    pending.set(requestId, { resolve, reject, timer, number, engine });
    try {
      if (tgUserId) { owners[keyOf(engine, number)] = tgUserId; saveOwners(); }
      spawnSession(engine, number, { PAIR_NUMBER: number, PAIR_REQUEST_ID: requestId });
    } catch (e) { clearTimeout(timer); pending.delete(requestId); reject(e); }
  });
}

/** Relaunch all linked sessions after a restart (staggered so the CPU is not hit all at once). */
function autoStartAll() {
  const list = [];
  for (const engine of [1, 2]) {
    const base = path.join(SESSIONS_DIR, "e" + engine);
    let names = [];
    try { names = fs.readdirSync(base); } catch (_) {}
    for (const n of names) if (isLinked(engine, n)) list.push([engine, n]);
  }
  list.forEach(([engine, n], i) => setTimeout(() => { try { spawnSession(engine, n); } catch (e) { console.error("[sessions] start failed", n, e.message); } }, i * 2500));
  if (list.length) console.log(`[sessions] restoring ${list.length} linked session(s)...`);
}

function remove(engine, number) {
  number = String(number).replace(/\D/g, "");
  const rec = running.get(keyOf(engine, number));
  if (rec) { rec.removed = true; try { rec.child.kill(); } catch (_) {} }
  try { fs.rmSync(dirOf(engine, number), { recursive: true, force: true }); } catch (_) {}
  delete owners[keyOf(engine, number)]; saveOwners();
}

/** Sessions that a Telegram user created. */
function listFor(tgUserId) {
  return Object.entries(owners).filter(([, id]) => id === tgUserId).map(([k]) => { const [e, n] = k.split(":"); return { engine: Number(e), number: n, linked: isLinked(Number(e), n), running: isRunning(Number(e), n) }; });
}
const ownerOf = (engine, number) => owners[keyOf(engine, String(number).replace(/\D/g, ""))];

module.exports = { requestPairing, autoStartAll, remove, listFor, ownerOf, count, isLinked, isRunning };
