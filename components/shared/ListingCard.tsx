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
  /** Free-form content between the tags row and the price/action row
   *  (e.g. a booking's date/guest details). */
  body?: React.ReactNode;
  /** Height of the frosted scrim — raise it when `body` adds tall content. */
  scrimHeightClass?: string;
  className?: string;
  imageSizes?: string;
}

/**
 * The single card design used across the whole app — public listings, vendor
 * dashboard, admin moderation and (visually) bookings.
 *
 * Full-bleed image with a progressive frosted-blur scrim so the text stays
 * readable over any photo in both themes. Overlays and the bottom control are
 * slots so each surface can supply its own badges/actions without forking the
 * design.
 */
export default function ListingCard({
  name,
  image,
  location,
  price,
  priceDisplay,
  unit,
  priceLabel,
  rating = 0,
  reviewCount,
  tags,
  badge,
  topRight,
  action,
  footer,
  body,
  scrimHeightClass = "h-[69%]",
  className = "",
  imageSizes = "(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px",
}: ListingCardProps) {
  const { currency } = useCurrency();
  const hasPrice = priceDisplay !== undefined || (price !== undefined && price !== null && price !== "");

  return (
    <div
      className={`relative rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/10 w-full h-full bg-white dark:bg-[var(--sw-surface)] [transform:translateZ(0)] [clip-path:inset(0_round_32px)] ${className}`}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes={imageSizes}
        className="object-cover"
      />

      {/* Top-left: custom badge, else an automatic rating pill */}
      {badge ? (
        badge
      ) : rating > 0 ? (
        <div
          className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: "var(--sw-chip-bg-hover)", backdropFilter: "blur(10px)" }}
        >
          <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-secondary)" }} fill="var(--sw-secondary)" />
          <span className="text-slate-800 dark:text-stone-200">{rating.toFixed(1)}</span>
        </div>
      ) : null}

      {topRight && <div className="absolute top-3 right-3 z-20">{topRight}</div>}

      {/* Progressive frosted blur + theme-aware scrim */}
      <div className={`absolute inset-x-0 bottom-0 ${scrimHeightClass} z-10 pointer-events-none rounded-b-[32px] overflow-hidden`}>
        {[
          { blur: 1, solid: 55, fade: 100 },
          { blur: 3, solid: 42, fade: 78 },
          { blur: 6, solid: 28, fade: 58 },
          { blur: 12, solid: 16, fade: 40 },
          { blur: 24, solid: 6, fade: 24 },
        ].map((l, idx) => (
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
        <div className="absolute inset-0" style={{ background: "var(--sw-card-scrim)" }} />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pt-5 pb-4 flex flex-col">
        <h3
          className="text-[22px] font-bold leading-snug text-slate-900 dark:text-stone-100 line-clamp-2 mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {name}
        </h3>

        {location && (
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400 flex-shrink-0" />
            <span className="text-[13px] font-medium text-slate-600 dark:text-stone-300 line-clamp-1">{location}</span>
          </div>
        )}

        {rating > 0 && (
          <div className="flex items-center mb-3 mt-1">
            <div className="flex items-center gap-0.5 mr-1.5">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--sw-secondary)" }}
                  fill={idx < Math.round(rating) ? "var(--sw-secondary)" : "transparent"}
                />
              ))}
            </div>
            <span className="text-[13px] font-bold text-slate-800 dark:text-stone-200">{rating.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="text-[13px] text-slate-500 dark:text-stone-400 font-medium ml-1">({reviewCount} reviews)</span>
            )}
          </div>
        )}

        {tags && <div className="flex flex-wrap gap-2 mb-4">{tags}</div>}

        {body}

        {(hasPrice || action) && (
          <div className="flex items-end justify-between gap-3 mt-auto">
            {hasPrice ? (
              <div className="flex flex-col">
                {priceLabel && <span className="text-[11px] font-medium text-slate-500 dark:text-stone-400 block mb-0.5">{priceLabel}</span>}
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] font-bold text-slate-900 dark:text-stone-100 leading-none tracking-tight">
                    {priceDisplay ?? convertPriceString(price as string | number, currency)}
                  </span>
                  {unit && (
                    <span className="text-[12px] font-medium text-slate-500 dark:text-stone-400 capitalize">{unit}</span>
                  )}
                </div>
              </div>
            ) : (
              <span />
            )}
            {action}
          </div>
        )}

        {footer && <div className="mt-3 pt-3 border-t border-slate-900/10 dark:border-white/10">{footer}</div>}
      </div>
    </div>
  );
}

/** Shared pill used in the card's `tags` row. */
export function CardTag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  const toneClass =
    tone === "accent"
      ? "bg-primary-500/15 text-primary-700 dark:text-primary-300 border-primary-500/25"
      : "bg-white/80 dark:bg-white/10 text-slate-700 dark:text-stone-300 border-slate-900/5 dark:border-white/10";
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border ${toneClass}`}>
      {children}
    </span>
  );
}
