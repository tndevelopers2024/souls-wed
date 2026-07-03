"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, BedDouble, Crown, Heart } from "lucide-react";
import type { Venue } from "@/lib/venues-data";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";

interface VenueCardProps {
  venue: Venue;
  view?: "grid" | "list";
}

const blurLayers = [
  { blur: 1, solid: 55, fade: 100 },
  { blur: 3, solid: 42, fade: 78 },
  { blur: 6, solid: 28, fade: 58 },
  { blur: 12, solid: 16, fade: 40 },
  { blur: 24, solid: 6, fade: 24 },
];

export default function VenueCard({ venue, view = "grid" }: VenueCardProps) {
  const { currency } = useCurrency();
  if (view === "list") {
    return (
      <Link href={`/venues/${venue.id}`} className="group block">
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-[280px] h-[220px] sm:h-auto flex-shrink-0">
            <Image src={venue.image} alt={venue.name} fill sizes="(max-width: 640px) 100vw, 280px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            {venue.featured && (
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Crown className="w-3.5 h-3.5" style={{ color: "var(--sw-orange)" }} />
                <span className="text-xs font-bold text-slate-800 tracking-wide">Featured</span>
              </div>
            )}
            <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white transition-colors" onClick={(e) => e.preventDefault()}>
              <Heart className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1" style={{ fontFamily: "var(--font-heading)" }}>{venue.name}</h3>
                {venue.rating > 0 && (
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                    <span className="text-sm font-bold text-slate-800">{venue.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{venue.location}, {venue.country}</span>
              </div>
              <div className="flex flex-wrap gap-4 mb-4 sm:mb-0">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{venue.minGuests}-{venue.maxGuests} pax</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <BedDouble className="w-4 h-4 text-slate-400" />
                  <span>{venue.rooms} Rooms</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between pt-4 border-t border-slate-50">
              <div>
                <span className="text-xs font-medium text-slate-500 block mb-0.5">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900">{convertPriceString(venue.price, currency)}</span>
                  <span className="text-sm text-slate-500 capitalize">{venue.priceUnit}</span>
                </div>
              </div>
              <span className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 text-sm font-bold rounded-full transition-colors border border-slate-200">
                Book +
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  /* ── Grid view: full-bleed image + bottom frosted-glass overlay ── */
  return (
    <Link href={`/venues/${venue.id}`} className="block group">
      <div className="relative rounded-[32px] overflow-hidden shadow-sm border border-slate-100 w-full h-[460px] sm:h-[500px] lg:h-[540px]">

        {/* Full-bleed image */}
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Tag pill top-left */}
        {venue.featured ? (
          <div
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
            style={{ background: "var(--sw-orange)" }}
          >
            <Crown className="w-3.5 h-3.5" />
            Featured
          </div>
        ) : venue.rating > 0 ? (
          <div
            className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
            style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
          >
            <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
            <span className="text-slate-800">{venue.rating.toFixed(1)}</span>
          </div>
        ) : null}

        {/* Heart pill top-right */}
        <button
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Progressive frosted blur */}
        <div className="absolute inset-x-0 bottom-0 h-[72%] z-10 pointer-events-none">
          {blurLayers.map((l, idx) => (
            <div
              key={idx}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${l.blur}px)`,
                WebkitBackdropFilter: `blur(${l.blur}px)`,
                maskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`,
                WebkitMaskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`,
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 32%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.12) 78%, rgba(255,255,255,0) 92%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pt-5 pb-4 flex flex-col">
          <h3 className="text-[22px] font-bold leading-snug text-slate-900 line-clamp-2 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {venue.name}
          </h3>

          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-slate-600 line-clamp-1">
              {venue.location}, {venue.country}
            </span>
          </div>

          {/* Rating in content area */}
          {venue.rating > 0 && (
            <div className="flex items-center mb-3 mt-1">
              <div className="flex items-center gap-0.5 mr-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-3.5 h-3.5" 
                    style={{ color: "var(--sw-gold)" }} 
                    fill={i < Math.round(venue.rating) ? "var(--sw-gold)" : "transparent"} 
                  />
                ))}
              </div>
              <span className="text-[13px] font-bold text-slate-800">{venue.rating.toFixed(1)}</span>
              <span className="text-[13px] text-slate-500 font-medium ml-1">({venue.reviewCount} reviews)</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white text-slate-700 shadow-sm">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {venue.minGuests}-{venue.maxGuests} pax
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white text-slate-700 shadow-sm">
              <BedDouble className="w-3.5 h-3.5 text-slate-500" />
              {venue.rooms} Rooms
            </div>
            <div 
              className="flex items-center text-[11px] font-bold px-3 py-1.5 rounded-full bg-white shadow-sm"
              style={{ color: "var(--sw-orange)" }}
            >
              {venue.type}
            </div>
          </div>

          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-500 block mb-0.5">from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-slate-900 leading-none tracking-tight">
                    {convertPriceString(venue.price, currency)}
                  </span>
                <span className="text-[12px] font-medium text-slate-500 capitalize">{venue.priceUnit}</span>
              </div>
            </div>
            <span
              className="text-[14px] font-bold px-5 py-2.5 rounded-full text-slate-900 bg-white shadow-sm hover:bg-slate-50 transition-colors"
            >
              Book +
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
