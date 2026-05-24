"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Camera, Film, ArrowRight } from "lucide-react";

const photographers = [
  {
    id: 1,
    name: "George Street Photo",
    location: "Chicago, United States",
    price: "₹212,491",
    unit: "per engagement",
    rating: 0,
    verified: true,
    type: "both",
    image: "https://images.trvl-media.com/place/6152386/71e8313a-bb03-4920-b0db-8a1c587b45df.jpg",
  },
  {
    id: 2,
    name: "Gia Dragoi Photography",
    location: "Chicago, United States",
    price: "₹187,860",
    unit: "per day",
    rating: 0,
    verified: true,
    type: "photo",
    image: "/soulswed/vendors/1180.jpg",
  },
  {
    id: 3,
    name: "One Moment Hawaii",
    location: "Honolulu, United States",
    price: "₹208,733",
    unit: "per engagement",
    rating: 0,
    verified: true,
    type: "both",
    image: "/soulswed/vendors/1179.jpg",
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
              <div className="bg-[#F4F4F4] p-1 rounded-[36px]">
                <div
                  className="relative h-[440px] sm:h-[500px] md:h-[560px] w-full"
                  style={{
                    clipPath: "inset(0 round 32px)",
                    WebkitClipPath: "inset(0 round 32px)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px"
                    className="object-cover"
                  />

                  {/* Rating chip — top left */}
                  {item.rating > 0 && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-full" style={{ background: "rgba(255,255,255,0.92)", color: "var(--sw-navy)" }}>
                      <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" /> {item.rating.toFixed(1)}
                    </div>
                  )}

                  {/* Type chip — top right */}
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ background: "rgba(255,255,255,0.92)", color: "var(--sw-navy)" }}>
                    <TypeIcon type={item.type} />
                    {typeLabel[item.type as keyof typeof typeLabel]}
                  </div>

                  {/* Frosted gradient overlay */}
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
                      <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-tight tracking-tight text-slate-900 line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
                        {item.name}
                      </h3>
                      {item.verified && <BadgeCheck className="w-6 h-6 flex-shrink-0 text-white fill-[#16a34a]" />}
                    </div>
                    <div className="flex items-center gap-1.5 mb-5">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-600 line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">from</span>
                        <span className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-none">{item.price}</span>
                        <span className="text-xs text-slate-500 mt-1">{item.unit}</span>
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
