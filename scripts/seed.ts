import { connectDB } from "../lib/mongodb";
import { Vendor } from "../lib/models/Vendor";

const DUMMY_VENDORS = [
  {
    name: "John's Venue Manager",
    businessName: "Grand Taj Banquet",
    email: "taj@example.com",
    phone: "9988776655",
    category: "venues",
    city: "Mumbai",
    description: "A luxurious banquet hall offering premium seating, catering, and grand decor for large Indian weddings.",
    priceFrom: 1500, // per plate veg
    advancePercentage: 30,
    images: ["/soulswed/acc_Venue.jpg"],
    featured: true,
    verified: true,
    available: true,
  },
  {
    name: "Sarah Stay Coordinator",
    businessName: "Royal Heritage Rooms",
    email: "royal@example.com",
    phone: "9988776656",
    category: "rooms",
    city: "Jaipur",
    description: "Elegant suites and double rooms to accommodate your wedding guests in royal style.",
    priceFrom: 6500, // per night
    advancePercentage: 25,
    images: ["/soulswed/hotels.jpg"],
    featured: true,
    verified: true,
    available: true,
  },
  {
    name: "Event Gurus",
    businessName: "Elite Wedding Planners",
    email: "elite@example.com",
    phone: "9988776657",
    category: "planners",
    city: "Delhi",
    description: "End-to-end wedding planning from invitations and logistics to post-wedding photoshoots.",
    priceFrom: 150000, // Fixed price
    advancePercentage: 40,
    images: ["/soulswed/acc_Planners.jpg"],
    featured: true,
    verified: true,
    available: true,
  },
  {
    name: "Chef Raj",
    businessName: "Royal Feast Caterers",
    email: "feast@example.com",
    phone: "9988776658",
    category: "caterers",
    city: "Mumbai",
    description: "Authentic multi-cuisine catering featuring live counters, North Indian, and Continental menus.",
    priceFrom: 850, // per plate veg
    advancePercentage: 30,
    images: ["/soulswed/caterers.jpg"],
    featured: true,
    verified: true,
    available: true,
  },
  {
    name: "Decors By Isha",
    businessName: "Enchanted Decorators",
    email: "enchanted@example.com",
    phone: "9988776659",
    category: "decorators",
    city: "Goa",
    description: "Custom floral designs, mandaps, and lighting tailored to your unique wedding theme.",
    priceFrom: 75000, // Fixed price starting package
    advancePercentage: 30,
    images: ["/soulswed/acc_decorators1.jpg"],
    featured: true,
    verified: true,
    available: true,
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected. Clearing old seed vendors...");

  const emails = DUMMY_VENDORS.map(v => v.email);
  await Vendor.deleteMany({ email: { $in: emails } });

  console.log("Inserting new seed vendors...");
  await Vendor.insertMany(DUMMY_VENDORS);
  
  console.log("Done! Seeded 5 vendors across the 5 categories.");
  process.exit(0);
}

seed().catch(console.error);
