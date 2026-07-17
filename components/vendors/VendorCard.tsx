"use client";

import { Heart } from "lucide-react";
import ListingCard from "@/components/shared/ListingCard";

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
        <button
          className="p-2 rounded-full bg-white/90 dark:bg-[var(--sw-surface)]/90 backdrop-blur-sm text-slate-400 dark:text-stone-500 hover:text-red-500 hover:bg-white dark:hover:bg-[var(--sw-surface)] transition-colors shadow-sm"
          onClick={(e) => e.preventDefault()}
          aria-label="Shortlist"
        >
          <Heart className="w-4 h-4" />
        </button>
      }
      action={
        <span className="text-[14px] font-bold px-5 py-2.5 rounded-full text-slate-900 dark:text-stone-100 bg-white dark:bg-[var(--sw-surface)] shadow-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
          Book +
        </span>
      }
    />
  );
}
