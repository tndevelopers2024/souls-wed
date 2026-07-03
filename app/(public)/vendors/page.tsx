import PublicVendorDirectory, { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { Venue } from "@/lib/models/Venue";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const vendors = await getPublicVendors();
  return <PublicVendorDirectory vendors={vendors} />;
}

async function getPublicVendors(): Promise<PublicVendor[]> {
  await connectDB();
  
  // Fetch active vendors
  const dbVendors = await Vendor.find({ verified: true, available: true })
    .select("-passwordHash")
    .lean();

  const mappedVendors: PublicVendor[] = dbVendors.map((vendor) => ({
    ...vendor,
    _id: vendor._id.toString(),
    priceFrom: vendor.priceFrom ? Number(vendor.priceFrom) : undefined,
  })) as unknown as PublicVendor[];

  // Fetch active venues
  const dbVenues = await Venue.find({ active: true }).lean();
  const mappedVenues: PublicVendor[] = dbVenues.map((v) => {
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

  const combined = [...mappedVendors, ...mappedVenues];

  // Sort: featured first, then rating
  return combined.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });
}
