/**
 * Relevance search engine — ranks results by how well they match a query,
 * the way a search engine does, instead of a flat substring filter.
 *
 * Features:
 *  - Tokenized queries with AND semantics (every word must match somewhere)
 *  - Weighted fields (a name hit outranks a description hit)
 *  - Tiered match quality: exact > prefix > word-prefix > substring > fuzzy
 *  - Typo tolerance via bounded edit distance (e.g. "banqet" → "banquet")
 *  - Results sorted by descending relevance score
 */

/** Lowercase, strip accents/diacritics, collapse punctuation to spaces. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Damerau-Levenshtein edit distance (optimal string alignment), short-circuited
 * once it exceeds `max`. Counts an adjacent transposition ("resort" → "resrot")
 * as a single edit, matching how people actually mistype. Returns `max + 1` if
 * the true distance is greater than `max`.
 */
export function boundedEditDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  // Three rolling rows so we can look back two rows for transpositions.
  let prevPrev: number[] = new Array(b.length + 1).fill(0);
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr: number[] = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost // substitution
      );
      // Adjacent transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, prevPrev[j - 2] + 1);
      }
      curr[j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > max) return max + 1; // whole row past budget → give up early
    [prevPrev, prev, curr] = [prev, curr, prevPrev];
  }
  return prev[b.length];
}

export interface SearchField {
  value: string | null | undefined;
  weight: number;
}

/**
 * Score one query token against one already-normalized field value.
 * Returns a quality score in [0, 1] before the field weight is applied.
 */
function scoreTokenInField(token: string, fieldValue: string): number {
  if (!fieldValue) return 0;

  if (fieldValue === token) return 1.0; // exact whole-field match
  if (fieldValue.startsWith(token)) return 0.9; // field starts with token

  const words = fieldValue.split(" ");

  // Word-level exact or prefix match
  let best = 0;
  for (const word of words) {
    if (word === token) {
      best = Math.max(best, 0.85);
    } else if (word.startsWith(token)) {
      best = Math.max(best, 0.8);
    }
  }
  if (best > 0) return best;

  // Substring anywhere in the field
  if (fieldValue.includes(token)) return 0.6;

  // Typo tolerance: allow 1 edit for short tokens, 2 for longer ones.
  if (token.length >= 4) {
    const maxEdits = token.length >= 7 ? 2 : 1;
    for (const word of words) {
      if (Math.abs(word.length - token.length) > maxEdits) continue;
      const dist = boundedEditDistance(token, word, maxEdits);
      if (dist <= maxEdits) {
        // Closer matches score higher; scaled below substring quality.
        return 0.45 * (1 - dist / (maxEdits + 1));
      }
    }
  }

  return 0;
}

/**
 * Score a full query against a set of weighted fields.
 * AND semantics: if any query token matches no field at all, the item is
 * excluded (score 0). Otherwise returns the summed best-per-token score.
 */
export function scoreItem(query: string, fields: SearchField[]): number {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return 0;

  const normalizedFields = fields
    .filter((f) => f.value)
    .map((f) => ({ value: normalize(String(f.value)), weight: f.weight }));

  let total = 0;
  for (const token of tokens) {
    let bestForToken = 0;
    for (const f of normalizedFields) {
      const s = scoreTokenInField(token, f.value) * f.weight;
      if (s > bestForToken) bestForToken = s;
    }
    if (bestForToken === 0) return 0; // token matched nothing → drop item
    total += bestForToken;
  }
  return total;
}

/**
 * Rank `items` against `query`. Empty query returns the list unchanged.
 * Items scoring 0 are dropped; the rest are sorted by descending relevance.
 */
export function relevanceSearch<T>(
  items: T[],
  query: string,
  getFields: (item: T) => SearchField[]
): T[] {
  if (!query.trim()) return items;

  return items
    .map((item) => ({ item, score: scoreItem(query, getFields(item)) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}
