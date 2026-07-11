import Image from "@/components/shared/CustomImage";
import { MapPin, Star, Heart } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";

interface VendorCardProps {
  id: string | number;
  name: string;
  location: string;
  price: string;
  unit: string;
  rating: number;
  reviewCount?: number;
  tags?: React.ReactNode;
  badge?: React.ReactNode;
  image: string;
}

export default function VendorCard({
  id,
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
  const { currency } = useCurrency();

  return (
    <div className="relative rounded-[32px] overflow-hidden shadow-sm border border-slate-100 w-full h-full bg-white [transform:translateZ(0)]">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 85vw, (max-width: 768px) 300px, 340px"
        className="object-cover transition-transform duration-700"
      />

      {/* Top Left Badge or Rating */}
      {badge ? (
        badge
      ) : rating > 0 ? (
        <div
          className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
          style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
        >
          <Star className="w-3.5 h-3.5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
          <span className="text-slate-800">{rating.toFixed(1)}</span>
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
      <div className="absolute inset-x-0 bottom-0 h-[69%] z-10 pointer-events-none">
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
          {name}
        </h3>

        <div className="flex items-center gap-1 mb-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="text-[13px] font-medium text-slate-600 line-clamp-1">{location}</span>
        </div>

        {/* Rating in content area */}
        {rating > 0 && (
          <div className="flex items-center mb-3 mt-1">
            <div className="flex items-center gap-0.5 mr-1.5">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--sw-gold)" }}
                  fill={idx < Math.round(rating) ? "var(--sw-gold)" : "transparent"}
                />
              ))}
            </div>
            <span className="text-[13px] font-bold text-slate-800">{rating.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="text-[13px] text-slate-500 font-medium ml-1">({reviewCount} reviews)</span>
            )}
          </div>
        )}

        {tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags}
          </div>
        )}

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-bold text-slate-900 leading-none tracking-tight">
                {convertPriceString(price, currency)}
              </span>
              <span className="text-[12px] font-medium text-slate-500 capitalize">{unit}</span>
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
  );
}
