"use client";

import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { MapPin, Star, BadgeCheck, ChevronLeft, Phone, Image as ImageIcon, Heart, PenSquare, Share2 } from "lucide-react";
import type { PublicVendor } from "@/components/vendors/PublicVendorDirectory";

interface VendorHeroProps {
  vendor: PublicVendor;
}

export default function VendorHero({ vendor }: VendorHeroProps) {
  const image = vendor.images && vendor.images.length > 0 ? vendor.images[0] : "/soulswed/vendors/1128.webp";
  const name = vendor.businessName || vendor.name;
  const rating = vendor.rating || 0;
  const reviewCount = vendor.reviewCount || 0;
  
  return (
    <div className="w-full flex flex-col relative">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href={`/${vendor.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {vendor.category}
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-t-3xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        {vendor.verified && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-[var(--sw-surface)] text-slate-800 dark:text-stone-200 shadow-sm">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            Verified Partner
          </div>
        )}
      </div>

      {/* Info Card (Slight overlap) */}
      <div className="bg-white dark:bg-[var(--sw-surface)] border border-slate-200 dark:border-white/10 rounded-b-3xl rounded-t-xl -mt-6 relative z-10 p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-stone-100 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {name}
            </h1>
            
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-stone-300 text-sm font-medium">
              <MapPin className="w-4 h-4 text-slate-400 dark:text-stone-500" />
              {vendor.city}, India
            </div>
            
            <p className="text-xs text-slate-500 dark:text-stone-400 max-w-lg mt-1">
              Premium {vendor.category} services in {vendor.city}
            </p>
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-stone-400 underline decoration-slate-300 underline-offset-2">
                {reviewCount} reviews
              </span>
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
          {vendor.phone ? (
            <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
              <Phone className="w-4 h-4" />
              Contact
            </a>
          ) : (
            <button className="flex items-center gap-2 text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
              <Phone className="w-4 h-4" />
              Contact
            </button>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-500 text-white px-2 py-0.5 rounded shadow-sm">
            Highly Requested
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 py-4 px-2 mt-2">
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-stone-300 hover:text-primary-600 transition-colors">
          <ImageIcon className="w-4 h-4" />
          {vendor.images?.length || 1} Photos
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-stone-300 hover:text-primary-600 transition-colors">
          <Heart className="w-4 h-4" />
          Shortlist
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-stone-300 hover:text-primary-600 transition-colors">
          <PenSquare className="w-4 h-4" />
          Write a Review
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-stone-300 hover:text-primary-600 transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
