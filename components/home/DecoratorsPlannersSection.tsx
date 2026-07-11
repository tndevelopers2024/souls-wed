"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { MapPin, ChevronLeft, ChevronRight, Star, BadgeCheck, Flower2, ClipboardList, ArrowRight, Heart } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";
import VendorCard from "@/components/vendors/VendorCard";

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
  const { currency } = useCurrency();
  const items = activeTab === "decorators" ? decorators : planners;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-x-clip">
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
                        {item.tag === "Decorator" ? (
                          <Flower2 className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        {item.tag}
                      </div>
                    }
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
