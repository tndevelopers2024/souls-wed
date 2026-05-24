"use client";

import Image from "next/image";
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
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Venues
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-t-3xl overflow-hidden">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        {venue.verified && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white text-slate-800 shadow-sm">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            Verified
          </div>
        )}
      </div>

      {/* Info Card (Slight overlap) */}
      <div className="bg-white border border-slate-200 rounded-b-3xl rounded-t-xl -mt-6 relative z-10 p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {venue.name}
            </h1>
            
            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              {venue.location}, {venue.country}
              <a href="#" className="text-orange-600 font-semibold ml-1 hover:underline text-xs">
                (View on Map)
              </a>
            </div>
            
            <p className="text-xs text-slate-500 max-w-lg mt-1">
              {`${venue.location}, ${venue.country}`}
            </p>
          </div>

          {/* Rating Badge */}
          {venue.rating > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{venue.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-2">
                {venue.reviewCount} reviews
              </span>
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button className="flex items-center gap-2 text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
            <Phone className="w-4 h-4" />
            Contact
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded shadow-sm">
            2 bookings recently
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 py-4 px-2 mt-2">
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors">
          <ImageIcon className="w-4 h-4" />
          102 Photos
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors">
          <Heart className="w-4 h-4" />
          Shortlist
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors">
          <PenSquare className="w-4 h-4" />
          Write a Review
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
