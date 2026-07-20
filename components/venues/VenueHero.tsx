"use client";

import { useState } from "react";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { MapPin, Star, BadgeCheck, ChevronLeft, Phone, Image as ImageIcon, Heart, PenSquare, Share2, Check } from "lucide-react";
import type { Venue } from "@/lib/venues-data";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

interface VenueHeroProps {
  venue: Venue;
}

export default function VenueHero({ venue }: VenueHeroProps) {
  const { items, addItem, removeItem } = useWishlistStore();
  const isSaved = items.some((item) => item.id === venue.id);

  const toggleWishlist = () => {
    if (isSaved) {
      removeItem(venue.id);
    } else {
      addItem({
        id: venue.id,
        name: venue.name,
        location: venue.location,
        price: venue.price,
        unit: venue.priceUnit,
        rating: venue.rating,
        reviewCount: venue.reviewCount,
        image: venue.image,
        category: "venue"
      });
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col relative">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/venues"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Venues
        </Link>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[32px] overflow-hidden mb-8">
        <Image
          src={venue.heroImage || venue.image}
          alt={venue.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        {venue.verified && (
          <div className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-white text-slate-800 border border-slate-200">
            <BadgeCheck className="w-4 h-4 text-green-600"/>
            Verified
          </div>
        )}
      </div>

      {/* Info Section - Editorial Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-100 text-primary-800 px-2.5 py-1 rounded-md">
              Venue & Estate
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
              2 bookings recently
            </span>
          </div>
          
          <h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {venue.name}
          </h1>
          
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium pt-1">
            <MapPin className="w-4 h-4 text-slate-400"/>
            {venue.location}, {venue.country}
            {venue.mapLink ? (
              <a href={venue.mapLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold ml-2 hover:underline text-xs">
                (View on Map)
              </a>
            ) : (
              <span className="text-primary-600 font-semibold ml-2 hover:underline text-xs cursor-pointer">
                (View on Map)
              </span>
            )}
          </div>
        </div>

        {/* Rating and Contact */}
        <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
          {venue.rating > 0 && (
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <div className="flex items-center gap-1.5 bg-sw-navy text-white px-4 py-2 rounded-xl">
                <Star className="w-4 h-4 text-sw-secondary fill-sw-secondary" />
                <span className="font-bold text-lg leading-none">{venue.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-2">
                Based on {venue.reviewCount} reviews
              </span>
            </div>
          )}
          
          <a href={venue.contactPhone ? `tel:${venue.contactPhone}` : "#"} className="flex items-center justify-center gap-2 w-full md:w-auto bg-green-50 text-green-700 font-bold px-6 py-2.5 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
            <Phone className="w-4 h-4" />
            {venue.contactPhone ? venue.contactPhone : "Contact Venue"}
          </a>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-8 py-5">
        <button 
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:opacity-70 transition-opacity"
        >
          <ImageIcon className="w-4 h-4" />
          102 Photos
        </button>
        <button 
          onClick={toggleWishlist}
          className={`flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 ${isSaved ? "text-red-500" : "text-slate-600"}`}
        >
          <Heart className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
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
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          {copied ? <span className="text-green-600">Copied!</span> : "Share"}
        </button>
      </div>
    </div>
  );
}
