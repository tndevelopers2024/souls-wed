import { connectDB } from "../lib/mongodb";
import { Vendor } from "../lib/models/Vendor";
import { Venue } from "../lib/models/Venue";
import { ServiceListing } from "../lib/models/ServiceListing";
import { hashPassword } from "../lib/auth";
import mongoose from "mongoose";

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected. Wiping old test data...");

  const vendorEmail = "vendor@soulswed.com"; // The primary vendor account
  const vendorPassword = "password123";
  const passwordHash = hashPassword(vendorPassword);
  
  // Wipe all vendor-related data
  await Vendor.deleteMany({});
  await Venue.deleteMany({});
  await ServiceListing.deleteMany({});

  console.log("Creating unified vendor account...");
  
  // 1. Create a single master Vendor
  const masterVendor = new Vendor({
    name: "SoulsWed Master Vendor",
    businessName: "SoulsWed Enterprises",
    email: vendorEmail,
    passwordHash: passwordHash,
    phone: "9988776655",
    categories: ["venues", "rooms", "planners", "caterers", "decorators"],
    city: "Mumbai",
    description: "A premier all-in-one wedding enterprise providing everything you need from venues and rooms to planners, caterers, and decorators.",
    images: ["/logo/logo-by-soulswed.png"],
    featured: true,
    verified: true,
    available: true,
  });
  
  await masterVendor.save();
  const vendorId = masterVendor._id.toString();

  console.log(`Master Vendor created with ID: ${vendorId}`);

  // 2. Create Venues/Rooms (using Venue Model)
  const venue1 = new Venue({
    vendorId,
    venueId: `venue-grand-taj-${Date.now()}`,
    name: "Grand Taj Banquet",
    city: "Mumbai",
    location: "South Mumbai",
    country: "India",
    type: "Banquet Hall",
    price: "1500",
    priceUnit: "per day",
    pricePerPlateVeg: "1500",
    pricePerPlateNonVeg: "1800",
    rentalCost: "250000",
    image: "/soulswed/acc_Venue.jpg",
    gallery: [],
    minGuests: 100,
    maxGuests: 1000,
    rooms: 2,
    outdoor: false,
    indoor: true,
    parking: true,
    catering: true,
    description: "A luxurious banquet hall offering premium seating, catering, and grand decor for large Indian weddings.",
    features: ["AC", "Stage", "DJ allowed"],
    verified: true,
    featured: true,
    active: true,
  });

  const venue2 = new Venue({
    vendorId,
    venueId: `venue-royal-heritage-${Date.now()}`,
    name: "Royal Heritage Rooms",
    city: "Jaipur",
    location: "City Center",
    country: "India",
    type: "Resort",
    price: "6500",
    priceUnit: "per day",
    pricePerPlateVeg: "",
    pricePerPlateNonVeg: "",
    rentalCost: "500000",
    image: "/soulswed/hotels.jpg",
    gallery: [],
    minGuests: 50,
    maxGuests: 300,
    rooms: 50,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Elegant suites and double rooms to accommodate your wedding guests in royal style.",
    features: ["Pool", "Spa", "Garden"],
    verified: true,
    featured: true,
    active: true,
  });

  await venue1.save();
  await venue2.save();

  // 3. Create Services (Planners, Caterers, Decorators using ServiceListing Model)
  const plannerService = new ServiceListing({
    vendorId,
    serviceId: `planners-elite-${Date.now()}`,
    category: "planners",
    name: "Elite Wedding Planners",
    city: "Delhi",
    location: "South Delhi",
    priceFrom: 150000,
    priceUnit: "per event",
    image: "/soulswed/acc_Planners.jpg",
    description: "End-to-end wedding planning from invitations and logistics to post-wedding photoshoots.",
    verified: true,
    featured: true,
    active: true,
  });

  const catererService = new ServiceListing({
    vendorId,
    serviceId: `caterers-royal-feast-${Date.now()}`,
    category: "caterers",
    name: "Royal Feast Caterers",
    city: "Mumbai",
    location: "Bandra",
    priceFrom: 850,
    priceUnit: "per plate",
    image: "/soulswed/caterers.jpg",
    description: "Authentic multi-cuisine catering featuring live counters, North Indian, and Continental menus.",
    verified: true,
    featured: true,
    active: true,
  });

  const decoratorService = new ServiceListing({
    vendorId,
    serviceId: `decorators-enchanted-${Date.now()}`,
    category: "decorators",
    name: "Enchanted Decorators",
    city: "Goa",
    location: "Panjim",
    priceFrom: 75000,
    priceUnit: "per event",
    image: "/soulswed/acc_decorators1.jpg",
    description: "Custom floral designs, mandaps, and lighting tailored to your unique wedding theme.",
    verified: true,
    featured: true,
    active: true,
  });

  await plannerService.save();
  await catererService.save();
  await decoratorService.save();

  console.log("Done! Seeded 1 unified vendor with 5 different service listings (2 venues, 3 services).");
  process.exit(0);
}

seed().catch(console.error);
