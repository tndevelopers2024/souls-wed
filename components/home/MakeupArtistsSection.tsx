"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Sparkles, ArrowRight, Heart } from "lucide-react";

const artists = [
  {
    id: 0,
    name: "Almudena Persa Makeup & Hair",
    location: "Marbella, Spain",
    price: "₹13,359",
    unit: "per booking",
    rating: 0,
    verified: true,
    tag: "Bridal Specialist",
    image: "/images/home/3bd5b7a48e6e5d2aa756803d28df2bc7.png",
  },
  {
    id: 1,
    name: "Alisa Lyons",
    location: "Los Angeles, USA",
    price: "₹13,359",
    unit: "per booking",
    rating: 0,
    verified: true,
    tag: "Bridal Specialist",
    image: "/images/home/701053e1dcc44c7f2f0862f42cc9d39b.jpg",
  },
  {
    id: 2,
    name: "Bella Bridal Beauty",
    location: "Sydney, Australia",
    price: "₹13,359",
    unit: "per booking",
    rating: 0,
    verified: true,
    tag: "Airbrush Expert",
    image: "/images/home/4933416287a892e453bb299fc5ad60fc.jpg",
  },
  {
    id: 3,
    name: "Ishita Poddar MUA",
    location: "Auckland, New Zealand",
    price: "₹6,650",
    unit: "per booking",
    rating: 0,
    verified: true,
    tag: "Natural Glam",
    image: "/images/home/72e1eab35a429a87adad5c46f0fbd7f8.jpg",
  },
];

export default function MakeupArtistsSection() {
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
              Look Your Best
            </p>
            <h2 className="section-heading">Makeup Artists</h2>
            <p className="section-subtext">Beauty and the brushes</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/category/makeup" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3" style={{ background: "var(--sw-peach)", color: "var(--sw-navy)" }}>
              Search more <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex gap-2">
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
          {artists.map((item, i) => (
            <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px] cursor-pointer block group"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative rounded-[24px] overflow-hidden shadow-sm border border-slate-100 w-full h-[440px] sm:h-[480px] lg:h-[520px]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px"
                        className="object-cover"
                      />

                      {/* Tag pill top-left */}
                      {item.rating > 0 && (
                        <div
                          className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                          style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
                        >
                          <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                          <span className="text-slate-800">{item.rating.toFixed(1)}</span>
                        </div>
                      )}

                      {/* Heart pill top-right */}
                      <button
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* Progressive frosted blur */}
                      <div className="absolute inset-x-0 bottom-0 h-[72%] z-10 pointer-events-none">
                        {[
                          { blur: 1, solid: 55, fade: 100 },
                          { blur: 3, solid: 42, fade: 78 },
                          { blur: 6, solid: 28, fade: 58 },
                          { blur: 12, solid: 16, fade: 40 },
                          { blur: 24, solid: 6, fade: 24 },
                        ].map((l, idx) => (
                          <div
                            key={idx}
                            className="absolute inset-0"
                            style={{
                              backdropFilter: `blur(${l.blur}px)`,
                              WebkitBackdropFilter: `blur(${l.blur}px)`,
                              maskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`,
                              WebkitMaskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`,
                            }}
                          />
                        ))}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 32%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.12) 78%, rgba(255,255,255,0) 92%)",
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pt-5 pb-4 flex flex-col">
                        <h3 className="text-[22px] font-bold leading-snug text-slate-900 line-clamp-2 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-700 line-clamp-1">{item.location}</span>
                        </div>

                        {/* Rating in content area */}
                        {item.rating > 0 && (
                          <div className="flex items-center mb-3 mt-1">
                            <div className="flex items-center gap-0.5 mr-1.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star 
                                  key={idx} 
                                  className="w-3.5 h-3.5" 
                                  style={{ color: "var(--sw-gold)" }} 
                                  fill={idx < Math.round(item.rating) ? "var(--sw-gold)" : "transparent"} 
                                />
                              ))}
                            </div>
                            <span className="text-[13px] font-bold text-slate-800">{item.rating.toFixed(1)}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white text-slate-700 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                            {item.tag}
                          </div>
                        </div>

                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">from</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[22px] font-bold text-slate-900 leading-none tracking-tight">
                                {item.price}
                              </span>
                              <span className="text-[12px] font-medium text-slate-500 capitalize">{item.unit}</span>
                            </div>
                          </div>
                          <span
                            className="text-[14px] font-bold px-5 py-2.5 rounded-full text-slate-900 bg-white shadow-sm hover:bg-slate-50 transition-colors"
                          >
                            Book +
                          </span>
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
