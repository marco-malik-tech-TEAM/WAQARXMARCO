"use strict";
/**
 * WhatsApp Status automation:
 *  - Auto status view  (setting "autoview",        default ON)
 *  - Auto status like  (setting "autolike",        default OFF)
 *  - Auto status reply (setting "autostatusreply", default OFF)
 *  - Status downloader (setting "statusdl",        default ON): react with ANY emoji
 *    to someone's status (or reply to it with .statusdl) and the status is sent to
 *    your own chat.
 *
 * Statuses are saved to disk (data/status_store.json, 24h), so statuses posted
 * while the bot was offline can still be downloaded / replied to after restart.
 */
const fs = require("fs");
const path = require("path");
const { downloadMediaMessage, jidNormalizedUser, getContentType, BufferJSON } = require("@whiskeysockets/baileys");
const settingsStore = require("./settingsStore");
const brand = require("./brand");
const logger = require("./logger");

const FILE = path.join(require("./paths").ROOT, "data", "status_store.json");
const REPLIED_FILE = path.join(require("./paths").ROOT, "data", "status_replied.json");
const TTL = 24 * 60 * 60 * 1000;
const MAX = 400;
const LIKE_EMOJIS = ["💀", "😈", "😂", "💯", "❤️", "👀", "🔥", "🤌", "🤙", "😍"];

let store = {};            // id -> { ts, jid, msg }
let replied = {};          // id -> ts
try { store = JSON.parse(fs.readFileSync(FILE, "utf8"), BufferJSON.reviver) || {}; } catch (_) { store = {}; }
try { replied = JSON.parse(fs.readFileSync(REPLIED_FILE, "utf8")) || {}; } catch (_) { replied = {}; }

let saveTimer = null;
function persist() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      const now = Date.now();
      for (const k of Object.keys(store)) if (now - store[k].ts > TTL) delete store[k];
      const keys = Object.keys(store).sort((a, b) => store[b].ts - store[a].ts);
      keys.slice(MAX).forEach((k) => delete store[k]);
      for (const k of Object.keys(replied)) if (now - replied[k] > TTL) delete replied[k];
      fs.writeFileSync(FILE, JSON.stringify(store, BufferJSON.replacer));
      fs.writeFileSync(REPLIED_FILE, JSON.stringify(replied));
    } catch (e) { logger.error("[status] save failed: " + e.message); }
  }, 2000);
}

const silentLogger = { level: "silent", trace() {}, debug() {}, info() {}, warn() {}, error() {}, fatal() {}, child() { return this; } };

function posterJid(m) {
  return m.key.participantPn || m.key.participantAlt || m.key.participant || "";
}
const numOf = (j) => String(j || "").split("@")[0].split(":")[0];

function contentOf(m) {
  const msg = m.message || {};
  const type = getContentType(msg);
  return { type, body: type ? msg[type] : null };
}
const isRealStatus = (m) => {
  const { type } = contentOf(m);
  return ["conversation", "extendedTextMessage", "imageMessage", "videoMessage", "audioMessage"].includes(type);
};

/** Save a status so it can be downloaded later (also when it arrived while the bot was offline). */
function save(m) {
  try {
    if (!m || !m.key || !m.key.id || !m.message || !isRealStatus(m)) return;
    if (store[m.key.id]) return;
    const ts = (Number(m.messageTimestamp) || Math.floor(Date.now() / 1000)) * 1000;
    if (Date.now() - ts > TTL) return;
    store[m.key.id] = { ts, jid: posterJid(m), msg: { key: m.key, message: m.message, messageTimestamp: m.messageTimestamp, pushName: m.pushName } };
    persist();
  } catch (_) {}
}

