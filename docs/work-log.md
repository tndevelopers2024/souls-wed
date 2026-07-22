# SoulsWed — Development Work Log

A running record of what has been built, what remains, and why. Written to be read
without opening the code.

**Reference document:** `5th April To Do List for Developer.docx` (client feedback, 23 items)

---

## Background: why some items look "missing"

The April to-do list was written against the **old soulswed.com** — the yellow-themed
site with the `Venues / Planners / Photographers` menu and the 22-question venue
questionnaire. Every screenshot in the document shows that version.

The current codebase is a **from-scratch rebuild** (first commit 23 May 2026). It is a
different application, so the April feedback splits three ways:

- Fixes that the rebuild already handles, or that the rebuild made irrelevant.
- Requirements that are still valid but were never carried across into the new build.
- Items that were never about this website at all (domain and search-engine settings).

---

## Scoreboard — 23 client items

| Status | Count | Items |
|---|---|---|
| ✅ Done and confirmed working | **15** | 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 15, 16, 17, 19, 23 |
| Built, not yet confirmed | 2 | 8, 14 |
| Not started | **1** | 13 |
| No longer applies (old UI removed) | 2 | 4, 21 |
| Not this website | 3 | 18, 20, 22 |

**22 of 23 are addressed; 15 are confirmed working with evidence.** Only the
vendor-edit freeze (#13) has not been touched. Items 8 and 14 are written but
need a save and an upload to prove, which requires a database that is not
shared with production.

**Already working**
- **#2** Search now works without choosing a category — it falls back to showing all vendors.
- **#16** Any photo in the gallery can be deleted, not just the last one.
- **#19** The soulswed.com description is live with the exact wording the client supplied.

**No longer applies** — #4 (the `Search Vendors` / `Top Picks` button row) and #21 (the
account dropdown sitting too close to the screen edge). Neither element exists in the rebuild.

**Not this website** — #18 and #22 are domain and Google Search Console settings for
soulswed.in and Soulswed-SILK. #20 is AmazingHalls.com's own site description.

