"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Loader2 } from "lucide-react";
import VenueCard from "@/components/venues/VenueCard";
import type { Venue } from "@/lib/venues-data";

export default function FeaturedVenues() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch venues that admins have verified — verified = approved for public display
  useEffect(() => {
    fetch("/api/venues?verified=true&limit=12")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const mapped = (data.venues ?? []).map((v: Record<string, unknown>) => ({
          ...v,
          id: v.venueId as string,
        })) as Venue[];
        setVenues(mapped.slice(0, 8));
      })
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  // Don't render the section at all if no featured venues exist
  if (!loading && venues.length === 0) return null;

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center text-center mb-8 md:mb-10 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sw-primary)" }}>
              Top Picks
            </p>
            <h2 className="section-heading">Amazing Venues</h2>
            <p className="section-subtext mx-auto">Best destinations at best prices</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/venues"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3"
              style={{ background: "var(--sw-white)", color: "var(--sw-navy)" }}
            >
              Search more <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--sw-white)", border: "0px solid var(--sw-light-gray)" }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: "var(--sw-navy)" }} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--sw-ink)" }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px] h-[500px] rounded-[32px] animate-pulse"
                style={{ background: "var(--sw-light-gray, #f1f5f9)" }}
              />
            ))}
          </div>
        )}

        {/* Scroll row — only shown when data is ready */}
        {!loading && (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-scroll pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {venues.map((venue, i) => (
              <motion.div
                key={venue.id}
                className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px]"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="h-[460px] sm:h-[500px] lg:h-[540px] w-full">
                  <VenueCard venue={venue} view="grid" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
