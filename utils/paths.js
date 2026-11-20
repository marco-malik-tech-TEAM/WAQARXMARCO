"use strict";
/**
 * Where this bot instance keeps its own files (login session, settings, data).
 * - Normal run (main bot):        the bot's own folder.
 * - Paired user session (child):  SESSION_DIR=sessions/<engine>/<number>  (set by sessionManager),
 *   so every user that pairs gets a fully separate login + settings.
 */
const path = require("path");
const fs = require("fs");
// DATA_DIR (e.g. a Railway Volume mounted at /data) keeps login + settings across redeploys.
const ROOT = process.env.SESSION_DIR ? path.resolve(process.env.SESSION_DIR)
  : process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "..");
for (const d of ["auth_info_baileys", "data", "config"]) {
  try { if (process.env.SESSION_DIR || process.env.DATA_DIR) fs.mkdirSync(path.join(ROOT, d), { recursive: true }); } catch (_) {}
}
module.exports = {
  ROOT,
  AUTH: path.join(ROOT, "auth_info_baileys"),
  DATA: path.join(ROOT, "data"),
  CONFIG: path.join(ROOT, "config"),
  IS_SESSION: !!process.env.SESSION_DIR,
};
