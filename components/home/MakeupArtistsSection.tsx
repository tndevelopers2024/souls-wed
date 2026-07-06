"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Sparkles, ArrowRight, Heart } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";
import VendorCard from "@/components/vendors/VendorCard";

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
  const { currency } = useCurrency();
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-x-clip">
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
                  className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px] h-[460px] sm:h-[500px] lg:h-[540px] cursor-pointer block group"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <VendorCard
                    id={item.id}
                    name={item.name}
                    location={item.location}
                    price={item.price}
                    unit={item.unit}
                    rating={item.rating}
                    image={item.image}
                    tags={
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white text-slate-700 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                        {item.tag}
                      </div>
                    }
                  />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
