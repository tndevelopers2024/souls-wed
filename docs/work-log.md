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
| ✅ Delivered so far | **13** | 1, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 17, 23 |
| Still to build | **2** | 3, 13 |
| Already working | 3 | 2, 16, 19 |
| No longer applies (old UI removed) | 2 | 4, 21 |
| Not this website | 3 | 18, 20, 22 |

**20 of the 23 items are now closed.** The two still outstanding are the
Booking.com-style photo layout (#3) and the vendor-edit freeze (#13).

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
| **Confirm all prices** | Every figure was transcribed from the April screenshots, where the client's own pen marks covered several digits. All prices are collected in one file (`lib/config/plans.ts`) and each is marked `NEEDS CONFIRMATION`. **These must be checked against the real rate card before going live.** |
| **WhatsApp number** | The number in the screenshot was too blurred to read. The WhatsApp button stays hidden until the number is supplied — the email addresses show either way. No number was guessed. |
| **Stripe keys** | Live payments need `STRIPE_SECRET_KEY` set. Until then PAY NOW will report a payment error. |
| **Vendor-side check** | The pop-up and the after-save pop-up were verified in code but not clicked through with a real vendor login, as there is no test vendor account. Worth a five-minute check once one exists. |

### Still outstanding

| # | Item | Notes |
|---|---|---|
| 3 | Booking.com-style photo layout | Plain square grid today. Medium effort. |
| 13 | Page freezes when editing a vendor | Needs to be reproduced before it can be fixed. |

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
