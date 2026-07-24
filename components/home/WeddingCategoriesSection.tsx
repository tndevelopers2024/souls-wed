"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { ChevronDownIcon } from "@/components/ui/chevron-down";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function WeddingCategoriesSection({ singleRow = false }: { singleRow?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If single row, show all items (horizontally scrollable). 
  // Else, use expansion logic (8 items initially -> 1 row -> all).
  const displayedCategories = singleRow
    ? VENDOR_CATEGORIES
    : (isExpanded ? VENDOR_CATEGORIES : VENDOR_CATEGORIES.slice(0, 8));

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--sw-primary)" }}
            >
              Browse By Category
            </p>
            <h2 className="section-heading">Wedding Categories</h2>
            <p className="section-subtext mx-auto">Find every vendor you need for the perfect day</p>
          </div>
        </motion.div>

        {/* Categories Flex Container */}
        <div
          className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 pb-4 md:pb-0"
        >
          {displayedCategories.map((cat, i) => (
            <motion.a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
              className="group min-w-[100px] w-[100px] md:min-w-0 md:w-[120px] flex flex-col items-center justify-start gap-2.5 p-1 flex-shrink-0"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(238, 116, 41, 0.1) 0%, rgba(238, 116, 41, 0.02) 100%)",
                  border: "1px solid rgba(238, 116, 41, 0.2)",
                  color: "var(--sw-primary)",
                }}
              >
                <cat.icon className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-center flex flex-col items-center">
                <h3
                  className="text-[14px] font-bold text-slate-900 group-hover:text-[var(--sw-primary)] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {cat.name}
                </h3>
                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide mt-0.5">
                  {cat.tagline}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {!singleRow && VENDOR_CATEGORIES.length > 8 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full transition-all hover:bg-slate-50"
              style={{ color: "var(--sw-primary)", border: "1.5px solid var(--sw-primary)" }}
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUpIcon className="w-4 h-4" />
                </>
              ) : (
                <>
                  View {VENDOR_CATEGORIES.length - 8} More Categories <ChevronDownIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
