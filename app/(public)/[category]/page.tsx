import { notFound } from "next/navigation";
import mongoose from "mongoose";
import PublicVendorDirectory, { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import PublicVendorDetailPage from "@/components/vendors/PublicVendorDetailPage";
import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { Venue } from "@/lib/models/Venue";
import { ServiceListing } from "@/lib/models/ServiceListing";

export const dynamic = "force-dynamic";

const categoryMap: Record<string, string> = {
  venues: "Venues",
  rooms: "Rooms",
  accommodation: "Rooms",
  planners: "Planners",
  caterers: "Caterers",
  decorators: "Decorators",
};

export default async function VendorCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  // ── Step 1: Check if this is a known category listing segment ──
  const categoryName = categoryMap[category];

  if (categoryName) {
    let vendors: PublicVendor[] = [];
    if (categoryName === "Venues") {
      vendors = await getVenuesAsPublicVendors();
    } else if (categoryName === "Rooms") {
      vendors = await getRoomsAsPublicVendors();
    } else {
      vendors = await getPublicVendors(categoryName);
    }
    return <PublicVendorDirectory vendors={vendors} activeCategory={categoryName} />;
  }

  // ── Step 2: If not a category, treat as a vendor ID for details page ──
  const isValidId = mongoose.Types.ObjectId.isValid(category);
  if (!isValidId) {
    notFound();
  }

  await connectDB();
  const dbVendor = await Vendor.findById(category).select("-passwordHash").lean();
  
  if (!dbVendor) {
    notFound();
  }

  const mappedVendor: PublicVendor = {
    ...dbVendor,
    _id: dbVendor._id.toString(),
  } as unknown as PublicVendor;

  return <PublicVendorDetailPage vendor={mappedVendor} />;
}

async function getVenuesAsPublicVendors(): Promise<PublicVendor[]> {
  await connectDB();
  const dbVenues = await Venue.find({ active: true })
    .sort({ featured: -1, rating: -1, createdAt: -1 })
    .lean();

  return dbVenues.map((v: any) => {
    let priceFrom: number | undefined = undefined;
    if (v.price) {
      const parsed = parseFloat(v.price.replace(/[₹,]/g, ""));
      if (!isNaN(parsed)) priceFrom = parsed;
    } else if (v.pricePerPlateVeg) {
      const parsed = parseFloat(v.pricePerPlateVeg.replace(/[₹,]/g, ""));
      if (!isNaN(parsed)) priceFrom = parsed;
    }
    return {
      _id: v._id.toString(),
      businessName: v.name,
      name: v.name,
      category: "Venues",
      city: v.city,
      description: v.description || "",
      rating: v.rating || 0,
      reviewCount: v.reviewCount || 0,
      priceFrom,
      images: v.image ? [v.image, ...(v.gallery || [])] : (v.gallery || []),
      featured: v.featured || false,
      verified: v.verified || false,
    };
  });
}

async function getRoomsAsPublicVendors(): Promise<PublicVendor[]> {
  await connectDB();
  
  // 1. Venues with rooms
  const dbVenues = await Venue.find({ active: true, rooms: { $gt: 0 } }).lean();
  const mappedVenues = dbVenues.map((v: any) => {
    let priceFrom: number | undefined = undefined;
    if (v.pricePerRoom) {
      priceFrom = v.pricePerRoom;
    } else if (v.rentalCost) {
      const rental = parseFloat(v.rentalCost.replace(/[₹,]/g, ""));
      if (!isNaN(rental) && v.rooms > 0) {
        priceFrom = Math.round(rental / v.rooms);
      }
    }
    return {
      _id: v._id.toString(),
      businessName: `${v.name} (Rooms)`,
      name: `${v.name} (Rooms)`,
      category: "Rooms",
      city: v.city,
      description: `Premium accommodation rooms available at ${v.name}. Total rooms: ${v.rooms}.`,
      rating: v.rating || 0,
      reviewCount: v.reviewCount || 0,
      priceFrom: priceFrom || 5000,
      images: v.image ? [v.image, ...(v.gallery || [])] : (v.gallery || []),
      featured: v.featured || false,
      verified: v.verified || false,
    };
  });

  // 2. Vendors registered under Rooms
  const dbVendors = await Vendor.find({ category: "Rooms", verified: true, available: true })
    .select("-passwordHash")
    .lean();
  const mappedVendors = dbVendors.map((vendor) => ({
    ...vendor,
    _id: vendor._id.toString(),
  })) as unknown as PublicVendor[];

  return [...mappedVenues, ...mappedVendors];
}

async function getPublicVendors(category: string): Promise<PublicVendor[]> {
  await connectDB();

  // Listings for every non-venue/room category live in the ServiceListing
  // collection (created & approved via the vendor/admin dashboards), so the
  // public directory must read from there — not the Vendor account collection.
  //
  // Build flexible category matching — handle variations like
  // "Planner" vs "Planners", "Cater" vs "Caterers", etc.
  const categoryVariants: Record<string, RegExp> = {
    "Planners": /planner/i,
    "Caterers": /cater/i,
    "Decorators": /decor/i,
  };

  const regex = categoryVariants[category];
  const filter: Record<string, unknown> = { active: true };

  if (regex) {
    filter.category = { $regex: regex };
  } else {
    filter.category = { $regex: new RegExp(category, "i") };
  }

  const services = await ServiceListing.find(filter)
    .sort({ featured: -1, rating: -1, createdAt: -1 })
    .limit(60)
    .lean();

  return services.map((s: any) => ({
    // Use serviceId so the card's `/vendor/{_id}` link resolves via the
    // ServiceListing fallback in /api/vendors.
    _id: s.serviceId,
    businessName: s.name,
    name: s.name,
    category,
    city: s.city,
    description: s.description || "",
    rating: s.rating || 0,
    reviewCount: s.reviewCount || 0,
    priceFrom: s.priceFrom,
    images: s.image ? [s.image, ...(s.gallery || [])] : (s.gallery || []),
    featured: s.featured || false,
    verified: s.verified || false,
  })) as PublicVendor[];
}
