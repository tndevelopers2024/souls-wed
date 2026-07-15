/**
 * fix-venue-names.ts
 * Run with: npx ts-node -e "require('./scripts/fix-venue-names.ts')"
 * Or: npx tsx scripts/fix-venue-names.ts
 *
 * Finds all venues whose name matches "Luxury Venue *" and updates them
 * with real names, real locations, and correct meta-data.
 */

import { connectDB } from "../lib/mongodb";
import { Venue } from "../lib/models/Venue";

const realVenues = [
  {
    matchPattern: /Luxury Venue 1/i,
    updates: {
      name: "The Grand Palace Banquet",
      location: "South Mumbai, Maharashtra",
      city: "Mumbai",
      type: "Banquet Hall",
      description:
        "A majestic banquet hall with opulent interiors, crystal chandeliers, and world-class catering – perfect for royal wedding celebrations.",
    },
  },
  {
    matchPattern: /Luxury Venue 2/i,
    updates: {
      name: "Royal Orchid Resort",
      location: "MG Road, Bengaluru",
      city: "Bengaluru",
      type: "Resort",
      description:
        "A premium garden resort blending contemporary luxury with lush green landscapes. Ideal for intimate and grand weddings alike.",
    },
  },
  {
    matchPattern: /Luxury Venue 3/i,
    updates: {
      name: "Leela Palace Jaipur",
      location: "Amber Road, Jaipur",
      city: "Jaipur",
      type: "Palace",
      description:
        "Set amidst the Pink City's heritage, this palatial venue offers Rajasthani grandeur, courtyards, and sumptuous banquet halls.",
    },
  },
  {
    matchPattern: /Luxury Venue 4/i,
    updates: {
      name: "Taj Falaknuma Palace",
      location: "Engine Bowli, Hyderabad",
      city: "Hyderabad",
      type: "Heritage Hotel",
      description:
        "An iconic palace hotel perched on a hill offering breathtaking views and unmatched regal elegance for destination weddings.",
    },
  },
  {
    matchPattern: /Luxury Venue 5/i,
    updates: {
      name: "The Oberoi Udaivilas",
      location: "Haribhau Upadhyay Nagar, Udaipur",
      city: "Udaipur",
      type: "Destination Venue",
      description:
        "Nestled on the banks of Lake Pichola, this iconic destination venue offers a magical lakeside setting for your dream wedding.",
    },
  },
  {
    matchPattern: /Luxury Venue 6/i,
    updates: {
      name: "ITC Grand Chola",
      location: "Mount Road, Chennai",
      city: "Chennai",
      type: "Convention Center",
      description:
        "One of South India's grandest venues, inspired by the Chola dynasty, with pillarless ballrooms and luxurious banquet spaces.",
    },
  },
  {
    matchPattern: /Luxury Venue 7/i,
    updates: {
      name: "The Westin Goa",
      location: "Vagator Road, North Goa",
      city: "Goa",
      type: "Beach Resort",
      description:
        "A stunning beachside resort offering open-air mandaps, sunrise ceremonies, and exclusive beach wedding packages.",
    },
  },
  {
    matchPattern: /Luxury Venue 8/i,
    updates: {
      name: "Park Hyatt Goa Resort",
      location: "Arossim Beach, South Goa",
      city: "Goa",
      type: "Beach Resort",
      description:
        "A spectacular colonial-inspired resort with private beach access, lush gardens, and bespoke wedding services.",
    },
  },
];

async function fixVenueNames() {
  await connectDB();
  console.log("Connected to MongoDB. Fetching all venues...");

  const allVenues = await Venue.find({});
  console.log(`Found ${allVenues.length} venues in database.`);

  let updated = 0;

  for (const venue of allVenues) {
    const match = realVenues.find((r) => r.matchPattern.test(venue.name));
    if (match) {
      await Venue.findByIdAndUpdate(venue._id, {
        $set: {
          ...match.updates,
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Updated: "${venue.name}" → "${match.updates.name}"`);
      updated++;
    }
  }

  if (updated === 0) {
    console.log('ℹ️  No "Luxury Venue" placeholder records found. Database may already be clean.');
  } else {
    console.log(`\n✨ Done! Updated ${updated} venue(s).`);
  }

  process.exit(0);
}

fixVenueNames().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
