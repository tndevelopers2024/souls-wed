"use client";

import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, MapPin, Star, Heart, BadgeCheck,
  ChevronDown, LayoutGrid, List, Loader2, Users,
  SlidersHorizontal, Sparkles, Crown,
} from "lucide-react";
import { formatAsCurrency } from "@/lib/currency";
import { useCurrency } from "@/lib/CurrencyContext";
import VenueFilterBar from "@/components/venues/VenueFilterBar";
import ListingCard, { CardTag } from "@/components/shared/ListingCard";
import VendorCard from "@/components/vendors/VendorCard";
import WeddingCategoriesSection from "@/components/home/WeddingCategoriesSection";

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
  gallery?: string[];
  videos?: string[];
  heroImage?: string;
  contactPhone?: string;
  mapLink?: string;
  featured?: boolean;
  verified?: boolean;
  phone?: string;
  website?: string;
  instagram?: string;
  advancePercentage?: number;
}



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
};

export default function PublicVendorDirectory({
  vendors,
  activeCategory,
}: {
  vendors: PublicVendor[];
  activeCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [activeCities, setActiveCities] = useState<string[]>([]);
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
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

    if (activeCities.length > 0) {
      list = list.filter((v) =>
        activeCities.some((city) =>
          v.city.toLowerCase().includes(city.toLowerCase())
        )
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
  }, [vendors, search, activeCities, sort]);

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
  if (activeCities.length > 0) {
    activeCities.forEach((city) => {
      activeFilters.push({ label: city, onRemove: () => setActiveCities((prev) => prev.filter((c) => c !== city)) });
    });
  }
  if (sort !== "Recommended") activeFilters.push({ label: sort, onRemove: () => setSort("Recommended") });

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <div className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden pt-16 pb-16 px-4 text-center rounded-[40px] shadow-sm border border-primary-50/60"
          style={{
            background: "var(--sw-hero-gradient)",
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
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════ CATEGORIES ══════════════════════ */}
      <div className="bg-white">
        <WeddingCategoriesSection />
      </div>

      {/* ══════════════════════ STICKY FILTER BAR ══════════════════════ */}
      <VenueFilterBar
        activeCities={activeCities}
        onCityChange={setActiveCities}
        activeCategory={activeCategory || "All"}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={`Search by ${(activeCategory || "vendor").toLowerCase()} name, city, or specialty…`}
      />

      {/* ══════════════════════ MAIN CONTENT ══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">{filtered.length}</span>{""}
              {(activeCategory || "vendor").toLowerCase()}
              {filtered.length !== 1 && !(activeCategory || "vendor").toLowerCase().endsWith("s") ? "s" : ""}
              {activeCities.length > 0 && (
                <span>
                  {" "}in{" "}
                  <span className="font-bold" style={{ color: "var(--sw-primary)" }}>
                    {activeCities.join(", ")}
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
                      onClick={() => { setSearch(""); setActiveCities([]); setSort("Recommended"); }}
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
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setViewType("grid")}
                className={`p-1.5 rounded-full transition-all ${viewType === "grid"
                  ? "bg-white shadow-sm text-[var(--sw-primary)]"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-1.5 rounded-full transition-all ${viewType === "list"
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
              onClick={() => { setSearch(""); setActiveCities([]); setSort("Recommended"); }}
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
                <DirectoryItemCard vendor={vendor} index={i} view={viewType} />
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
                  : "linear-gradient(135deg, var(--sw-ink) 0%, #2a3747 100%)",
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
            className="text-center mt-12 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            You&apos;ve seen all {filtered.length} vendors
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Vendor Card ──────────────────────────────────────────────────────────────
function DirectoryItemCard({ vendor, index, view }: { vendor: PublicVendor; index: number; view: "grid" | "list" }) {
  const { currency } = useCurrency();
  const image = vendor.images?.[0] || fallbackImages[index % fallbackImages.length];
  const rating = vendor.rating || 0;

  const detailHref =
    vendor.category === "Venues"
      ? `/venues/${vendor.venueId || vendor._id}?type=venue`
      : vendor.category === "Rooms" && vendor.venueId
        ? `/venues/${vendor.venueId}?type=room`
        : `/vendor/${vendor._id}`;

  if (view === "list") {
    return (
      <Link href={detailHref} className="group block">
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-[280px] h-[220px] sm:h-auto flex-shrink-0">
            <Image src={image} alt={vendor.businessName || vendor.name} fill sizes="(max-width: 640px) 100vw, 280px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            {vendor.featured && (
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Crown className="w-3.5 h-3.5" style={{ color: "var(--sw-primary)" }} />
                <span className="text-xs font-bold text-slate-800 tracking-wide">Featured</span>
              </div>
            )}
            <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white transition-colors" onClick={(e) => e.preventDefault()}>
              <Heart className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1" style={{ fontFamily: "var(--font-heading)" }}>{vendor.businessName || vendor.name}</h3>
                {rating > 0 && (
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-secondary)" }} fill="var(--sw-secondary)" />
                    <span className="text-sm font-bold text-slate-800">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{vendor.city}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
                  <span>{vendor.category}</span>
                </div>
                {vendor.verified && (
                  <div className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end justify-between pt-4 border-t border-slate-50 mt-4">
              <div>
                {vendor.priceFrom ? (
                  <>
                    <span className="text-xs font-medium text-slate-500 block mb-0.5">Starting from</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-slate-900">{formatAsCurrency(vendor.priceFrom, currency)}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-xl font-bold text-slate-900">On request</span>
                )}
              </div>
              <span className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 text-sm font-bold rounded-full transition-colors border border-slate-200">
                Book +
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={detailHref} className="block group">
      <div className="h-[460px] sm:h-[500px] lg:h-[540px]">
        <VendorCard
          id={vendor._id}
          name={vendor.businessName || vendor.name}
          image={image}
          location={vendor.city}
          rating={rating}
          reviewCount={vendor.reviewCount || 0}
          price={vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
          unit=""
          badge={
            vendor.featured ? (
              <div
                className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ background: "var(--sw-primary)" }}
              >
                <Crown className="w-3.5 h-3.5" />
                Featured
              </div>
            ) : undefined
          }
          tags={
            <>
              <div
                className="flex items-center text-[11px] font-bold px-3 py-1.5 rounded-full bg-white shadow-sm"
                style={{ color: "var(--sw-primary)" }}
              >
                {vendor.category}
              </div>
              {vendor.verified && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white text-emerald-700 shadow-sm">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              )}
            </>
          }
        />
      </div>
    </Link>
  );
}
