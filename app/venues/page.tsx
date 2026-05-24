"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilterBar from "@/components/venues/VenueFilterBar";
import { venues } from "@/lib/venues-data";

const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Highest Rated"];

export default function VenuesPage() {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    let list = [...venues];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
      );
    }

    if (activeCity) {
      list = list.filter(
        (v) =>
          v.city.toLowerCase().includes(activeCity.toLowerCase()) ||
          v.location.toLowerCase().includes(activeCity.toLowerCase())
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
      // Recommended: featured first
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [search, activeCity, sort]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>
      {/* Hero Banner */}
      <div
        className="pt-28 pb-14 px-4 text-center"
        style={{ background: "linear-gradient(135deg, var(--sw-peach) 0%, #f9ede0 100%)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--sw-orange)" }}
          >
            Find Your Dream Venue
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
          >
            Wedding Venues
          </h1>
          <p className="text-base text-slate-600 mb-8 max-w-lg mx-auto">
            Discover extraordinary spaces across the world — from regal palaces to backwater resorts
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--sw-orange)" }}
            />
            <input
              type="text"
              placeholder="Search by venue name, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-full text-sm font-medium outline-none border"
              style={{
                background: "white",
                borderColor: "rgba(0,0,0,0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                color: "var(--sw-navy)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Sticky filter bar */}
      <VenueFilterBar activeCity={activeCity} onCityChange={setActiveCity} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">{filtered.length}</span> venues
            {activeCity && (
              <span>
                {" "}in{" "}
                <span className="font-bold" style={{ color: "var(--sw-orange)" }}>
                  {activeCity}
                </span>
              </span>
            )}
          </p>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all"
              style={{ borderColor: "var(--sw-light-gray)", color: "var(--sw-navy)" }}
            >
              {sort}
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)" }}
              />
            </button>
            {sortOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-[20px] overflow-hidden z-50 py-1.5"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                }}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setSortOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-orange-50"
                    style={{
                      fontWeight: sort === opt ? 700 : 500,
                      color: sort === opt ? "var(--sw-orange)" : "var(--sw-navy)",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl font-bold text-slate-300 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              No venues found
            </p>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((venue, i) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <VenueCard venue={venue} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 text-white"
              style={{
                background: "var(--sw-navy)",
                boxShadow: "0 4px 14px rgba(55,71,90,0.25)",
              }}
            >
              Load More Venues
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
