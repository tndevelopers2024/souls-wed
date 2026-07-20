# Vendor Dashboard — Media Upload Fix & Form UX Upgrade

**Date:** 2026-07-20
**Scope:** Venue & Service edit forms in `/vendor/dashboard`, upload API, public gallery rendering.

---

## Problems found

| # | Problem | Root cause | Where |
|---|---------|-----------|-------|
| 1 | Videos can't be uploaded from device | `/api/upload` only whitelists image MIME types; video field is a bare URL text input with no upload button | `app/api/upload/route.ts`, `app/(dashboard)/vendor/dashboard/page.tsx` |
| 2 | Videos saved as YouTube `watch?v=` links never display publicly | Public gallery renders the raw URL in an `<iframe>`; YouTube/Vimeo block non-embed URLs via X-Frame-Options | `components/venues/VenueGallery.tsx` |
| 3 | Uploaded video files wouldn't play either | Direct `.mp4` files need a `<video>` tag, not an `<iframe>` | `components/venues/VenueGallery.tsx` |
| 4 | Broken/empty gallery tiles | "+ Add Image URL" pushes `""` into the array; empty strings are saved to MongoDB unfiltered | dashboard forms + `app/api/venues/route.ts`, `app/api/services/route.ts` |
| 5 | **Uploads invisible in production** | Files are written to `public/uploads` at runtime. `next start` only serves `public/` contents that existed at build time, so runtime uploads 404 for visitors | `app/api/upload/route.ts` |
| 6 | Clunky media UX | One-row-per-URL inputs, no previews, no drag-drop, no progress, no thumbnail management | dashboard forms |

## Fix plan

### 1. Upload API — support video + keep images (`app/api/upload/route.ts`)
- Accept optional `kind` form field (`image` | `video`).
- Image types: jpeg/png/webp/gif/avif — max 15 MB.
- Video types: mp4/webm/quicktime/m4v — max 200 MB.
- Keep iron-session auth check. Return `{ success, url, kind }`.

### 2. Serve runtime uploads in production (`app/uploads/[...path]/route.ts`)
- New route handler that streams files from `public/uploads` with correct
  `Content-Type`, `Cache-Control: public, max-age=31536000, immutable`, and
  HTTP **Range** support (needed for video seeking).
- In dev the static `public/` server wins (same result); in prod the route
  serves files uploaded after build. Existing `/uploads/...` URLs in MongoDB
  keep working unchanged.
- Path-traversal guard (resolve + prefix check).

### 3. Video URL normalization helper (`lib/media.ts`)
- `toVideoEmbedUrl(url)`: `youtube.com/watch?v=`, `youtu.be/`, `shorts/` → `youtube.com/embed/<id>`; `vimeo.com/<id>` → `player.vimeo.com/video/<id>`; already-embed URLs pass through.
- `isDirectVideoUrl(url)`: `.mp4/.webm/.mov/.m4v` or `/uploads/` paths.

### 4. New `components/shared/MediaGalleryInput.tsx`
Production-level media manager used by both venue & service forms:
- **Images mode**: thumbnail grid with previews, multi-file picker, drag-and-drop, per-file upload progress, remove buttons, optional add-by-URL row.
- **Videos mode**: upload from device (goes through `/api/upload` as `kind=video`), or paste YouTube/Vimeo/direct URL; inline preview (thumbnail for YT, `<video>` for files); invalid-URL feedback.
- Uploads happen immediately; the component only emits clean, non-empty URL arrays.

### 5. Public gallery rendering (`components/venues/VenueGallery.tsx`)
- Filter empty strings from `images`/`videos`.
- Direct file URLs → `<video controls preload="metadata">`.
- YouTube/Vimeo → `<iframe src={toVideoEmbedUrl(url)}>`.

### 6. Dashboard forms (`app/(dashboard)/vendor/dashboard/page.tsx`)
- Replace the per-row URL inputs for Gallery + Videos with `MediaGalleryInput` in **both** the venue form and the service form.
- Trim + drop empty strings from `gallery`/`videos`/`features` before submit.
- UX polish: clear section grouping for media, helper text, consistent dark-mode styles, save feedback preserved.

### 7. Server-side sanitization (`app/api/venues/route.ts`, `app/api/services/route.ts`)
- On POST/PATCH: `gallery`/`videos` → keep strings only, trim, drop empties, cap at 30 items; normalize video URLs to embed form at save time.

## Verification
- `npx tsc --noEmit` clean.
- Dev-server smoke test: edit venue → upload image + video → save → open public venue page → media visible in Gallery/Videos tabs.

## Out of scope (recommend later)
- Cloud object storage (S3/R2/Cloudinary) — required if deploying to serverless/multi-instance hosting; local-disk uploads only work on a single persistent server.
- Image optimization pipeline (currently `unoptimized: true`).
