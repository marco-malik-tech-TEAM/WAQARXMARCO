"use strict";
/**
 * Runs Bot 2 (./bot2) as a child process of this bot.
 * - requestPairing(number): starts Bot 2 if needed, asks it to request a
 *   WhatsApp pairing code for `number`, and resolves with that code.
 * - autoStartIfLinked(): on this bot's own startup, if Bot 2 was already
 *   linked before (bot2/auth_info_baileys has valid creds), relaunch it
 *   automatically so both bots come back up together after a restart.
 *
 * Bot 2 is a full, independent copy of this same bot engine (its own
 * commands, auth folder, settings) — it just happens to be launched from
 * here instead of having its own Telegram/QR entry point.
 */
const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");

const BOT2_DIR = path.join(__dirname, "..", "bot2");
const BOT2_ENTRY = path.join(BOT2_DIR, "bot-core.js");
const AUTH_DIR = path.join(BOT2_DIR, "auth_info_baileys");
const CREDS_FILE = path.join(AUTH_DIR, "creds.json");

let child = null;
const pending = new Map(); // requestId -> { resolve, reject, timer }

function isLinked() {
  try {
    const c = JSON.parse(fs.readFileSync(CREDS_FILE, "utf8"));
    return !!c.registered;
  } catch {
    return false;
  }
}

function spawn(extraEnv) {
  if (child) return child;
  if (!fs.existsSync(BOT2_ENTRY)) {
    throw new Error("Bot 2 files were not found (bot2/bot-core.js is missing).");
  }
  child = fork(BOT2_ENTRY, [], {
    cwd: BOT2_DIR,
    env: { ...process.env, ...extraEnv },
  });
  child.on("exit", (code) => {
    console.log("[bot2] process exited, code:", code);
    child = null;
    for (const [id, p] of pending) {
      clearTimeout(p.timer);
      p.reject(new Error("Bot 2 process exited before pairing finished."));
      pending.delete(id);
    }
  });
  child.on("message", (msg) => {
    if (!msg || !msg.requestId || !pending.has(msg.requestId)) return;
    const p = pending.get(msg.requestId);
    clearTimeout(p.timer);
    pending.delete(msg.requestId);
    if (msg.type === "pairing_code") p.resolve(msg.code);
    else if (msg.type === "pairing_error") p.reject(new Error(msg.message || "Pairing failed."));
  });
  child.on("error", (e) => console.error("[bot2] failed to start:", e.message));
  return child;
}

function requestPairing(number) {
  if (isLinked()) {
    return Promise.reject(
      new Error("Bot 2 is already linked and running. Delete bot2/auth_info_baileys to re-pair."),
    );
  }
  if (child) {
    return Promise.reject(
      new Error("Bot 2 is already starting up or waiting to be paired. Please wait and try again."),
    );
  }
  const requestId = Date.now() + "-" + Math.random().toString(36).slice(2);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error("Timed out waiting for the pairing code from Bot 2."));
    }, 45000);
    pending.set(requestId, { resolve, reject, timer });
    try {
      spawn({ PAIR_NUMBER: number, PAIR_REQUEST_ID: requestId });
    } catch (e) {
      clearTimeout(timer);
      pending.delete(requestId);
      reject(e);
    }
  });
}

function autoStartIfLinked() {
  try {
    if (isLinked() && !child) spawn({});
  } catch (e) {
    console.error("[bot2] auto-start failed:", e.message);
  }
}

module.exports = { requestPairing, autoStartIfLinked, isLinked };
