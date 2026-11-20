"use strict";
/**
 * Instagram media resolver with several independent strategies:
 *   1. public downloader APIs      (socialFetch.fetchMedia, raced in parallel)
 *   2. Instagram's own embed page  (/p/<code>/embed/captioned/)
 *   3. link-preview mirror sites   (kkinstagram / ddinstagram - og:video tags)
 * They all run at the same time; the first one that returns media wins.
 * If none gives a link that can actually be downloaded, the command falls back
 * to yt-dlp (see igCommand.js).
 */
const axios = require("axios");
const { fetchMedia } = require("./socialFetch");

const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const BOT_UA = "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)";
const MIRRORS = ["kkinstagram.com", "ddinstagram.com", "instagramez.com"];

function shortcodeOf(link) {
  const m = String(link).match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]+)/i) || String(link).match(/instagr\.am\/(?:p|reel)\/([\w-]+)/i);
  return m ? m[1] : null;
}

const decodeEntities = (s) => String(s).replace(/&amp;/g, "&").replace(/&#x2F;/g, "/").replace(/&#38;/g, "&").replace(/&quot;/g, '"');
const unescapeJs = (s) => String(s).replace(/\\+u0026/gi, "&").replace(/\\+u0025/gi, "%").replace(/\\+\//g, "/").replace(/\\+/g, "");

async function getHtml(url, ua) {
  const r = await axios.get(url, {
    timeout: 12000, maxRedirects: 5, validateStatus: () => true, responseType: "text", transformResponse: (d) => d,
    headers: { "User-Agent": ua, "Accept-Language": "en-US,en;q=0.9", Accept: "text/html,application/xhtml+xml" },
  });
  if (r.status >= 400) throw new Error("HTTP " + r.status);
  return String(r.data || "");
}

function parseEmbed(html) {
  const videos = [], images = [];
  for (const m of html.matchAll(/video_url\\*"\s*:\s*\\*"(https?:[^"]+?)\\*"/g)) videos.push(unescapeJs(m[1]));
  for (const m of html.matchAll(/<video[^>]+src="([^"]+)"/g)) videos.push(decodeEntities(m[1]));
  for (const m of html.matchAll(/display_url\\*"\s*:\s*\\*"(https?:[^"]+?)\\*"/g)) images.push(unescapeJs(m[1]));
  for (const m of html.matchAll(/class="EmbeddedMediaImage"[^>]+src="([^"]+)"/g)) images.push(decodeEntities(m[1]));
  const cap = html.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/);
  const title = cap ? decodeEntities(cap[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim() : "";
  return { videos: [...new Set(videos)], images: videos.length ? [] : [...new Set(images)], title };
}

function parseOg(html) {
  const meta = (prop) => {
    const m = html.match(new RegExp('<meta[^>]+(?:property|name)="' + prop + '"[^>]+content="([^"]+)"', "i"))
      || html.match(new RegExp('<meta[^>]+content="([^"]+)"[^>]+(?:property|name)="' + prop + '"', "i"));
    return m ? decodeEntities(m[1]) : "";
  };
  const videos = [meta("og:video:secure_url"), meta("og:video"), meta("twitter:player:stream")].filter((u) => /^https?:/i.test(u));
  const img = meta("og:image");
  return { videos: [...new Set(videos)], images: !videos.length && /^https?:/i.test(img) ? [img] : [], title: meta("og:title") };
}

async function viaEmbed(code) {
  const html = await getHtml("https://www.instagram.com/p/" + code + "/embed/captioned/", DESKTOP_UA);
  const out = parseEmbed(html);
  if (!out.videos.length && !out.images.length) throw new Error("embed page has no media");
  return out;
}

async function viaMirror(code) {
  const errs = [];
  for (const host of MIRRORS) {
    try {
      const html = await getHtml("https://" + host + "/reel/" + code + "/", BOT_UA);
      const out = parseOg(html);
      if (out.videos.length || out.images.length) return out;
      errs.push(host + ": no media");
    } catch (e) { errs.push(host + ": " + e.message); }
  }
  throw new Error(errs.join(" | "));
}

/** @returns {Promise<{videos:string[], images:string[], title:string, source:string}>} */
async function resolveInstagram(link) {
  const code = shortcodeOf(link);
  const tasks = [fetchMedia("instagram", link).then((r) => ({ ...r, source: "api:" + (r.source || "") }))];
  if (code) {
    tasks.push(viaEmbed(code).then((r) => ({ ...r, source: "embed" })));
    tasks.push(viaMirror(code).then((r) => ({ ...r, source: "mirror" })));
  }
  try {
    return await Promise.any(tasks);
  } catch (agg) {
    const msgs = (agg.errors || []).map((e) => e.message).join(" | ");
    throw new Error("no direct link found (" + msgs.slice(0, 200) + ")");
  }
}

module.exports = { resolveInstagram, shortcodeOf, parseEmbed, parseOg };
