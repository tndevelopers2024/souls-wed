"use client";

import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { MapPin, Star, BadgeCheck, ChevronLeft, Phone, Image as ImageIcon, Heart, PenSquare, Share2 } from "lucide-react";
import type { Venue } from "@/lib/venues-data";

interface VenueHeroProps {
  venue: Venue;
}

export default function VenueHero({ venue }: VenueHeroProps) {
  return (
    <div className="w-full flex flex-col relative">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/venues"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:text-stone-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Venues
        </Link>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[32px] overflow-hidden shadow-sm mb-8">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        {venue.verified && (
          <div className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-white/95 dark:bg-[var(--sw-surface)]/95 backdrop-blur-md text-slate-800 dark:text-stone-200 shadow-lg">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            Verified
          </div>
        )}
      </div>

      {/* Info Section - Editorial Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-100 text-primary-800 px-2.5 py-1 rounded-md shadow-sm">
              Venue & Estate
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-stone-300 px-2.5 py-1 rounded-md">
              2 bookings recently
            </span>
          </div>
          
          <h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-stone-100 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {venue.name}
          </h1>
          
          <div className="flex items-center gap-2 text-slate-500 dark:text-stone-400 text-sm font-medium pt-1">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-stone-500" />
            {venue.location}, {venue.country}
            <a href="#" className="text-primary-600 font-semibold ml-2 hover:underline text-xs">
              (View on Map)
            </a>
          </div>
        </div>

        {/* Rating and Contact */}
        <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
          {venue.rating > 0 && (
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <div className="flex items-center gap-1.5 bg-sw-navy text-white px-4 py-2 rounded-xl shadow-md">
                <Star className="w-4 h-4 text-sw-secondary fill-sw-secondary" />
                <span className="font-bold text-lg leading-none">{venue.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-stone-400 underline decoration-slate-300 underline-offset-2">
                Based on {venue.reviewCount} reviews
              </span>
            </div>
          )}
          
          <button className="flex items-center justify-center gap-2 w-full md:w-auto bg-green-50 hover:bg-green-100 text-green-700 font-bold px-6 py-2.5 rounded-xl transition-colors border border-green-200">
            <Phone className="w-4 h-4" />
            Contact Venue
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-start gap-8 py-5">
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-stone-300 hover:text-primary-600 transition-colors">
          <ImageIcon className="w-4 h-4" />
          102 Photos
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
