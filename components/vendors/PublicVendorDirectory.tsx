import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import { formatAsCurrency } from "@/lib/currency";

export interface PublicVendor {
  _id: string;
  businessName?: string;
  name: string;
  category: string;
  city: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  priceFrom?: number;
  images?: string[];
  featured?: boolean;
  verified?: boolean;
}

const categoryLinks = [
  { label: "All", href: "/vendors" },
  { label: "Venues", href: "/vendors/venues" },
  { label: "Planners", href: "/vendors/planners" },
  { label: "Photographers", href: "/vendors/photographers" },
  { label: "Decorators", href: "/vendors/decorators" },
  { label: "Makeup", href: "/vendors/makeup" },
  { label: "Caterers", href: "/vendors/caterers" },
  { label: "DJs", href: "/vendors/djs" },
];

const fallbackImages = [
  "/soulswed/vendors/1182.avif",
  "/soulswed/vendors/1128.webp",
  "/soulswed/vendors/1129.png",
  "/soulswed/vendors/1118.jpg",
];

export default function PublicVendorDirectory({
  vendors,
  activeCategory,
}: {
  vendors: PublicVendor[];
  activeCategory?: string;
}) {
  const title = activeCategory ? `${activeCategory} Vendors` : "Verified Wedding Vendors";

  return (
    <main className="min-h-screen pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-6 mb-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sw-orange)" }}>
              Approved Partner Directory
            </p>
            <h1 className="section-heading">{title}</h1>
            <p className="section-subtext">
              Browse vendor profiles that have passed admin verification and are currently accepting enquiries.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {categoryLinks.map((item) => {
              const isActive =
                (!activeCategory && item.label === "All") ||
                item.label.toLowerCase() === activeCategory?.toLowerCase();
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-orange-200 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {vendors.length === 0 ? (
          <div className="rounded-[28px] border border-slate-100 bg-white p-10 text-center">
            <h2 className="text-lg font-extrabold text-slate-900">No approved vendors yet</h2>
            <p className="text-sm text-slate-500 mt-2">
              New partner applications will appear here after admin approval.
            </p>
            <Link
              href="/signup?role=vendor"
              className="inline-flex mt-6 px-5 py-3 rounded-full bg-slate-900 text-white text-xs font-bold"
            >
              Apply as a vendor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <VendorCard key={vendor._id} vendor={vendor} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function VendorCard({ vendor, index }: { vendor: PublicVendor; index: number }) {
  const image = vendor.images?.[0] || fallbackImages[index % fallbackImages.length];
  const rating = vendor.rating || 0;

  return (
    <article className="group relative rounded-[28px] overflow-hidden border border-slate-100 bg-white shadow-sm min-h-[460px]">
      <Image
        src={image}
        alt={vendor.businessName || vendor.name}
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {vendor.featured && (
          <span className="rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
            Featured
          </span>
        )}
        {vendor.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      <button className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-white/90 text-slate-400 shadow-sm transition-colors hover:text-red-500">
        <Heart className="m-auto h-4 w-4" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[74%] bg-gradient-to-t from-white via-white/88 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white">
            {vendor.category}
          </span>
          {rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)} ({vendor.reviewCount || 0})
            </span>
          )}
        </div>

        <h2 className="line-clamp-2 text-2xl font-extrabold leading-tight text-slate-950">
          {vendor.businessName || vendor.name}
        </h2>
        <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span>{vendor.city}</span>
        </div>

        {vendor.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {vendor.description}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400">Starts from</span>
            <span className="text-xl font-black text-slate-950">
              {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, "INR") : "On request"}
            </span>
          </div>
          <Link
            href={`/login?role=user`}
            className="rounded-full bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-orange-600"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