The remaining 15 items group into **8 pieces of work**, because six of them (#5, #6, #8,
#9, #10, #23) all describe the same Subscribe / Advertise pop-up.

---

## Session 1 — 22 July 2026

### Delivered

**1. Photos now load ~8x faster (client item #1)**

Image compression had been switched off site-wide, so every photo was sent to visitors at
its full original size. This was the direct cause of the "Le Crans takes too long to display
pictures" complaint. Compression is now on.

Measured on a real venue photo from the site:

| | Before | After |
|---|---|---|
| File sent to visitor | 472 KB, JPEG | **61 KB, WebP** |
| Reduction | — | **87% smaller** |

A page showing 12 photos now transfers roughly 0.7 MB instead of 5.7 MB. The saving applies
to every image on the site, on every page.

As part of the same change, the site previously accepted images from *any* address on the
internet, including insecure ones. It now uses an approved list. Photos a vendor pastes from
an outside source still display exactly as before — they simply skip compression instead of
failing.

**2. Upload alerts to the SoulsWed team (client item #14)**

When a vendor uploads photos or videos, a notification email now goes to
`soulswed99@gmail.com` containing the vendor's name, email, ID, and how much was uploaded.

One email is sent per upload session, not per file — uploading 30 photos produces one
alert, not 30. Repeat alerts for the same vendor are held for 60 seconds. If the mail
server is unreachable the vendor's upload still succeeds; only the alert is skipped.

The destination address can be changed without a code change, via the `UPLOAD_NOTIFY_EMAIL`
setting.

**3. Content review notice for vendors (client item #15)**

Every photo and video upload box now displays, in brand orange:

> Uploads are subject to review and can be deleted if found inappropriate.

**4. "Set as Main image" and "Delete image" (client item #17)**

Each photo in a vendor's gallery now carries two labelled buttons, in the colours the client
asked for:

- **Set as Main image** — orange (`#EE7429`)
- **Delete image** — yellow (`#FCCB11`)

The current main image is marked with a "MAIN" badge and an orange outline. If a vendor
deletes the photo that was set as main, the next photo is promoted automatically so the
listing is never left without a cover image. Both the Venue editor and the Service editor
have this.

### Verified

- Image compression confirmed live and measured (figures above).
- The approved-image-source list confirmed active; outside sources confirmed still displaying.
- Vendor dashboard loads and its login protection still works.
- No new code errors introduced (error count went from 35 to 34; the remainder are
  pre-existing and unrelated to this work — see Known issues).

### Not started this session

| # | Item | Notes |
|---|---|---|
| 3 | Booking.com-style photo layout | Currently a plain square grid. Medium effort. |
| 13 | Page freezes when editing a vendor | Needs to be reproduced first; cause unknown. |
| 7, 11, 12 | Rate card page | Delivered later the same day — see Session 2. |
| 5, 6, 8, 9, 10, 23 | Subscribe / Advertise pop-up | Delivered later the same day — see Session 2. |

---

## Session 2 — 22 July 2026

Rate cards and the Subscribe / Advertise pop-up. This closes nine more client
items and completes the revenue side of the April feedback.

### Delivered

**5. Subscription Plans page (client items #7, #12)** — at `/subscribe`

The four-column rate card for Banquet Halls and Rooms: **Core** (free), **Plus**,
**Elite** and **Luxe**, with the club names, the "Special Pre-Launch Offer*" heading
and the full feature list for each tier.

- All pricing is now **blue**, not yellow. The client's complaint was that yellow text
  on a white background could not be read; blue fixes it and stays readable in dark mode.
- **Three PAY NOW buttons**, exactly as asked — one under each paid column. Core is free,
  so it shows "Included free" instead of a payment button.
- Original prices appear struck through above the offer price.

**6. Advertisement Plans page (client item #11)** — at `/advertise`

The five advertising packages for hotels, each in its own box, **each with its own PAY NOW
button** positioned next to the price — the exact spot the client circled.

**7. Contact options on both rate cards (client item #11)**

Below both rate cards: a WhatsApp button and all three enquiry addresses —
`weddings@pearlsntiaras.com`, `info@soulswed.com` and `info@amazinghalls.com`.

**8. Test payment amounts (client item #12)**

The client asked for ₹30 and ₹50 while the payment flow is being verified, then a switch
back to real prices. Checkout charges those test amounts today, and both pages carry a
visible orange notice explaining this so nobody mistakes it for the real price.

Switching to real prices is a one-line settings change — `NEXT_PUBLIC_PLAN_TEST_MODE=false`.
No code needs to be touched.

The amount charged is always decided on the server from the plan the customer picked. A
price cannot be altered from the browser.

**9. Subscribe / Advertise pop-up on every page (client items #5, #6, #9, #10, #23)**

A promotional "sticker" now appears on every page of the site, carrying the client's own
wording — *"Promote Your Hotel to High-Paying Customers!"* with the three benefit ticks.
It has two buttons, **Subscribe here** and **Advertise with us**, which open the two rate
cards. This is the direct answer to the question the developers raised in the April
document (#23).

- It is shown **only to logged-in vendors** — couples browsing the site and admins never
  see it, so it never gets in a customer's way.
- It closes with an **X** (#9) and stays closed for the rest of that browsing session.
- The wording is "Subscribe here", as requested (#10).

**10. Pop-up after a vendor saves (client item #8)**

Saving a venue, a service, or the business profile now opens the same offer as a centred
pop-up with the Subscribe and Advertise buttons. It appears once per session rather than
on every save, so it prompts without nagging, and closes with the X or the Escape key.

### Verified

- Both rate cards were opened in a browser and checked: pricing renders in blue, the
  subscription page shows exactly three PAY NOW buttons, the advertisement page shows five.
- PAY NOW as a logged-out visitor correctly redirects to the login page and returns the
  visitor to the rate card afterwards.
- The pop-up was confirmed **not** to appear for logged-out visitors.
- No browser errors on any of the pages. No new code errors introduced.

### Needs the client / a live account before launch

| Item | Detail |
|---|---|
| **Stripe keys** | Live payments need `STRIPE_SECRET_KEY` set. Until then PAY NOW will report a payment error. |
| **Vendor-side check** | The pop-up and the after-save pop-up were verified in code but not clicked through with a real vendor login, as there is no test vendor account. Worth a five-minute check once one exists. |

> Pricing was still unconfirmed at this point. It was resolved in Session 3.

### Still outstanding

| # | Item | Notes |
|---|---|---|
| 3 | Booking.com-style photo layout | Plain square grid today. Medium effort. |
| 13 | Page freezes when editing a vendor | Needs to be reproduced before it can be fixed. |

---

## Session 3 — 22 July 2026

A copy of the old soulswed.com was made available locally, which let us replace every
guessed figure with the data the old site itself shipped. **Pricing now comes from the
old site rather than from a reading of a screenshot, and the rate cards cover every
vendor category rather than just hotels.**

> **Where this data came from.** The old site was read at `http://127.0.0.1:5501/` — the
> local copy, not a public URL. There are no live links to give: **soulswed.com currently
> serves a maintenance page**, and amazinghalls.com and soulswed.in do not resolve at all.
> So these figures could not be cross-checked against a running deployment. They are the
> best available source by a wide margin, but the client should still confirm them before
> real money is charged.

### What changed and why

The April document only showed screenshots of the *hotel* rate card, so Session 2 built
one subscription card and one advertising card. Reading the live site showed that is not
how the business actually works:

- There are **five different subscription rate cards**, one per vendor category —
  Venues/Banquet Halls, Photographers, Makeup Artists, Decorators and Wedding Planners.
  Each has its own prices and its own benefits. This matches the client's own note that
  *"for other vendors we have a different rate card."*
- There are **two advertising rate cards** — one for hotels (5 options) and a separate
  one for all other vendors (6 options, including two cheaper inside-page placements
  that hotels do not get).

Both pages now have category tabs, so a vendor sees the card that applies to them.

### Prices corrected

Reading the client's annotated screenshots got the discounted prices right but the
original "was" prices wrong, because their pen marks covered the digits:

| | Previously shown | Correct |
|---|---|---|
| Venues Plus — was | US $ 990 | **US $ 1,950** |
| Venues Luxe — was | US $ 6,930 | **US $ 6,900** |
| Hotel advert 1 — was | US $ 2,499 | **US $ 2,400** |
| Hotel advert 2 — was | US $ 4,899 | **US $ 4,590** |
| Hotel advert 3 — was | US $ 2,065 | **US $ 3,069** |
| Hotel advert 4 — was | US $ 5,995 | **US $ 5,969** |
| Hotel advert 5 — was | US $ 2,045 | **US $ 2,949** |

All discounted prices (the ones customers actually pay) were already correct. Two plan
benefits were also wrong and are now fixed: the free tier gives **15 photos a year**, not
10, and reads *"not visible on first page, **<9% of visitors** visit this section"*.

Every figure now comes from the live site rather than from a reading of a screenshot.

### Contact details resolved

- **WhatsApp: +91 94452 66640** — taken from the live site's own floating WhatsApp
  button. The button is now live on both rate cards.
- **Email:** the live site uses `info@pearlsntiaras.com`. The April to-do list asked for
  `weddings@pearlsntiaras.com`. The live address is used, since it is known to work.
  **Worth one question to the client:** which of the two should it be?

### Verified

- Both pages checked in a browser: category tabs switch correctly and show the right
  prices per category (spot-checked Makeup Artists — US $ 1,249 → US $ 492 + 2 months
  free, matching the live site exactly).
- A character-encoding fault introduced while importing the data was caught and fixed —
  nine plan titles had a corrupted dash. All text now renders cleanly.
- No new code errors.

---

## Open question for the client

Item #2 is marked working, but it filters by **city**, not **country**. The client's actual
request was *"I want to filter country wise, it can show all vendors."*

Vendor records have no country field, and the search box offers a fixed list of 13 cities
(Paris, New York, London, …). True country search is a further piece of work — roughly half
a day — and is not currently on the 23-item list. **Please confirm whether the client still
wants it.**

---

## Known issues (pre-existing, not from this work)

- 34 type errors remain across the project, mostly from the animated-icon migration
  (commit `9e87678`) — icons being passed `fill` and `strokeWidth` settings they don't accept.
  These block a production build and should be cleared before the next release.
- Uploaded files are written to the server's own disk. This works on a normal server but
  will lose files on a serverless host such as Vercel. Worth confirming the hosting plan
  before launch.

---

## Change record

| Date | Area | Files |
|---|---|---|
| 22 Jul 2026 | Image compression + approved sources | `next.config.ts`, `lib/image-hosts.ts`, `components/shared/CustomImage.tsx` |
| 22 Jul 2026 | Upload alerts | `lib/mail.ts`, `app/api/upload/notify/route.ts` |
| 22 Jul 2026 | Review notice, main-image controls | `components/shared/MediaGalleryInput.tsx`, `app/(dashboard)/vendor/dashboard/page.tsx` |
| 22 Jul 2026 | Rate cards + prices (single source of truth) | `lib/config/plans.ts`, `app/(public)/subscribe/page.tsx`, `app/(public)/advertise/page.tsx` |
| 22 Jul 2026 | PAY NOW payments | `app/api/plans/checkout/route.ts`, `components/plans/PayNowButton.tsx`, `components/plans/PlanCheckoutStatus.tsx` |
| 22 Jul 2026 | Subscribe/Advertise pop-ups, contact strip, blue pricing colour | `components/plans/PromoSticker.tsx`, `components/plans/PlanOfferModal.tsx`, `components/plans/PlanContactStrip.tsx`, `app/layout.tsx`, `app/globals.css` |

## Session 4 — 22 July 2026

Verification with a real vendor login, plus the Booking.com layout and demo imagery.

### Confirmed working

Signed in as a vendor and checked each item on screen rather than in code:

- **Sticker (#5, #6, #9, #10, #23)** — appears on every page for a logged-in vendor with
  the client's own wording, both buttons opening the two rate cards, and closes on the X.
  Confirmed it does *not* appear for logged-out visitors, so it never blocks a couple.
- **Review notice (#15)** — shows on both the photo and the video uploader.
- **Main image (#17)** — six orange "Set as Main image" and six yellow "Delete image"
  buttons. Setting a main moves the badge; deleting the main promotes another photo so a
  listing is never left without a cover.
- **Gallery (#3)** — the Booking.com collage now runs against real photographs.

### A defect found only by looking

**"Delete image" was unreadable in dark mode.** The label colour flipped to near-white
while its yellow background stayed put, giving 1.41:1 contrast — effectively invisible in
the vendor dashboard, which renders dark. Now pinned dark: **11.35:1**.

This was invisible in code review and on every light-mode page. It only surfaced by
signing in and inspecting the rendered button.

### Demo imagery

All 26 listings (20 services, 6 venues) had empty galleries and now carry six photographs
each, from Unsplash — licensed for commercial use, unlike image-search results. Every URL
was checked for a valid response and then visually reviewed and sorted by category.

Because these listings carry real hotel names, galleries drawn from the stock pool display
*"Representative images — not photographs of this specific property."* The caption
disappears once a vendor uploads their own.

### Incident: live data was modified

**Local development and the live site share one MongoDB Atlas database.** The vendor
dashboard also saves automatically 1.5 seconds after any edit. Testing the delete and
set-main controls on a real listing therefore wrote to live data.

**The Ritz-Carlton New York, NoMad** lost one gallery photograph and had its cover image
overwritten.

- The gallery was **restored** exactly.
- The cover image could **not** be restored — it pointed at an external address that was
  overwritten with no record of the original. The card displays correctly, but with a
  different photograph. If a backup from before 22 July exists, that field is worth
  checking.

Two lessons, both worth acting on:

1. **There is no separate development database.** Anyone developing locally is working on
   live data. A separate database for development should be a priority.
2. Testing that writes must use a throwaway listing, never a real one.

### Still outstanding

| # | Item | Why |
|---|---|---|
| 8 | Pop-up after Save | Needs a save; a save writes to live data |
| 14 | Upload alert email | Needs an upload; same reason |
| 13 | Vendor edit freeze | Not started — but see the lead below |

**A lead on #13.** The vendor edit form saves automatically 1.5 seconds after *any* change,
so every keystroke schedules a full save to the server. On an editor this large, with this
vendor's 25 listings, that is a strong candidate for the freezing the client reported. This
is the first concrete explanation we have for that complaint.

### Also outstanding, and more urgent than the April list

**Vendor uploads are broken in production.** The site runs on Vercel, whose filesystem
cannot be written to, but uploads are saved to local disk. Uploading needs to move to
proper file storage. This affects real vendors today.
