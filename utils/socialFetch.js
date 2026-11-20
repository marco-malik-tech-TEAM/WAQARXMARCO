"use strict";
/**
 * Social media link resolver (TikTok / Instagram / Facebook).
 * Tries several public downloader APIs one after another. Every response is
 * checked (HTML / non-JSON bodies are skipped, never parsed blindly), so one
 * dead API can no longer break a command.
 *
 * The API list is at the top of this file. If one stops working, edit/add
 * entries here - nothing else needs to change.
 */
const axios = require("axios");
const { KEITH_BASE } = require("../config/apis");

const UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
const E = encodeURIComponent;

const SOURCES = {
  tiktok: [
    { name: "tikwm", url: (u) => "https://www.tikwm.com/api/?hd=1&url=" + E(u), base: "https://www.tikwm.com" },
    { name: "tiklydown", url: (u) => "https://api.tiklydown.eu.org/api/download/v3?url=" + E(u) },
    { name: "keith", url: (u) => KEITH_BASE + "/download/tiktok?url=" + E(u) },
    { name: "siputzx", url: (u) => "https://api.siputzx.my.id/api/d/tiktok?url=" + E(u) },
    { name: "vreden", url: (u) => "https://api.vreden.my.id/api/tiktok?url=" + E(u) },
    { name: "agatz", url: (u) => "https://api.agatz.xyz/api/tiktok?url=" + E(u) },
  ],
  instagram: [
    { name: "keith", url: (u) => KEITH_BASE + "/download/instagram?url=" + E(u) },
    { name: "keith-igdl", url: (u) => KEITH_BASE + "/download/igdl?url=" + E(u) },
    { name: "siputzx", url: (u) => "https://api.siputzx.my.id/api/d/igdl?url=" + E(u) },
    { name: "vreden", url: (u) => "https://api.vreden.my.id/api/igdownload?url=" + E(u) },
    { name: "agatz", url: (u) => "https://api.agatz.xyz/api/instagram?url=" + E(u) },
    { name: "ryzen", url: (u) => "https://api.ryzendesu.vip/api/downloader/igdl?url=" + E(u) },
  ],
  facebook: [
    { name: "keith", url: (u) => KEITH_BASE + "/download/fbdown?url=" + E(u) },
    { name: "keith-fb", url: (u) => KEITH_BASE + "/download/facebook?url=" + E(u) },
    { name: "siputzx", url: (u) => "https://api.siputzx.my.id/api/d/facebook?url=" + E(u) },
    { name: "vreden", url: (u) => "https://api.vreden.my.id/api/fbdl?url=" + E(u) },
    { name: "agatz", url: (u) => "https://api.agatz.xyz/api/facebook?url=" + E(u) },
    { name: "ryzen", url: (u) => "https://api.ryzendesu.vip/api/downloader/fbdl?url=" + E(u) },
  ],
};

const IMG_RE = /\.(jpe?g|png|webp)(\?|$)/i;
const VID_RE = /\.(mp4|mov|m4v|webm)(\?|$)|video|mime_type=video|\/play|nowm|hdplay|download/i;
const BAD_RE = /\.(jpe?g|png|webp|gif|mp3|m4a|json|html?)(\?|$)|avatar|cover|thumb|profile|logo/i;

/** Follow share/short links (vm.tiktok.com, fb.watch, facebook.com/share/...) to the real URL. */
async function expand(url) {
  try {
    const r = await axios.get(url, { maxRedirects: 8, timeout: 15000, headers: { "User-Agent": UA }, validateStatus: () => true, responseType: "stream" });
    const final = (r.request && r.request.res && r.request.res.responseUrl) || url;
    r.data.destroy();
    return final;
  } catch (_) { return url; }
}

function walk(node, out, path = "") {
  if (node == null) return;
  if (typeof node === "string") { if (/^https?:\/\//i.test(node) || node.startsWith("/")) out.push({ url: node, key: path.toLowerCase() }); return; }
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, out, path + "." + i));
  if (typeof node === "object") {
    const hints = Object.entries(node)
      .filter(([k, v]) => /^(type|mime_?type|format|extension|kind|media_?type)$/i.test(k) && typeof v === "string")
      .map(([, v]) => v.toLowerCase());
    const keys = Object.keys(node).filter((k) => /video|image|reel|media|photo|carousel|download|play|hd|nowm/i.test(k));
    const context = [path, ...hints, ...keys].filter(Boolean).join(".");
    for (const [k, value] of Object.entries(node)) walk(value, out, [context, k].filter(Boolean).join("."));
  }
}

