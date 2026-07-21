"use client";

import { HeartIcon } from "@/components/ui/heart";
import { motion, AnimatePresence } from "framer-motion";
import ListingCard from "@/components/shared/ListingCard";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

interface VendorCardProps {
  id: string | number;
  name: string;
  location: string;
  price: string | number;
  unit: string;
  rating: number;
  reviewCount?: number;
  tags?: React.ReactNode;
  badge?: React.ReactNode;
  image: string;
}

/**
 * Public-facing listing card — the shared ListingCard with the shortlist heart
 * and a "Book +" control.
 */
export default function VendorCard({
  id,
  name,
  location,
  price,
  unit,
  rating,
  reviewCount,
  tags,
  badge,
  image,
}: VendorCardProps) {
  const { items, addItem, removeItem } = useWishlistStore();
  
  // Checking by id to see if it's already in wishlist
  const isSaved = items.some((item) => item.id === id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent navigation if card is clickable
    
    if (isSaved) {
      removeItem(id);
    } else {
      addItem({ id, name, location, price, unit, rating, reviewCount, image });
    }
  };

  return (
    <ListingCard
      name={name}
      image={image}
      location={location}
      price={price}
      unit={unit}
      rating={rating}
      reviewCount={reviewCount}
      tags={tags}
      badge={badge}
      topRight={
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="p-2 rounded-full transition-colors flex items-center justify-center relative overflow-hidden"
          style={{
            background: isSaved ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
            color: isSaved ? "#ef4444" : "#94a3b8"
          }}
          onClick={toggleWishlist}
          aria-label="Shortlist"
        >
          <AnimatePresence>
            {isSaved && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 bg-red-50"
                style={{ zIndex: 0 }}
              />
            )}
          </AnimatePresence>
          <HeartIcon 
            className="w-4 h-4 relative z-10 transition-colors duration-200" 
            fill={isSaved ? "currentColor" : "none"} 
          />
        </motion.button>
      }
      action={
        <span className="text-[14px] font-bold px-5 py-2.5 rounded-full text-slate-900 bg-white border border-slate-200 whitespace-nowrap">
          Book +
        </span>
      }
    />
  );
}
