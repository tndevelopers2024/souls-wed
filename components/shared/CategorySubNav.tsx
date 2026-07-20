"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";

interface Props {
  activeCategory?: string;
}

export default function CategorySubNav({ activeCategory }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 8 items = 1 row on desktop. If expanded, show all.
  const displayedCategories = isExpanded ? VENDOR_CATEGORIES : VENDOR_CATEGORIES.slice(0, 8);

  return (
    <div className="mb-12 w-full relative">
      <div className="flex flex-nowrap md:flex-wrap md:justify-center overflow-x-auto md:overflow-x-visible gap-4 md:gap-8 pb-4 md:pb-0 custom-scrollbar snap-x snap-mandatory hide-scrollbar items-start">
        {displayedCategories.map((cat, i) => {
          const isActive = activeCategory && cat.slug.toLowerCase() === activeCategory.toLowerCase();
          
          return (
            <Link
              key={cat.slug}
              href={cat.slug === "venues" ? "/venues" : `/vendors/${cat.slug}`}
              className="group min-w-[100px] w-[100px] md:min-w-[110px] md:w-[110px] flex flex-col items-center justify-start gap-2.5 p-1 flex-shrink-0 snap-start relative"
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: isActive 
                    ? "linear-gradient(135deg, var(--sw-primary) 0%, #f5a623 100%)"
                    : "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                  border: isActive 
                    ? "none"
                    : "1px solid rgba(238, 116, 41, 0.2)",
                  color: isActive ? "white" : "var(--sw-primary)",
                  boxShadow: isActive ? "0 8px 24px rgba(238,116,41,0.4)" : "none",
                }}
              >
                <cat.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-center flex flex-col items-center">
                <h3 
                  className="text-[13px] font-bold transition-colors"
                  style={{ 
                    fontFamily: "var(--font-heading)",
                    color: isActive ? "var(--sw-primary)" : "var(--sw-navy)"
                  }}
                >
                  {cat.name}
                </h3>
                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide mt-0.5" style={{ opacity: isActive ? 1 : 0.7 }}>
                  {cat.tagline}
                </p>
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="activeCategoryDot"
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-primary-500"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Expand / Collapse Button */}
      {VENDOR_CATEGORIES.length > 8 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full transition-all hover:bg-slate-50"
            style={{ color: "var(--sw-primary)", border: "1.5px solid var(--sw-primary)" }}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                View {VENDOR_CATEGORIES.length - 8} More Categories <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
