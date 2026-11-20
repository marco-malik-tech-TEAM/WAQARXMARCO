'use strict';
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '32'; // faster crypto / file work
/**
 * MARCO X WAQAR MD BOT - Telegram pairing launcher
 * - A Telegram bot generates the WhatsApp pairing code for your number
 * - Once linked, the real bot (bot-core.js) starts automatically
 * The token is not hard-coded: set TELEGRAM_BOT_TOKEN in the panel's
 * Environment/Variables (or put it in telegram_token.txt).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Crash protection: an unexpected error will not stop the process
process.on('uncaughtException', (e) => console.error('[uncaughtException]', e && e.message));
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e && (e.message || e)));

// If the panel did not install the packages, install them here
function ensureDeps() {
  try { require.resolve('axios'); require.resolve('pino'); require.resolve('@whiskeysockets/baileys'); return; } catch {}
  console.log('📦 Installing packages (npm install)... this can take a few minutes');
  try { execSync('npm install --omit=dev --no-audit --no-fund', { cwd: __dirname, stdio: 'inherit' }); }
  catch (e) { console.error('❌ npm install failed:', e.message); }
}
ensureDeps();

try { require('dotenv').config(); } catch {}
const axios = require('axios');
const pino = require('pino');

// Token: first from the variable, otherwise from telegram_token.txt
function readToken() {
  if (process.env.TELEGRAM_BOT_TOKEN) return process.env.TELEGRAM_BOT_TOKEN.trim();
  try { return fs.readFileSync(path.join(__dirname, 'telegram_token.txt'), 'utf8').trim(); } catch { return ''; }
}
const TOKEN = readToken();
if (!TOKEN) {
  console.error('❌ Token not found. Put the token in telegram_token.txt or set TELEGRAM_BOT_TOKEN.');
  setInterval(() => {}, 1 << 30); // keep the process alive so the panel does not restart it in a loop
  return;
}

const API = `https://api.telegram.org/bot${TOKEN}`;
const PATHS = require('./utils/paths');
const AUTH_DIR = PATHS.AUTH;
const OWNER_FILE = path.join(PATHS.ROOT, 'data_tg_owner.json');
const log = pino({ level: 'silent' });

let coreStarted = false;
let pairing = null; // { sock, chatId }
const pendingBot = new Map(); // chatId -> 1 | 2
const brand = require('./utils/brand');
const BUG_BOT_URL = brand.BUG_BOT_URL;
const CHANNEL_URL = brand.CHANNEL_URL;
const GROUP_URL = brand.GROUP_URL;
const START_IMAGE = path.join(__dirname, 'assets', 'telegram_start.jpg');

// ---------- Telegram helpers ----------
async function tg(method, body) {
  try {
    const r = await axios.post(`${API}/${method}`, body, { timeout: 70000 });
    return r.data;
  } catch (e) {
    if (e.response?.status === 409) {
      console.error('⚠️ [telegram] 409 Conflict: another bot/server is running with this same token! Use /revoke in BotFather to get a new token and put it in telegram_token.txt.');
    } else if (e.response?.status === 401) {
      console.error('❌ [telegram] 401: the token is wrong or has been revoked. Put a new token in telegram_token.txt.');
    } else {
      console.error(`[telegram] ${method}:`, e.response?.data?.description || e.message);
    }
    return null;
  }
}
const say = (chatId, text, extra = {}) =>
  tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra });

async function sendPhoto(chatId, filePath, caption, extra = {}) {
  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('caption', caption || '');
    form.append('parse_mode', 'HTML');
    if (extra.reply_markup) form.append('reply_markup', JSON.stringify(extra.reply_markup));
    form.append('photo', fs.createReadStream(filePath));
    const r = await axios.post(`${API}/sendPhoto`, form, {
      headers: form.getHeaders(),
      timeout: 70000,
    });
    return r.data;
  } catch (e) {
    console.error('[telegram] sendPhoto:', e.response?.data?.description || e.message);
    // fall back to a plain text message so /start still works without the image
    return say(chatId, caption || '', extra);
  }
}

async function answerCallback(id, text) {
  try { await axios.post(`${API}/answerCallbackQuery`, { callback_query_id: id, text: text || '' }); } catch {}
}

function getOwner() {
  if (process.env.TELEGRAM_OWNER_ID) return Number(process.env.TELEGRAM_OWNER_ID);
  try { return JSON.parse(fs.readFileSync(OWNER_FILE, 'utf8')).id; } catch { return null; }
}
function setOwner(id) {
  fs.writeFileSync(OWNER_FILE, JSON.stringify({ id }));
}

function isLinked() {
  try {
    const c = JSON.parse(fs.readFileSync(path.join(AUTH_DIR, 'creds.json'), 'utf8'));
    return !!c.registered;
  } catch { return false; }
}

// ---------- Start real bot ----------
function startCore() {
  if (coreStarted) return;
  coreStarted = true;
  console.log('🚀 Starting the main bot...');
  require('./bot-core.js');
}

// ---------- Pairing ----------
async function startPairing(chatId, rawNumber) {
  const number = String(rawNumber).replace(/\D/g, '');
  if (number.length < 8 || number.length > 15) {
    return say(chatId, '❌ Invalid number. Write it with the country code and without +.\nExample: <code>pair 923001234567</code>');
  }
  if (coreStarted || isLinked()) {
    return say(chatId, '✅ The bot is already linked and running. To pair again, first delete the <code>auth_info_baileys</code> folder and restart.');
  }
  if (pairing) {
    try { pairing.sock.end(undefined); } catch {}
    pairing = null;
  }

  const baileys = require('@whiskeysockets/baileys');
  const makeWASocket = baileys.default;
  const { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } = baileys;
  const browser = baileys.Browsers ? baileys.Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '20.0.04'];

  await say(chatId, '⏳ Generating your pairing code, please wait a few seconds...');

  let codeSent = false;
  let attempts = 0;

  const connect = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, log) },
      logger: log,
      browser,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
    });
    pairing = { sock, chatId };
    sock.ev.on('creds.update', saveCreds);

    if (!state.creds.registered && !codeSent) {
      // a short wait is needed before requesting the code
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(number);
          codeSent = true;
          const pretty = code.match(/.{1,4}/g).join('-');
          await say(chatId,
            `🔑 <b>Your pairing code:</b>\n\n<code>${pretty}</code>\n\n` +
            `1️⃣ Open WhatsApp\n2️⃣ Settings → Linked Devices → Link a Device\n` +
            `3️⃣ Tap <b>Link with phone number instead</b>\n4️⃣ Enter this code\n\n` +
            `⏱ The code expires after a short time.`);
        } catch (e) {
          await say(chatId, `❌ Could not generate the code: ${e.message}\nSend <code>pair ${number}</code> again.`);
        }
      }, 3000);
    }

    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        await say(chatId, '✅ <b>WhatsApp linked successfully!</b>\nThe bot is starting now. All commands will work inside WhatsApp.');
        try { sock.ev.removeAllListeners(); sock.end(undefined); } catch {}
        pairing = null;
        setTimeout(startCore, 2000);
      }
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (code === DisconnectReason.loggedOut) {
          pairing = null;
          fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          return say(chatId, '❌ Logged out. Send <code>pair number</code> again.');
        }
        if (isLinked() || codeSent) {
          // after linking, WhatsApp asks for a restart (515) - reconnect
          if (++attempts <= 8) return setTimeout(connect, 1500);
        }
        pairing = null;
        await say(chatId, '⚠️ Connection lost. Send <code>pair number</code> again.');
      }
    });
  };

  connect().catch((e) => say(chatId, `❌ Error: ${e.message}`));
}

const lastPair = new Map(); // chatId -> timestamp (anti-spam)
async function startSessionPairing(chatId, from, rawNumber, engine) {
  const number = String(rawNumber).replace(/\D/g, '');
  if (number.length < 8 || number.length > 15) {
    return say(chatId, '❌ Invalid number. Write it with the country code and without +.\nExample: <code>923001234567</code>');
  }
  const now = Date.now();
  if (now - (lastPair.get(chatId) || 0) < 15000) return say(chatId, '⏳ Please wait a few seconds before the next request.');
  lastPair.set(chatId, now);
  const sm = require('./utils/sessionManager');
  await say(chatId, `⏳ Preparing <b>Bot ${engine}</b> for <code>${number}</code> and generating your pairing code...`);
  try {
    const code = await sm.requestPairing(engine, number, from);
    const pretty = code.match(/.{1,4}/g).join('-');
    await say(chatId,
      `🔑 <b>Pairing code (Bot ${engine}):</b>\n\n<code>${pretty}</code>\n\n` +
      `1️⃣ Open WhatsApp\n2️⃣ Settings → Linked Devices → Link a Device\n` +
      `3️⃣ Tap <b>Link with phone number instead</b>\n4️⃣ Enter this code\n\n` +
      `⚠️ Enter it immediately — it expires in about 60 seconds.\n` +
      `After linking, send <code>.menu</code> in any WhatsApp chat to use your bot. ✅`);
  } catch (e) {
    await say(chatId, `❌ ${e.message}`);
  }
}

// Bot 1: the very first pairing by the owner links the MAIN bot; everyone else gets their own session
function routePair(chatId, from, bot, number) {
  pendingBot.delete(chatId);
  if (bot === 1 && from === getOwner() && !coreStarted && !isLinked()) return startPairing(chatId, number);
  return startSessionPairing(chatId, from, number, bot);
}

// ---------- Telegram message handling ----------
async function onMessage(msg) {
  const chatId = msg.chat.id;
  const from = msg.from?.id;
  const text = (msg.text || '').trim();
  if (!text) return;

  let owner = getOwner();
  if (!owner && /^\/(start|link)/i.test(text)) { setOwner(from); owner = from; }

  if (/^\/(start|link|help)/i.test(text)) {
    return sendPhoto(chatId, START_IMAGE,
      '✨ <b>MARCO X WAQAR MD BOT - Pairing Bot</b>\n\n' +
      '✨ <b>DEVELOPER:</b> Marco Malik\n' +
      '✨ <b>CO-OWNER:</b> WAQAR WRITES\n' +
      '✨ <b>PLATFORM:</b> Telegram 📱 → WhatsApp\n\n' +
      '👑 <b>Click the buttons below</b>\n\n' +
      '📡 /status — 🟢 Running • Live\n' +
      '🔗 <code>/pair 923001234567</code> — pair Bot 1\n' +
      '🔗 <code>/pair2 923001234567</code> — pair Bot 2\n' +
      '🤖 <code>/mybots</code> — your paired numbers\n\n' +
      '♾️ <b>Unlimited pairing</b> — anyone can connect their own WhatsApp.\n' +
      '<i>Send your number with the country code, without +.</i>', {
        reply_markup: {
          inline_keyboard: [
            // style: primary = blue, success = green, danger = red (Telegram Bot API button colors)
            [{ text: '🐞 Bug Menu ↗️', url: BUG_BOT_URL, style: 'primary' }],
            [{ text: '📢 Channel ↗️', url: CHANNEL_URL, style: 'success' }],
            [{ text: '👥 Group ↗️', url: GROUP_URL, style: 'danger' }],
          ],
        },
      });
  }
  if (/^\/status/i.test(text)) {
    let b2 = '🔴 Not linked';
    try { const x = require('./utils/bot2Manager'); b2 = x.isLinked() ? '🟢 Linked & running' : '🔴 Not linked'; } catch {}
    const b1 = coreStarted ? '🟢 Running • Live' : isLinked() ? '🟡 Linked, starting up' : '🔴 Not linked yet';
    return say(chatId, `📡 <b>Status</b>\n\n🤖 Bot 1: ${b1}\n🤖 Bot 2: ${b2}\n\n🔗 <code>/pair 923001234567</code> — pair Bot 1\n🔗 <code>/pair2 923001234567</code> — pair Bot 2\n\n👥 Connected sessions right now: <b>${require('./utils/sessionManager').count()}</b>`);
  }
  const m2 = text.match(/^\/?pair\s*2\s+(.+)$/i);
  if (m2) return routePair(chatId, from, 2, m2[1]);
  if (/^\/?pair\s*2$/i.test(text)) {
    return say(chatId, 'Write your number after the command. Example: <code>/pair2 923001234567</code>');
  }
  const m = text.match(/^\/?pair(?:ing)?\s+(.+)$/i);
  if (m) return routePair(chatId, from, 1, m[1]);
  if (/^\/?pair(?:ing)?$/i.test(text)) {
    return say(chatId, 'Write your number after the command. Example: <code>/pair 923001234567</code>');
  }
  const mu = text.match(/^\/unpair(?:\s*([12]))?\s+(\d{8,15})$/i);
  if (mu) {
    const sm = require('./utils/sessionManager');
    const engine = Number(mu[1] || 1);
    const own = sm.ownerOf(engine, mu[2]);
    if (own !== from && from !== getOwner()) return say(chatId, '⛔ You can only remove numbers that you paired yourself.');
    sm.remove(engine, mu[2]);
    return say(chatId, `🗑️ Bot ${engine} removed for <code>${mu[2]}</code>. You can pair again any time.`);
  }
  if (/^\/(mybots|my)$/i.test(text)) {
    const mine = require('./utils/sessionManager').listFor(from);
    if (!mine.length) return say(chatId, 'You have not paired any number yet.\n🔗 <code>/pair 923001234567</code>');
    return say(chatId, '🤖 <b>Your bots</b>\n\n' + mine.map((s) => `• Bot ${s.engine}: <code>${s.number}</code> — ${s.running ? '🟢 Running' : s.linked ? '🟡 Starting' : '🔴 Not linked'}`).join('\n') + '\n\nRemove: <code>/unpair 923001234567</code>');
  }
  if (/^\d{8,15}$/.test(text) && pendingBot.has(chatId)) {
    const bot = pendingBot.get(chatId);
    pendingBot.delete(chatId);
    return routePair(chatId, from, bot, text);
  }
  return say(chatId, 'I did not understand that. Press /start.');
}

async function onCallback(query) {
  const chatId = query.message?.chat?.id;
  const from = query.from?.id;
  const owner = getOwner();
  if (!chatId) return;
  if (query.data === 'pair1') {
    pendingBot.set(chatId, 1);
    await answerCallback(query.id, '');
    return say(chatId, 'Send your WhatsApp number with the country code (without +) to pair *Bot 1*.\nExample: <code>923001234567</code>', { parse_mode: 'Markdown' });
  }
  if (query.data === 'pair2') {
    pendingBot.set(chatId, 2);
    await answerCallback(query.id, '');
    return say(chatId, 'Send your WhatsApp number with the country code (without +) to pair *Bot 2*.\nExample: <code>923001234567</code>', { parse_mode: 'Markdown' });
  }
  return answerCallback(query.id, '');
}

async function poll() {
  let offset = 0;
  await tg('deleteWebhook', {});
  const me = await tg('getMe', {});
  console.log('🤖 Telegram bot is running:', me?.result?.username || 'check the token');
  for (;;) {
    const r = await tg('getUpdates', { offset, timeout: 50, allowed_updates: ['message', 'callback_query'] });
    if (!r?.ok) { await new Promise((s) => setTimeout(s, 3000)); continue; }
    for (const u of r.result) {
      offset = u.update_id + 1;
      if (u.message) onMessage(u.message).catch((e) => console.error(e.message));
      if (u.callback_query) onCallback(u.callback_query).catch((e) => console.error(e.message));
    }
  }
}

// if already linked, start the bot right away
if (isLinked()) startCore();
try { require('./utils/sessionManager').autoStartAll(); } catch (e) { console.error('[sessions]', e.message); }
poll();
