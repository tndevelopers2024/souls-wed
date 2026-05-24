"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, ArrowRight, Crown } from "lucide-react";
import type { Venue } from "@/lib/venues-data";

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
    <section className="py-16 overflow-hidden" style={{ background: "var(--sw-peach)" }}>
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
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {venues.map((venue, i) => (
            <motion.div
              key={venue.id}
              className="flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[340px]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ scrollSnapAlign: "start" }}
            >
              <Link href={`/venues/${venue.id}`} className="block bg-[#F4F4F4] p-1 rounded-[36px] group cursor-pointer">
                <div
                  className="relative h-[440px] sm:h-[500px] w-full"
                  style={{ clipPath: "inset(0 round 32px)", WebkitClipPath: "inset(0 round 32px)" }}
                >
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px"
                    className="object-cover"
                  />

                  {/* Featured badge */}
                  {venue.featured && (
                    <div
                      className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full text-white"
                      style={{ background: "var(--sw-orange)" }}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      Featured
                    </div>
                  )}

                  {/* Rating chip */}
                  {venue.rating > 0 && (
                    <div
                      className="absolute top-4 right-4 z-30 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-full"
                      style={{ background: "rgba(255,255,255,0.92)", color: "var(--sw-navy)" }}
                    >
                      <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                      {venue.rating.toFixed(1)}
                    </div>
                  )}

                  {/* Frosted gradient */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.5) 30%, transparent 55%)",
                      backdropFilter: "blur(8px)",
                      WebkitMaskImage: "linear-gradient(to top, black 36%, transparent 60%)",
                      maskImage: "linear-gradient(to top, black 36%, transparent 60%)",
                    }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3
                        className="text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight text-slate-900 line-clamp-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {venue.name}
                      </h3>
                      {venue.verified && <BadgeCheck className="w-6 h-6 flex-shrink-0 text-white fill-[#16a34a]" />}
                    </div>
                    <div className="flex items-center gap-1.5 mb-5">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-600 line-clamp-1">
                        {venue.city}, {venue.country}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">from</span>
                        <span className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-none">
                          {venue.price}
                        </span>
                        <span className="text-xs text-slate-500 mt-1">{venue.priceUnit}</span>
                      </div>
                      <span
                        className="text-[15px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5"
                        style={{ background: "rgba(255,255,255,0.9)", color: "#111827" }}
                      >
                        View <span className="text-xl leading-none font-medium text-slate-700">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
