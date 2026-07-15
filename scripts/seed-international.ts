/**
 * seed-international.ts
 * Adds 7 international listings for each of 5 categories:
 * Venues, Rooms, Planners, Caterers, Decorators
 *
 * Run: MONGODB_URI=$(grep MONGODB_URI .env | cut -d= -f2-) npx tsx scripts/seed-international.ts
 *
 * All prices stored in INR equivalent (site auto-converts to AED/USD/etc.)
 */

import { connectDB } from "../lib/mongodb";
import { Venue } from "../lib/models/Venue";
import { ServiceListing } from "../lib/models/ServiceListing";

const VENDOR_ID = "international-vendor";

// ─── VENUES (7 international) ─────────────────────────────────────────────────
const internationalVenues = [
  {
    name: "Burj Al Arab Terrace",
    city: "Dubai", country: "UAE", location: "Jumeirah Beach Road, Dubai",
    type: "Luxury Hotel", price: "1500000", priceUnit: "per day",
    pricePerPlateVeg: "18000", pricePerPlateNonVeg: "25000",
    minGuests: 50, maxGuests: 800, rooms: 202,
    outdoor: true, indoor: true, parking: true, catering: true,
    rating: 4.9, reviewCount: 312, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=85",
    description: "The world's most iconic sail-shaped hotel offers an exclusive private beach terrace for dream destination weddings with panoramic Arabian Gulf views.",
    features: ["Private Beach", "Helipad Arrival", "Butler Service", "Michelin Chef", "Fireworks Package"],
  },
  {
    name: "Château de Vaux-le-Vicomte",
    city: "Paris", country: "France", location: "Maincy, Île-de-France",
    type: "Historic Château", price: "1200000", priceUnit: "per day",
    pricePerPlateVeg: "15000", pricePerPlateNonVeg: "22000",
    minGuests: 30, maxGuests: 500, rooms: 45,
    outdoor: true, indoor: true, parking: true, catering: true,
    rating: 4.9, reviewCount: 189, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85",
    description: "A stunning 17th-century French château surrounded by formal gardens, fountains, and candlelit salons — the most romantic wedding venue in Europe.",
    features: ["Formal French Gardens", "Candlelit Ballroom", "Vintage Wine Cellar", "Horse Carriage", "Evening Fireworks"],
  },
  {
    name: "The Bali Cliff Resort",
    city: "Bali", country: "Indonesia", location: "Uluwatu, Bali",
    type: "Cliff Resort", price: "350000", priceUnit: "per day",
    pricePerPlateVeg: "6000", pricePerPlateNonVeg: "9000",
    minGuests: 20, maxGuests: 300, rooms: 70,
    outdoor: true, indoor: false, parking: true, catering: true,
    rating: 4.8, reviewCount: 421, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=85",
    description: "Perched on dramatic Uluwatu cliffs above the Indian Ocean, this tropical paradise venue offers sunset ceremonies with traditional Kecak fire dancers.",
    features: ["Ocean Cliff Views", "Infinity Pool", "Balinese Ceremony", "Fire Dancers", "Jungle Spa"],
  },
  {
    name: "The Savoy Royal Suite",
    city: "London", country: "UK", location: "The Strand, London",
    type: "Heritage Hotel", price: "900000", priceUnit: "per day",
    pricePerPlateVeg: "12000", pricePerPlateNonVeg: "18000",
    minGuests: 30, maxGuests: 350, rooms: 268,
    outdoor: false, indoor: true, parking: true, catering: true,
    rating: 4.8, reviewCount: 254, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=85",
    description: "London's most legendary hotel offers grand Edwardian ballrooms, the famous Savoy River Restaurant terrace, and unmatched Thames River ceremony views.",
    features: ["Thames River Views", "Art Deco Ballroom", "Rolls Royce Transfer", "Royal Bridal Suite", "Personal Butler"],
  },
  {
    name: "Four Seasons Maldives",
    city: "Malé", country: "Maldives", location: "Kuda Huraa, North Malé Atoll",
    type: "Overwater Resort", price: "2000000", priceUnit: "per day",
    pricePerPlateVeg: "22000", pricePerPlateNonVeg: "30000",
    minGuests: 10, maxGuests: 150, rooms: 106,
    outdoor: true, indoor: true, parking: false, catering: true,
    rating: 5.0, reviewCount: 178, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=900&q=85",
    description: "Say your vows over crystal-clear turquoise lagoons in overwater villas. The most exclusive barefoot luxury wedding destination in the world.",
    features: ["Overwater Bungalows", "Coral Reef Ceremony", "Seaplane Transfer", "Private Beach Dinner", "Underwater Room"],
  },
  {
    name: "Marina Bay Sands SkyPark",
    city: "Singapore", country: "Singapore", location: "10 Bayfront Ave, Singapore",
    type: "Sky Venue", price: "800000", priceUnit: "per day",
    pricePerPlateVeg: "10000", pricePerPlateNonVeg: "15000",
    minGuests: 50, maxGuests: 600, rooms: 2561,
    outdoor: true, indoor: true, parking: true, catering: true,
    rating: 4.7, reviewCount: 367, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=85",
    description: "Celebrate your union 57 floors above Singapore with 360° skyline views, the iconic infinity pool backdrop, and Asia's most spectacular wedding setting.",
    features: ["Infinity Sky Pool", "360° City Views", "Celebrity Chef Dining", "Light & Sound Show", "Yacht Arrival"],
  },
  {
    name: "Santorini Oia Cliffside Villa",
    city: "Santorini", country: "Greece", location: "Oia, Santorini Island",
    type: "Cliffside Villa", price: "650000", priceUnit: "per day",
    pricePerPlateVeg: "8000", pricePerPlateNonVeg: "12000",
    minGuests: 10, maxGuests: 120, rooms: 15,
    outdoor: true, indoor: true, parking: false, catering: true,
    rating: 4.9, reviewCount: 302, verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=85",
    description: "The iconic whitewashed village of Oia provides the most photographed wedding backdrop on Earth — Aegean Sea sunsets, blue-domed churches, and volcanic caldera views.",
    features: ["Caldera Views", "Aegean Sunset Ceremony", "Wine Tasting", "Catamaran Cruise", "Traditional Greek Feast"],
  },
];

