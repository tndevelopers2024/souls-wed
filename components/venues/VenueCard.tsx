"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, BedDouble, Crown, Heart } from "lucide-react";
import type { Venue } from "@/lib/venues-data";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venues/${venue.id}`} className="group block">
      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Featured badge */}
          {venue.featured && (
            <div
              className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: "var(--sw-orange)" }}
            >
              <Crown className="w-3 h-3" />
              Featured
            </div>
          )}

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/90"
            style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.preventDefault()}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-slate-500 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name + verified */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="text-[17px] font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-[var(--sw-orange)] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {venue.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span className="text-xs text-slate-500 line-clamp-1">
              {venue.location}, {venue.country}
            </span>
          </div>

          {/* Rating */}
          {venue.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--sw-gold)" }}
                    fill={s <= Math.round(venue.rating) ? "var(--sw-gold)" : "none"}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">{venue.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({venue.reviewCount} reviews)</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              <Users className="w-3 h-3 inline mr-1" />
              {venue.minGuests}–{venue.maxGuests} pax
            </span>
            {venue.rooms > 0 && (
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                <BedDouble className="w-3 h-3 inline mr-1" />
                {venue.rooms} Rooms
              </span>
            )}
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
              {venue.type}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block">from</span>
              <span className="text-[18px] font-bold text-slate-900 leading-tight">
                {venue.price}
              </span>
              <span className="text-[11px] text-slate-400 ml-1">{venue.priceUnit}</span>
            </div>
            <span
              className="text-xs font-bold px-4 py-2 rounded-full text-white transition-all hover:opacity-90"
              style={{ background: "var(--sw-navy)" }}
            >
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
