"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import VendorCard from "@/components/vendors/VendorCard";

interface ServiceItem {
  id: string;
  name: string;
  location: string;
  price: string;
  unit: string;
  rating: number;
  verified: boolean;
  tag: string;
  image: string;
}

interface CategoryCarouselSectionProps {
  categorySlug: string;
  title: string;
  subtitle: string;
  tagLabel: string;
  icon: React.ReactNode;
}

export default function CategoryCarouselSection({ categorySlug, title, subtitle, tagLabel, icon }: CategoryCarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = useCurrency();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services?category=${categorySlug}&verified=true&limit=8`)
      .then((r) => r.json())
      .then((data) => {
        const mapData = (services: any[]) =>
          (services || []).map((s: any) => ({
            id: s.serviceId,
            name: s.name,
            location: s.city,
            price: `₹${s.priceFrom?.toLocaleString("en-IN") || 0}`,
            unit: s.priceUnit || "per event",
            rating: s.rating || 0,
            verified: s.verified,
            tag: tagLabel,
            image: s.image || "",
          }));
        setItems(mapData(data.services));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categorySlug, tagLabel]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  // if (!loading && items.length === 0) return null;

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
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sw-primary)" }}>
              {tagLabel}
            </p>
            <h2 className="section-heading">{title}</h2>
            <p className="section-subtext">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`/category/${categorySlug}`}
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3"
              style={{ background: "var(--sw-white)", color: "var(--sw-navy)" }}
            >
              Search more <ArrowRight className="w-4 h-4" />
            </a>
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
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-5 overflow-hidden pb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px] h-[460px] sm:h-[500px] lg:h-[540px] rounded-[32px] animate-pulse"
                style={{ background: "var(--sw-light-gray, #f1f5f9)" }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              {icon}
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">No {title.toLowerCase()} found</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              We are currently updating our listings for {title}. Check back soon!
            </p>
          </div>
        )}

        {/* Scroll row */}
        {!loading && items.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-scroll pb-4"
            style={{ scrollbarWidth: "none" }}
          >
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
                      {icon}
                      {item.tag}
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
