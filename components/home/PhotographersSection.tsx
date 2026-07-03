"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Camera, Film, ArrowRight } from "lucide-react";

interface Photographer {
  id: number;
  name: string;
  location: string;
  price: string;
  unit: string;
  rating: number;
  verified?: boolean;
  type: string;
  image: string;
}

const photographers: Photographer[] = [
      {
    id: 4,
    name: "Awarjana Photo Gallery",
    location: "Sri Lanka",
    price: "₹187,860",
    unit: "per day",
    rating: 0,
    // verified: true,
    type: "photo",
    image: "/images/home/a9d04acf8f559614012e1247fcf6381b.jpg",
  },
  {
    id: 1,
    name: "George Street Photo",
    location: "Chicago, United States",
    price: "₹212,491",
    unit: "per engagement",
    rating: 0,
    // verified: true,
    type: "both",
    image: "/images/home/d2164b1f027798a6e62f4002043c4b15.jpg",
  },
  {
    id: 2,
    name: "Gia Dragoi Photography",
    location: "Chicago, United States",
    price: "₹187,860",
    unit: "per day",
    rating: 0,
    // verified: true,
    type: "photo",
    image: "https://cdn0.weddingwire.com/vendor/042391/3_2/960/jpg/gia-photos-wedding-photographer-039_51_193240-177819025787375.jpeg",
  },

  {
    id: 3,
    name: "One Moment Hawaii",
    location: "Honolulu, United States",
    price: "₹208,733",
    unit: "per engagement",
    rating: 0,
    // verified: true,
    type: "both",
    image: "/images/home/99eadda9b88373538d8b943a635619d9.jpg",
  },

];

const typeLabel = { photo: "Photographer", video: "Videographer", both: "Photo + Video" };
const TypeIcon = ({ type }: { type: string }) =>
  type === "video" ? <Film className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />;

export default function PhotographersSection() {
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
              Capture Every Moment
            </p>
            <h2 className="section-heading">Photographers &amp; Videographers</h2>
            <p className="section-subtext">From Moments to Memories</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/category/photographers" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3" style={{ background: "var(--sw-peach)", color: "var(--sw-navy)" }}>
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
          {photographers.map((item, i) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[340px] cursor-pointer"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
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

                      {/* Type pill top-left */}
                      <div
                        className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--sw-peach)", color: "var(--sw-navy)" }}
                      >
                        <TypeIcon type={item.type} />
                        {typeLabel[item.type as keyof typeof typeLabel]}
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
                             {typeLabel[item.type as keyof typeof typeLabel]}
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
      </div>
    </section>
  );
}
