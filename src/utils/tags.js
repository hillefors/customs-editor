// utils/tags.js
//
// Ordering "tags" are invisible Unicode Tag characters (block U+E0000).
// Each tag glyph is a plain ASCII character shifted into that block:
//
//   codepoint = 0xE0000 + asciiCode
//
// So Tag "0" is U+E0030, Tag "A" is U+E0041, and so on. Prepending one (or
// more) of these to a custom's name makes the roleplay site sort by it while
// the tag stays completely invisible to a reader.
//
// --- Numbering scheme -----------------------------------------------------
// Within a single box the customs are numbered 0, 1, 2 … in base-16 (hex,
// digits 0-9 A-F). The site sorts names as plain strings, so for the order to
// hold, every tag in a box must be the SAME length — otherwise "1" would sort
// after "10". We therefore pad every tag to the width needed by the largest
// index in that box:
//
//   1-16 customs   -> width 1:  0, 1, … F
//   17-256 customs -> width 2:  00, 01, … FF
//   257+ customs   -> width 3:  000, 001, …
//
// Crossing a boundary re-pads the whole box (0 becomes 00), which is why the
// visible name budget shrinks as a box grows — see maxNameLength().

const TAG_BASE = 0xe0000
const RADIX = 16 // hex: 0-9 then A-F

// The site's hard cap on a name. We count conservatively in UTF-16 code units
// (String.prototype.length): each tag glyph lives outside the BMP, so it is a
// surrogate pair worth 2 units. This is the safe assumption — if the site is
// more lenient we simply leave a little headroom.
export const NAME_LIMIT = 30
const TAG_UNIT_COST = 2 // UTF-16 code units per invisible tag glyph

// Number of hex digits needed to number `count` items (0-based), min 1.
export function tagWidth(count) {
  if (count <= 1) return 1
  return (count - 1).toString(RADIX).length
}

// The human-readable tag key for a position, e.g. 0 -> "0", 10 -> "A",
// 31 -> "1F" (padded to the box width). Shown in the order badge.
export function tagKey(index, width) {
  return index.toString(RADIX).toUpperCase().padStart(width, '0')
}

// The invisible glyph string for a tag key (each char -> its U+E00xx glyph).
export function tagGlyphs(key) {
  let out = ''
  for (const ch of key) out += String.fromCodePoint(TAG_BASE + ch.charCodeAt(0))
  return out
}

// The full name to paste into the site: invisible ordering tag + visible name.
export function taggedName(name, index, count) {
  const width = tagWidth(count)
  return tagGlyphs(tagKey(index, width)) + name
}

// Longest visible name allowed given how many customs share the box (the tag
// grows wider as the box grows, eating into the 30-unit budget).
export function maxNameLength(count) {
  return NAME_LIMIT - TAG_UNIT_COST * tagWidth(count)
}

// UTF-16 length of a would-be tagged name, for overflow checks.
export function taggedLength(name, count) {
  return name.length + TAG_UNIT_COST * tagWidth(count)
}
