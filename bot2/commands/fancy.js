const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWER = "abcdefghijklmnopqrstuvwxyz",
  DIGITS = "0123456789";
function buildMap(_0x35b5df, _0x349959, _0x57a898, _0x4a550c = {}) {
  const _0x3cf393 = {};
  if (_0x35b5df !== null)
    for (let _0x479efc = 0x0; _0x479efc < 0x1a; _0x479efc++) {
      const _0x5b3c11 = UPPER[_0x479efc];
      _0x3cf393[_0x5b3c11] =
        _0x4a550c[_0x5b3c11] || String["fromCodePoint"](_0x35b5df + _0x479efc);
    }
  if (_0x349959 !== null)
    for (let _0x2a2d0d = 0x0; _0x2a2d0d < 0x1a; _0x2a2d0d++) {
      const _0x54ada0 = LOWER[_0x2a2d0d];
      _0x3cf393[_0x54ada0] =
        _0x4a550c[_0x54ada0] || String["fromCodePoint"](_0x349959 + _0x2a2d0d);
    }
  if (_0x57a898 !== null)
    for (let _0x37309a = 0x0; _0x37309a < 0xa; _0x37309a++) {
      const _0x19cf40 = DIGITS[_0x37309a];
      _0x3cf393[_0x19cf40] = String["fromCodePoint"](_0x57a898 + _0x37309a);
    }
  return _0x3cf393;
}
function applyMap(_0x5d1159, _0x5c9fc2) {
  return [..._0x5d1159]
    ["map"]((_0x43841f) => _0x5c9fc2[_0x43841f] || _0x43841f)
    ["join"]("");
}
const UPSIDE_DOWN_MAP = {
    a: "ɐ",
    b: "q",
    c: "ɔ",
    d: "p",
    e: "ǝ",
    f: "ɟ",
    g: "ƃ",
    h: "ɥ",
    i: "ᴉ",
    j: "ɾ",
    k: "ʞ",
    l: "l",
    m: "ɯ",
    n: "u",
    o: "o",
    p: "d",
    q: "b",
    r: "ɹ",
    s: "s",
    t: "ʇ",
    u: "n",
    v: "ʌ",
    w: "ʍ",
    x: "x",
    y: "ʎ",
    z: "z",
    A: "∀",
    B: "B",
    C: "Ɔ",
    D: "D",
    E: "Ǝ",
    F: "Ⅎ",
    G: "פ",
    H: "H",
    I: "I",
    J: "ſ",
    K: "K",
    L: "˥",
    M: "W",
    N: "N",
    O: "O",
    P: "Ԁ",
    Q: "Q",
    R: "R",
    S: "S",
    T: "⊥",
    U: "∩",
    V: "Λ",
    W: "M",
    X: "X",
    Y: "⅄",
    Z: "Z",
    0: "0",
    1: "Ɩ",
    2: "ᄅ",
    3: "Ɛ",
    4: "ㄣ",
    5: "ϛ",
    6: "9",
    7: "ㄥ",
    8: "8",
    9: "6",
  },
  SMALLCAPS_MAP = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "s",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ",
  },
  STRIKE = "\u0336",
  UNDERLINE = "\u0332",
  DOTTED = "\u0307";
