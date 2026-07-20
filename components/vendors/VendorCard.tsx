"use client";

import { Heart } from "lucide-react";
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
          className="w-9 h-9 rounded-full transition-all flex items-center justify-center relative overflow-hidden backdrop-blur-md shadow-sm cursor-pointer"
          style={{
            background: isSaved ? "#ffffff" : "rgba(0,0,0,0.4)",
            color: isSaved ? "#ef4444" : "#ffffff",
            border: isSaved ? "1px solid #fee2e2" : "1px solid rgba(255,255,255,0.25)"
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
          <Heart 
            className="w-4 h-4 relative z-10 transition-colors duration-200" 
            fill={isSaved ? "currentColor" : "none"} 
          />
        </motion.button>
      }
      action={
        <span className="text-xs font-bold px-4 py-2 rounded-full text-white bg-gradient-to-r from-[#EE7429]/90 to-[#f58638]/90 backdrop-blur-md shadow-md shadow-[#EE7429]/20 border border-white/20 hover:shadow-lg hover:shadow-[#EE7429]/40 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer">
          Book +
        </span>
      }
    />
  );
}
