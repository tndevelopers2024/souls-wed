// Helpers for handling vendor-supplied media URLs (gallery images & videos).

const VIDEO_FILE_RE = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

/** True when the URL points at a playable video file (needs a <video> tag, not an iframe). */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  if (VIDEO_FILE_RE.test(url)) return true;
  // Local uploads without a recognizable extension still stream as files
  return url.startsWith("/uploads/") && !url.includes("youtube") && !url.includes("vimeo");
}

/**
 * Normalize a YouTube/Vimeo URL to its embeddable form.
 * Watch/short/share links refuse to load inside an <iframe> (X-Frame-Options),
 * which is why raw pasted links show up blank on the public pages.
 * Returns the input unchanged when it's already an embed URL or an unknown host.
 */
export function toVideoEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    const u = new URL(trimmed, "https://dummy.local");
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname.startsWith("/embed/")) return trimmed;
      if (u.pathname === "/watch" && u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      const shorts = u.pathname.match(/^\/(shorts|live)\/([\w-]+)/);
      if (shorts) return `https://www.youtube.com/embed/${shorts[2]}`;
    }

    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (host === "vimeo.com") {
      const m = u.pathname.match(/^\/(\d+)/);
      if (m) return `https://player.vimeo.com/video/${m[1]}`;
    }
    if (host === "player.vimeo.com") return trimmed;
  } catch {
    // Not a parseable URL — return as-is and let the caller decide
  }
  return trimmed;
}

/** Trim entries, drop empties, dedupe, and cap the list length. */
export function sanitizeMediaList(list: unknown, max = 30): string[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    if (typeof item !== "string") continue;
    const v = item.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
    if (out.length >= max) break;
  }
  return out;
}
