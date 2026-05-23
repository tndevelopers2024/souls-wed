"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star } from "lucide-react";

const venues = [
  {
    id: 1,
    name: "The Grand Palace",
    location: "Udaipur, Rajasthan",
    capacity: "Up to 800 guests",
    rating: 4.9,
    priceFrom: "₹2.5L",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  },
  {
    id: 2,
    name: "Beachside Bliss Resort",
    location: "Goa, India",
    capacity: "Up to 300 guests",
    rating: 4.8,
    priceFrom: "₹1.8L",
    image: "https://images.unsplash.com/photo-1520962922320-2038eebab146?w=600&q=80",
  },
  {
    id: 3,
    name: "Sky Garden Venue",
    location: "Mumbai, Maharashtra",
    capacity: "Up to 500 guests",
    rating: 4.7,
    priceFrom: "₹3.2L",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&q=80",
  },
  {
    id: 4,
    name: "Royal Haveli Retreat",
    location: "Jaipur, Rajasthan",
    capacity: "Up to 600 guests",
    rating: 4.9,
    priceFrom: "₹4L",
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&q=80",
  },
  {
    id: 5,
    name: "Marina Bay Ballroom",
    location: "Dubai, UAE",
    capacity: "Up to 1000 guests",
    rating: 5.0,
    priceFrom: "₹8L",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80",
  },
  {
    id: 6,
    name: "Cliff Edge Estate",
    location: "Bali, Indonesia",
    capacity: "Up to 200 guests",
    rating: 4.8,
    priceFrom: "₹2.1L",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80",
  },
];

export default function FeaturedVenues() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-hidden" style={{ background: "var(--sw-peach)" }}>
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
            <h2 className="section-heading">Dream Venues Await</h2>
            <p className="section-subtext">Handpicked halls for your perfect celebration</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "var(--sw-white)", border: "1px solid var(--sw-light-gray)" }}
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
        </motion.div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-scroll pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {venues.map((venue, i) => (
            <motion.div
              key={venue.id}
              className="flex-shrink-0 w-72 md:w-80 h-[420px] relative rounded-3xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                sizes="(max-width: 768px) 288px, 320px"
                priority={i === 0}
                className="object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 30%, rgba(47,56,67,0.92) 100%)",
                }}
              />

              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="glass text-white text-xs font-bold px-3 py-1.5 rounded-full !rounded-full flex items-center gap-1">
                  <span style={{ color: "var(--sw-gold)" }}>₹</span>
                  From {venue.priceFrom}
                </div>
                <div className="glass text-white text-xs font-bold px-3 py-1.5 rounded-full !rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "var(--sw-gold)" }} />
                  {venue.rating}
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className="text-xl font-bold text-white mb-1 leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {venue.name}
                </h3>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--sw-steel)" }} />
                  <span className="text-xs" style={{ color: "var(--sw-steel)" }}>{venue.location}</span>
                </div>
                <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {venue.capacity}
                </p>
                <button className="btn-glass !text-xs !px-4 !py-2.5 w-full text-center">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
