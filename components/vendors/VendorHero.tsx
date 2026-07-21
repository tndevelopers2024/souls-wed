"use client";

import { useState } from "react";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { Star, BadgeCheck, Image as ImageIcon, PenSquare, Share2 } from "lucide-react";
import { MapPinIcon } from "@/components/ui/map-pin";
import { ChevronLeftIcon } from "@/components/ui/chevron-left";
import { PhoneIcon } from "@/components/ui/phone";
import { HeartIcon } from "@/components/ui/heart";
import { CheckIcon } from "@/components/ui/check";
import type { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

interface VendorHeroProps {
  vendor: PublicVendor;
}

export default function VendorHero({ vendor }: VendorHeroProps) {
  const { items, addItem, removeItem } = useWishlistStore();
  const isSaved = items.some((item) => item.id === vendor._id);

  const toggleWishlist = () => {
    if (isSaved) {
      removeItem(vendor._id);
    } else {
      addItem({
        id: vendor._id,
        name: vendor.businessName || vendor.name,
        location: vendor.city || "Various Locations",
        price: vendor.priceFrom || 0,
        unit: "event",
        rating: vendor.rating || 0,
        reviewCount: vendor.reviewCount || 0,
        image: vendor.images && vendor.images.length > 0 ? vendor.images[0] : "/soulswed/vendors/1128.webp",
        category: vendor.category
      });
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to {vendor.category}
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-t-3xl overflow-hidden">
        <Image
          src={vendor.heroImage || image}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        {vendor.verified && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white text-slate-800 border border-slate-200">
            <BadgeCheck className="w-4 h-4 text-green-600"/>
            Verified Partner
          </div>
        )}
      </div>

      {/* Info Card (Slight overlap) */}
      <div className="bg-white border border-slate-200 rounded-b-3xl rounded-t-xl -mt-6 relative z-10 p-6 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {name}
            </h1>
            
            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
              <MapPinIcon className="w-4 h-4 text-slate-400"/>
              {vendor.city}, India
              {vendor.mapLink && (
                <a href={vendor.mapLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold ml-2 hover:underline text-xs">
                  (View on Map)
                </a>
              )}
            </div>
            
            <p className="text-xs text-slate-500 max-w-lg mt-1">
              Premium {vendor.category} services in {vendor.city}
            </p>
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-2">
                {reviewCount} reviews
              </span>
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          {vendor.contactPhone || vendor.phone ? (
            <a href={`tel:${vendor.contactPhone || vendor.phone}`} className="flex items-center gap-2 text-green-600 font-semibold text-sm">
              <PhoneIcon className="w-4 h-4" />
              {vendor.contactPhone || vendor.phone || "Contact"}
            </a>
          ) : (
            <button className="flex items-center gap-2 text-green-600 font-semibold text-sm">
              <PhoneIcon className="w-4 h-4" />
              Contact
            </button>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-500 text-white px-2 py-0.5 rounded">
            Highly Requested
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-8 border-b border-slate-200 py-4 px-2 mt-2">
        <button 
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:opacity-70 transition-opacity"
        >
          <ImageIcon className="w-4 h-4" />
          {vendor.images?.length || 1} Photos
        </button>
        <button 
          onClick={toggleWishlist}
          className={`flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 ${isSaved ? "text-red-500" : "text-slate-600"}`}
        >
          <HeartIcon className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved" : "Shortlist"}
        </button>
        <button 
          onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:opacity-70 transition-opacity"
        >
          <PenSquare className="w-4 h-4" />
          Write a Review
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:opacity-70 transition-opacity"
        >
          {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          {copied ? <span className="text-green-600">Copied!</span> : "Share"}
        </button>
      </div>
    </div>
  );
}
