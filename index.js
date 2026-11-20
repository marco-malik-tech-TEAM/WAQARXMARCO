'use strict';
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '32';
/**
 * MARCO X WAQAR MD BOT - MINI BOT launcher (Railway ready)
 *
 *  1. Starts the pairing WEBSITE on $PORT (Railway gives you the public domain).
 *  2. Open the site, enter your number, enter the 8-letter code in WhatsApp -> linked.
 *  3. The real bot (bot-core.js) starts automatically. On every restart it starts
 *     by itself if a session exists (saved on the Volume / DATA_DIR, or SESSION_ID variable).
 *
 * Telegram pairing still works if TELEGRAM_BOT_TOKEN is set - but it is optional now.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

process.on('uncaughtException', (e) => console.error('[uncaughtException]', e && e.message));
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e && (e.message || e)));

function ensureDeps() {
  try { require.resolve('axios'); require.resolve('pino'); require.resolve('@whiskeysockets/baileys'); return; } catch {}
  console.log('📦 Installing packages (npm install)...');
  try { execSync('npm install --omit=dev --no-audit --no-fund', { cwd: __dirname, stdio: 'inherit' }); }
  catch (e) { console.error('❌ npm install failed:', e.message); }
}
ensureDeps();
try { require('dotenv').config(); } catch {}

const { AUTH } = require('./utils/paths');
const web = require('./web-pairing');

let coreStarted = false;
function startCore() {
  if (coreStarted) return;
  coreStarted = true;
  console.log('🚀 Starting the main bot...');
  require('./bot-core.js');
}

// 1) website first, so Railway sees the service as healthy right away
web.start({ startCore, coreRunning: () => coreStarted, port: process.env.PORT || 3000 });

// 2) start the bot straight away when a session already exists
let linked = false;
try { linked = !!JSON.parse(fs.readFileSync(path.join(AUTH, 'creds.json'), 'utf8')).registered; } catch {}
if (linked || (process.env.SESSION_ID && process.env.SESSION_ID.trim())) startCore();
else console.log('🔗 Not linked yet - open your Railway domain and pair your number.');

// 3) optional Telegram pairing (only if a token is provided)
function telegramToken() {
  if (process.env.TELEGRAM_BOT_TOKEN) return process.env.TELEGRAM_BOT_TOKEN.trim();
  try { return fs.readFileSync(path.join(__dirname, 'telegram_token.txt'), 'utf8').trim(); } catch { return ''; }
}
if (telegramToken()) {
  try { require('./telegram-pairing.js'); } catch (e) { console.error('[telegram]', e.message); }
} else {
  try { require('./utils/sessionManager').autoStartAll(); } catch (e) { console.error('[sessions]', e.message); }
}
