"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, Check,
  Users, Coins, Building2, Layers, Sparkles, Globe2
} from "lucide-react";
import { cities } from "@/lib/venues-data";

const filters = [
  {
    label: "Guests",
    Icon: Users,
    options: ["Up to 100", "100–300", "300–600", "600+"],
  },
  {
    label: "Price Range",
    Icon: Coins,
    options: ["Under ₹50,000", "₹50k–₹2L", "₹2L–₹5L", "₹5L+"],
  },
  {
    label: "Venue Type",
    Icon: Building2,
    options: ["5-Star Hotel", "Resort", "Garden Venue", "Banquet Hall", "Palace"],
  },
  {
    label: "Space",
    Icon: Layers,
    options: ["Indoor", "Outdoor", "Both"],
  },
  {
    label: "Features",
    Icon: Sparkles,
    options: ["In-house Catering", "Parking", "Bridal Suite", "Overnight Stay"],
  },
];

// City emojis — venue-type/landscape based, not country-specific
const cityEmojis: Record<string, string> = {
  // India
  "Delhi NCR": "🏛️",
  "Mumbai": "🌊",
  "Bangalore": "🌸",
  "Goa": "🌴",
  "Jaipur": "🏰",
  "Udaipur": "⛵",
  "Kerala": "🌿",
  "Chennai": "🌅",
  // International
  "Paris": "🗼",
  "New York": "🗽",
  "London": "🎡",
  "Tokyo": "⛩️",
  "Dubai": "✨",
  "Rome": "🏛️",
  "Bali": "🌺",
  "Sydney": "🌉",
  "Istanbul": "🕌",
};

interface Props {
  activeCity: string;
  onCityChange: (city: string) => void;
}

