"use strict";
/**
 * YouTube search and MP4 resolver shared by .video and .video2.
 * Uses yt-search/Keith for search, multiple HTTP resolvers for downloads,
 * and a local yt-dlp executable as an optional last-resort fallback.
 */
const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
const { KEITH_BASE } = require("../config/apis");
const YT_RE = /(?:youtube\.com|youtu\.be)/i;
const YT_HOST_RE = /^(?:www\.|m\.|music\.)?(?:youtube\.com|youtu\.be)$/i;
const timeout = (ms) => ({ timeout: ms, headers: { "User-Agent": "Mozilla/5.0" } });

function isYouTubeUrl(value) {
  try {
    const u = new URL(value);
    return /^https?:$/.test(u.protocol) && YT_HOST_RE.test(u.hostname);
  } catch (_) { return false; }
}

async function searchViaYtSearch(query) {
  const r = await yts(query);
  const v = (r && r.videos && r.videos[0]) || null;
  if (!v || !isYouTubeUrl(v.url)) return null;
  return { url: v.url, title: v.title || "YouTube Video" };
}
async function searchViaKeith(query) {
  const r = await axios.get(KEITH_BASE + "/search/yts?query=" + encodeURIComponent(query), timeout(20000));
  const list = r.data && r.data.result;
  if (!Array.isArray(list)) return null;
  const v = list.find((item) => item && isYouTubeUrl(item.url));
  return v ? { url: v.url, title: v.title || "YouTube Video" } : null;
}
async function searchVideo(query) {
  if (YT_RE.test(query) && isYouTubeUrl(query)) {
    let title = "YouTube Video";
    try {
      const id = (query.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1];
      if (id) { const v = await yts({ videoId: id }); if (v && v.title) title = v.title; }
    } catch (_) {}
    return { url: query, title };
  }
  for (const fn of [searchViaYtSearch, searchViaKeith]) {
    try { const res = await fn(query); if (res) return res; }
    catch (e) { console.error("[YTSEARCH]", fn.name, "failed:", e.message); }
  }
  return null;
}

const SRC_TIMEOUT_MS = 15000;
function collectLinks(node, out, path = "") {
  if (node == null) return;
  if (typeof node === "string") {
    if (/^https?:\/\//i.test(node)) out.push({ url: node, path });
    return;
  }
  if (Array.isArray(node)) return node.forEach((v, i) => collectLinks(v, out, path + "." + i));
  if (typeof node === "object") {
    const hints = Object.entries(node)
      .filter(([k, v]) => /^(type|mime_?type|format|extension|kind|media_?type)$/i.test(k) && typeof v === "string")
      .map(([, v]) => v.toLowerCase()).join(" ");
    for (const [k, v] of Object.entries(node)) collectLinks(v, out, [path, hints, k].filter(Boolean).join("."));
  }
}
function isHttpUrl(value) {
  try { const u = new URL(value); return u.protocol === "https:" || u.protocol === "http:"; }
  catch (_) { return false; }
}
function pickLink(body) {
  let parsed = body;
  if (typeof body === "string") {
    try { parsed = JSON.parse(body); } catch (_) { return null; }
    if (typeof parsed === "string") { try { parsed = JSON.parse(parsed); } catch (_) {} }
  }
  const found = [];
  collectLinks(parsed, found);
  const candidates = found.filter(({ url, path }) =>
    isHttpUrl(url) && !/youtube\.com\/(?:watch|shorts|embed)|youtu\.be\//i.test(url) &&
    !/thumbnail|thumb|image|avatar|cover|poster|\.jpe?g(?:\?|$)|\.png(?:\?|$)|\.webp(?:\?|$)/i.test(path + " " + url)
  );
  const score = ({ url, path }) =>
    (/video|mp4|download|direct|media|url/i.test(path) ? 2 : 0) +
    (/\.mp4(?:\?|$)|mime.?type=video/i.test(url) ? 3 : 0);
  candidates.sort((a, b) => score(b) - score(a));
  return candidates[0]?.url || null;
}
async function viaKeith(url) {
  const endpoints = ["/download/mp4?url=", "/download/ytmp4?url="];
  let lastErr;
  for (const ep of endpoints) {
    try {
      const r = await axios.get(KEITH_BASE + ep + encodeURIComponent(url), timeout(SRC_TIMEOUT_MS));
      const link = pickLink(r.data);
      if (link) return link;
      lastErr = new Error("no valid media URL in response");
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("Keith returned no video URL");
}
async function viaGeneric(base, url) {
  const r = await axios.get(base + encodeURIComponent(url), timeout(SRC_TIMEOUT_MS));
  const link = pickLink(r.data);
  if (!link) throw new Error("no valid media URL in response");
  return link;
}
async function viaLocalYtDlp(url) {
  const args = ["--no-warnings", "--no-playlist", "--format", "best[ext=mp4]/best", "--get-url", url];
  const candidates = [];
  if (process.env.YT_DLP_PATH) candidates.push([process.env.YT_DLP_PATH, args]);
  try {
    const bundled = require("youtube-dl-exec").constants.YOUTUBE_DL_PATH;
    if (bundled && fs.existsSync(bundled)) candidates.push([bundled, args]);
  } catch (_) {}
  candidates.push(["yt-dlp", args], ["python3", ["-m", "yt_dlp", ...args]]);
  let lastErr;
  for (const [bin, argv] of candidates) {
    try {
      const { stdout } = await execFileAsync(bin, argv, { timeout: 60000, maxBuffer: 1024 * 1024, windowsHide: true });
      const link = String(stdout || "").trim().split(/\r?\n/).find(isHttpUrl);
      if (link) return link;
      lastErr = new Error("yt-dlp returned no direct video URL");
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("yt-dlp is not installed");
}
const SOURCES = [
  { name: "Keith", resolve: (url) => viaKeith(url) },
  { name: "SIPUTZx", resolve: (url) => viaGeneric("https://api.siputzx.my.id/api/d/ytmp4?url=", url) },
  { name: "Vreden", resolve: (url) => viaGeneric("https://api.vreden.my.id/api/ytmp4?url=", url) },
  { name: "Ryzen", resolve: (url) => viaGeneric("https://api.ryzendesu.vip/api/downloader/ytmp4?url=", url) },
  { name: "local yt-dlp", resolve: viaLocalYtDlp },
];
async function resolveMp4(url) {
  if (!isYouTubeUrl(url)) throw new Error("Only public YouTube video links are supported.");
  return new Promise((resolve, reject) => {
    let pending = SOURCES.length;
    const errs = [];
    for (const source of SOURCES) {
      Promise.resolve().then(() => source.resolve(url)).then((downloadUrl) => {
        if (!isHttpUrl(downloadUrl)) throw new Error("invalid download URL");
        resolve({ downloadUrl, source: source.name });
      }).catch((e) => {
        const status = e.response && e.response.status;
        errs.push(source.name + ": " + (status === 429 ? "rate-limited" : status ? "HTTP " + status : (e.message || "failed")));
        if (--pending === 0) reject(new Error(errs.join(" | ") || "no download source available"));
      });
    }
  });
}
module.exports = { searchVideo, resolveMp4, YT_RE, isYouTubeUrl, pickLink };
