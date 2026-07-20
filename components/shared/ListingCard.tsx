"use client";

import Image from "@/components/shared/CustomImage";
import { MapPin, Star } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";

export interface ListingCardProps {
  name: string;
  image: string;
  location?: string;
  /** Raw price — converted via the currency context unless `priceDisplay` is given. */
  price?: string | number;
  /** Pre-formatted price string; wins over `price` (dashboards show fixed INR). */
  priceDisplay?: string;
  unit?: string;
  /** Small label above the price. */
  priceLabel?: string;
  rating?: number;
  reviewCount?: number;
  /** Pill row above the price. */
  tags?: React.ReactNode;
  /** Top-left overlay (e.g. Featured). Falls back to a rating pill. */
  badge?: React.ReactNode;
  /** Top-right overlay (e.g. heart, Live/Pending status). */
  topRight?: React.ReactNode;
  /** Bottom-right control (e.g. "Book +", Edit). */
  action?: React.ReactNode;
  /** Extra row beneath the price/action (e.g. admin moderation toggles). */
  footer?: React.ReactNode;
  /** Free-form content between the tags row and the price/action row. */
  body?: React.ReactNode;
  /** Height of scrim (legacy prop maintained for compatibility). */
  scrimHeightClass?: string;
  className?: string;
  imageSizes?: string;
}

/**
 * Modern Split-Card Design:
 * Top crisp photo container + bottom clean details card with zero blurry scrim overlays.
 */
export default function ListingCard({
  name,
  image,
  location,
  price,
  priceDisplay,
  unit,
  priceLabel = "starting from",
  rating = 0,
  reviewCount,
  tags,
  badge,
  topRight,
  action,
  footer,
  body,
  className = "",
  imageSizes = "(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px",
}: ListingCardProps) {
  const { currency } = useCurrency();
  const hasPrice = priceDisplay !== undefined || (price !== undefined && price !== null && price !== "");

  return (
    <div
      className={`group relative flex flex-col rounded-[28px] overflow-hidden glass-card w-full h-full hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[#EE7429]/10 ${className}`}
    >
      {/* ── TOP: Crisp High-Res Image Header ── */}
      <div className="relative w-full h-[220px] sm:h-[230px] shrink-0 overflow-hidden bg-slate-100/50 dark:bg-stone-800/50">
        <Image
          src={image}
          alt={name}
          fill
          sizes={imageSizes}
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gentle dark gradient at bottom for smooth contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top-left: Featured Badge or Rating Pill */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          {badge ? (
            badge
          ) : rating > 0 ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-sm">
              <Star className="w-3.5 h-3.5 fill-[#FCCB11] text-[#FCCB11]" />
              <span>{rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        {/* Top-right: Heart shortlist or Live badge */}
        {topRight && <div className="absolute top-3 right-3 z-20">{topRight}</div>}
      </div>

      {/* ── BOTTOM: Clean Content Body ── */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-transparent rounded-b-[28px] relative z-10 backdrop-blur-sm">
        <div>
          {/* Title */}
          <h3
            className="text-lg sm:text-[19px] font-extrabold leading-snug text-slate-900 dark:text-stone-100 line-clamp-1 group-hover:text-[#EE7429] transition-colors mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
            title={name}
          >
            {name}
          </h3>

          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {location ? (
              <div className="flex items-center gap-1 text-slate-500 dark:text-stone-400 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#EE7429] shrink-0" />
                <span className="text-xs font-semibold truncate">{location}</span>
              </div>
            ) : <div />}

            {rating > 0 && !badge && (
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-stone-300 shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#FCCB11] text-[#FCCB11]" />
                <span>{rating.toFixed(1)}</span>
                {reviewCount !== undefined && (
                  <span className="text-[11px] text-slate-400 font-normal">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Tags row */}
          {tags && <div className="flex flex-wrap gap-1.5 mb-3">{tags}</div>}

          {/* Body slot */}
          {body}
        </div>

        {/* Footer: Price & Action */}
        {(hasPrice || action) && (
          <div className="pt-3.5 mt-auto border-t border-slate-200/50 dark:border-stone-700/50 flex items-center justify-between gap-3">
            {hasPrice ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-stone-500 block mb-0.5">
                  {priceLabel}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-stone-100 leading-none tracking-tight">
                    {priceDisplay ?? convertPriceString(price as string | number, currency)}
                  </span>
                  {unit && (
                    <span className="text-xs font-semibold text-slate-400 dark:text-stone-500 capitalize">
                      {unit.startsWith("/") ? unit : `/${unit}`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div />
            )}

            {action}
          </div>
        )}

        {footer && <div className="mt-3 pt-3 border-t border-slate-100 dark:border-stone-800">{footer}</div>}
      </div>
    </div>
  );
}

/** Shared pill used in the card's `tags` row. */
export function CardTag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  const toneClass =
    tone === "accent"
      ? "bg-[#EE7429]/10 text-[#EE7429] dark:bg-[#EE7429]/20 dark:text-[#f58638] border-[#EE7429]/20"
      : "bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-300 border-slate-200/60 dark:border-stone-700/60";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${toneClass}`}>
      {children}
    </span>
  );
}

