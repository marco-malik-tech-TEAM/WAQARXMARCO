"use strict";
/** Sends the welcome / goodbye card + message when members join or leave a group. */
const { buildCard } = require("./welcomeCard");
const brand = require("./brand");

const numOf = (jid) => String(jid || "").split("@")[0].split(":")[0];

async function handle(sock, update, meta, groupSettings) {
  const groupJid = update.id;
  const groupName = (meta && meta.subject) || "the group";
  const count = (meta && meta.participants && meta.participants.length) || "";
  for (const p of update.participants || []) {
    const jid = (p && (p.phoneNumber || p.id)) || p;
    const tag = "@" + numOf(jid);
    let type = null;
    if (update.action === "add" && groupSettings.welcome) type = "welcome";
    else if (update.action === "remove" && groupSettings.goodbye) type = "goodbye";
    if (!type) continue;

    const caption = type === "welcome"
      ? `╔═══════════════╗\n   🎉 *WELCOME* 🎉\n╚═══════════════╝\n\nHey ${tag}! 👋\nWelcome to *${groupName}* 🌟\nYou are member *#${count}*.\n\n📜 Please read the group rules\n💬 Introduce yourself\n🎉 Enjoy your stay!\n\n> _${brand.FOOTER}_`
      : `╔═══════════════╗\n   👋 *GOODBYE* 👋\n╚═══════════════╝\n\n${tag} has left *${groupName}*.\nWe wish you all the best! 🌹\n\n> _${brand.FOOTER}_`;

    const card = await buildCard({ sock, jid, number: numOf(jid), groupName, memberCount: count, type });
    try {
      if (card) await sock.sendMessage(groupJid, { image: card, caption, mentions: [jid] });
      else await sock.sendMessage(groupJid, { text: caption, mentions: [jid] });
    } catch (e) {
      console.error("[welcomeGreeter] send failed:", e.message);
      try { await sock.sendMessage(groupJid, { text: caption, mentions: [jid] }); } catch (_) {}
    }
  }
}

module.exports = { handle };
