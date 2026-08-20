// utils/tags.js
//
// Ordering "tags" are invisible Unicode Tag characters (block U+E0000).
// Each tag glyph is the plain ASCII character shifted into that block:
//
//   codepoint = 0xE0000 + asciiCode
//
// So Tag "0" is U+E0030, Tag "A" is U+E0041, and so on. Prepending one of
// these to a custom's name makes the roleplay site sort by it while the
// character stays completely invisible to a reader.

const TAG_BASE = 0xe0000

// The keys, in the exact order the customs should sort: 0-9 then A-G.
export const TAG_KEYS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
]

// How many distinct positions we can encode. Beyond this we simply stop
// tagging (the extra customs keep their natural, untagged order).
export const MAX_TAGS = TAG_KEYS.length

// The invisible glyph for a given tag key (e.g. '0' -> U+E0030).
export function tagGlyph(key) {
  return String.fromCodePoint(TAG_BASE + key.charCodeAt(0))
}

// The invisible glyph for a zero-based position, or '' if out of range.
export function tagForIndex(index) {
  const key = TAG_KEYS[index]
  return key ? tagGlyph(key) : ''
}

// A custom's name as it should be pasted into the site: the invisible
// ordering tag followed by the visible name.
export function taggedName(name, index) {
  return tagForIndex(index) + name
}
