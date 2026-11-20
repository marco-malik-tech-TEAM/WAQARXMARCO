/**
 * WhatsApp channel integration
 *  - resolves the channel's JID (the "...@newsletter" id) from its invite code
 *  - makes every linked account automatically follow the channel
 *  - automatically reacts to every new post in the channel
 *  - builds the contextInfo that makes a message look "Forwarded from channel"
 *
 * Optional environment variables:
 *   NEWSLETTER_JID          use this channel id directly (skips the lookup)
 *   CHANNEL_AUTOFOLLOW      "false" to disable auto-follow   (default: on)
 *   CHANNEL_AUTOREACT       "false" to disable auto-react    (default: on)
 *   CHANNEL_REACT_EMOJIS    comma separated list, e.g. "❤️,🔥,👏"
 */
const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const brand = require("./brand");

const FLAG_OFF = (v) => String(v || "").toLowerCase() === "false";
const AUTOFOLLOW = !FLAG_OFF(process.env.CHANNEL_AUTOFOLLOW);
const AUTOREACT = !FLAG_OFF(process.env.CHANNEL_AUTOREACT);
const EMOJIS = (
  process.env.CHANNEL_REACT_EMOJIS || "❤️,🔥,😍,👏,💯,🥰,😎,🤩,👍,⚡"
)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

const STATE_DIR = path.join(require("./paths").ROOT, "auth_info_baileys");
const STATE_FILE = path.join(STATE_DIR, ".channel_state.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log("[channel]", ...a);

let channelJid = process.env.NEWSLETTER_JID || null;
let resolving = null;

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}
function writeState(patch) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify({ ...readState(), ...patch }, null, 2),
    );
  } catch (e) {
    log("could not save state:", e.message);
  }
}

/** Find the channel's @newsletter JID (cached after the first success). */
async function resolveJid(sock) {
  if (channelJid) return channelJid;
  const cached = readState();
  if (cached.invite === brand.CHANNEL_INVITE && cached.jid) {
    channelJid = cached.jid;
    return channelJid;
  }
  if (!sock || typeof sock.newsletterMetadata !== "function") return null;
  if (resolving) return resolving;
  resolving = (async () => {
    for (let i = 1; i <= 3; i++) {
      try {
        const meta = await sock.newsletterMetadata(
          "invite",
          brand.CHANNEL_INVITE,
        );
        if (meta && meta.id) {
          channelJid = meta.id;
          writeState({ invite: brand.CHANNEL_INVITE, jid: channelJid });
          log("channel id resolved:", channelJid);
          return channelJid;
        }
      } catch (e) {
        log(`lookup attempt ${i}/3 failed:`, e && e.message);
      }
      await sleep(3000 * i);
    }
    return null;
  })().finally(() => {
    resolving = null;
  });
  return resolving;
}

/** Follow the channel once per linked account. */
async function ensureFollowing(sock) {
  if (!AUTOFOLLOW) return;
  const jid = await resolveJid(sock);
  if (!jid) return;
  if (readState().followed === jid) return;
  if (typeof sock.newsletterFollow !== "function") return;
  for (let i = 1; i <= 3; i++) {
    try {
      await sock.newsletterFollow(jid);
      writeState({ followed: jid });
      log("now following the channel.");
      return;
    } catch (e) {
      const msg = String((e && e.message) || e);
      if (/already|subscribed|exist/i.test(msg)) {
        writeState({ followed: jid });
        return;
      }
      log(`follow attempt ${i}/3 failed:`, msg);
      await sleep(4000 * i);
    }
  }
}

/** Ask WhatsApp to push live updates for the channel so posts reach us. */
async function subscribe(sock) {
  const jid = await resolveJid(sock);
  if (!jid) return;
  try {
    if (typeof sock.subscribeNewsletterUpdates === "function")
      await sock.subscribeNewsletterUpdates(jid);
  } catch (e) {
    log("live-update subscribe failed:", e && e.message);
  }
}

const reacted = new Set();

async function reactToPost(sock, m) {
  const remote = m && m.key && m.key.remoteJid;
  if (!remote || !String(remote).endsWith("@newsletter")) return;
  const jid = channelJid || (await resolveJid(sock));
  if (!jid || remote !== jid) return;
  const serverId =
    m.newsletter_server_id ||
    m.key.server_id ||
    (m.message && m.message.newsletter_server_id);
  if (!serverId) return;
  const id = String(serverId);
  if (reacted.has(id)) return;
  reacted.add(id);
  if (reacted.size > 500) reacted.delete(reacted.values().next().value);
  await sleep(1500 + Math.floor(Math.random() * 2500));
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  try {
    await sock.newsletterReactMessage(jid, id, emoji);
    log(`reacted ${emoji} to post ${id}`);
  } catch (e) {
    reacted.delete(id);
    log("react failed:", e && e.message);
  }
}

/**
 * Call once per socket (from events/connection.js). Registers the
 * auto-react listener and, whenever the connection opens, follows
 * the channel.
 */
function attach(sock) {
  if (AUTOREACT) {
    sock.ev.on("messages.upsert", ({ messages }) => {
      for (const m of messages || []) reactToPost(sock, m).catch(() => {});
    });
  }
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection !== "open") return;
    setTimeout(async () => {
      try {
        await ensureFollowing(sock);
        await subscribe(sock);
        // keep retrying in the background until the channel id is known
        if (!channelJid) {
          const t = setInterval(async () => {
            if (await resolveJid(sock)) {
              clearInterval(t);
              await ensureFollowing(sock);
              await subscribe(sock);
            }
          }, 10 * 60 * 1000);
          t.unref && t.unref();
        }
      } catch (e) {
        log("setup error:", e && e.message);
      }
    }, 8000);
  });
}

/**
 * contextInfo that makes a message appear as
 * "Forwarded from <channel name>".
 */
async function forwardContext(sock) {
  const jid = channelJid || (await resolveJid(sock).catch(() => null));
  if (!jid) return {};
  return {
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: jid,
      newsletterName: brand.CHANNEL_NAME,
      serverMessageId: 143,
    },
  };
}

module.exports = { attach, resolveJid, ensureFollowing, forwardContext };
