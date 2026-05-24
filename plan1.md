# Plan 1 — Venues Listing & Detail Pages

## Goal
When a user clicks **Venues** in the navbar (→ `/venues`), they land on a full category listing page styled like WedMeGood's venue browser but in the SoulsWed theme. Clicking any venue card opens a rich detail page at `/venues/[id]`.

---

## Routes

| Route | File | Description |
|---|---|---|
| `/venues` | `app/venues/page.tsx` | Listing / browse page |
| `/venues/[id]` | `app/venues/[id]/page.tsx` | Individual venue detail |

---

## Page 1 — `/venues` (Listing)

### Sections (top → bottom)
1. **Page Hero** — full-width peach banner, "Wedding Venues" heading, subtitle, search bar
2. **Filter Bar** — sticky horizontal pill filters: Guest Count · Price Range · Venue Type · City · Space · Features
3. **City Bubbles** — horizontally scrollable row of circular city thumbnails (Delhi NCR, Mumbai, Bangalore, Goa, Jaipur, Kerala, Udaipur, Chennai)
4. **Results Header** — "Showing X venues" + Sort dropdown (Recommended / Price Low→High / Rating)
5. **Venue Grid** — responsive: 3-col desktop / 2-col tablet / 1-col mobile
6. **Load More** — button at bottom

### Venue Grid Card
- Aspect-ratio 4:3 image, `rounded-2xl`, hover lift `-translate-y-1`
- **"Featured" badge** top-left (sw-orange bg, white text, rounded-full)
- Heart/wishlist icon top-right
- Venue name (Cormorant, bold, 18px)
- Location (MapPin icon + city string)
- Rating stars + score + review count (hidden if rating = 0)
- Price (₹X per plate **or** per day)
- Guest range + room count tag chips
- "View Details →" link

---

## Page 2 — `/venues/[id]` (Detail)

### Layout — two-column on desktop (main + sidebar), stacked on mobile

#### Main Column
1. **Hero** — full-bleed image 500px tall, venue name overlaid bottom-left with frosted glass chip
2. **Photo Gallery** — 3-col grid: first photo spans 2 rows (large), rest fill right column; "View all photos" button
3. **About** — venue description paragraph
4. **Key Features** — icon grid: max guests, rooms, outdoor/indoor, parking, catering
5. **Pricing Table** — Veg per plate · Non-veg per plate · Rental Cost rows
6. **Reviews** — overall score + rating breakdown bars (5★→1★) + individual review cards (avatar, name, date, text)
7. **FAQ** — accordion with 4–5 common venue questions
8. **Similar Venues** — horizontal scroll row using same card style as FeaturedVenues on homepage

#### Sidebar (sticky on desktop)
- Price summary: "from ₹X per plate"
- **"Check Availability & Prices"** — full-width sw-orange button
- **"Make Enquiry"** — full-width sw-navy outlined button
- Quick facts: capacity, rooms, city, venue type

---

## Files to Create

```
app/
  venues/
    page.tsx                  ← listing page
    [id]/
      page.tsx                ← detail page

components/
  venues/
    VenueCard.tsx             ← reusable grid card
    VenueFilterBar.tsx        ← filter pills + city bubbles
    VenueHero.tsx             ← detail hero image + overlay
    VenueGallery.tsx          ← photo grid
    VenueSidebar.tsx          ← sticky CTA + price sidebar
    VenueReviews.tsx          ← rating bars + review cards
    SimilarVenues.tsx         ← bottom scroll row

lib/
  venues-data.ts              ← static venue data (extends existing 6 venues + 3 Indian)
```

---

## Venue Data (9 venues total)

Extend the existing 6 from FeaturedVenues, add 3 Indian venues:
- **YAAN Udaipur** — Eklingji, Udaipur | ₹2,200/plate | 50–1200 pax | 4★ Hotel
- **The Leela Ashtamudi** — Trivandrum, Kerala | ₹1,800/plate | 80–600 pax
- **The Royal Palms** — Chennai | ₹2,50,000 rental | 500–700 pax

---

## Styling Rules
| Element | Style |
|---|---|
| Page background | `var(--sw-white)` |
| Section accent bg | `var(--sw-peach)` |
| Primary CTA | `var(--sw-orange)` + white text |
| Secondary CTA | outlined `var(--sw-navy)` |
| Card radius | `rounded-[24px]` |
| Card hover | `hover:-translate-y-1 hover:shadow-lg` |
| Headings | Cormorant Garamond (`var(--font-heading)`) |
| Body | Plus Jakarta Sans |
| "Featured" badge | `bg-[var(--sw-orange)] text-white rounded-full text-xs font-bold px-3 py-1` |
| Filter pills | active: sw-navy bg + white text · inactive: white bg + sw-navy text |

---

## Implementation Order
1. `lib/venues-data.ts` — data layer
2. `components/venues/VenueCard.tsx` — shared card
3. `components/venues/VenueFilterBar.tsx` — filters + city bubbles
4. `app/venues/page.tsx` — listing page
5. `components/venues/VenueHero.tsx` + `VenueGallery.tsx` + `VenueSidebar.tsx` + `VenueReviews.tsx` + `SimilarVenues.tsx`
6. `app/venues/[id]/page.tsx` — detail page
7. Verify nav link `/venues` is correct (already set in Navbar.tsx)
