"use strict";
/**
 * yt-dlp wrapper (direct downloads - no third-party API links that return 403).
 *
 * - Finds yt-dlp (YT_DLP_PATH, ./bin, youtube-dl-exec, system PATH) and, if it
 *   is missing, downloads the standalone binary from GitHub into ./bin once.
 * - Optional login cookies for YouTube / Instagram: put a Netscape-format
 *   "cookies.txt" in the project root (or set YT_COOKIES_FILE / IG_COOKIES_FILE).
 *   This is the fix when YouTube says "Sign in to confirm you're not a bot".
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const axios = require("axios");
const { spawn, execFile } = require("child_process");
const kit = require("./mediaKit");

const ROOT = path.join(__dirname, "..");
const BIN_DIR = path.join(ROOT, "bin");
const isWin = process.platform === "win32";

function releaseAsset() {
  if (isWin) return "yt-dlp.exe";
  if (process.platform === "darwin") return "yt-dlp_macos";
  return process.arch === "arm64" ? "yt-dlp_linux_aarch64" : "yt-dlp_linux";
}

function run(bin, args, timeout = 20000) {
  return new Promise((resolve) => {
    execFile(bin, args, { timeout, windowsHide: true }, (err, stdout) => resolve(err ? null : String(stdout || "").trim()));
  });
}

async function works(candidate) {
  const [bin, pre] = Array.isArray(candidate) ? candidate : [candidate, []];
  const v = await run(bin, [...pre, "--version"]);
  return v ? { bin, pre } : null;
}

async function downloadFile(url, dest) {
  const res = await axios.get(url, { responseType: "stream", timeout: 120000, maxRedirects: 8 });
  await new Promise((resolve, reject) => {
    const w = fs.createWriteStream(dest);
    res.data.pipe(w);
    w.on("finish", resolve);
    w.on("error", reject);
    res.data.on("error", reject);
  });
}

let cached = null;
let installing = null;

async function install() {
  const asset = releaseAsset();
  let dir = BIN_DIR;
  try { fs.mkdirSync(dir, { recursive: true }); fs.accessSync(dir, fs.constants.W_OK); }
  catch (_) { dir = path.join(os.tmpdir(), "ytdlp-bin"); fs.mkdirSync(dir, { recursive: true }); }
  const base = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/";

  const target = path.join(dir, asset);
  try {
    console.log("[YTDLP] downloading", asset, "...");
    await downloadFile(base + asset, target);
    if (!isWin) fs.chmodSync(target, 0o755);
    const ok = await works(target);
    if (ok) return ok;
  } catch (e) { console.error("[YTDLP] standalone download failed:", e.message); }

  // Fallback: python zipapp (needs python3 on the host)
  try {
    const zipapp = path.join(dir, "yt-dlp");
    await downloadFile(base + "yt-dlp", zipapp);
    if (!isWin) fs.chmodSync(zipapp, 0o755);
    return (await works(["python3", [zipapp]])) || (await works(["python", [zipapp]])) || (await works(zipapp));
  } catch (e) { console.error("[YTDLP] zipapp download failed:", e.message); }
  return null;
}

/** @returns {Promise<{bin:string, pre:string[]}>} */
async function getYtDlp() {
  if (cached) return cached;
  const candidates = [];
  if (process.env.YT_DLP_PATH) candidates.push(process.env.YT_DLP_PATH);
  candidates.push(path.join(BIN_DIR, releaseAsset()), path.join(os.tmpdir(), "ytdlp-bin", releaseAsset()));
  try {
    const p = require("youtube-dl-exec").constants.YOUTUBE_DL_PATH;
    if (p && fs.existsSync(p)) candidates.push(p);
  } catch (_) {}
  candidates.push("yt-dlp", ["python3", ["-m", "yt_dlp"]]);
  for (const c of candidates) {
    const ok = await works(c);
    if (ok) return (cached = ok);
  }
  if (!installing) installing = install().finally(() => { installing = null; });
  const ok = await installing;
  if (!ok) throw new Error("yt-dlp is not available and could not be downloaded");
  return (cached = ok);
}

function cookiesFor(kind) {
  const files = [
    kind === "instagram" ? process.env.IG_COOKIES_FILE : null,
    process.env.YT_COOKIES_FILE,
    path.join(ROOT, kind === "instagram" ? "cookies_instagram.txt" : "cookies_youtube.txt"),
    path.join(ROOT, "cookies.txt"),
  ].filter(Boolean);
  return files.find((f) => { try { return fs.statSync(f).size > 20; } catch (_) { return false; } }) || null;
}

const VIDEO_EXT = /\.(mp4|mkv|webm|mov|m4v)$/i;