export default function VenueFilterBar({ activeCity, onCityChange }: Props) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const toggleFilter = (label: string) =>
    setOpenFilter(openFilter === label ? null : label);

  const selectOption = (filterLabel: string, option: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterLabel]: option }));
    setOpenFilter(null);
  };

  const clearFilter = (filterLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = { ...activeFilters };
    delete next[filterLabel];
    setActiveFilters(next);
  };

  const activeCount = Object.keys(activeFilters).length;


  return (
    <div className="px-4 mt-6 mb-8">
      <div
        className="max-w-7xl mx-auto rounded-[2.5rem]"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          border: "1px solid rgba(238,116,41,0.12)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(238,116,41,0.05)",
        }}
      >
        {/* ═══════════ ROW 1 — Filter chips ═══════════ */}
        <div className="flex items-center justify-center gap-2 px-4 pt-4 pb-2 flex-wrap" style={{ scrollbarWidth: "none" }}>

          {/* Main filter button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
            style={{
              background: activeCount > 0
                ? "linear-gradient(135deg, var(--sw-orange) 0%, #f5932a 100%)"
                : "linear-gradient(135deg, var(--sw-navy) 0%, #2a3747 100%)",
              color: "white",
              boxShadow: activeCount > 0
                ? "0 6px 20px rgba(238,116,41,0.38)"
                : "0 6px 20px rgba(55,71,90,0.28)",
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            <AnimatePresence>
              {activeCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.28)" }}
                >
                  {activeCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="h-6 w-px flex-shrink-0" style={{ background: "rgba(0,0,0,0.08)" }} />

          {/* Filter chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap" style={{ scrollbarWidth: "none" }}>
            {filters.map((f) => {
              const isActive = !!activeFilters[f.label];
              const isOpen = openFilter === f.label;
              const { Icon } = f;

              return (
                <div key={f.label} className="relative flex-shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleFilter(f.label)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(238,116,41,0.12) 0%, rgba(245,163,42,0.08) 100%)"
                        : isOpen
                        ? "rgba(55,71,90,0.07)"
                        : "rgba(55,71,90,0.04)",
                      color: isActive ? "var(--sw-orange)" : "var(--sw-navy)",
                      border: isActive
                        ? "1.5px solid rgba(238,116,41,0.3)"
                        : isOpen
                        ? "1.5px solid rgba(55,71,90,0.18)"
                        : "1.5px solid rgba(55,71,90,0.1)",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(238,116,41,0.12)"
                        : isOpen
                        ? "0 0 0 3px rgba(55,71,90,0.06)"
                        : "none",
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ opacity: isActive ? 1 : 0.6 }}
                    />
                    <span>{isActive ? activeFilters[f.label] : f.label}</span>
                    {isActive ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => clearFilter(f.label, e)}
                        className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                        style={{ background: "rgba(238,116,41,0.18)" }}
                      >
                        <X className="w-2.5 h-2.5" style={{ color: "var(--sw-orange)" }} />
                      </motion.span>
                    ) : (
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-0 mt-2.5 w-60 rounded-3xl z-50 overflow-hidden"
                        style={{
                          background: "white",
                          border: "1px solid rgba(0,0,0,0.06)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
                        }}
                      >
                        {/* Dropdown header */}
                        <div
                          className="flex items-center gap-2 px-4 py-3"
                          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                        >
                          <Icon className="w-4 h-4" style={{ color: "var(--sw-orange)" }} />
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            {f.label}
                          </span>
                        </div>

                        <div className="py-1.5">
                          {f.options.map((opt) => {
                            const isSelected = activeFilters[f.label] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => selectOption(f.label, opt)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all hover:bg-orange-50/60 group"
                                style={{
                                  color: isSelected ? "var(--sw-orange)" : "var(--sw-navy)",
                                  fontWeight: isSelected ? 700 : 500,
                                }}
                              >
                                {opt}
                                <motion.span
                                  initial={false}
                                  animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <Check className="w-4 h-4" style={{ color: "var(--sw-orange)" }} />
                                </motion.span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Clear all */}
            <AnimatePresence>
              {activeCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setActiveFilters({})}
                  className="flex-shrink-0 text-xs font-semibold underline underline-offset-2 transition-colors hover:text-orange-500"
                  style={{ color: "var(--sw-navy)", opacity: 0.5 }}
                >
                  Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

          {/* ═══════════ ROW 2 — City circles ═══════════ */}
        <div className="px-4 pt-4 pb-4 mt-1 border-t border-slate-200/50">

          <div
            className="flex items-end justify-center gap-5 flex-wrap"
            style={{ paddingBottom: "2px" }}
          >
            {/* All Cities circle */}
            <motion.button
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onCityChange("")}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div
                className="relative transition-all duration-300"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  padding: activeCity === "" ? "3px" : "2px",
                  background: activeCity === ""
                    ? "linear-gradient(135deg, var(--sw-orange), #f5a623)"
                    : "rgba(55,71,90,0.1)",
                  boxShadow: activeCity === ""
                    ? "0 8px 24px rgba(238,116,41,0.35)"
                    : "none",
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: activeCity === ""
                      ? "linear-gradient(135deg, var(--sw-navy) 0%, #2a3747 100%)"
                      : "rgba(55,71,90,0.08)",
                  }}
                >
                  <Globe2
                    className="w-7 h-7"
                    style={{
                      color: activeCity === "" ? "white" : "var(--sw-navy)",
                      opacity: activeCity === "" ? 1 : 0.45,
                    }}
                  />
                </div>
              </div>
              <span
                className="text-[12px] font-bold transition-colors duration-200"
                style={{ color: activeCity === "" ? "var(--sw-orange)" : "#64748b" }}
              >
                All Cities
              </span>
            </motion.button>

            {/* City circles */}
            {cities.map((city) => {
              const isActive = activeCity === city.name;
              return (
                <motion.button
                  key={city.name}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onCityChange(city.name)}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  {/* Gradient ring + image */}
                  <div
                    className="relative transition-all duration-300"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      padding: isActive ? "3px" : "2px",
                      background: isActive
                        ? "linear-gradient(135deg, var(--sw-orange), #f5a623)"
                        : "rgba(0,0,0,0.08)",
                      boxShadow: isActive
                        ? "0 8px 24px rgba(238,116,41,0.35)"
                        : "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover transition-transform duration-500"
                        sizes="90px"
                        style={{ transform: isActive ? "scale(1.12)" : "scale(1)" }}
                      />
                      {/* Orange tint when active */}
                      {isActive && (
                        <div
                          className="absolute inset-0"
                          style={{ background: "rgba(238,116,41,0.15)" }}
                        />
                      )}
                    </div>

                    {/* Check badge */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: "var(--sw-orange)",
                          border: "2.5px solid white",
                          boxShadow: "0 2px 8px rgba(238,116,41,0.5)",
                        }}
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>

                  {/* City name */}
                  <span
                    className="text-[12px] font-bold transition-colors duration-200 leading-tight text-center"
                    style={{
                      color: isActive ? "var(--sw-orange)" : "#64748b",
                      maxWidth: 80,
                    }}
                  >
                    {city.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
