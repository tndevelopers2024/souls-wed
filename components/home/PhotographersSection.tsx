"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Camera, Film, ArrowRight, Heart } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";
import VendorCard from "@/components/vendors/VendorCard";

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
                        <TypeIcon type={item.type} />
                        {typeLabel[item.type as keyof typeof typeLabel]}
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
