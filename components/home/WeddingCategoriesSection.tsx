"use client";

import { motion } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { ArrowRight } from "lucide-react";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function WeddingCategoriesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--sw-orange)" }}
            >
              Browse By Category
            </p>
            <h2 className="section-heading">Wedding Categories</h2>
            <p className="section-subtext">Find every vendor you need for the perfect day</p>
          </div>
          <a
            href="/vendors"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3"
            style={{ color: "var(--sw-navy)", border: "1.5px solid var(--sw-navy)" }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Grid for categories */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {VENDOR_CATEGORIES.map((cat) => (
            <motion.a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              variants={itemVariants}
              className="relative h-56 md:h-64 rounded-[32px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Progressive frosted blur (Liquid Glass) */}
              <div className="absolute inset-x-0 bottom-0 h-[69%] z-10 pointer-events-none group-hover:h-[72%] transition-all duration-500">
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
                <div className="flex items-center gap-3 transform transition-all duration-500 group-hover:-translate-y-1">
                  <div className="bg-white/90 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-slate-800 flex-shrink-0 transition-colors duration-500 group-hover:text-[var(--sw-orange)]">
                    <cat.icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col">
                    <h3
                      className="text-[22px] font-bold text-slate-900 leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-[11px] mt-0.5 text-slate-500 font-bold tracking-wide uppercase">
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
