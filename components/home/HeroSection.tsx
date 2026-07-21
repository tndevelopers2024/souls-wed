"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { ChevronDown, MapPin, Calendar, Users, Layers, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { useRouter } from "next/navigation";

const destinations = [
  "Paris",
  "New York",
  "London",
  "Tokyo",
  "Dubai",
  "Rome",
  "Bali",
  "Mumbai",
  "Jaipur",
  "Goa",
  "Udaipur",
  "Sydney",
  "Istanbul"
];

const guestRanges = [
  "Up to 50",
  "50 - 100",
  "100 - 250",
  "250 - 500",
  "500 - 1000",
  "1000+"
];

const words = ["Extraordinary", "Events,"];
const words2 = ["Effortlessly", "Planned"];

const bgVideos = [
  "/videos/home/98d54592b8b559aaba3a1be833d89a41.mp4", // Default
  "/videos/home/6443f7453a5075757e193491d6a69ea1.mp4",
  "/videos/home/dd38fc3826a28cf0ac334ea9e9835830.mp4",
  "/videos/home/6fd8249497054ca4fe24aaf816e55282.mp4",
];

export default function HeroSection() {
  const router = useRouter();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<"destination" | "category" | "date" | "guests" | null>(null);
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [guests, setGuests] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredGuests, setHoveredGuests] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % bgVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("city", destination);
    if (guests) params.append("guests", guests);
    if (dateRange) {
      params.append("start", dateRange.start);
      params.append("end", dateRange.end);
    }
    const path = category ? `/${category}` : "/vendors";
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="w-full px-3 md:px-2 lg:px-2 pt-3">
      <section className="relative min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center rounded-[32px] sm:rounded-[35px] border border-amber-100/60">
        {/* Background media and elements wrapper to contain overflow */}
        <div className="absolute inset-0 overflow-hidden rounded-[32px] sm:rounded-[35px] z-0">
          {/* Background image carousel */}
          <div className="absolute inset-0">
            <AnimatePresence>
              <motion.div
                key={currentVideoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <video
                  src={bgVideos[currentVideoIndex]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Simple dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-24 pb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ color: "var(--sw-chip-bg-hover)" }}
          >
            Flawless Moves. Perfect Events.
          </motion.div>

          {/* Headline Line 1 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2">
            <span className="flex flex-wrap justify-center gap-x-4">
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                  className="text-white"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Headline Line 2 — gold italic */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold italic leading-tight mb-6" style={{ color: "var(--sw-secondary)" }}>
            <span className="flex flex-wrap justify-center gap-x-4">
              {words2.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.36 + i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mb-12"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Book premier venues, flights, and vendors all in one place.
          </motion.p>

          {/* Floating Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-5xl xl:max-w-6xl"
          >
            <div
              ref={searchRef}
              className="rounded-[32px] md:rounded-full p-2 md:p-2.5 shadow-2xl flex flex-col gap-2 md:gap-0 md:flex-row items-center relative z-20 w-full"
              style={{
                background: "var(--sw-nav-default)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(238,116,41,0.15)",
              }}
              onMouseLeave={() => setHoveredSection(null)}
            >

              {/* Destination */}
              <div
                className={`flex-1 w-full md:w-auto px-6 py-2.5 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative ${openDropdown === "destination" ? "z-50" : "z-10"}`}
                onClick={() => setOpenDropdown(openDropdown === "destination" ? null : "destination")}
                onMouseEnter={() => setHoveredSection("destination")}
              >
                {(hoveredSection === "destination" || (!hoveredSection && openDropdown === "destination")) && (
                  <motion.div
                    layoutId="search-bar-section-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                      border: "1px solid rgba(238, 116, 41, 0.1)",
                      backdropFilter: "blur(12px) saturate(150%)",
                      boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                  />
                )}
                <label className="relative z-10 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-[var(--sw-primary)] cursor-pointer mb-0.5 pointer-events-none">Destination</label>
                <div className="relative z-10 w-full text-[15px] font-semibold truncate leading-tight flex items-center justify-between">
                  <span className={destination ? "text-gray-900" : "text-gray-500"}>
                    {destination || "Where to?"}
                  </span>
                </div>

                <AnimatePresence>
                  {openDropdown === "destination" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 mt-6 min-w-[240px] rounded-[28px] p-2 z-50 flex flex-col before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:bg-transparent"
                      style={{
                        background: "var(--sw-nav-default)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(238,116,41,0.15)",
                        boxShadow: "0 24px 60px rgba(238,116,41,0.12)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto custom-scrollbar pr-1" onMouseLeave={() => setHoveredDestination(null)}>
                        {destinations.map((d) => {
                          const isActive = destination === d;
                          const isHovered = hoveredDestination === d;
                          const showPill = isHovered || (!hoveredDestination && isActive);

                          return (
                            <button
                              key={d}
                              className="relative flex items-center px-4 py-2.5 text-sm font-medium transition-colors z-10 w-full text-left rounded-full"
                              style={{ color: isActive || showPill ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                              onClick={() => {
                                setDestination(d);
                                setOpenDropdown(null);
                              }}
                              onMouseEnter={() => setHoveredDestination(d)}
                            >
                              {showPill && (
                                <motion.div
                                  layoutId="destination-dropdown-pill"
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                    border: "1px solid rgba(238, 116, 41, 0.2)",
                                    backdropFilter: "blur(12px)",
                                    zIndex: -1,
                                  }}
                                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                />
                              )}
                              <span className="relative z-10 w-full font-bold">{d}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-200 mx-1" />

              {/* Date */}
              <div
                className={`flex-1 w-full md:w-auto px-6 py-2.5 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative ${openDropdown === "date" ? "z-50" : "z-10"}`}
                onClick={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
                onMouseEnter={() => setHoveredSection("date")}
              >
                {(hoveredSection === "date" || (!hoveredSection && openDropdown === "date")) && (
                  <motion.div
                    layoutId="search-bar-section-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                      border: "1px solid rgba(238, 116, 41, 0.1)",
                      backdropFilter: "blur(12px) saturate(150%)",
                      boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                  />
                )}
                <label className="relative z-10 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-[var(--sw-primary)] cursor-pointer mb-0.5 pointer-events-none">Dates</label>
                <div className="relative z-10 w-full text-[15px] font-semibold truncate leading-tight flex items-center justify-between">
                  <span className={dateRange ? "text-gray-900" : "text-gray-500"}>
                    {dateRange ? (() => {
                      const formatDate = (ds: string) => {
                        const [y, m, d] = ds.split('-').map(Number);
                        return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      };
                      return dateRange.start === dateRange.end
                        ? formatDate(dateRange.start)
                        : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
                    })() : "Add dates"}
                  </span>
                </div>

                <AnimatePresence>
                  {openDropdown === "date" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[300px] sm:w-[340px] rounded-[28px] p-4 sm:p-5 z-50 flex flex-col before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:bg-transparent"
                      style={{
                        background: "var(--sw-nav-default)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(238,116,41,0.15)",
                        boxShadow: "0 24px 60px rgba(238,116,41,0.12)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BookingCalendar
                        mode="range"
                        bookedDates={[]}
                        providerId="home-search"
                        selectedRange={dateRange}
                        onRangeSelect={(start, end) => {
                          setDateRange({ start, end });
                          setOpenDropdown(null);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-200 mx-1" />

              {/* Guests */}
              <div
                className={`flex-1 w-full md:w-auto px-6 py-2.5 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative ${openDropdown === "guests" ? "z-50" : "z-10"}`}
                onClick={() => setOpenDropdown(openDropdown === "guests" ? null : "guests")}
                onMouseEnter={() => setHoveredSection("guests")}
              >
                {(hoveredSection === "guests" || (!hoveredSection && openDropdown === "guests")) && (
                  <motion.div
                    layoutId="search-bar-section-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                      border: "1px solid rgba(238, 116, 41, 0.1)",
                      backdropFilter: "blur(12px) saturate(150%)",
                      boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                  />
                )}
                <label className="relative z-10 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-[var(--sw-primary)] cursor-pointer mb-0.5 pointer-events-none">Guests</label>
                <div className="relative z-10 w-full text-[15px] font-semibold truncate leading-tight flex items-center justify-between">
                  <span className={guests ? "text-gray-900" : "text-gray-500"}>
                    {guests || "Add guests"}
                  </span>
                </div>

                <AnimatePresence>
                  {openDropdown === "guests" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 mt-6 min-w-[200px] rounded-[28px] p-2 z-50 flex flex-col before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:bg-transparent"
                      style={{
                        background: "var(--sw-nav-default)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(238,116,41,0.15)",
                        boxShadow: "0 24px 60px rgba(238,116,41,0.12)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto custom-scrollbar pr-1" onMouseLeave={() => setHoveredGuests(null)}>
                        {guestRanges.map((g) => {
                          const isActive = guests === g;
                          const isHovered = hoveredGuests === g;
                          const showPill = isHovered || (!hoveredGuests && isActive);

                          return (
                            <button
                              key={g}
                              className="relative flex items-center px-4 py-2.5 text-sm font-medium transition-colors z-10 w-full text-left rounded-full"
                              style={{ color: isActive || showPill ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                              onClick={() => {
                                setGuests(g);
                                setOpenDropdown(null);
                              }}
                              onMouseEnter={() => setHoveredGuests(g)}
                            >
                              {showPill && (
                                <motion.div
                                  layoutId="guests-dropdown-pill"
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                    border: "1px solid rgba(238, 116, 41, 0.2)",
                                    backdropFilter: "blur(12px)",
                                    zIndex: -1,
                                  }}
                                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                />
                              )}
                              <span className="relative z-10 w-full font-bold">{g}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-200 mx-1" />

              {/* Category */}
              <div
                className={`flex-1 w-full md:w-auto px-6 py-2.5 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative ${openDropdown === "category" ? "z-50" : "z-10"}`}
                onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                onMouseEnter={() => setHoveredSection("category")}
              >
                {(hoveredSection === "category" || (!hoveredSection && openDropdown === "category")) && (
                  <motion.div
                    layoutId="search-bar-section-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                      border: "1px solid rgba(238, 116, 41, 0.1)",
                      backdropFilter: "blur(12px) saturate(150%)",
                      boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                  />
                )}
                <label className="relative z-10 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-[var(--sw-primary)] cursor-pointer mb-0.5 pointer-events-none">Category</label>
                <div className="relative z-10 w-full text-[15px] font-semibold truncate leading-tight flex items-center justify-between">
                  <span className={category ? "text-gray-900" : "text-gray-500"}>
                    {category ? VENDOR_CATEGORIES.find(c => c.slug === category)?.name : "All Categories"}
                  </span>
                </div>

                <AnimatePresence>
                  {openDropdown === "category" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 mt-6 min-w-[280px] rounded-[28px] p-2 z-50 flex flex-col before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:bg-transparent"
                      style={{
                        background: "var(--sw-nav-default)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(238,116,41,0.15)",
                        boxShadow: "0 24px 60px rgba(238,116,41,0.12)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto custom-scrollbar pr-1" onMouseLeave={() => setHoveredCategory(null)}>
                        {VENDOR_CATEGORIES.map((c) => {
                          const isActive = category === c.slug;
                          const isHovered = hoveredCategory === c.slug;
                          const showPill = isHovered || (!hoveredCategory && isActive);

                          return (
                            <button
                              key={c.slug}
                              className="relative flex items-center px-4 py-2.5 text-sm font-medium transition-colors z-10 w-full text-left rounded-full"
                              style={{ color: isActive || showPill ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                              onClick={() => {
                                setCategory(c.slug);
                                setOpenDropdown(null);
                              }}
                              onMouseEnter={() => setHoveredCategory(c.slug)}
                            >
                              {showPill && (
                                <motion.div
                                  layoutId="category-dropdown-pill"
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                    border: "1px solid rgba(238, 116, 41, 0.2)",
                                    backdropFilter: "blur(12px)",
                                    zIndex: -1,
                                  }}
                                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                />
                              )}
                              <span className="relative z-10 w-full font-bold">{c.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <div className="w-full md:w-auto mt-2 md:mt-0 md:ml-2">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 md:py-3.5 rounded-full font-bold transition-colors duration-300 h-[52px]"
                  style={{ transform: 'none' }}
                >
                  <Search className="w-4 h-4 text-white font-bold" strokeWidth={3} />
                  <span className="text-[15px]">Search</span>
                </button>
              </div>

            </div>
          </motion.div>
        </div>


      </section>
    </div>
  );
}
