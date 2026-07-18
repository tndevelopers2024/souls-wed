"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import VendorCard from "@/components/vendors/VendorCard";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[var(--sw-white)] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--sw-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-[var(--sw-white)] pb-20">
      
      {/* ══════════════════════ HERO ══════════════════════ */}
      <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden pt-12 pb-12 px-4 text-center rounded-[40px] shadow-sm border border-[rgba(238,116,41,0.3)]"
          style={{ background: "linear-gradient(150deg, #fdf6f0 0%, #fceee3 40%, #f5dcc9 100%)" }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-widest text-[var(--sw-primary)] bg-[rgba(238,116,41,0.12)] border border-[rgba(238,116,41,0.25)]">
              <Heart className="w-3.5 h-3.5 fill-[var(--sw-primary)]" />
              Your Favorites
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.1] text-[var(--sw-navy)] font-heading">
              My <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--sw-primary)] to-[#f5a623]">Wishlist</span>
            </h1>
            
            <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Keep track of your favorite venues, planners, and creatives all in one place. 
              {hasItems && ` You currently have ${items.length} saved ${items.length === 1 ? 'item' : 'items'}.`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════ MAIN CONTENT ══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {!hasItems ? (
          // Empty State
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--sw-navy)] mb-2 font-heading">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 max-w-md mb-8">
              Start exploring our curated list of premium venues and vendors. Click the heart icon on any listing to save it here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/venues"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[var(--sw-primary)] hover:bg-[#e06822] transition-colors shadow-[0_4px_14px_rgba(238,116,41,0.35)]"
              >
                <Search className="w-4 h-4" />
                Explore Venues
              </Link>
              <Link 
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-[var(--sw-navy)] bg-white border-2 border-slate-200 hover:border-[var(--sw-primary)] hover:text-[var(--sw-primary)] transition-colors"
              >
                Browse Vendors
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          // Wishlist Grid
          <div className="flex flex-col gap-8">
            <div className="flex justify-end">
              <button
                onClick={clearWishlist}
                className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <VendorCard
                      id={item.id}
                      name={item.name}
                      location={item.location}
                      price={item.price}
                      unit={item.unit}
                      rating={item.rating}
                      reviewCount={item.reviewCount}
                      image={item.image}
                      tags={
                        item.category ? (
                          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--sw-primary)] bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-white">
                            {item.category}
                          </span>
                        ) : undefined
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
