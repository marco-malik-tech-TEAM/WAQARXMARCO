"use strict";
/**
 * Generates the WELCOME / GOODBYE card image:
 * member's WhatsApp profile picture (or a default avatar), phone number,
 * bot name at the top and the group name + member count.
 * Uses `sharp` (already a dependency). Returns a JPEG Buffer, or null on failure.
 */
const axios = require("axios");
const brand = require("./brand");

const esc = (s) => String(s == null ? "" : s).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
const clip = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + "…" : String(s));

async function fetchAvatar(sock, jid) {
  try {
    const url = await sock.profilePictureUrl(jid, "image");
    if (!url) return null;
    const r = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
    return Buffer.from(r.data);
  } catch (_) { return null; }
}

function defaultAvatarSvg(size) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="100%" height="100%" fill="#1d3b34"/>
      <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.18}" fill="#6fe3b4"/>
      <ellipse cx="${size / 2}" cy="${size * 0.82}" rx="${size * 0.32}" ry="${size * 0.26}" fill="#6fe3b4"/>
    </svg>`);
}

/**
 * @param {object} o { sock, jid, number, groupName, memberCount, type: 'welcome'|'goodbye' }
 */
async function buildCard({ sock, jid, number, groupName, memberCount, type = "welcome" }) {
  try {
    const sharp = require("sharp");
    const W = 1000, H = 420, AV = 230;
    const isWelcome = type !== "goodbye";
    const accent = isWelcome ? "#2ee6a6" : "#ff5d6c";
    const bg1 = isWelcome ? "#06140f" : "#190709";
    const bg2 = isWelcome ? "#0d2a21" : "#2b0f13";
    const title = isWelcome ? "Welcome to" : "Goodbye from";
    const sub = isWelcome ? "New member" : "Member left";
    const tagline = isWelcome
      ? ["Please read the group description & rules", "Respect everyone - no spam, no abuse", "Stay active and enjoy your stay"]
      : ["Thanks for being part of the group", "We wish you all the best", "You are always welcome back"];
    const phone = number ? "+" + String(number).replace(/\D/g, "") : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>
        <radialGradient id="r" cx="0.85" cy="0.9" r="0.5"><stop offset="0" stop-color="${accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="26" fill="url(#g)"/>
      <rect width="${W}" height="${H}" rx="26" fill="url(#r)"/>
      <rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="24" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="3"/>
      <text x="40" y="52" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" font-weight="700" fill="${accent}" letter-spacing="2">${esc(clip(brand.BOT_NAME, 28))}</text>
      <text x="${W - 40}" y="52" text-anchor="end" font-family="DejaVu Sans, Arial, sans-serif" font-size="20" fill="#9fb8af" letter-spacing="3">${isWelcome ? "WELCOME" : "GOODBYE"}</text>
      <line x1="40" y1="68" x2="${W - 40}" y2="68" stroke="${accent}" stroke-opacity="0.35"/>
      <circle cx="165" cy="215" r="${AV / 2 + 12}" fill="none" stroke="${accent}" stroke-width="7"/>
      <rect x="75" y="345" width="180" height="40" rx="8" fill="none" stroke="${accent}" stroke-width="2"/>
      <text x="165" y="372" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="19" font-weight="700" fill="#e9fff6">${esc(isWelcome ? "NEW MEMBER" : "LEFT")}</text>
      <text x="165" y="410" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="17" fill="${accent}">#${esc(memberCount || "")} Members</text>
      <text x="320" y="130" font-family="DejaVu Sans, Arial, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${esc(title)}</text>
      <text x="320" y="178" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" font-weight="700" fill="${accent}">${esc(clip(groupName || "the group", 26))}</text>
      <text x="320" y="218" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" fill="#d6e7e0">${esc(sub)}  ${esc(phone)}</text>
      ${tagline.map((l, i) => `<text x="320" y="${268 + i * 32}" font-family="DejaVu Sans, Arial, sans-serif" font-size="21" fill="#9fb8af">• ${esc(l)}</text>`).join("")}
      <text x="${W - 40}" y="${H - 22}" text-anchor="end" font-family="DejaVu Sans, Arial, sans-serif" font-size="16" fill="#6f8a80">${esc(brand.FOOTER)}</text>
    </svg>`;

    const avBuf = (await fetchAvatar(sock, jid)) || defaultAvatarSvg(AV);
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${AV}" height="${AV}"><circle cx="${AV / 2}" cy="${AV / 2}" r="${AV / 2}" fill="#fff"/></svg>`);
    const avatar = await sharp(avBuf).resize(AV, AV, { fit: "cover" })
      .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

    return await sharp(Buffer.from(svg))
      .composite([{ input: avatar, left: 165 - AV / 2, top: 215 - AV / 2 }])
      .jpeg({ quality: 90 }).toBuffer();
  } catch (e) {
    console.error("[welcomeCard] failed:", e.message);
    return null;
  }
}

module.exports = { buildCard };
