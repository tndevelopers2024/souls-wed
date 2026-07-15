/**
 * fix-all-images.ts
 * Run: MONGODB_URI=$(grep MONGODB_URI .env | cut -d= -f2-) npx tsx scripts/fix-all-images.ts
 *
 * Adds real, high-quality Unsplash images to every venue and service listing.
 */

import { connectDB } from "../lib/mongodb";
import { Venue } from "../lib/models/Venue";
import { ServiceListing } from "../lib/models/ServiceListing";

// ─── VENUE IMAGES ─────────────────────────────────────────────────────────────
const venueImages: Record<string, string> = {
  "The Grand Palace Banquet":  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85",
  "Royal Orchid Resort":       "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=85",
  "Leela Palace Jaipur":       "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=900&q=85",
  "Taj Falaknuma Palace":      "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?w=900&q=85",
  "The Oberoi Udaivilas":      "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=900&q=85",
  "ITC Grand Chola":           "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=900&q=85",
  "The Westin Goa":            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=85",
};

// ─── SERVICE IMAGES by name ───────────────────────────────────────────────────
const serviceImages: Record<string, string> = {
  // ROOMS
  "The Ritz-Carlton Suites":       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85",
  "Taj West End Heritage Rooms":   "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=85",
  "ITC Mughal Royal Suites":       "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=85",
  "Umaid Bhawan Palace Rooms":     "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85",
  "The Leela Kovalam Villas":      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=900&q=85",
  "Wildflower Hall Shimla":        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=85",
  "Alila Fort Bishangarh":         "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=85",

  // PLANNERS
  "Shaadi Squad Events":           "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85",
  "WeddingNama Studios":           "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
  "The Wedding Company":           "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
  "Aaradhya Occasions":            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=85",
  "Meraki Wedding Planners":       "https://images.unsplash.com/photo-1532117182044-031e7cd916ee?w=900&q=85",
  "Ritz Weddings":                 "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&q=85",
  "Celestial Celebrations":        "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=900&q=85",

  // CATERERS
  "Royal Feast Caterers":          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85",
  "Saffron Grand Catering":        "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=85",
  "The Food Studio":               "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=85",
  "Rajwada Khana Catering":        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85",
  "Coastal Flavours Catering":     "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=85",
  "Zaika E Nawab":                 "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&q=85",
  "Madras Kitchen Co.":            "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=900&q=85",

  // DECORATORS
  "Enchanted Florals":             "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
  "Petal & Prism Decor":           "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85",
  "Dreamscape Weddings":           "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=85",
  "Marigold Mandap Studio":        "https://images.unsplash.com/photo-1600428863823-94a7cbc19e4e?w=900&q=85",
  "Seascape Decor Goa":            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85",
  "Noor Decor House":              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=85",
  "Kalpana Events Decor":          "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=85",

  // PHOTOGRAPHERS
  "The Wedding Film Co.":          "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85",
  "Frozen Moments Studio":         "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&q=85",
  "Infinite Frames":               "https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=900&q=85",
  "Royal Clicks Photography":      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
  "Sun & Sea Visuals":             "https://images.unsplash.com/photo-1562530940-9fa2b06f0553?w=900&q=85",
  "Shutter & Story Co.":           "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=85",
  "Lumos Wedding Films":           "https://images.unsplash.com/photo-1615553612093-56dfe7d49b31?w=900&q=85",

  // MAKEUP ARTISTS
  "Reena Kohli Artistry":          "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=900&q=85",
  "Blush & Bloom Studio":          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
  "The Glam Room":                 "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=85",
  "Sona Bridal Studio":            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85",
  "Goa Glam Artists":              "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=85",
  "Noor Bridal Artistry":          "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=900&q=85",
  "Meera's Bridal Lounge":         "https://images.unsplash.com/photo-1583241800698-e8ab01830a44?w=900&q=85",

  // SAKHI SERVICE
  "Sakhi Squad Mumbai":            "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=900&q=85",
  "Royal Sakhi Delhi":             "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=85",
  "Bangalore Bride Buddies":       "https://images.unsplash.com/photo-1511405889574-b32a7ab6b16e?w=900&q=85",
  "Pink City Sakhi Services":      "https://images.unsplash.com/photo-1537204696486-967f1b7be02c?w=900&q=85",
  "Goa Bride Companions":          "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=900&q=85",
  "Hyderabad Sakhi House":         "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
  "Chennai Bride Squad":           "https://images.unsplash.com/photo-1464582883107-8adf2dca8a9f?w=900&q=85",
};

// ─────────────────────────────────────────────────────────────────────────────

async function fixAllImages() {
  await connectDB();
  console.log("Connected to MongoDB.\n");

  // ── Update Venues ─────────────────────────────────────────────────────────
  console.log("=== VENUES ===");
  const allVenues = await Venue.find({}).lean() as any[];
  let venueCount = 0;

  for (const venue of allVenues) {
    const img = venueImages[venue.name];
    if (img) {
      await Venue.findByIdAndUpdate(venue._id, {
        $set: { image: img, updatedAt: new Date() },
      });
      console.log(`  ✅ ${venue.name}`);
      venueCount++;
    } else {
      console.log(`  ⚠️  No image mapping for: ${venue.name}`);
    }
  }

  // ── Update Service Listings ───────────────────────────────────────────────
  console.log("\n=== SERVICES ===");
  const allServices = await ServiceListing.find({}).lean() as any[];
  let serviceCount = 0;

  for (const service of allServices) {
    const img = serviceImages[service.name];
    if (img) {
      await ServiceListing.findByIdAndUpdate(service._id, {
        $set: { image: img, updatedAt: new Date() },
      });
      console.log(`  ✅ [${service.category}] ${service.name}`);
      serviceCount++;
    } else {
      console.log(`  ⚠️  No image mapping for: ${service.name} (${service.category})`);
    }
  }

  console.log(`\n✨ Done! Updated ${venueCount} venue(s) and ${serviceCount} service(s) with real images.`);
  process.exit(0);
}

fixAllImages().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