/* ---- serialized queue so many statuses never trigger a burst of messages ---- */
let chain = Promise.resolve();
const enqueue = (fn) => { chain = chain.then(fn).catch((e) => logger.error("[status] " + e.message)); return chain; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function handleOne(sock, m) {
  const poster = posterJid(m);
  if (!poster || m.key.fromMe) return;
  const id = m.key.id;

  if (settingsStore.get("autoview", true)) {
    try { await sock.readMessages([m.key]); } catch (e) { logger.error("[autoview] " + e.message); }
  }
  if (settingsStore.get("autolike", false)) {
    try {
      const emoji = LIKE_EMOJIS[Math.floor(Math.random() * LIKE_EMOJIS.length)];
      await sock.sendMessage("status@broadcast", { react: { text: emoji, key: m.key } }, { statusJidList: [m.key.participant || poster, jidNormalizedUser(sock.user.id)] });
      await wait(800);
    } catch (e) { logger.error("[autolike] " + e.message); }
  }
  if (settingsStore.get("autostatusreply", false) && !replied[id]) {
    replied[id] = Date.now();
    persist();
    try {
      const text =
        "👀 *Seen your status!*\n\n" +
        "🤖 By *" + brand.BOT_NAME + "*\n" +
        "👨‍💻 Developer: " + brand.DEVELOPER + "\n\n" +
        "> _" + brand.FOOTER + "_";
      await sock.sendMessage(poster.includes("@lid") && m.key.participantPn ? m.key.participantPn : poster, { text }, { quoted: m });
      await wait(1500 + Math.floor(Math.random() * 1500));
    } catch (e) { logger.error("[autostatusreply] " + e.message); }
  }
}

/** Called for every status@broadcast message. Non-blocking. */
function onStatus(sock, m) {
  save(m);
  if (!isRealStatus(m)) return Promise.resolve();
  enqueue(() => handleOne(sock, m));
  return Promise.resolve();
}

/** Send a saved status to the owner's own chat. */
async function sendStatusTo(sock, statusId, destJid) {
  const rec = store[statusId];
  if (!rec) return { ok: false, reason: "That status is not saved (older than 24h or the bot never received it)." };
  const m = rec.msg;
  const { type, body } = contentOf(m);
  const who = "@" + numOf(rec.jid);
  const mentions = rec.jid ? [rec.jid] : [];
  const tag = "\n\n👤 Status of " + who + "\n> _" + brand.FOOTER + "_";
  try {
    if (type === "conversation" || type === "extendedTextMessage") {
      const txt = type === "conversation" ? body : body.text;
      await sock.sendMessage(destJid, { text: "📝 *Status*\n\n" + txt + tag, mentions });
    } else {
      const buffer = await downloadMediaMessage(m, "buffer", {}, { logger: silentLogger, reuploadRequest: sock.updateMediaMessage });
      const cap = (body.caption ? body.caption + "\n" : "") + "✅ *Status downloaded*" + tag;
      if (type === "imageMessage") await sock.sendMessage(destJid, { image: buffer, caption: cap, mentions });
      else if (type === "videoMessage") await sock.sendMessage(destJid, { video: buffer, mimetype: "video/mp4", caption: cap, mentions });
      else if (type === "audioMessage") await sock.sendMessage(destJid, { audio: buffer, mimetype: body.mimetype || "audio/mpeg", ptt: !!body.ptt });
    }
    return { ok: true };
  } catch (e) {
    logger.error("[statusdl] " + e.message);
    return { ok: false, reason: e.message };
  }
}

const recent = new Map();
/** Owner reacts to a status with any emoji -> download it to the owner's DM. */
async function onReaction(sock, m) {
  const rm = m.message && m.message.reactionMessage;
  if (!rm || !rm.text || !rm.key || rm.key.remoteJid !== "status@broadcast") return false;
  if (!settingsStore.get("statusdl", true)) return false;
  const { isOwner } = require("./isOwner");
  if (!m.key.fromMe && !isOwner(m)) return false;
  const id = rm.key.id;
  if (recent.has(id) && Date.now() - recent.get(id) < 60000) return true;
  recent.set(id, Date.now());
  const me = jidNormalizedUser(sock.user.id);
  const r = await sendStatusTo(sock, id, me);
  if (!r.ok) await sock.sendMessage(me, { text: "❌ Status download failed: " + r.reason });
  return true;
}

module.exports = { onStatus, onReaction, save, sendStatusTo, has: (id) => !!store[id] };
