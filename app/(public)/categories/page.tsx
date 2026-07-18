"use client";

import { motion, Variants } from "framer-motion";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--sw-deep-navy)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span 
            className="text-sm font-bold uppercase tracking-widest mb-3 block"
            style={{ color: "var(--sw-primary)" }}
          >
            Discover Your Perfect Match
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Wedding Categories
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            From dreamy venues to flawless makeup, explore our comprehensive selection of top-tier wedding professionals ready to bring your vision to life.
          </p>
        </motion.div>

        {/* Icon-based Categories Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {VENDOR_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.slug} variants={itemVariants}>
                <Link 
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center p-6 bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 text-center h-full"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300"
                    style={{
                      background: "linear-gradient(135deg, rgba(238, 116, 41, 0.1) 0%, rgba(238, 116, 41, 0.02) 100%)",
                      border: "1px solid rgba(238, 116, 41, 0.2)",
                      color: "var(--sw-primary)",
                    }}
                  >
                    <Icon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h3 
                    className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-[var(--sw-primary)] transition-colors mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide mb-3 leading-relaxed">
                    {category.tagline}
                  </p>
                  
                  {category.features && (
                    <div className="mt-auto inline-flex px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-[10px] text-slate-600 dark:text-slate-300 font-medium text-center">
                      {category.features}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}
