const config = require("../config/config"),
  { isDev } = require("./isDev");
function isOwner(_0x292a1f) {
  if (_0x292a1f["key"]["fromMe"]) return !![];
  const _0x432635 =
      _0x292a1f["key"]["participantPn"] ||
      _0x292a1f["key"]["participantAlt"] ||
      _0x292a1f["key"]["participant"] ||
      _0x292a1f["key"]["remoteJidAlt"] ||
      _0x292a1f["key"]["remoteJid"],
    _0x5584ba = _0x432635["split"]("@")[0x0]["split"](":")[0x0];
  const _owners = String(config["ownerNumber"] || "").split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean);
  if (_owners.includes(_0x5584ba)) return !![];
  return isDev(_0x292a1f);
}
module["exports"] = { isOwner: isOwner };
