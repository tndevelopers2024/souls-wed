/**
 * Fills empty galleries on demo listings with category-appropriate stock photos.
 *
 *   node scripts/seed-demo-galleries.mjs          # dry run, prints what it would do
 *   node scripts/seed-demo-galleries.mjs --write  # actually writes
 *
 * These are Unsplash images licensed for commercial use. They are REPRESENTATIVE
 * ONLY — the gallery labels them as such — and must be replaced by each vendor's
 * own photographs before launch. Never let a stock photo stand in for a real
 * named property without that label.
 *
 * Existing non-empty galleries are left untouched.
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { DEMO_IMAGE_POOLS } from "../lib/config/demo-images.ts";

const PHOTOS_PER_LISTING = 6;

function loadEnv() {
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* .env is optional if the vars are already exported */
  }
}

/** Rotate through the pool so each listing gets a different combination. */
function galleryFor(pool, listingIndex) {
  const out = [];
  for (let i = 0; i < PHOTOS_PER_LISTING; i++) {
    out.push(pool[(listingIndex * PHOTOS_PER_LISTING + i) % pool.length]);
  }
  return [...new Set(out)];
}

const write = process.argv.includes("--write");
loadEnv();

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

let planned = 0;

// ── Service listings, grouped by category ──
const services = await db.collection("servicelistings").find({}).toArray();
const byCategory = {};
for (const s of services) (byCategory[s.category] ??= []).push(s);

for (const [category, listings] of Object.entries(byCategory)) {
  const pool = DEMO_IMAGE_POOLS[category];
  if (!pool) {
    console.warn(`  ! no image pool for category "${category}" — skipped`);
    continue;
  }
  let i = -1;
  for (const listing of listings) {
    i++;
    if (Array.isArray(listing.gallery) && listing.gallery.length > 0) continue;
    const gallery = galleryFor(pool, i);
    planned++;
    console.log(`  ${category.padEnd(11)} ${String(listing.name).slice(0, 34).padEnd(36)} +${gallery.length}`);
    if (write) {
      await db.collection("servicelistings").updateOne({ _id: listing._id }, { $set: { gallery } });
    }
  }
}

// ── Venues use the venues pool ──
const venues = await db.collection("venues").find({}).toArray();
let vi = -1;
for (const venue of venues) {
  vi++;
  if (Array.isArray(venue.gallery) && venue.gallery.length > 0) continue;
  const gallery = galleryFor(DEMO_IMAGE_POOLS.venues, vi);
  planned++;
  console.log(`  ${"venues".padEnd(11)} ${String(venue.name).slice(0, 34).padEnd(36)} +${gallery.length}`);
  if (write) {
    await db.collection("venues").updateOne({ _id: venue._id }, { $set: { gallery } });
  }
}

console.log(`\n${write ? "Updated" : "Would update"} ${planned} listings.`);
if (!write) console.log("Dry run — re-run with --write to apply.");

await mongoose.disconnect();
