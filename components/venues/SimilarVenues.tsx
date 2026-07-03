"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, ArrowRight, Crown } from "lucide-react";
import type { Venue } from "@/lib/venues-data";
import VenueCard from "@/components/venues/VenueCard";

interface SimilarVenuesProps {
  venues: Venue[];
}

export default function SimilarVenues({ venues }: SimilarVenuesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  };

  if (venues.length === 0) return null;

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "var(--sw-orange)" }}>
              You May Also Like
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
              Similar Venues
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/venues"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3"
              style={{ background: "var(--sw-white)", color: "var(--sw-navy)" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--sw-white)" }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: "var(--sw-navy)" }} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--sw-navy)" }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

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
               {/* Match the exact height configuration from FeaturedVenues */}
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
