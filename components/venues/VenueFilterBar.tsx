"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, Check,
  Users, Coins, Building2, Layers, Sparkles, Globe2,
  LayoutGrid, BedDouble, CalendarHeart, ChefHat, Palette, 
  ClipboardList, Utensils,
  ChevronRight, ChevronLeft
} from "lucide-react";
import { cities } from "@/lib/venues-data";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatAsCurrency, CURRENCIES } from "@/lib/currency";

const categoryLinks = [
  { label: "All", href: "/vendors", icon: LayoutGrid },
  { label: "Venues", href: "/venues", icon: Building2 },
  { label: "Rooms", href: "/rooms", icon: BedDouble },
  { label: "Planners", href: "/planners", icon: ClipboardList },
  { label: "Caterers", href: "/caterers", icon: Utensils },
  { label: "Decorators", href: "/decorators", icon: Palette },
];



interface Props {
  activeCity: string;
  onCityChange: (city: string) => void;
  activeCategory?: string;
}

export default function VenueFilterBar({ activeCity, onCityChange, activeCategory }: Props) {
  const { currency, setCurrency } = useCurrency();
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filters = useMemo(() => {
    let priceOptions = ["Under ₹50,000", "₹50k–₹2L", "₹2L–₹5L", "₹5L+"];
    if (currency !== "INR") {
      const p50k = formatAsCurrency(50000, currency);
      const p2L = formatAsCurrency(200000, currency);
      const p5L = formatAsCurrency(500000, currency);
      priceOptions = [`Under ${p50k}`, `${p50k}–${p2L}`, `${p2L}–${p5L}`, `${p5L}+`];
    }
    
    return [
      {
        label: "Guests",
        Icon: Users,
        options: ["Up to 100", "100–300", "300–600", "600+"],
      },
      {
        label: "Price Range",
        Icon: Coins,
        options: priceOptions,
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
  }, [currency]);

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
    <div className="px-4 mt-6 mb-8 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* ═══════════ ROW 0 — Creative Category Carousel ═══════════ */}
      <div 
        className="relative mx-auto rounded-[2rem] p-3 max-w-full"
        style={{
          background: "var(--sw-glass-panel)",
          backdropFilter: "blur(24px) saturate(200%)",
          border: "1px solid var(--sw-chip-bg)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.5)",
        }}
      >
        <div className="flex gap-2.5 flex-wrap justify-center items-center relative z-0">
          {categoryLinks.map((item) => {
            const isActive =
              (!activeCategory && item.label === "Venues") ||
              (activeCategory && item.label.toLowerCase() === activeCategory.toLowerCase());
              
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wide transition-all duration-300 group ${
                  isActive
                    ?"text-slate-900 bg-primary-50/80"
                    :"text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon 
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ?"text-primary-500":"text-slate-400 group-hover:text-primary-400"
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
                
                {isActive && (
                  <motion.div 
                    layoutId="activeCategoryBorder"
                    className="absolute inset-0 rounded-full border-2 border-primary-500 shadow-[0_4px_12px_rgba(238,116,41,0.2)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══════════ ROW 1 — Filter chips ═══════════ */}
      <div 
        ref={filterContainerRef} 
        className="flex items-center justify-center gap-2 flex-wrap relative z-40 mx-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Main filter button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
          style={{
            background: activeCount > 0
              ? "linear-gradient(135deg, var(--sw-primary) 0%, #f5932a 100%)"
              : "linear-gradient(135deg, var(--sw-ink) 0%, #2a3747 100%)",
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
        <div className="h-6 w-px flex-shrink-0 mx-1" style={{ background: "rgba(0,0,0,0.1)" }} />

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
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(238,116,41,0.12) 0%, rgba(245,163,42,0.08) 100%)"
                      : isOpen
                      ? "white"
                      : "var(--sw-chip-bg)",
                    color: isActive ? "var(--sw-primary)" : "var(--sw-navy)",
                    border: isActive
                      ? "1.5px solid rgba(238,116,41,0.3)"
                      : isOpen
                      ? "1.5px solid rgba(55,71,90,0.15)"
                      : "1.5px solid rgba(55,71,90,0.08)",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(238,116,41,0.12)"
                      : isOpen
                      ? "0 8px 24px rgba(0,0,0,0.06)"
                      : "0 2px 8px rgba(0,0,0,0.03)",
                    backdropFilter: "blur(12px)",
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
                      className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer ml-1"
                      style={{ background: "rgba(238,116,41,0.18)" }}
                    >
                      <X className="w-2.5 h-2.5" style={{ color: "var(--sw-primary)" }} />
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 ml-1"
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
                      className="absolute top-full left-0 mt-3 w-64 rounded-3xl z-50 overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Dropdown header */}
                      <div
                        className="flex items-center gap-2 px-5 py-3.5"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: "rgba(250,250,250,0.5)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "var(--sw-primary)" }} />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                          {f.label}
                        </span>
                      </div>

                      <div className="py-2">
                        {f.options.map((opt) => {
                          const isSelected = activeFilters[f.label] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => selectOption(f.label, opt)}
                              className="w-full flex items-center justify-between px-5 py-3 text-sm transition-all hover:bg-primary-50/80 group"
                              style={{
                                color: isSelected ? "var(--sw-primary)" : "var(--sw-navy)",
                                fontWeight: isSelected ? 700 : 500,
                              }}
                            >
                              {opt}
                              <motion.span
                                initial={false}
                                animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Check className="w-4 h-4" style={{ color: "var(--sw-primary)" }} />
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
                className="flex-shrink-0 text-xs font-bold underline underline-offset-4 transition-colors hover:text-primary-500 ml-2"
                style={{ color: "var(--sw-navy)", opacity: 0.6 }}
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══════════ ROW 2 — City circles ═══════════ */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Destinations</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-200" />
        </div>

        <div
          className="flex items-end justify-center gap-4 flex-wrap"
          style={{ paddingBottom: "4px" }}
        >
          {/* All Cities circle */}
          <motion.button
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCityChange("")}
            className="flex-shrink-0 flex flex-col items-center gap-2.5"
          >
            <div
              className="relative transition-all duration-300"
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                padding: activeCity === "" ? "3px" : "2px",
                background: activeCity === ""
                  ? "linear-gradient(135deg, var(--sw-primary), #f5a623)"
                  : "rgba(55,71,90,0.06)",
                boxShadow: activeCity === ""
                  ? "0 8px 24px rgba(238,116,41,0.4)"
                  : "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  background: activeCity === ""
                    ? "linear-gradient(135deg, var(--sw-ink) 0%, #1e293b 100%)"
                    : "white",
                }}
              >
                {activeCity === "" && (
                   <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                )}
                <Globe2
                  className="w-7 h-7 relative z-10"
                  style={{
                    color: activeCity === "" ? "white" : "var(--sw-navy)",
                    opacity: activeCity === "" ? 1 : 0.5,
                  }}
                />
              </div>
            </div>
            <span
              className="text-[11px] font-extrabold transition-colors duration-200 uppercase tracking-wider"
              style={{ color: activeCity === "" ? "var(--sw-primary)" : "#64748b" }}
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
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onCityChange(city.name)}
                className="flex-shrink-0 flex flex-col items-center gap-2.5 group"
              >
                {/* Gradient ring + image */}
                <div
                  className="relative transition-all duration-300"
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    padding: isActive ? "3px" : "2px",
                    background: isActive
                      ? "linear-gradient(135deg, var(--sw-primary), #f5a623)"
                      : "rgba(0,0,0,0.04)",
                    boxShadow: isActive
                      ? "0 8px 24px rgba(238,116,41,0.4)"
                      : "0 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="76px"
                      style={{ transform: isActive ? "scale(1.15)" : "scale(1)" }}
                    />
                    {/* Orange tint when active */}
                    {isActive && (
                      <div
                        className="absolute inset-0"
                        style={{ background: "rgba(238,116,41,0.2)" }}
                      />
                    )}
                  </div>

                  {/* Check badge */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: "var(--sw-primary)",
                        border: "2px solid white",
                        boxShadow: "0 4px 12px rgba(238,116,41,0.5)",
                      }}
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* City name */}
                <span
                  className="text-[11px] font-extrabold transition-colors duration-200 uppercase tracking-wider text-center"
                  style={{
                    color: isActive ? "var(--sw-primary)" : "#64748b",
                    maxWidth: 76,
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
  );
}
