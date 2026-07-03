import { notFound } from "next/navigation";
import PublicVendorDirectory, { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { Venue } from "@/lib/models/Venue";

export const dynamic = "force-dynamic";

const categoryMap: Record<string, string> = {
  venues: "Venues",
  planners: "Planners",
  photographers: "Photographers",
  decorators: "Decorators",
  makeup: "Make-up Artists",
  caterers: "Caterers",
  djs: "DJs",
};

export default async function VendorCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = categoryMap[category];

  if (!categoryName) {
    notFound();
  }

  const vendors = category === "venues"
    ? await getVenuesAsPublicVendors()
    : await getPublicVendors(categoryName);

  return <PublicVendorDirectory vendors={vendors} activeCategory={categoryName} />;
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

async function getPublicVendors(category: string): Promise<PublicVendor[]> {
  await connectDB();
  const vendors = await Vendor.find({
    verified: true,
    available: true,
    category,
  })
    .select("-passwordHash")
    .sort({ featured: -1, rating: -1, createdAt: -1 })
    .limit(60)
    .lean();

  return vendors.map((vendor) => ({
    ...vendor,
    _id: vendor._id.toString(),
  })) as PublicVendor[];
}
