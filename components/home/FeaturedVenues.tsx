"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import VenueCard from "@/components/venues/VenueCard";
import { venues } from "@/lib/venues-data";

export default function FeaturedVenues() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use the first 6 featured venues from the real data source
  const featuredList = venues.filter(v => v.featured).slice(0, 6);
  // Fallback to regular venues if not enough featured ones
  const displayVenues = featuredList.length > 0 ? featuredList : venues.slice(0, 6);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sw-orange)" }}>
              Top Picks
            </p>
            <h2 className="section-heading">Amazing Venues</h2>
            <p className="section-subtext">Best destinations at best prices</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/category/venues"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3"
              style={{ background: "var(--sw-white)", color: "var(--sw-navy)" }}
            >
              Search more <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--sw-white)", border: "0px solid var(--sw-light-gray)" }}>
                <ChevronLeft className="w-5 h-5" style={{ color: "var(--sw-navy)" }} />
              </button>
              <button onClick={() => scroll("right")} className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--sw-navy)" }}>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scroll row */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-scroll pb-4" style={{ scrollbarWidth: "none" }}>
          {displayVenues.map((venue, i) => (
            <motion.div
              key={venue.id}
              className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ scrollSnapAlign: "start" }}
            >
               {/* Setting a specific height so the card proportions look great in the horizontal scroller */}
               <div className="h-[480px] sm:h-[520px] md:h-[560px] lg:h-[580px] w-full">
                 <VenueCard venue={venue} view="grid" />
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
