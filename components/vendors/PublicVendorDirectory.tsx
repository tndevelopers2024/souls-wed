"use client";

import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, MapPin, Star, Heart, BadgeCheck,
  ChevronDown, LayoutGrid, List, Loader2, Users,
  SlidersHorizontal,
} from "lucide-react";
import { formatAsCurrency } from "@/lib/currency";
import { useCurrency } from "@/lib/CurrencyContext";
import VenueFilterBar from "@/components/venues/VenueFilterBar";

export interface PublicVendor {
  _id: string;
  venueId?: string;
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
  phone?: string;
  website?: string;
  instagram?: string;
  advancePercentage?: number;
}

const categoryLinks = [
  { label: "All", href: "/vendors", icon: "✦" },
  { label: "Venues", href: "/venues" },
  { label: "Rooms", href: "/rooms" },
  { label: "Planners", href: "/planners" },
  { label: "Caterers", href: "/caterers" },
  { label: "Decorators", href: "/decorators" },
  { label: "Photographers", href: "/photographers" },
  { label: "Chartered Airlines", href: "/chartered-airlines" },
  { label: "Makeup", href: "/makeup" },
  { label: "Hairstylists", href: "/hairstylists" },
  { label: "Mehndi", href: "/mehndi" },
  { label: "Florists", href: "/florists" },
  { label: "Choreographers", href: "/choreographers" },
];

const cityFilters = [
  { name: "All Cities", image: "" },
  { name: "Mumbai", image: "/soulswed/vendors/1213.jpg" },
  { name: "Delhi", image: "/soulswed/vendors/1207.jpg" },
  { name: "Goa", image: "/soulswed/vendors/1206.jpg" },
  { name: "Jaipur", image: "/soulswed/acc_Photographers.jpg" },
  { name: "Udaipur", image: "/soulswed/pageimg_venues.jpg" },
  { name: "Dubai", image: "/soulswed/vendors/1118.jpg" },
  { name: "Bali", image: "/soulswed/acc_decorators1.jpg" },
  { name: "Maldives", image: "/soulswed/vendors/1128.webp" },
];

const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Highest Rated"];

const fallbackImages = [
  "/soulswed/vendors/1182.avif",
  "/soulswed/vendors/1128.webp",
  "/soulswed/vendors/1129.png",
  "/soulswed/vendors/1118.jpg",
];

// ── Category-specific hero config ──
const categoryMeta: Record<string, { eyebrow: string; titlePrefix: string; titleAccent: string; subtitle: string }> = {
  Venues: { eyebrow: "Explore Dream Venues", titlePrefix: "Wedding", titleAccent: "Venues", subtitle: "Discover extraordinary spaces — from regal palaces to serene backwater resorts — curated for your perfect celebration." },
  Rooms: { eyebrow: "Premium Accommodation", titlePrefix: "Wedding", titleAccent: "Rooms", subtitle: "Luxury rooms and suites for your guests — from boutique stays to grand resorts." },
  Planners: { eyebrow: "Expert Event Planning", titlePrefix: "Wedding", titleAccent: "Planners", subtitle: "From intimate ceremonies to grand celebrations — let experts handle every detail." },
  Caterers: { eyebrow: "Exquisite Cuisine", titlePrefix: "Wedding", titleAccent: "Caterers", subtitle: "Multi-cuisine catering with live counters, customized menus, and premium service." },
  Decorators: { eyebrow: "Stunning Decor", titlePrefix: "Wedding", titleAccent: "Decorators", subtitle: "Transform your venue with breathtaking floral installations, lighting, and mandap designs." },
  Photographers: { eyebrow: "Capture Every Moment", titlePrefix: "Wedding", titleAccent: "Photographers", subtitle: "Cinematic photography and videography — candid moments, drone shots, and same-day edits." },
  "Chartered Airlines": { eyebrow: "Fly In Style", titlePrefix: "Chartered", titleAccent: "Airlines", subtitle: "Private charter flights for destination weddings — luxury amenities, flexible routes." },
  "Make-up Artists": { eyebrow: "Beauty & Glam", titlePrefix: "Makeup", titleAccent: "Artists", subtitle: "Celebrity bridal makeup — HD, airbrush, and traditional looks with premium products." },
  Hairstylists: { eyebrow: "Perfect Hair", titlePrefix: "Wedding", titleAccent: "Hairstylists", subtitle: "Bridal hairstyling for all hair types — updos, braids, cascading curls, and more." },
  "Mehndi Artists": { eyebrow: "Intricate Artistry", titlePrefix: "Mehndi", titleAccent: "Artists", subtitle: "Traditional and modern mehndi designs — Rajasthani, Arabic, and fusion styles." },
  Florists: { eyebrow: "Blooms & Bouquets", titlePrefix: "Wedding", titleAccent: "Florists", subtitle: "Premium floral arrangements — imported flowers, seasonal bouquets, and venue installations." },
  Choreographers: { eyebrow: "Dance & Perform", titlePrefix: "Wedding", titleAccent: "Choreographers", subtitle: "Sangeet choreography — Bollywood, contemporary, and fusion dance routines." },
};

