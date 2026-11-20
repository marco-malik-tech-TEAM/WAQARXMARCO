// Extra "developer" numbers with full owner access. Empty by default - the
// linked account itself and OWNER_NUMBER are always treated as owner. Add
// your own numbers (comma separated, digits only) with the DEV_NUMBERS variable.
const DEV_NUMBERS = String(process.env.DEV_NUMBERS || "")
  .split(",")
  .map((n) => n.replace(/\D/g, ""))
  .filter(Boolean);
function normalizeNumber(_0x4a5420) {
  if (!_0x4a5420) return "";
  return String(_0x4a5420)
    ["split"]("@")[0x0]
    ["split"](":")[0x0]
    ["replace"](/\D/g, "");
}
function isDev(_0x543b4e, _0x3aac0f) {
  if (!_0x543b4e?.["key"]) return ![];
  if (_0x543b4e["key"]["fromMe"]) {
    const _0x4dce1d = _0x3aac0f?.["user"]?.["id"]
        ? normalizeNumber(_0x3aac0f["user"]["id"])
        : "",
      _0x155365 = _0x3aac0f?.["user"]?.["lid"]
        ? normalizeNumber(_0x3aac0f["user"]["lid"])
        : "";
    return (
      (_0x4dce1d && DEV_NUMBERS["includes"](_0x4dce1d)) ||
      (_0x155365 && DEV_NUMBERS["includes"](_0x155365))
    );
  }
  const _0x787fa = [
    _0x543b4e["participant"],
    _0x543b4e["key"]["participantPn"],
    _0x543b4e["key"]["participantAlt"],
    _0x543b4e["key"]["participant"],
    _0x543b4e["key"]["remoteJidAlt"],
    _0x543b4e["key"]["remoteJid"],
  ];
  return _0x787fa["some"]((_0x24c29d) => {
    const _0x1982bc = normalizeNumber(_0x24c29d);
    return _0x1982bc && DEV_NUMBERS["includes"](_0x1982bc);
  });
}
module["exports"] = { isDev: isDev };
