"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";

const testimonials = [
  {
    id: 1,
    couple: "Priya & Arjun",
    date: "February 2025",
    venue: "Udaipur Palace",
    quote: "SoulsWed made our dream Udaipur wedding a reality. Every vendor was perfectly coordinated. Truly flawless!",
    image: "https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=800&q=80",
    stars: 5,
  },
  {
    id: 2,
    couple: "Meera & Rohan",
    date: "December 2024",
    venue: "Goa Beachside Resort",
    quote: "We planned our entire Goa beach wedding through SoulsWed in just 3 weeks. The booking process was seamless.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    stars: 5,
  },
  {
    id: 3,
    couple: "Ananya & Vikram",
    date: "March 2025",
    venue: "Dubai Marina Ballroom",
    quote: "A destination wedding in Dubai felt overwhelming until we found SoulsWed. They connected us with amazing vendors.",
    image: "https://images.unsplash.com/photo-1536321115970-5dfa13356211?w=800&q=80",
    stars: 5,
  },
  {
    id: 4,
    couple: "Divya & Karan",
    date: "January 2025",
    venue: "Jaipur Haveli",
    quote: "The royal Jaipur wedding we always dreamed of. SoulsWed's vendor network is unmatched — everything exceeded expectations.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    stars: 5,
  },
  {
    id: 5,
    couple: "Sana & Aditya",
    date: "April 2025",
    venue: "Bali Cliff Estate",
    quote: "We had the most magical Bali ceremony. SoulsWed made international wedding planning so simple. Everything was 10/10!",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    stars: 5,
  },
];

export default function TestimonialsSection() {
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
              Real Love Stories
            </p>
            <h2 className="section-heading">Couples Love SoulsWed</h2>
            <p className="section-subtext">Discover why thousands of couples trusted us</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button onClick={() => scroll("left")} className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--sw-white)", border: "1px solid var(--sw-light-gray)" }}>
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
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[360px] cursor-pointer group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="bg-[#F4F4F4] p-1 rounded-[36px]">
                <div
                  className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full"
                  style={{
                    clipPath: "inset(0 round 32px)",
                    WebkitClipPath: "inset(0 round 32px)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.couple}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Rating chip — top left */}
                  <div className="absolute top-4 left-4 z-30 flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-full shadow-sm" style={{ background: "rgba(255,255,255,0.92)", color: "var(--sw-navy)" }}>
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                  </div>

                  {/* Icon chip — top right */}
                  <div className="absolute top-4 right-4 z-30 flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.92)", color: "var(--sw-orange)" }}>
                    <Heart className="w-4 h-4 fill-current" />
                  </div>

                  {/* Frosted gradient overlay */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 40%, transparent 65%)",
                      backdropFilter: "blur(12px)",
                      WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 70%)",
                      maskImage: "linear-gradient(to top, black 45%, transparent 70%)",
                    }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex flex-col justify-end">
                    <Quote className="w-10 h-10 mb-4 opacity-20" style={{ color: "var(--sw-navy)" }} />
                    <p className="text-[17px] leading-relaxed font-medium text-slate-800 mb-6 italic" style={{ fontFamily: "var(--font-body)" }}>
                      "{item.quote}"
                    </p>
                    <div className="flex items-end justify-between pt-4 border-t border-slate-300/40">
                      <div className="flex flex-col">
                        <span className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-none mb-1" style={{ fontFamily: "var(--font-heading)" }}>{item.couple}</span>
                        <span className="text-sm font-medium" style={{ color: "var(--sw-orange)" }}>{item.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Controls */}
        <div className="md:hidden flex justify-center gap-2 mt-6">
          <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95" style={{ background: "var(--sw-white)", border: "1px solid var(--sw-light-gray)" }}>
            <ChevronLeft className="w-6 h-6" style={{ color: "var(--sw-navy)" }} />
          </button>
          <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95" style={{ background: "var(--sw-navy)" }}>
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
