"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X, MapPin, Star, Building2, Globe, LayoutGrid, List, Loader2, Sparkles } from "lucide-react";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilterBar from "@/components/venues/VenueFilterBar";
import type { Venue } from "@/lib/venues-data";

const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Highest Rated"];

export default function VenuesPage() {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCities, setActiveCities] = useState<string[]>([]);
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // ── Fetch venues from MongoDB API ──────────────────────────────────────────
  useEffect(() => {
    setFetchLoading(true);
    setFetchError(null);
    fetch("/api/venues")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load venues");
        return res.json();
      })
      .then((data) => {
        // Map MongoDB doc shape (venueId) back to Venue interface (id)
        const mapped = (data.venues ?? []).map((v: Record<string, unknown>) => ({
          ...v,
          id: v.venueId as string,
        })) as Venue[];
        setAllVenues(mapped);
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setFetchLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...allVenues];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
      );
    }

    if (activeCities.length > 0) {
      list = list.filter(
        (v) =>
          activeCities.some((city) =>
            v.city.toLowerCase().includes(city.toLowerCase()) ||
            v.location.toLowerCase().includes(city.toLowerCase())
          )
      );
    }

    if (sort === "Price: Low to High") {
      list.sort((a, b) => {
        const av = parseInt(a.price.replace(/[^\d]/g, ""));
        const bv = parseInt(b.price.replace(/[^\d]/g, ""));
        return av - bv;
      });
    } else if (sort === "Price: High to Low") {
      list.sort((a, b) => {
        const av = parseInt(a.price.replace(/[^\d]/g, ""));
        const bv = parseInt(b.price.replace(/[^\d]/g, ""));
        return bv - av;
      });
    } else if (sort === "Highest Rated") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [search, activeCities, sort, allVenues]);

  const visible = filtered.slice(0, visibleCount);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [search, activeCities, sort]);

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

  // Loading skeleton
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--sw-white)" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--sw-primary)" }} />
        <p className="text-sm text-slate-500 font-medium">Loading venues from database...</p>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: "var(--sw-white)" }}>
        <Building2 className="w-12 h-12 text-red-400" />
        <p className="text-base font-bold text-slate-700">Failed to load venues</p>
        <p className="text-sm text-slate-400">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all"
          style={{ background: "var(--sw-primary)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <div className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden pt-16 pb-16 px-4 text-center rounded-[40px] border border-primary-50/60"
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
            Explore Dream Venues
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
          >
            Wedding{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, var(--sw-primary) 0%, #f5a623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Venues
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Discover extraordinary spaces — from regal palaces to serene backwater resorts — curated for your perfect celebration.
          </p>

        </motion.div>

      </div>
      </div>

      {/* ══════════════════════ STICKY FILTER BAR ══════════════════════ */}
      <VenueFilterBar
        activeCities={activeCities}
        onCityChange={setActiveCities}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by venue name, city, or location…"
      />

      {/* ══════════════════════ MAIN CONTENT ══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">{filtered.length}</span>{""}
              venue{filtered.length !== 1 ? "s" : ""}
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
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
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
                className={`p-1.5 rounded-full transition-all ${
                  viewType === "grid" 
                    ?"bg-white shadow-sm text-[var(--sw-primary)]"
                    :"text-slate-400 hover:text-slate-600"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-1.5 rounded-full transition-all ${
                  viewType === "list" 
                    ?"bg-white shadow-sm text-[var(--sw-primary)]"
                    :"text-slate-400 hover:text-slate-600"
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold"
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
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between"
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

        {/* Grid */}
        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28 flex flex-col items-center"
          >
            {/* Illustrated empty state */}
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #fceee3 0%, #fdf6f0 100%)" }}
            >
              <Building2 className="w-12 h-12" style={{ color: "var(--sw-primary)", opacity: 0.5 }} />
            </div>
            <p
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
            >
              No venues found
            </p>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              We couldn't find venues matching your filters. Try adjusting your search or clearing some filters.
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
            {visible.map((venue, i) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                className={viewType === "list" ? "w-full" : ""}
              >
                <VenueCard venue={venue} view={viewType} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-14">
            <div className="text-xs text-slate-400 mb-4 font-medium">
              Showing {visible.length} of {filtered.length} venues
            </div>
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="relative px-10 py-4 rounded-full font-bold text-sm text-white overflow-hidden group"
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
                    <span
                      className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"
                    />
                    Loading…
                  </>
                ) : (
                  <>
                    Load More Venues
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
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
            You've seen all {filtered.length} venues
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