export default function PublicVendorDirectory({
  vendors,
  activeCategory,
}: {
  vendors: PublicVendor[];
  activeCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchFocused, setSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  const meta = categoryMeta[activeCategory || ""] || {
    eyebrow: "Approved Partner Directory",
    titlePrefix: "Wedding",
    titleAccent: "Vendors",
    subtitle: "Browse vendor profiles that have passed admin verification and are currently accepting enquiries.",
  };

  const filtered = useMemo(() => {
    let list = [...vendors];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          (v.businessName || v.name).toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          (v.description || "").toLowerCase().includes(q)
      );
    }

    if (activeCity) {
      list = list.filter((v) =>
        v.city.toLowerCase().includes(activeCity.toLowerCase())
      );
    }

    if (sort === "Price: Low to High") {
      list.sort((a, b) => (a.priceFrom || 0) - (b.priceFrom || 0));
    } else if (sort === "Price: High to Low") {
      list.sort((a, b) => (b.priceFrom || 0) - (a.priceFrom || 0));
    } else if (sort === "Highest Rated") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [vendors, search, activeCity, sort]);

  const visible = filtered.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => c + 6);
      setIsLoading(false);
    }, 400);
  };

  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (search.trim()) activeFilters.push({ label: `"${search}"`, onRemove: () => setSearch("") });
  if (activeCity) activeFilters.push({ label: activeCity, onRemove: () => setActiveCity("") });
  if (sort !== "Recommended") activeFilters.push({ label: sort, onRemove: () => setSort("Recommended") });

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <div className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden pt-16 pb-16 px-4 text-center rounded-[40px] shadow-sm border border-primary-50/60"
          style={{
            background: "linear-gradient(150deg, #fdf6f0 0%, #fceee3 40%, #f5dcc9 100%)",
          }}
        >
        {/* Floating orbs */}
        <div
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(238,116,41,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "orb-float 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-10 -right-20 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(252,203,17,0.2) 0%, transparent 70%)",
            filter: "blur(48px)",
            animation: "orb-float 12s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(238,116,41,0.08) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(238,116,41,0.12)",
              color: "var(--sw-primary)",
              border: "1px solid rgba(238,116,41,0.25)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
            {meta.eyebrow}
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
          >
            {meta.titlePrefix}{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, var(--sw-primary) 0%, #f5a623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {meta.titleAccent}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            {meta.subtitle}
          </p>

          {/* Search bar */}
          <motion.div
            className="max-w-2xl mx-auto relative"
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex items-center rounded-full px-5 py-3 gap-3 transition-all duration-300"
              style={{
                background: "white",
                border: searchFocused
                  ? "2px solid var(--sw-primary)"
                  : "2px solid rgba(0,0,0,0.08)",
                boxShadow: searchFocused
                  ? "0 8px 32px rgba(238,116,41,0.18)"
                  : "0 4px 24px rgba(0,0,0,0.08)",
              }}
            >
              <Search
                className="w-5 h-5 flex-shrink-0 transition-colors duration-300"
                style={{ color: searchFocused ? "var(--sw-primary)" : "#94a3b8" }}
              />
              <input
                type="text"
                placeholder={`Search by ${(activeCategory || "vendor").toLowerCase()} name, city, or specialty…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 text-sm font-medium outline-none bg-transparent"
                style={{ color: "var(--sw-navy)" }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setSearch("")}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: "rgba(0,0,0,0.08)" }}
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* ══════════════════════ STICKY FILTER BAR ══════════════════════ */}
      <VenueFilterBar activeCity={activeCity} onCityChange={setActiveCity} activeCategory={activeCategory || "All"} />

      {/* ══════════════════════ MAIN CONTENT ══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">{filtered.length}</span>{" "}
              {(activeCategory || "vendor").toLowerCase()}
              {filtered.length !== 1 && !(activeCategory || "vendor").toLowerCase().endsWith("s") ? "s" : ""}
              {activeCity && (
                <span>
                  {" "}in{" "}
                  <span className="font-bold" style={{ color: "var(--sw-primary)" }}>
                    {activeCity}
                  </span>
                </span>
              )}
            </p>

            {/* Active filter chips */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {activeFilters.map((f) => (
                    <motion.button
                      key={f.label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      onClick={f.onRemove}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                      style={{
                        background: "rgba(238,116,41,0.1)",
                        color: "var(--sw-primary)",
                        border: "1px solid rgba(238,116,41,0.25)",
                      }}
                    >
                      {f.label}
                      <X className="w-3 h-3" />
                    </motion.button>
                  ))}
                  {activeFilters.length > 1 && (
                    <button
                      onClick={() => { setSearch(""); setActiveCity(""); setSort("Recommended"); }}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors underline"
                    >
                      Clear all
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="hidden sm:flex bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
              <button
                onClick={() => setViewType("grid")}
                className={`p-1.5 rounded-full transition-all ${
                  viewType === "grid"
                    ? "bg-white shadow-sm text-[var(--sw-primary)]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-1.5 rounded-full transition-all ${
                  viewType === "list"
                    ? "bg-white shadow-sm text-[var(--sw-primary)]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all hover:shadow-md"
                style={{
                  borderColor: sortOpen ? "var(--sw-primary)" : "var(--sw-light-gray)",
                  color: "var(--sw-navy)",
                  background: sortOpen ? "rgba(238,116,41,0.05)" : "white",
                  boxShadow: sortOpen ? "0 0 0 3px rgba(238,116,41,0.1)" : "none",
                }}
              >
                <span className="hidden sm:inline text-slate-400 font-normal text-xs">Sort:</span>
                {sort}
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-[20px] overflow-hidden z-50 py-1.5"
                    style={{
                      background: "white",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
                    }}
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSort(opt); setSortOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 flex items-center justify-between"
                        style={{
                          fontWeight: sort === opt ? 700 : 500,
                          color: sort === opt ? "var(--sw-primary)" : "var(--sw-navy)",
                        }}
                      >
                        {opt}
                        {sort === opt && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid / Empty state */}
        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28 flex flex-col items-center"
          >
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #fceee3 0%, #fdf6f0 100%)" }}
            >
              <Users className="w-12 h-12" style={{ color: "var(--sw-primary)", opacity: 0.5 }} />
            </div>
            <p
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
            >
              No vendors found
            </p>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              We couldn&apos;t find vendors matching your filters. Try adjusting your search or clearing some filters.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCity(""); setSort("Recommended"); }}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{
                background: "var(--sw-primary)",
                color: "white",
                boxShadow: "0 4px 14px rgba(238,116,41,0.35)",
              }}
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className={viewType === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" : "flex flex-col gap-5 max-w-4xl mx-auto"}>
            {visible.map((vendor, i) => (
              <motion.div
                key={vendor._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                className={viewType === "list" ? "w-full" : ""}
              >
                <VendorCard vendor={vendor} index={i} view={viewType} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-14">
            <div className="text-xs text-slate-400 mb-4 font-medium">
              Showing {visible.length} of {filtered.length} vendors
            </div>
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="relative px-10 py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 text-white overflow-hidden group"
              style={{
                background: isLoading
                  ? "var(--sw-light-gray)"
                  : "linear-gradient(135deg, var(--sw-navy) 0%, #2a3747 100%)",
                boxShadow: isLoading ? "none" : "0 6px 20px rgba(55,71,90,0.3)",
                color: isLoading ? "var(--sw-navy)" : "white",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    Load More Vendors
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                      style={{ background: "rgba(255,255,255,0.18)" }}
                    >
                      {Math.min(6, filtered.length - visibleCount)}
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        )}

        {/* All loaded message */}
        {visibleCount >= filtered.length && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12 text-xs text-slate-400 font-medium"
          >
            ✦ You&apos;ve seen all {filtered.length} vendors ✦
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Vendor Card ──────────────────────────────────────────────────────────────
function VendorCard({ vendor, index, view }: { vendor: PublicVendor; index: number; view: "grid" | "list" }) {
  const { currency } = useCurrency();
  const image = vendor.images?.[0] || fallbackImages[index % fallbackImages.length];
  const rating = vendor.rating || 0;

  const detailHref =
    vendor.category === "Venues"
      ? `/venues/${vendor.venueId || vendor._id}?type=venue`
      : vendor.category === "Rooms" && vendor.venueId
      ? `/venues/${vendor.venueId}?type=room`
      : `/${vendor._id}`;

  if (view === "list") {
    return (
      <article className="group flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-[24px] overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4">
        <div className="relative w-full sm:w-44 h-52 sm:h-44 rounded-[18px] overflow-hidden flex-shrink-0">
          <Image src={image} alt={vendor.businessName || vendor.name} fill sizes="(max-width: 640px) 100vw, 176px" className="object-cover" />
          {vendor.featured && (
            <span className="absolute top-2 left-2 rounded-full bg-primary-500 px-2.5 py-1 text-[9px] font-black uppercase text-white">Featured</span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white">{vendor.category}</span>
              {rating > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)} ({vendor.reviewCount || 0})
                </span>
              )}
              {vendor.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <Link href={detailHref}>
              <h2 className="text-xl font-extrabold text-slate-950 hover:text-primary-600 transition-colors leading-tight">
                {vendor.businessName || vendor.name}
              </h2>
            </Link>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin className="h-3.5 w-3.5 text-primary-500" />
              <span>{vendor.city}</span>
            </div>
            {vendor.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{vendor.description}</p>
            )}
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">Starts from</span>
              <span className="text-lg font-black text-slate-950">
                {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
              </span>
            </div>
            <Link href={detailHref} className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-600">
              View Details
            </Link>
          </div>
        </div>
      </article>
    );
  }

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
          <span className="rounded-full bg-primary-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
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

        <Link href={detailHref}>
          <h2 className="line-clamp-2 text-2xl font-extrabold leading-tight text-slate-950 hover:text-primary-600 transition-colors">
            {vendor.businessName || vendor.name}
          </h2>
        </Link>
        <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <MapPin className="h-4 w-4 text-primary-500" />
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
              {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
            </span>
          </div>
          <Link
            href={detailHref}
            className="rounded-full bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-600"
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
