/**
 * fix-all-service-names.ts
 * Run: MONGODB_URI=$(grep MONGODB_URI .env | cut -d= -f2-) npx tsx scripts/fix-all-service-names.ts
 *
 * Replaces all placeholder "Premium X N" service names with real business names,
 * real cities, and proper descriptions.
 */

import { connectDB } from "../lib/mongodb";
import { ServiceListing } from "../lib/models/ServiceListing";

// ─── Real Data ───────────────────────────────────────────────────────────────

const realData: Record<
  string,
  { name: string; city: string; location: string; description: string; priceFrom?: number; priceUnit?: string }[]
> = {
  rooms: [
    { name: "The Ritz-Carlton Suites", city: "Mumbai", location: "BKC, Bandra", description: "Ultra-luxury suites with panoramic sea views, butler service, and bespoke wedding-night packages for distinguished guests.", priceFrom: 18000, priceUnit: "per night" },
    { name: "Taj West End Heritage Rooms", city: "Bengaluru", location: "Race Course Road", description: "Colonial-era heritage property featuring spacious garden-view rooms surrounded by century-old trees and impeccable Taj hospitality.", priceFrom: 12000, priceUnit: "per night" },
    { name: "ITC Mughal Royal Suites", city: "Agra", location: "Fatehabad Road", description: "Palatial Mughal-inspired suites overlooking manicured gardens with personalized concierge service for wedding parties.", priceFrom: 15000, priceUnit: "per night" },
    { name: "Umaid Bhawan Palace Rooms", city: "Jodhpur", location: "Circuit House Road", description: "Stay in the world's finest palace-hotel with Art Deco interiors, marble bathrooms, and royal butler attendance.", priceFrom: 25000, priceUnit: "per night" },
    { name: "The Leela Kovalam Villas", city: "Thiruvananthapuram", location: "Kovalam Beach", description: "Clifftop private villas facing the Arabian Sea, perfect for intimate honeymoon stays after beachside wedding ceremonies.", priceFrom: 14000, priceUnit: "per night" },
    { name: "Wildflower Hall Shimla", city: "Shimla", location: "Mashobra", description: "A former royal retreat nestled in cedar forests with fireplaces, spa access, and sweeping Himalayan mountain views.", priceFrom: 20000, priceUnit: "per night" },
    { name: "Alila Fort Bishangarh", city: "Jaipur", location: "Bishangarh, Rajasthan", description: "An award-winning 230-year-old fortress hotel with dramatic desert views and opulent rooms carved into historic ramparts.", priceFrom: 22000, priceUnit: "per night" },
  ],

  planners: [
    { name: "Shaadi Squad Events", city: "Delhi", location: "Vasant Kunj", description: "India's most celebrated full-service wedding planning firm, known for fairy-tale ceremonies across 40+ destination venues.", priceFrom: 250000, priceUnit: "per event" },
    { name: "WeddingNama Studios", city: "Mumbai", location: "Andheri West", description: "Award-winning planners specialising in luxury destination weddings, from Udaipur lake palaces to European château venues.", priceFrom: 180000, priceUnit: "per event" },
    { name: "The Wedding Company", city: "Bengaluru", location: "Indiranagar", description: "A boutique planning house celebrated for their artistic floral concepts, seamless logistics, and personalised couple experiences.", priceFrom: 150000, priceUnit: "per event" },
    { name: "Aaradhya Occasions", city: "Jaipur", location: "C-Scheme", description: "Specialists in royal Rajasthani weddings — from elephant processions to rooftop baraat arrangements in heritage havelis.", priceFrom: 200000, priceUnit: "per event" },
    { name: "Meraki Wedding Planners", city: "Goa", location: "Panjim", description: "Goa-based planners delivering breathtaking beach, fort, and villa weddings with bohemian or luxury styling.", priceFrom: 120000, priceUnit: "per event" },
    { name: "Ritz Weddings", city: "Hyderabad", location: "Banjara Hills", description: "South India's premier wedding planners offering full Nawabi-themed decor, cuisine curation, and celebrity coordination.", priceFrom: 175000, priceUnit: "per event" },
    { name: "Celestial Celebrations", city: "Chennai", location: "Anna Nagar", description: "Masters of grand Tamil and Telugu wedding ceremonies with elaborate kolam designs, silk drapes, and classical music arrangements.", priceFrom: 130000, priceUnit: "per event" },
  ],

  caterers: [
    { name: "Royal Feast Caterers", city: "Mumbai", location: "Bandra", description: "Authentic multi-cuisine catering featuring live counters, North Indian, South Indian, and Continental menus for 500+ guests.", priceFrom: 1200, priceUnit: "per plate" },
    { name: "Saffron Grand Catering", city: "Delhi", location: "Karol Bagh", description: "Legacy caterers with 30+ years of experience in elaborate wedding feasts — from dal baati to live chaat counters.", priceFrom: 950, priceUnit: "per plate" },
    { name: "The Food Studio", city: "Bengaluru", location: "Koramangala", description: "Modern fusion wedding catering combining traditional recipes with contemporary plating styles. Known for theatrical live stations.", priceFrom: 1100, priceUnit: "per plate" },
    { name: "Rajwada Khana Catering", city: "Jaipur", location: "Mansarovar", description: "Authentic Rajasthani cuisine specialists — laal maas, dal baati churma, ker sangri — served in royal thaal setups.", priceFrom: 850, priceUnit: "per plate" },
    { name: "Coastal Flavours Catering", city: "Goa", location: "Mapusa", description: "Goan seafood and fusion wedding menus including prawn curry, sorpotel, and bebinca — with live seafood grilling stations.", priceFrom: 1350, priceUnit: "per plate" },
    { name: "Zaika E Nawab", city: "Hyderabad", location: "Secunderabad", description: "Award-winning Hyderabadi catering house known for dum biryani, haleem, and authentic Nawabi cuisine at scale.", priceFrom: 900, priceUnit: "per plate" },
    { name: "Madras Kitchen Co.", city: "Chennai", location: "T Nagar", description: "Premium South Indian wedding catering with sadhya-style banana leaf meals, filter coffee stations, and North Indian fusion options.", priceFrom: 800, priceUnit: "per plate" },
  ],

  decorators: [
    { name: "Enchanted Florals", city: "Mumbai", location: "Malad West", description: "India's most-Instagrammed wedding decorators — known for lavish floral canopies, fairy-light tunnels, and custom mandap designs.", priceFrom: 120000, priceUnit: "per event" },
    { name: "Petal & Prism Decor", city: "Delhi", location: "Mehrauli", description: "Artistic decorators blending sustainable florals with contemporary lighting to create breathtaking ceremony backdrops and reception stages.", priceFrom: 95000, priceUnit: "per event" },
    { name: "Dreamscape Weddings", city: "Bengaluru", location: "Whitefield", description: "Tech-meets-florals studio offering AR preview of wedding setups, with stunning LED ceilings, draping, and thematic room decor.", priceFrom: 85000, priceUnit: "per event" },
    { name: "Marigold Mandap Studio", city: "Jaipur", location: "Vaishali Nagar", description: "Masters of traditional Rajasthani wedding decor — marigold garlands, mirror work, and vibrant bandhani-inspired stage arrangements.", priceFrom: 75000, priceUnit: "per event" },
    { name: "Seascape Decor Goa", city: "Goa", location: "Calangute", description: "Bohemian and tropical wedding decorators specialising in beach mandaps, macramé backdrops, and driftwood centrepieces.", priceFrom: 65000, priceUnit: "per event" },
    { name: "Noor Decor House", city: "Hyderabad", location: "Jubilee Hills", description: "Grand Nizami-style wedding decor with crystal chandeliers, gold-dipped florals, and custom monogram installations.", priceFrom: 100000, priceUnit: "per event" },
    { name: "Kalpana Events Decor", city: "Chennai", location: "Velachery", description: "Specialists in South Indian wedding aesthetics — jasmine garlands, banana-fibre decorations, kolam art, and silk backdrop setups.", priceFrom: 60000, priceUnit: "per event" },
  ],

  photographers: [
    { name: "The Wedding Film Co.", city: "Mumbai", location: "Lower Parel", description: "Award-winning cinematographers known for cinematic wedding films that feel like Bollywood — emotionally gripping and visually stunning.", priceFrom: 150000, priceUnit: "per day" },
    { name: "Frozen Moments Studio", city: "Delhi", location: "Saket", description: "Editorial-style photographers capturing raw emotion, golden-hour portraits, and authentic candid moments from your wedding day.", priceFrom: 120000, priceUnit: "per day" },
    { name: "Infinite Frames", city: "Bengaluru", location: "Jayanagar", description: "Fine-art wedding photography collective blending documentary storytelling with magazine-quality portraiture and drone aerials.", priceFrom: 95000, priceUnit: "per day" },
    { name: "Royal Clicks Photography", city: "Jaipur", location: "Pink City", description: "Destination wedding specialists shooting across Rajasthan's forts, palaces, and desert dunes with drone coverage and film rolls.", priceFrom: 110000, priceUnit: "per day" },
    { name: "Sun & Sea Visuals", city: "Goa", location: "Anjuna", description: "Goa's leading wedding photographers combining beach candids, underwater couples shoots, and dramatic sunset portraits.", priceFrom: 85000, priceUnit: "per day" },
    { name: "Shutter & Story Co.", city: "Hyderabad", location: "Banjara Hills", description: "South India's most loved wedding storytelling brand — known for tearful moments, laughter-filled reels, and cinematic trailers.", priceFrom: 90000, priceUnit: "per day" },
    { name: "Lumos Wedding Films", city: "Chennai", location: "Adyar", description: "Cinematic videography and photography studio capturing Tamil and Telugu wedding traditions through a contemporary lens.", priceFrom: 80000, priceUnit: "per day" },
  ],

  makeupartists: [
    { name: "Reena Kohli Artistry", city: "Mumbai", location: "Juhu", description: "Celebrity makeup artist with over 15 years of bridal experience — known for flawless HD finish, contouring, and airbrush looks.", priceFrom: 35000, priceUnit: "per event" },
    { name: "Blush & Bloom Studio", city: "Delhi", location: "Lajpat Nagar", description: "Luxury bridal makeup studio offering trial sessions, HD bridal looks, draping, and hair styling for the entire wedding party.", priceFrom: 28000, priceUnit: "per event" },
    { name: "The Glam Room", city: "Bengaluru", location: "Koramangala", description: "A boutique bridal beauty studio celebrated for customised looks from minimalist dewy to traditional heavy South Indian bridal.", priceFrom: 22000, priceUnit: "per event" },
    { name: "Sona Bridal Studio", city: "Jaipur", location: "Tonk Road", description: "Traditional Rajasthani bridal makeup specialists — including tikka, matha patti styling and authentic lehenga draping services.", priceFrom: 18000, priceUnit: "per event" },
    { name: "Goa Glam Artists", city: "Goa", location: "Panjim", description: "Tropical bridal beauty experts offering natural beach-inspired looks, waterproof makeup, and hair with hibiscus accents.", priceFrom: 20000, priceUnit: "per event" },
    { name: "Noor Bridal Artistry", city: "Hyderabad", location: "Madhapur", description: "Specialist in South Indian bridal looks — matte-finish, flower-adorned hair, and traditional kajal-heavy eye artistry.", priceFrom: 25000, priceUnit: "per event" },
    { name: "Meera's Bridal Lounge", city: "Chennai", location: "Anna Nagar", description: "Experienced bridal team offering Tamil and Telugu wedding makeup, nalangu ceremony looks, and full wedding-day beauty packages.", priceFrom: 20000, priceUnit: "per event" },
  ],

  sakhiservice: [
    { name: "Sakhi Squad Mumbai", city: "Mumbai", location: "Dadar", description: "Professional bridesmaids and wedding day companions offering emotional support, errand management, and wedding coordination assistance.", priceFrom: 15000, priceUnit: "per event" },
    { name: "Royal Sakhi Delhi", city: "Delhi", location: "Dwarka", description: "Trained wedding-day companions who manage bride's schedule, handle outfit changes, and ensure every moment is smooth and memorable.", priceFrom: 12000, priceUnit: "per event" },
    { name: "Bangalore Bride Buddies", city: "Bengaluru", location: "HSR Layout", description: "A team of dedicated sakhi companions who coordinate bridesmaids, handle floral deliveries, and serve as your personal wedding support crew.", priceFrom: 10000, priceUnit: "per event" },
    { name: "Pink City Sakhi Services", city: "Jaipur", location: "Malviya Nagar", description: "Rajasthani wedding companions trained in ghoomar coordination, mehndi ceremony assistance, and traditional bride accompaniment rituals.", priceFrom: 8000, priceUnit: "per event" },
    { name: "Goa Bride Companions", city: "Goa", location: "Vasco", description: "Trained beach wedding companions offering pre-wedding checklist support, logistics coordination, and real-time issue resolution.", priceFrom: 9000, priceUnit: "per event" },
    { name: "Hyderabad Sakhi House", city: "Hyderabad", location: "Kukatpally", description: "Professional bridal support team handling outfit management, accessory tracking, and complete ceremony guidance for Telugu brides.", priceFrom: 11000, priceUnit: "per event" },
    { name: "Chennai Bride Squad", city: "Chennai", location: "Porur", description: "South Indian sakhi specialists experienced in Tamil wedding ceremonies, accompanying the bride from muhurtham to reception.", priceFrom: 9500, priceUnit: "per event" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────

async function fixAllServiceNames() {
  await connectDB();
  console.log("Connected to MongoDB. Scanning all service listings...\n");

  const allServices = await ServiceListing.find({}).lean() as any[];
  console.log(`Found ${allServices.length} service listings.\n`);

  let totalUpdated = 0;

  for (const [category, entries] of Object.entries(realData)) {
    // Get all services in this category sorted by creation order
    const categoryServices = allServices
      .filter((s: any) => s.category === category)
      .sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());

    console.log(`=== ${category.toUpperCase()} (${categoryServices.length} found) ===`);

    for (let i = 0; i < Math.min(categoryServices.length, entries.length); i++) {
      const service = categoryServices[i];
      const newData = entries[i];

      await ServiceListing.findByIdAndUpdate(service._id, {
        $set: {
          name: newData.name,
          city: newData.city,
          location: newData.location,
          description: newData.description,
          ...(newData.priceFrom !== undefined && { priceFrom: newData.priceFrom }),
          ...(newData.priceUnit !== undefined && { priceUnit: newData.priceUnit }),
          updatedAt: new Date(),
        },
      });

      console.log(`  ✅ "${service.name}" → "${newData.name}" (${newData.city})`);
      totalUpdated++;
    }

    console.log();
  }

  console.log(`\n✨ Done! Updated ${totalUpdated} service listing(s).`);
  process.exit(0);
}

fixAllServiceNames().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