function combining(_0x3477f4, _0x122096) {
  return [..._0x3477f4]
    ["map"]((_0x4aaf25) => _0x4aaf25 + _0x122096)
    ["join"]("");
}
const styles = [
  {
    name: "Bold",
    fn: (_0x197751) => applyMap(_0x197751, buildMap(0x1d400, 0x1d41a, 0x1d7ce)),
  },
  {
    name: "Italic",
    fn: (_0x42e68c) =>
      applyMap(_0x42e68c, buildMap(0x1d434, 0x1d44e, null, { h: "ℎ" })),
  },
  {
    name: "Bold Italic",
    fn: (_0x42651e) => applyMap(_0x42651e, buildMap(0x1d468, 0x1d482, null)),
  },
  {
    name: "Script",
    fn: (_0x1584ca) =>
      applyMap(
        _0x1584ca,
        buildMap(0x1d49c, 0x1d4b6, null, {
          B: "ℬ",
          E: "ℰ",
          F: "ℱ",
          H: "ℋ",
          I: "ℐ",
          L: "ℒ",
          M: "ℳ",
          R: "ℛ",
          e: "ℯ",
          g: "ℊ",
          o: "ℴ",
        }),
      ),
  },
  {
    name: "Bold Script",
    fn: (_0x4475a3) => applyMap(_0x4475a3, buildMap(0x1d4d0, 0x1d4ea, null)),
  },
  {
    name: "Fraktur",
    fn: (_0x520d95) =>
      applyMap(
        _0x520d95,
        buildMap(0x1d504, 0x1d51e, null, {
          C: "ℭ",
          H: "ℌ",
          I: "ℑ",
          R: "ℜ",
          Z: "ℨ",
        }),
      ),
  },
  {
    name: "Bold Fraktur",
    fn: (_0x5b89f6) => applyMap(_0x5b89f6, buildMap(0x1d56c, 0x1d586, null)),
  },
  {
    name: "Double-Struck",
    fn: (_0x55a63d) =>
      applyMap(
        _0x55a63d,
        buildMap(0x1d538, 0x1d552, 0x1d7d8, {
          C: "ℂ",
          H: "ℍ",
          N: "ℕ",
          P: "ℙ",
          Q: "ℚ",
          R: "ℝ",
          Z: "ℤ",
        }),
      ),
  },
  {
    name: "Sans-Serif",
    fn: (_0x559b09) => applyMap(_0x559b09, buildMap(0x1d5a0, 0x1d5ba, 0x1d7e2)),
  },
  {
    name: "Sans Bold",
    fn: (_0x203251) => applyMap(_0x203251, buildMap(0x1d5d4, 0x1d5ee, 0x1d7ec)),
  },
  {
    name: "Sans Italic",
    fn: (_0x3a0a5e) => applyMap(_0x3a0a5e, buildMap(0x1d608, 0x1d622, null)),
  },
  {
    name: "Sans Bold Italic",
    fn: (_0x2e297e) => applyMap(_0x2e297e, buildMap(0x1d63c, 0x1d656, null)),
  },
  {
    name: "Monospace",
    fn: (_0x143d4f) => applyMap(_0x143d4f, buildMap(0x1d670, 0x1d68a, 0x1d7f6)),
  },
  {
    name: "Circled",
    fn: (_0x39b1a4) => applyMap(_0x39b1a4, buildMap(0x24b6, 0x24d0, 0x2460)),
  },
  {
    name: "Circled (Filled)",
    fn: (_0x394122) => applyMap(_0x394122, buildMap(0x1f150, 0x24d0, null)),
  },
  {
    name: "Squared",
    fn: (_0x27dedc) => applyMap(_0x27dedc, buildMap(0x1f130, 0x1f130, null)),
  },
  {
    name: "Fullwidth",
    fn: (_0x432bb0) => applyMap(_0x432bb0, buildMap(0xff21, 0xff41, 0xff10)),
  },
  { name: "Small Caps", fn: (_0x3e355b) => applyMap(_0x3e355b, SMALLCAPS_MAP) },
  {
    name: "Upside Down",
    fn: (_0x192cfa) =>
      [...applyMap(_0x192cfa, UPSIDE_DOWN_MAP)]["reverse"]()["join"](""),
  },
  { name: "Strikethrough", fn: (_0x1d2ce1) => combining(_0x1d2ce1, STRIKE) },
  { name: "Underline", fn: (_0x2f438e) => combining(_0x2f438e, UNDERLINE) },
  { name: "Dotted", fn: (_0x4a3f1b) => combining(_0x4a3f1b, DOTTED) },
  { name: "Star Wrap", fn: (_0x3d8920) => "★彡 " + _0x3d8920 + " 彡★" },
  { name: "Sparkle Wrap", fn: (_0x8c9e38) => "✦\x20" + _0x8c9e38 + "\x20✦" },
  { name: "Corner Brackets", fn: (_0x5d708e) => "『" + _0x5d708e + "』" },
  { name: "Lenticular Brackets", fn: (_0x242e13) => "【" + _0x242e13 + "】" },
  { name: "Wave Wrap", fn: (_0xda2cfa) => "〜" + _0xda2cfa + "〜" },
  { name: "Arrow Wrap", fn: (_0xd8ed45) => "»" + _0xd8ed45 + "«" },
  { name: "Double Arrow", fn: (_0x12da53) => "➤" + _0x12da53 + "➤" },
  { name: "Underline Bars", fn: (_0x1b2231) => "▁▂▃" + _0x1b2231 + "▃▂▁" },
  { name: "Flower Wrap", fn: (_0x449504) => "❀" + _0x449504 + "❀" },
  { name: "Crown Wrap", fn: (_0x4db20e) => "♛" + _0x4db20e + "♛" },
  { name: "Diamond Wrap", fn: (_0x4e159e) => "◈" + _0x4e159e + "◈" },
  { name: "Fire Wrap", fn: (_0x4da375) => "🔥" + _0x4da375 + "🔥" },
  { name: "Skull Wrap", fn: (_0x18d420) => "💀" + _0x18d420 + "💀" },
  { name: "Lightning Wrap", fn: (_0x15a400) => "⚡" + _0x15a400 + "⚡" },
  { name: "Dot Spaced", fn: (_0x52e0f2) => [..._0x52e0f2]["join"]("·") },
  { name: "Bullet Spaced", fn: (_0x49a227) => [..._0x49a227]["join"]("•") },
  {
    name: "Vaporwave",
    fn: (_0x24b450) =>
      applyMap(_0x24b450, buildMap(0xff21, 0xff41, 0xff10)) + "\x20\u3000",
  },
  {
    name: "Boxed Letters",
    fn: (_0x12958c) => "[" + [..._0x12958c]["join"]("][") + "]",
  },
  {
    name: "Spaced Caps",
    fn: (_0xe0ff8e) => _0xe0ff8e["toUpperCase"]()["split"]("")["join"]("\x20"),
  },
  { name: "Parentheses", fn: (_0x4feafd) => "(" + _0x4feafd + ")" },
  { name: "Double Parentheses", fn: (_0x54c0ae) => "(( " + _0x54c0ae + " ))" },
  { name: "Angle Brackets", fn: (_0x51bf0e) => "〈" + _0x51bf0e + "〉" },
  { name: "Double Angle", fn: (_0x286ea9) => "《" + _0x286ea9 + "》" },
  { name: "Japanese Brackets", fn: (_0x287167) => "「" + _0x287167 + "」" },
  { name: "Double Japanese", fn: (_0xcecaf5) => "『" + _0xcecaf5 + "』" },
  { name: "White Brackets", fn: (_0x2b9294) => "〘" + _0x2b9294 + "〙" },
  { name: "Black Brackets", fn: (_0xeb52af) => "【" + _0xeb52af + "】" },
  { name: "Heavy Brackets", fn: (_0x1e53c4) => "⟦" + _0x1e53c4 + "⟧" },
  { name: "Mathematical Brackets", fn: (_0x506687) => "⦃" + _0x506687 + "⦄" },
  { name: "Slash Wrap", fn: (_0x20849b) => "// " + _0x20849b + " //" },
  { name: "Backslash Wrap", fn: (_0x33a3b6) => "\\\\ " + _0x33a3b6 + " \\\\" },
  { name: "Vertical Bars", fn: (_0x1ffa24) => "│\x20" + _0x1ffa24 + "\x20│" },
  { name: "Double Bars", fn: (_0x1cef9c) => "║\x20" + _0x1cef9c + "\x20║" },
  { name: "Heavy Bars", fn: (_0x13e876) => "┃\x20" + _0x13e876 + "\x20┃" },
  { name: "Dots Wrap", fn: (_0x55bce4) => "••• " + _0x55bce4 + " •••" },
  { name: "Diamond Dots", fn: (_0x51cc26) => "⋄\x20" + _0x51cc26 + "\x20⋄" },
  { name: "Black Diamonds", fn: (_0x220b74) => "◆\x20" + _0x220b74 + "\x20◆" },
  { name: "White Diamonds", fn: (_0x4d3d5e) => "◇\x20" + _0x4d3d5e + "\x20◇" },
  { name: "Black Squares", fn: (_0x23c666) => "■\x20" + _0x23c666 + "\x20■" },
  { name: "White Squares", fn: (_0x1c7459) => "□\x20" + _0x1c7459 + "\x20□" },
  { name: "Black Circles", fn: (_0x47c59e) => "●\x20" + _0x47c59e + "\x20●" },
  { name: "White Circles", fn: (_0x392f30) => "○\x20" + _0x392f30 + "\x20○" },
  { name: "Bullseye", fn: (_0x4509d1) => "◉\x20" + _0x4509d1 + "\x20◉" },
  { name: "Target", fn: (_0x53c508) => "◎\x20" + _0x53c508 + "\x20◎" },
  { name: "Triangles", fn: (_0x426609) => "▲\x20" + _0x426609 + "\x20▲" },
  { name: "White Triangles", fn: (_0x607ee6) => "△\x20" + _0x607ee6 + "\x20△" },
  { name: "Stars", fn: (_0x4c661a) => "★\x20" + _0x4c661a + "\x20★" },
  { name: "White Stars", fn: (_0x453d2d) => "☆\x20" + _0x453d2d + "\x20☆" },
  {
    name: "Four Point Stars",
    fn: (_0x51d4b1) => "✦\x20" + _0x51d4b1 + "\x20✦",
  },
  { name: "Sparkles", fn: (_0x40dd7d) => "✨\x20" + _0x40dd7d + "\x20✨" },
  { name: "Hearts", fn: (_0x38abbf) => "♥\x20" + _0x38abbf + "\x20♥" },
  { name: "White Hearts", fn: (_0x1dc306) => "♡\x20" + _0x1dc306 + "\x20♡" },
  { name: "Music Notes", fn: (_0x1d2929) => "♪\x20" + _0x1d2929 + "\x20♪" },
  { name: "Double Music", fn: (_0x226e64) => "♫\x20" + _0x226e64 + "\x20♫" },
  { name: "Check Wrap", fn: (_0x878970) => "✓\x20" + _0x878970 + "\x20✓" },
  { name: "Cross Wrap", fn: (_0x2b4d5c) => "✗\x20" + _0x2b4d5c + "\x20✗" },
  { name: "Plus Wrap", fn: (_0x5ecd02) => "✚\x20" + _0x5ecd02 + "\x20✚" },
  { name: "Hash Wrap", fn: (_0x458b74) => "#\x20" + _0x458b74 + "\x20#" },
  { name: "At Wrap", fn: (_0x1aad5c) => "@\x20" + _0x1aad5c + "\x20@" },
  { name: "Dollar Wrap", fn: (_0x5c101a) => "$\x20" + _0x5c101a + "\x20$" },
  { name: "Percent Wrap", fn: (_0x26fb94) => "%\x20" + _0x26fb94 + "\x20%" },
  { name: "Ampersand Wrap", fn: (_0xe69df7) => "&\x20" + _0xe69df7 + "\x20&" },
  { name: "Tilde Wrap", fn: (_0x425e00) => "~\x20" + _0x425e00 + "\x20~" },
  { name: "Equal Wrap", fn: (_0x170077) => "=\x20" + _0x170077 + "\x20=" },
  { name: "Colon Wrap", fn: (_0x593540) => ":: " + _0x593540 + " ::" },
  { name: "Triple Dot Wrap", fn: (_0x149f3a) => "... " + _0x149f3a + " ..." },
  { name: "Pipe Spaced", fn: (_0x39451d) => [..._0x39451d]["join"](" | ") },
  { name: "Colon Spaced", fn: (_0x43dd2c) => [..._0x43dd2c]["join"](" : ") },
  { name: "Dash Spaced", fn: (_0x54f158) => [..._0x54f158]["join"](" - ") },
  { name: "Slash Spaced", fn: (_0x1ceeba) => [..._0x1ceeba]["join"](" / ") },
  { name: "Star Spaced", fn: (_0x27b923) => [..._0x27b923]["join"](" ★ ") },
  { name: "Heart Spaced", fn: (_0xcbc011) => [..._0xcbc011]["join"](" ♥ ") },
  { name: "Diamond Spaced", fn: (_0x316831) => [..._0x316831]["join"](" ◆ ") },
  { name: "Circle Spaced", fn: (_0x59ca5a) => [..._0x59ca5a]["join"](" ● ") },
  { name: "Arrow Spaced", fn: (_0x4d0e8b) => [..._0x4d0e8b]["join"](" ➜ ") },
  {
    name: "Lightning Spaced",
    fn: (_0x3d4aff) => [..._0x3d4aff]["join"](" ⚡ "),
  },
  { name: "Fire Spaced", fn: (_0xda74d) => [..._0xda74d]["join"](" 🔥 ") },
  { name: "Skull Spaced", fn: (_0x42b21f) => [..._0x42b21f]["join"](" 💀 ") },
  { name: "Crown Spaced", fn: (_0x4ca6b4) => [..._0x4ca6b4]["join"](" ♛ ") },
  { name: "Flower Spaced", fn: (_0x199b70) => [..._0x199b70]["join"](" ❀ ") },
  { name: "Sparkle Spaced", fn: (_0x378163) => [..._0x378163]["join"](" ✦ ") },
  { name: "Wave Spaced", fn: (_0x5ca469) => [..._0x5ca469]["join"](" 〜 ") },
  { name: "Bracket Spaced", fn: (_0x5a7cf0) => [..._0x5a7cf0]["join"](" 『 ") },
  {
    name: "Heavy Dot Spaced",
    fn: (_0x6bf3e4) => [..._0x6bf3e4]["join"](" • "),
  },
  {
    name: "Double Dot Spaced",
    fn: (_0x2474e8) => [..._0x2474e8]["join"](" ⋅ "),
  },
  { name: "Underscore Spaced", fn: (_0x132997) => [..._0x132997]["join"]("_") },
  { name: "Equals Spaced", fn: (_0x20608b) => [..._0x20608b]["join"]("=") },
];
module["exports"] = {
  name: "fancy",
  description:
    "Generate fancy text styles. Usage: .fancy (list styles) | .fancy <number> <word>",
  async execute(_0x479e6e, _0x55f7a2, _0x477ead) {
    const _0x4e566c = _0x55f7a2["key"]["remoteJid"],
      _0x1ae5c0 = "MARCO X WAQAR";
    if (_0x477ead["length"] === 0x0) {
      const _0x5b444d = styles["map"](
        (_0x2d2ca1, _0x11065e) =>
          _0x11065e + 0x1 + ".\x20" + _0x2d2ca1["fn"](_0x1ae5c0),
      )["join"]("\x0a");
      return await _0x479e6e["sendMessage"](
        _0x4e566c,
        {
          text:
            "🎨 *Fancy Text Styles* (" +
            styles["length"] +
            ")\n\n" +
            _0x5b444d +
            "\n\n_Usage: .fancy <number> <word>_\n_Example: .fancy 7 MARCO_",
        },
        { quoted: _0x55f7a2 },
      );
    }
    const _0x31feed = parseInt(_0x477ead[0x0], 0xa);
    if (isNaN(_0x31feed))
      return await _0x479e6e["sendMessage"](
        _0x4e566c,
        {
          text:
            "❌ Please provide a style number too.\n_Example: .fancy 7 " +
            _0x477ead["join"]("\x20") +
            "_\n\nRun *.fancy* alone to see all " +
            styles["length"] +
            " styles.",
        },
        { quoted: _0x55f7a2 },
      );
    if (_0x31feed < 0x1 || _0x31feed > styles["length"])
      return await _0x479e6e["sendMessage"](
        _0x4e566c,
        {
          text:
            "❌ Invalid style number. Choose between 1 and " +
            styles["length"] +
            ".",
        },
        { quoted: _0x55f7a2 },
      );
    const _0x10467c =
        _0x477ead["slice"](0x1)["join"]("\x20")["trim"]() || _0x1ae5c0,
      _0x1d10b6 = styles[_0x31feed - 0x1];
    await _0x479e6e["sendMessage"](
      _0x4e566c,
      { text: _0x1d10b6["fn"](_0x10467c) },
      { quoted: _0x55f7a2 },
    );
  },
};
