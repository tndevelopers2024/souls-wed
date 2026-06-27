"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, ArrowRight } from "lucide-react";

const venues = [
  {
    id: 1,
    name: "The Ritz-Carlton New York, NoMad",
    location: "New York, United States",
    price: "₹144,000",
    unit: "per day",
    rating: 5.0,
    verified: true,
    image: "/images/home/c90805ff23032394456bcd39453439e7.jpg",
  },
  {
    id: 2,
    name: "Conrad New York Downtown",
    location: "New York, United States",
    price: "₹50,000",
    unit: "per day",
    rating: 5.0,
    verified: true,
    image: "/images/home/2e738b599bbcea127cb885e1ed70756e.jpg",
  },
  {
    id: 3,
    name: "Refinery Hotel New York",
    location: "New York, United States",
    price: "₹38,000",
    unit: "per day",
    rating: 5.0,
    verified: true,
    image: "https://static.prod.r53.tablethotels.com/media/hotels/slideshow_images_staged/large/1268892.jpg",
  },
  {
    id: 4,
    name: "JW Marriott Hotel Hong Kong",
    location: "Hong Kong",
    price: "₹27,000",
    unit: "per day",
    rating: 0,
    verified: true,
    image: "/images/home/499f83d693ddd970fa5579a15659fb61.jpg",
  },
  {
    id: 5,
    name: "InterContinental Grand Stanford Hong Kong",
    location: "Hong Kong",
    price: "₹17,000",
    unit: "per day",
    rating: 5.0,
    verified: true,
    image: "/images/home/95e86ad3ca2d4c9e98e2d291f01f8883.webp",
  },
  {
    id: 6,
    name: "Harbour Grand Hong Kong",
    location: "Hong Kong",
    price: "₹1,166,401",
    unit: "per engagement",
    rating: 5.0,
    verified: true,
    image: "/images/home/e2d6a695c47f4ca4b74e988fbe50da14.jpeg",
  },
];

export default function FeaturedVenues() {
  const scrollRef = useRef<HTMLDivElement>(null);
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
          {venues.map((venue, i) => (
            <motion.div
              key={venue.id}
              className="flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[340px] cursor-pointer"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Card Container */}
              <div className="bg-[#F4F4F4] p-1 rounded-[36px]">
                <div
                  className="relative h-[440px] sm:h-[500px] md:h-[560px] w-full"
                  style={{
                    clipPath: "inset(0 round 32px)",
                    WebkitClipPath: "inset(0 round 32px)",
                  }}
                >
                  {/* Full-bleed image */}
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px"
                    priority={i === 0}
                    className="object-cover"
                  />

                  {/* Rating chip — top left */}
                  {venue.rating > 0 && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-full" style={{ background: "rgba(255,255,255,0.92)", color: "var(--sw-navy)" }}>
                      <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" /> {venue.rating.toFixed(1)}
                    </div>
                  )}

                  {/* Frosted gradient mask overlay */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.5) 30%, transparent 55%)",
                      backdropFilter: "blur(8px)",
                      WebkitMaskImage: "linear-gradient(to top, black 36%, transparent 60%)",
                      maskImage: "linear-gradient(to top, black 36%, transparent 60%)"
                    }}
                  />

                  {/* Content over gradient */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col justify-end">
                    {/* Name + badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-tight tracking-tight text-slate-900 line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
                        {venue.name}
                      </h3>
                      {venue.verified && <BadgeCheck className="w-6 h-6 flex-shrink-0 text-white fill-[#16a34a]" />}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-5">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-600 line-clamp-1">{venue.location}</span>
                    </div>

                    {/* Price + button */}
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">from</span>
                        <span className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-none">{venue.price}</span>
                        <span className="text-xs text-slate-500 mt-1">{venue.unit}</span>
                      </div>
                      <button
                        className="text-[15px] sm:text-base font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all hover:scale-105 flex items-center gap-1.5"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          color: "#111827",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                        }}
                      >
                        Book <span className="text-xl leading-none font-medium text-slate-700">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
