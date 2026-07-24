"use client";

import { Star } from "lucide-react";
import type { VenueReview } from "@/lib/venues-data";

interface VenueReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: VenueReview[];
}

export default function VenueReviews({ rating, reviewCount, reviews }: VenueReviewsProps) {
  // Real distribution computed from the actual reviews, not a fixed guess.
  const counts = [5, 4, 3, 2, 1].map(
    (stars) => reviews.filter((r) => Math.round(r.rating) === stars).length
  );
  const total = counts.reduce((sum, c) => sum + c, 0) || 1;
  const distribution = [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    pct: Math.round((counts[i] / total) * 100),
  }));

  if (reviewCount === 0) {
    return (
      <div className="text-center py-10 rounded-lg border border-slate-200 bg-slate-50">
        <p className="text-slate-500 text-sm">No reviews yet — be the first to celebrate here!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Overall score */}
      <div className="flex items-start gap-8 mb-6 p-6 rounded-lg border border-slate-200 bg-white">
        <div className="text-center">
          <div
            className="text-5xl font-bold leading-none mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
          >
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-4 h-4"
                style={{ color: "var(--sw-secondary)" }}
                fill={s <= Math.round(rating) ? "var(--sw-secondary)" : "none"}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">{reviewCount} reviews</p>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-2">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 w-4">{d.stars}</span>
              <Star className="w-3 h-3" style={{ color: "var(--sw-secondary)" }} fill="var(--sw-secondary)" />
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${d.pct}%`,
                    background: "var(--sw-primary)",
                  }}
                />
              </div>
              <span className="text-xs text-slate-400 w-8 text-right">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-lg border border-slate-200 bg-white"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                style={{ background: "var(--sw-ink)" }}
              >
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-800">{review.author}</p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3 h-3"
                      style={{ color: "var(--sw-secondary)" }}
                      fill={s <= review.rating ? "var(--sw-secondary)" : "none"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
