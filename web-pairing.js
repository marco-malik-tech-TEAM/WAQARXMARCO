"use strict";
/**
 * MARCO X WAQAR MD BOT - Web pairing site (Railway ready, MULTI-USER)
 *
 *   GET  /              pairing website
 *   GET  /dp.jpg        bot profile picture
 *   GET  /healthz       health check (Railway)
 *   GET  /api/info      brand links + telegram username
 *   GET  /api/stats     live stats (uptime, active sessions, ...)
 *   GET  /api/status?number=923001234567   { linked, running }
 *   POST /api/pair      { number, password? } -> { code }
 *
 * Every number that pairs gets its OWN session (utils/sessionManager.js),
 * so many people can link their WhatsApp at the same time and the
 * "already linked" error of the old single-session design is gone.
 * The same sessions are shared with the Telegram pairing bot.
 *
 * Optional env:  WEB_PASSWORD   (page asks for it before it gives a code)
 *                MAX_SESSIONS   (0 = unlimited)
 *                TELEGRAM_BOT_TOKEN
 */
const fs = require("fs");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const brand = require("./utils/brand");

const WEB_DIR = path.join(__dirname, "web");
const STARTED = Date.now();
const CODE_LIFETIME_S = 120;

let startCore = () => {};
let coreRunning = () => false;
let tgUser = null, tgFetched = false;

const sm = () => require("./utils/sessionManager");

// ---------- helpers ----------
const hits = new Map(); // ip -> [timestamps]
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  list.push(now); hits.set(ip, list);
  return list.length > 20 || (list.length > 1 && now - list[list.length - 2] < 6000);
}
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (!v.some((t) => now - t < 3600000)) hits.delete(k); }, 600000).unref();

const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const send = (res, code, body, type = "application/json; charset=utf-8", extra = {}) => {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 4096) { reject(new Error("body too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(new Error("bad JSON")); } });
    req.on("error", reject);
  });
}
function cleanNumber(v) {
  let n = String(v || "").replace(/\D/g, "");
  if (n.startsWith("00")) n = n.slice(2);
  return n;
}

async function telegramUsername() {
  if (tgFetched) return tgUser;
  tgFetched = true;
  try {
    let token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
    if (!token) { try { token = fs.readFileSync(path.join(__dirname, "telegram_token.txt"), "utf8").trim(); } catch (_) {} }
    if (!token) return null;
    const axios = require("axios");
    const r = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 8000 });
    tgUser = r.data && r.data.result && r.data.result.username ? r.data.result.username : null;
  } catch (_) { tgFetched = false; }
  return tgUser;
}

// ---------- server ----------
function start(opts = {}) {
  startCore = opts.startCore || startCore;
  coreRunning = opts.coreRunning || coreRunning;
  const port = Number(opts.port || process.env.PORT || 3000);

  const server = http.createServer(async (req, res) => {
    try {
      const url = (req.url || "/").split("?")[0];
      const query = new URLSearchParams((req.url || "").split("?")[1] || "");
      const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

      if (req.method === "GET" && (url === "/healthz" || url === "/health")) return send(res, 200, "ok", "text/plain");
      if (req.method === "GET" && (url === "/" || url === "/index.html" || url === "/pair"))
        return send(res, 200, fs.readFileSync(path.join(WEB_DIR, "index.html")), "text/html; charset=utf-8");
      if (req.method === "GET" && url === "/dp.jpg")
        return send(res, 200, fs.readFileSync(path.join(WEB_DIR, "dp.jpg")), "image/jpeg", { "Cache-Control": "public, max-age=86400" });

      if (req.method === "GET" && url === "/api/info") {
        const tg = await telegramUsername();
        return send(res, 200, {
          name: brand.BOT_NAME, developer: brand.DEVELOPER, coOwner: brand.CO_OWNER, tagline: brand.TAGLINE,
          channel: brand.CHANNEL_URL, group: brand.GROUP_URL,
          telegram: tg ? "https://t.me/" + tg : null, telegramUser: tg ? "@" + tg : null,
          passwordRequired: !!process.env.WEB_PASSWORD,
          codeSeconds: CODE_LIFETIME_S,
        });
      }

      if (req.method === "GET" && url === "/api/stats") {
        let sessions = 0; try { sessions = sm().count(); } catch (_) {}
        const mem = process.memoryUsage();
        return send(res, 200, {
          online: true,
          uptime: Math.floor((Date.now() - STARTED) / 1000),
          sessions: sessions + (coreRunning() ? 1 : 0),
          memoryMB: Math.round(mem.rss / 1048576),
          node: process.version,
          now: Date.now(),
        });
      }

      if (req.method === "GET" && url === "/api/status") {
        const number = cleanNumber(query.get("number"));
        if (number.length < 8 || number.length > 15) return send(res, 400, { error: "Invalid number." });
        const s = sm();
        return send(res, 200, { number, linked: s.isLinked(1, number), running: s.isRunning(1, number) });
      }

      if (req.method === "POST" && url === "/api/pair") {
        if (limited(ip)) return send(res, 429, { error: "Too many requests. Please wait a few seconds and try again." });
        const body = await readBody(req);
        if (process.env.WEB_PASSWORD && !safeEq(body.password || "", process.env.WEB_PASSWORD))
          return send(res, 401, { error: "Wrong password." });
        const number = cleanNumber(body.number);
        if (number.length < 8 || number.length > 15)
          return send(res, 400, { error: "Invalid number. Use the country code, no + or spaces. Example: 923001234567" });
        const s = sm();
        if (s.isLinked(1, number)) {
          // make sure it is running, then tell the user it is done
          try { await s.requestPairing(1, number, null); } catch (_) {}
          return send(res, 200, { alreadyLinked: true, number });
        }
        const code = await s.requestPairing(1, number, null);
        return send(res, 200, { code, number, secondsLeft: CODE_LIFETIME_S });
      }
      return send(res, 404, { error: "not found" });
    } catch (e) {
      console.error("[WEB]", e.message);
      const m = String(e.message || "Something went wrong");
      return send(res, /already linked/i.test(m) ? 409 : /in progress|full/i.test(m) ? 429 : 500, { error: m.replace(/✅/g, "").trim() });
    }
  });
  server.on("error", (e) => console.error("[WEB] server error:", e.message));
  server.listen(port, "0.0.0.0", () => console.log("🌐 Pairing website is running on port " + port));
  return server;
}

module.exports = { start };