function pickMedia(input, base) {
  let json = input;
  if (typeof input === "string") {
    try { json = JSON.parse(input); } catch (_) { return { videos: [], images: [], title: "" }; }
    if (typeof json === "string") { try { json = JSON.parse(json); } catch (_) {} }
  }
  const all = [];
  walk(json, all);
  const fix = (u) => (u.startsWith("/") ? (base || "") + u : u);
  const list = all.map((x) => ({ url: fix(x.url), key: x.key })).filter((x) => /^https?:\/\//i.test(x.url));
  const rank = (k) => (/hd|nowm|no_?watermark/.test(k) ? 0 : /play|video|url|download|sd|mp4/.test(k) ? 1 : 2);
  const videos = list.filter((x) => !BAD_RE.test(x.url) && (VID_RE.test(x.url) || /video|play|hd|sd|nowm|reel|mp4|mime.*video/.test(x.key)))
    .sort((a, b) => rank(a.key) - rank(b.key));
  const images = list.filter((x) => IMG_RE.test(x.url) || (!VID_RE.test(x.url) && /image|photo|carousel/.test(x.key)))
    .filter((x) => !/avatar|profile|logo|thumb|cover/i.test(x.url + x.key));
  let title = "";
  const findTitle = (obj) => {
    if (!obj || typeof obj !== "object" || title) return;
    if (typeof obj.title === "string") title = obj.title;
    else for (const value of Object.values(obj)) findTitle(value);
  };
  findTitle(json);
  return { videos: [...new Set(videos.map((v) => v.url))], images: [...new Set(images.map((i) => i.url))], title: String(title || "") };
}

// Per-source timeout. Kept short on purpose: a single slow/sleeping API
// (e.g. a cold-starting free Heroku dyno) must never hold up the others -
// this is what used to make the bot "wait a minute" before replying.
const SOURCE_TIMEOUT_MS = 9000;

async function callSource(src, url) {
  const r = await axios.get(src.url(url), { timeout: SOURCE_TIMEOUT_MS, headers: { "User-Agent": UA, Accept: "application/json" }, validateStatus: () => true, responseType: "text", transformResponse: (d) => d });
  const body = String(r.data || "").trim();
  if (r.status >= 400) throw new Error("HTTP " + r.status);
  if (!body.startsWith("{") && !body.startsWith("[")) throw new Error("not JSON (API is down)");
  const json = JSON.parse(body);
  const media = pickMedia(json, src.base);
  if (!media.videos.length && !media.images.length) throw new Error("no media in response");
  return media;
}

/**
 * Fire every configured source for the platform AT THE SAME TIME and return
 * as soon as the first one succeeds, instead of waiting for each one to
 * fail/time out before trying the next. This is the main speed fix: total
 * wait becomes "the fastest working API", not "the sum of every dead one".
 */
function raceToFirstSuccess(tasks) {
  return new Promise((resolve, reject) => {
    let pending = tasks.length;
    const errs = [];
    if (!pending) return reject(new Error("no sources configured"));
    for (const t of tasks) {
      t.promise
        .then((val) => resolve({ val, name: t.name }))
        .catch((e) => {
          errs.push(t.name + ": " + e.message);
          if (--pending === 0) reject(Object.assign(new Error(errs.join(" | ")), { details: errs }));
        });
    }
  });
}

/**
 * @param {"tiktok"|"instagram"|"facebook"} platform
 * @returns {Promise<{videos:string[],images:string[],title:string,source:string}>}
 */
async function fetchMedia(platform, link) {
  const sources = SOURCES[platform];
  if (!sources) throw new Error("Unsupported media platform: " + platform);
  const isFullPost = /(?:instagram\.com|instagr\.am)\/(?:reel|p|tv)\/[\w-]+(?:\/|\?|$)/i.test(link);
  const url = /tiktok\.com\/@/i.test(link) || isFullPost ? link : await expand(link);
  try {
    const { val, name } = await raceToFirstSuccess(
      sources.map((src) => ({ name: src.name, promise: callSource(src, url) }))
    );
    return { ...val, source: name };
  } catch (e) {
    console.error("[socialFetch] all sources failed for", platform, "-", (e.details || []).join(" | "));
    const err = new Error("All download servers failed right now. Make sure the link is public and try again in a minute.");
    err.details = e.details || [];
    throw err;
  }
}

module.exports = { fetchMedia, UA, pickMedia };
