// utils/share.js
//
// The whole app is client-only — nothing is stored on a server. To let a user
// come back later (or hand their work to someone else) we serialize the entire
// set of customs into a compact, URL-safe string and hang it off the page URL
// as `?s=…`. Loading a URL with that param rehydrates the exact same state.
//
// It is a reversible ENCODING, not a one-way hash: the data lives entirely in
// the link. lz-string keeps it short enough to fit comfortably in a URL.

import LZString from 'lz-string'

// Bumped only if the payload shape changes; decode rejects unknown versions.
const VERSION = 1

// The query-string key that carries the state.
export const PARAM = 's'

// Fixed order of types <-> short keys, to keep the payload tiny.
const TYPES = ['Fave', 'Yes', 'Maybe', 'No']
const SHORT = { Fave: 'F', Yes: 'Y', Maybe: 'M', No: 'N' }

// Encode the four ordered groups into a URL-safe string.
// Each custom becomes [name] or [name, description] (description omitted when
// empty), preserving array order = display order.
export function encodeState(groups) {
  const g = {}
  for (const type of TYPES) {
    g[SHORT[type]] = (groups[type] || []).map((c) =>
      c.description ? [c.name, c.description] : [c.name]
    )
  }
  const json = JSON.stringify({ v: VERSION, g })
  return LZString.compressToEncodedURIComponent(json)
}

// Decode a string back into `{ Fave, Yes, Maybe, No }` arrays of
// `{ name, description }`. Returns null on anything malformed.
export function decodeState(str) {
  if (!str) return null
  try {
    const json = LZString.decompressFromEncodedURIComponent(str)
    if (!json) return null
    const data = JSON.parse(json)
    if (!data || data.v !== VERSION || typeof data.g !== 'object') return null

    const groups = { Fave: [], Yes: [], Maybe: [], No: [] }
    for (const type of TYPES) {
      const arr = data.g[SHORT[type]]
      if (!Array.isArray(arr)) continue
      groups[type] = arr
        .filter((item) => Array.isArray(item) && typeof item[0] === 'string')
        .map((item) => ({
          name: item[0],
          description: typeof item[1] === 'string' ? item[1] : '',
        }))
    }
    return groups
  } catch {
    return null
  }
}

// True if any group holds at least one custom.
export function isEmpty(groups) {
  return TYPES.every((type) => !(groups[type] && groups[type].length))
}

// Read the encoded state from the current URL's query string, if present.
export function readStateParam() {
  return new URLSearchParams(window.location.search).get(PARAM)
}

// Build a shareable absolute URL for the given encoded string. When there is
// nothing to share, returns the bare page URL (a clean "start fresh" link).
export function buildShareUrl(encoded) {
  const { origin, pathname } = window.location
  return encoded ? `${origin}${pathname}?${PARAM}=${encoded}` : `${origin}${pathname}`
}