// ─── ROOMS (7 international) ──────────────────────────────────────────────────
const internationalRooms = [
  { name: "Atlantis Royal Sky Suite", city: "Dubai", country: "UAE", location: "Palm Jumeirah, Dubai", priceFrom: 120000, priceUnit: "per night", rating: 4.9, reviewCount: 198, image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=85", description: "The most spectacular suite on Palm Jumeirah with floor-to-ceiling ocean views, private infinity pool, and 24-hour butler service for royal honeymoon experiences.", features: ["Private Infinity Pool", "Butler Service", "Aquaventure Access", "Limousine Transfer"] },
  { name: "Le Bristol Honeymoon Suite", city: "Paris", country: "France", location: "8th Arrondissement, Paris", priceFrom: 95000, priceUnit: "per night", rating: 4.8, reviewCount: 143, image: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=900&q=85", description: "Nestled near the Champs-Élysées, this palatial suite offers Louis XVI décor, a private terrace with Eiffel Tower views, and the finest French hospitality.", features: ["Eiffel Tower View", "Private Terrace", "In-Suite Spa", "Champagne Welcome"] },
  { name: "COMO Uma Ubud Jungle Villa", city: "Bali", country: "Indonesia", location: "Ubud, Bali", priceFrom: 55000, priceUnit: "per night", rating: 4.8, reviewCount: 287, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=85", description: "A private jungle villa carved into Bali's lush Ayung River valley with private plunge pool, open-air living spaces, and daily spa treatments amid birdsong.", features: ["Plunge Pool", "Jungle Views", "Open-Air Bedroom", "Daily Spa Treatment"] },
  { name: "The Connaught Penthouse", city: "London", country: "UK", location: "Mayfair, London", priceFrom: 85000, priceUnit: "per night", rating: 4.8, reviewCount: 112, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=85", description: "Mayfair's most prestigious address offers a full-floor penthouse with wraparound terraces, private chef service, and handpicked Hepworth artwork collections.", features: ["Wraparound Terrace", "Private Chef", "Bespoke Turndown", "Bentley Chauffeured"] },
  { name: "Gili Lankanfushi Crusoe Residence", city: "Malé", country: "Maldives", location: "North Malé Atoll, Maldives", priceFrom: 180000, priceUnit: "per night", rating: 5.0, reviewCount: 89, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=85", description: "The world's most remote overwater villa — entirely surrounded by turquoise lagoon with no phone, no shoes, no news — just pure paradise for newlyweds.", features: ["Private Lagoon", "Personal Friday Butler", "Snorkel Garden", "Sundeck Pavilion"] },
  { name: "Raffles Presidential Suite", city: "Singapore", country: "Singapore", location: "1 Beach Road, Singapore", priceFrom: 75000, priceUnit: "per night", rating: 4.9, reviewCount: 156, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&q=85", description: "The legendary colonial suite that once hosted Rudyard Kipling now offers couples a romantic heritage experience with teak floors, tropical palms, and butler suites.", features: ["Colonial Heritage", "Private Garden", "Singapore Sling Lounge", "Personalized Butler"] },
  { name: "Canaves Oia Suites", city: "Santorini", country: "Greece", location: "Oia, Santorini", priceFrom: 70000, priceUnit: "per night", rating: 4.9, reviewCount: 234, image: "https://images.unsplash.com/photo-1586861203927-800a5acddfbe?w=900&q=85", description: "Carved into the volcanic caldera cliffs, these cave suites offer private jacuzzis, outdoor plunge pools, and front-row seats to the world's most photographed sunset.", features: ["Caldera View", "Private Jacuzzi", "Cave Pool", "Sunrise Breakfast"] },
];

// ─── PLANNERS (7 international) ───────────────────────────────────────────────
const internationalPlanners = [
  { name: "Arabia Weddings Dubai", city: "Dubai", country: "UAE", location: "DIFC, Dubai", priceFrom: 500000, priceUnit: "per event", rating: 4.9, reviewCount: 189, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=85", description: "The Middle East's most celebrated luxury wedding planning agency — orchestrating royal celebrations from desert camps to Burj Khalifa rooftop ceremonies.", features: ["Desert Ceremony", "Burj View Events", "Luxury Transport Fleet", "Celebrity Entertainment"] },
  { name: "Mon Beau Mariage Paris", city: "Paris", country: "France", location: "Le Marais, Paris", priceFrom: 450000, priceUnit: "per event", rating: 4.8, reviewCount: 134, image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85", description: "Paris's most exclusive wedding atelier specialising in château weddings, Seine River receptions, and fairytale Parisian elopements with haute couture styling.", features: ["Château Bookings", "Seine Cruise Reception", "French Couturier", "Flowers by Moulié"] },
  { name: "Bali Bliss Weddings", city: "Bali", country: "Indonesia", location: "Seminyak, Bali", priceFrom: 180000, priceUnit: "per event", rating: 4.8, reviewCount: 312, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85", description: "Bali's leading destination wedding planners creating magical cliff-top, temple, jungle, and beach ceremonies with authentic Balinese rituals and tropical luxury.", features: ["Temple Blessing", "Cliff-Top Ceremony", "Traditional Barong Dance", "Flower Petal Aisle"] },
  { name: "The Perfect Day London", city: "London", country: "UK", location: "Chelsea, London", priceFrom: 400000, priceUnit: "per event", rating: 4.8, reviewCount: 167, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85", description: "London's premier boutique wedding planners crafting intimate English garden parties, historic manor ceremonies, and elegant London landmark celebrations.", features: ["English Garden Party", "Historic Venue Access", "Floral Design", "Royal Barge Option"] },
  { name: "Island Dream Weddings", city: "Malé", country: "Maldives", location: "South Malé Atoll, Maldives", priceFrom: 650000, priceUnit: "per event", rating: 4.9, reviewCount: 87, image: "https://images.unsplash.com/photo-1532117182044-031e7cd916ee?w=900&q=85", description: "Maldives' only LGBTQ+ inclusive luxury wedding planners delivering barefoot ceremony packages on private islands with submarine dining and bioluminescent beach finales.", features: ["Private Island", "Underwater Dinner", "Bioluminescent Beach", "Seaplane Ceremony"] },
  { name: "Stellar Events Singapore", city: "Singapore", country: "Singapore", location: "Orchard Road, Singapore", priceFrom: 350000, priceUnit: "per event", rating: 4.7, reviewCount: 221, image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&q=85", description: "Asia's most awarded event management company, known for tech-forward wedding productions with drone shows, holographic backdrops, and MBS SkyPark ceremonies.", features: ["Drone Show", "Holographic Backdrop", "LED Production", "Celebrity DJ"] },
  { name: "Aegean Love Santorini", city: "Santorini", country: "Greece", location: "Fira, Santorini", priceFrom: 300000, priceUnit: "per event", rating: 4.9, reviewCount: 198, image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=900&q=85", description: "Greece's most romantic destination wedding planners crafting intimate Aegean ceremonies in ancient chapels, volcanic cliffs, and exclusive caldera-view villas.", features: ["Ancient Chapel Access", "Catamaran Party", "Greek Feast", "Sunset Photography Session"] },
];

// ─── CATERERS (7 international) ───────────────────────────────────────────────
const internationalCaterers = [
  { name: "Zuma International Catering", city: "Dubai", country: "UAE", location: "Gate Village, DIFC Dubai", priceFrom: 12000, priceUnit: "per plate", rating: 4.9, reviewCount: 143, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85", description: "World-class Japanese-inspired modern cuisine for high-profile Dubai weddings — from wagyu sashimi platters to live teppanyaki stations and premium sake bars.", features: ["Wagyu & Truffle Menu", "Live Teppanyaki", "Sake Bar", "Sushi Master"] },
  { name: "La Grande Bouffe Paris", city: "Paris", country: "France", location: "Saint-Germain-des-Prés, Paris", priceFrom: 15000, priceUnit: "per plate", rating: 4.8, reviewCount: 112, image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=85", description: "Paris's most sought-after wedding catering maison offering classic French haute cuisine — from foie gras amuse-bouche to macaron towers by Paul Bocuse-trained chefs.", features: ["Michelin Chef", "French Wine Sommelier", "Macaron Tower", "Cheese Trolley"] },
  { name: "Bumbu Bali Catering", city: "Bali", country: "Indonesia", location: "Jimbaran, Bali", priceFrom: 5000, priceUnit: "per plate", rating: 4.8, reviewCount: 276, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85", description: "Authentic Balinese wedding feasts featuring ceremonial babi guling, rijsttafel spreads, and open-fire satay stations with tropical fruit carving artistry.", features: ["Babi Guling Feast", "Rijsttafel Spread", "Fruit Carving", "Traditional Gamelan Band"] },
  { name: "Bespoke By Roux", city: "London", country: "UK", location: "Piccadilly, London", priceFrom: 14000, priceUnit: "per plate", rating: 4.8, reviewCount: 98, image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=85", description: "The Roux Brothers' exclusive wedding catering division delivering three-Michelin-star calibre menus to English country estates, London townhouses, and castle venues.", features: ["3-Star Quality", "Artisan Cheese", "Champagne Towers", "English High Tea"] },
  { name: "Under the Stars Maldives", city: "Malé", country: "Maldives", location: "Hulhumalé, Maldives", priceFrom: 25000, priceUnit: "per plate", rating: 5.0, reviewCount: 54, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&q=85", description: "The Maldives' most exclusive private dining experience — gourmet seafood caught that morning, served on your own private sandbank under a million stars.", features: ["Private Sandbank", "Fresh Seafood", "Stargazing Setup", "Floating Breakfast"] },
  { name: "Pollen Restaurant Catering", city: "Singapore", country: "Singapore", location: "Gardens by the Bay, Singapore", priceFrom: 8500, priceUnit: "per plate", rating: 4.7, reviewCount: 187, image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=900&q=85", description: "Stunning multi-cuisine catering from Gardens by the Bay's exclusive Pollen restaurant — farm-to-table menus with Mediterranean, Asian fusion, and floral-inspired confections.", features: ["Farm to Table", "Flower Dome Backdrop", "Dessert Garden", "Cocktail Mixologist"] },
  { name: "Selene Santorini Catering", city: "Santorini", country: "Greece", location: "Pyrgos, Santorini", priceFrom: 10000, priceUnit: "per plate", rating: 4.9, reviewCount: 165, image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=85", description: "Santorini's most acclaimed caterer serving authentic Greek-Mediterranean wedding feasts with fresh Aegean seafood, volcano wines, and traditional honey-walnut desserts.", features: ["Volcano Wine", "Aegean Seafood", "Greek Meze Feast", "Baklava & Loukoumades"] },
];

// ─── DECORATORS (7 international) ─────────────────────────────────────────────
const internationalDecorators = [
  { name: "Luxe Events Dubai", city: "Dubai", country: "UAE", location: "Sheikh Zayed Road, Dubai", priceFrom: 800000, priceUnit: "per event", rating: 4.9, reviewCount: 156, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=85", description: "Dubai's most opulent wedding decorators producing gold-leaf installations, Swarovski crystal mandaps, and infinity-mirror walkways for ultra-luxury desert celebrations.", features: ["Gold Leaf Ceiling", "Swarovski Crystals", "Infinity Mirror Aisle", "Custom Monogram Lights"] },
  { name: "Maison des Fleurs Paris", city: "Paris", country: "France", location: "Palais Royal, Paris", priceFrom: 600000, priceUnit: "per event", rating: 4.8, reviewCount: 123, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85", description: "Paris's most celebrated floral design house — purveyors of full château gardens, cascading peonies and roses, and candlelit table arrangements for the world's elite.", features: ["Full Château Florals", "Cascading Peony Wall", "Candlelit Aisles", "Bespoke Scent Design"] },
  { name: "Tropical Luxe Bali", city: "Bali", country: "Indonesia", location: "Canggu, Bali", priceFrom: 150000, priceUnit: "per event", rating: 4.8, reviewCount: 298, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85", description: "Bali's most Instagrammed decorators creating tropical boho-luxury setups — floating flower installations, bamboo altars, frangipani-draped arches, and lantern-lit jungles.", features: ["Floating Flower Pool", "Bamboo Altar", "Frangipani Arch", "Lantern Forest"] },
  { name: "English Rose Events", city: "London", country: "UK", location: "Notting Hill, London", priceFrom: 500000, priceUnit: "per event", rating: 4.7, reviewCount: 134, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85", description: "Award-winning British wedding decorators famous for English garden aesthetics — wildflower meadows, vintage birdcages, Downton-era draping, and ivy-covered arches.", features: ["English Garden Setup", "Vintage Birdcages", "Ivy-Covered Arch", "Union Jack Styling"] },
  { name: "Ocean Bloom Maldives", city: "Malé", country: "Maldives", location: "Ari Atoll, Maldives", priceFrom: 900000, priceUnit: "per event", rating: 5.0, reviewCount: 67, image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=85", description: "The Maldives' premier overwater wedding decorators — floating petal mandaps, sea-glass aisle lanterns, coral-and-orchid centrepieces, and underwater flower tunnels.", features: ["Overwater Mandap", "Floating Petal Aisle", "Coral Centrepieces", "Underwater Florals"] },
  { name: "Gardens by Design Singapore", city: "Singapore", country: "Singapore", location: "Botanic Gardens, Singapore", priceFrom: 400000, priceUnit: "per event", rating: 4.7, reviewCount: 178, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=85", description: "Singapore's most innovative wedding decorators merging tropical botanic maximalism with cutting-edge LED technology and projection-mapped installations.", features: ["Projection Mapping", "Tropical Botanic Theme", "LED Canopy", "Custom Neon Signs"] },
  { name: "White Cave Aesthetics", city: "Santorini", country: "Greece", location: "Imerovigli, Santorini", priceFrom: 350000, priceUnit: "per event", rating: 4.9, reviewCount: 212, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85", description: "Santorini's most celebrated aesthetic studio — whitewashed cave ceremonies draped in bougainvillea, Aegean blue linens, olive branch arches, and sunset terrace dinners.", features: ["Bougainvillea Canopy", "Olive Branch Arch", "Aegean Blue Linen", "Caldera Terrace Dinner"] },
];

// ─────────────────────────────────────────────────────────────────────────────

async function seedInternational() {
  await connectDB();
  console.log("Connected to MongoDB. Seeding international data...\n");

  // Venues
  console.log("=== INTERNATIONAL VENUES ===");
  for (const v of internationalVenues) {
    const slug = v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const venueId = `venue-intl-${slug}-${Date.now()}`;
    await Venue.create({
      vendorId: VENDOR_ID,
      venueId,
      gallery: [],
      ...v,
    });
    console.log(`  ✅ ${v.name} — ${v.city}, ${v.country}`);
  }

  // Rooms
  console.log("\n=== INTERNATIONAL ROOMS ===");
  for (const r of internationalRooms) {
    const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await ServiceListing.create({
      vendorId: VENDOR_ID,
      serviceId: `rooms-intl-${slug}-${Date.now()}`,
      category: "rooms",
      verified: true,
      featured: true,
      active: true,
      ...r,
    });
    console.log(`  ✅ ${r.name} — ${r.city}, ${r.country}`);
  }

  // Planners
  console.log("\n=== INTERNATIONAL PLANNERS ===");
  for (const p of internationalPlanners) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await ServiceListing.create({
      vendorId: VENDOR_ID,
      serviceId: `planners-intl-${slug}-${Date.now()}`,
      category: "planners",
      verified: true,
      featured: true,
      active: true,
      ...p,
    });
    console.log(`  ✅ ${p.name} — ${p.city}, ${p.country}`);
  }

  // Caterers
  console.log("\n=== INTERNATIONAL CATERERS ===");
  for (const c of internationalCaterers) {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await ServiceListing.create({
      vendorId: VENDOR_ID,
      serviceId: `caterers-intl-${slug}-${Date.now()}`,
      category: "caterers",
      verified: true,
      featured: true,
      active: true,
      ...c,
    });
    console.log(`  ✅ ${c.name} — ${c.city}, ${c.country}`);
  }

  // Decorators
  console.log("\n=== INTERNATIONAL DECORATORS ===");
  for (const d of internationalDecorators) {
    const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await ServiceListing.create({
      vendorId: VENDOR_ID,
      serviceId: `decorators-intl-${slug}-${Date.now()}`,
      category: "decorators",
      verified: true,
      featured: true,
      active: true,
      ...d,
    });
    console.log(`  ✅ ${d.name} — ${d.city}, ${d.country}`);
  }

  const total = internationalVenues.length + internationalRooms.length + internationalPlanners.length + internationalCaterers.length + internationalDecorators.length;
  console.log(`\n✨ Done! Seeded ${total} international listings across 5 categories.`);
  process.exit(0);
}

seedInternational().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
