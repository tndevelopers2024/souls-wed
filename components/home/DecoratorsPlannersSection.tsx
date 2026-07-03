"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Flower2, ClipboardList, ArrowRight } from "lucide-react";

const decorators = [
  {
    id: 1, name: "Akiko Kovacs", location: "Honolulu, United States",
    price: "₹29,223", unit: "per booking", rating: 0, verified: true, tag: "Decorator",
    image: "/images/home/1cc5d798b520b4ba81f15015612796d0.jpg",
  },
      {
    id: 4, name: "Floraison-31", location: "Auckland, New Zealand",
    price: "₹12,656", unit: "per engagement", rating: 0, verified: true, tag: "Decorator",
    image: "/images/home/1dae12c36000143c2636b828426e4cf3.jpg",
  },
  {
    id: 2, name: "French Florist", location: "California, United States",
    price: "₹25,048", unit: "per booking", rating: 0, verified: true, tag: "Decorator",
    image: "/images/home/f8648d3e1d587c1c62dec1373c2a1e8e.jpg",
  },
  {
    id: 3, name: "Les Filles d'a cote", location: "Paris, France",
    price: "₹12,656", unit: "per engagement", rating: 0, verified: true, tag: "Decorator",
    image: "/images/home/a05874ad857e7eea07ced6a187fa04fe.jpg",
  },

];

const planners = [
  {
    id: 1, name: "Eve Experience", location: "Kollam, India",
    price: "₹260,000", unit: "per engagement", rating: 0, verified: true, tag: "Planner",
    image: "/soulswed/vendors/1129.png",
  },
  {
    id: 2, name: "SANS Events", location: "Kochi, India",
    price: "₹250,000", unit: "per engagement", rating: 0, verified: true, tag: "Planner",
    image: "/soulswed/vendors/1128.webp",
  },
  {
    id: 3, name: "Bespoke Experiences", location: "Phuket, Thailand",
    price: "₹183,623", unit: "per engagement", rating: 0, verified: true, tag: "Planner",
    image: "/soulswed/vendors/1118.jpg",
  },
];

type Tab = "decorators" | "planners";

const subtext: Record<Tab, string> = {
  decorators: "Let's bring your vision to life",
  planners: "Enjoy your special day while the experts take care of the details",
};

export default function DecoratorsPlannersSection() {
  const [activeTab, setActiveTab] = useState<Tab>("decorators");
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = activeTab === "decorators" ? decorators : planners;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sw-orange)" }}>
              Design &amp; Plan
            </p>
            <h2 className="section-heading">Decorators &amp; Planners</h2>
            <p className="section-subtext">{subtext[activeTab]}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={`/category/${activeTab}`} className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3" style={{ background: "var(--sw-white)", color: "var(--sw-navy)" }}>
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

        {/* Tab pills */}
        <div className="flex gap-3 mb-8">
          {(["decorators", "planners"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab ? "var(--sw-navy)" : "var(--sw-white)",
                color: activeTab === tab ? "white" : "var(--sw-navy)",
                boxShadow: activeTab === tab ? "0 4px 16px rgba(55,71,90,0.3)" : "none",
              }}
            >
              {tab === "decorators" ? <Flower2 className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
              {tab === "decorators" ? "Decorators" : "Wedding Planners"}
            </button>
          ))}
        </div>

        {/* Scroll row */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-scroll pb-4" style={{ scrollbarWidth: "none" }}>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[340px] cursor-pointer"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative rounded-[24px] overflow-hidden shadow-sm border border-slate-100 w-full h-[480px] sm:h-[520px] md:h-[560px] lg:h-[580px] cursor-pointer block">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px"
                        className="object-cover"
                      />

                      {/* Tag pill top-left */}
                      <div
                        className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--sw-orange)" }}
                      >
                        {item.tag === "Decorator"
                          ? <Flower2 className="w-3.5 h-3.5" />
                          : <ClipboardList className="w-3.5 h-3.5" />}
                        {item.tag}
                      </div>

                      {/* Rating pill top-right */}
                      {item.rating > 0 && (
                        <div
                          className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}
                        >
                          <Star className="w-3 h-3" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                          <span className="text-slate-800">{item.rating.toFixed(1)}</span>
                        </div>
                      )}

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
                        <h3 className="text-[17px] font-bold leading-snug text-slate-900 line-clamp-2 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-700 line-clamp-1">{item.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                           <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-orange-50/80 text-orange-700 border border-orange-100/60">
                             {item.tag}
                           </span>
                        </div>

                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-medium text-slate-600 block">from</span>
                            <span className="text-[18px] font-bold text-slate-900 leading-tight">{item.price}</span>
                            <span className="text-[11px] font-medium text-slate-600 ml-1">{item.unit}</span>
                          </div>
                          <span
                            className="text-xs font-bold px-4 py-2 rounded-full text-white"
                            style={{ background: "var(--sw-navy)" }}
                          >
                            View Details →
                          </span>
                        </div>
                      </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