function friendlyError(text) {
  const s = String(text || "");
  if (/larger than max-filesize|File is larger/i.test(s)) return "FILE_TOO_LARGE";
  if (/Sign in to confirm|not a bot|confirm you.re not a bot/i.test(s))
    return "YouTube is asking this server to sign in (bot check). Add a cookies.txt file (see README_DOWNLOADS.md) and try again.";
  if (/login required|rate-limit reached|Requested content is not available|empty media response|restricted video/i.test(s))
    return "Instagram requires login for this post. Add an Instagram cookies.txt file (see README_DOWNLOADS.md) or make sure the post is public.";
  if (/Private video|private/i.test(s)) return "This video is private.";
  if (/Video unavailable|has been removed|not available/i.test(s)) return "This video is unavailable.";
  if (/HTTP Error 403/i.test(s)) return "The source refused the download (403).";
  const last = s.trim().split("\n").filter(Boolean).pop() || "download failed";
  return last.replace(/^ERROR:\s*/i, "").slice(0, 200);
}

/**
 * Download a URL with yt-dlp into `dir`.
 * @param {string} url
 * @param {{dir:string, kind?:"youtube"|"instagram", format?:string, maxBytes?:number,
 *          onProgress?:(p:{percent:number,speed:string,eta:string})=>void, timeoutMs?:number}} o
 * @returns {Promise<string>} path of the downloaded video file
 */
async function download(url, o) {
  const { dir, kind = "youtube", format = "b", maxBytes = 1990 * 1024 * 1024, onProgress, timeoutMs = 60 * 60 * 1000 } = o;
  const { bin, pre } = await getYtDlp();
  const cookies = cookiesFor(kind);

  let args = [
    ...pre,
    "--no-warnings", "--no-playlist", "--newline", "--force-ipv4",
    "--no-part", "--retries", "5", "--fragment-retries", "5", "--concurrent-fragments", "4",
    "--socket-timeout", "30",
    "--ffmpeg-location", kit.ffmpegBin(),
    "--js-runtimes", "node",
    "--format", format,
    "--merge-output-format", "mp4",
    "--max-filesize", String(maxBytes),
    "-o", path.join(dir, "%(id)s.%(ext)s"),
  ];
  if (cookies) args.push("--cookies", cookies);
  if (process.env.YT_DLP_PROXY) args.push("--proxy", process.env.YT_DLP_PROXY);
  args.push(url);

  const attempt = (argv) => new Promise((resolve, reject) => {
    const child = spawn(bin, argv, { windowsHide: true });
    let stderr = "", out = "";
    const timer = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("download timed out")); }, timeoutMs);
    const onLine = (chunk) => {
      const text = chunk.toString();
      out += text;
      if (out.length > 20000) out = out.slice(-5000);
      if (onProgress) {
        const m = text.match(/\[download\]\s+([\d.]+)%.*?at\s+([^\s]+).*?ETA\s+([^\s]+)/g);
        const last = m && m[m.length - 1];
        const mm = last && last.match(/\[download\]\s+([\d.]+)%.*?at\s+([^\s]+).*?ETA\s+([^\s]+)/);
        if (mm) onProgress({ percent: parseFloat(mm[1]), speed: mm[2], eta: mm[3] });
      }
    };
    child.stdout.on("data", onLine);
    child.stderr.on("data", (d) => { stderr += d.toString(); if (stderr.length > 20000) stderr = stderr.slice(-5000); });
    child.on("error", (e) => { clearTimeout(timer); reject(e); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve();
      reject(new Error(stderr || out || "yt-dlp exited with code " + code));
    });
  });

  try {
    await attempt(args);
  } catch (e) {
    // Older yt-dlp builds do not know --js-runtimes: retry without it.
    if (/no such option: --js-runtimes|unrecognized arguments: --js-runtimes/i.test(e.message)) {
      const i = args.indexOf("--js-runtimes");
      args = args.filter((_, idx) => idx !== i && idx !== i + 1);
      await attempt(args).catch((e2) => { throw new Error(friendlyError(e2.message)); });
    } else {
      throw new Error(friendlyError(e.message));
    }
  }

  const files = fs.readdirSync(dir)
    .filter((f) => VIDEO_EXT.test(f))
    .map((f) => ({ f: path.join(dir, f), size: fs.statSync(path.join(dir, f)).size }))
    .sort((a, b) => b.size - a.size);
  if (!files.length) throw new Error("download finished but no video file was created");
  return files[0].f;
}

/** Height-limited format selector that prefers WhatsApp-friendly H.264 + AAC MP4. */
function formatFor(height) {
  const h = height || 720;
  return [
    `bv*[height<=${h}][vcodec^=avc1]+ba[ext=m4a]`,
    `b[height<=${h}][ext=mp4]`,
    `bv*[height<=${h}]+ba`,
    `b[height<=${h}]`,
    "b",
  ].join("/");
}

module.exports = { getYtDlp, download, formatFor, friendlyError, cookiesFor };
