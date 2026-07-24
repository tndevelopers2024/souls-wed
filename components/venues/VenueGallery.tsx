"use client";

import { useState, useEffect } from "react";
import Image from "@/components/shared/CustomImage";
import { Images, Star } from "lucide-react";
import { XIcon } from "@/components/ui/x";
import { ChevronLeftIcon } from "@/components/ui/chevron-left";
import { ChevronRightIcon } from "@/components/ui/chevron-right";
import { isDirectVideoUrl, toVideoEmbedUrl } from "@/lib/media";

export interface GalleryReview {
  id?: string | number;
  author?: string;
  date?: string;
  text?: string;
}

interface VenueGalleryProps {
  images: string[];
  videos?: string[];
  venueName: string;
  /**
   * "hero" — the Booking.com collage, shown at the top of the page so a
   * visitor sees the photographs the moment it opens.
   * "videos" — the video grid on its own, for the section further down.
   */
  variant?: "hero" | "videos";
  /** Shown in the all-photos grid's side panel, as Booking.com does. */
  rating?: number;
  reviewCount?: number;
  reviews?: GalleryReview[];
}

/**
 * The label sitting on the last tile of the collage, as Booking.com does it —
 * white underlined text over a dark scrim, opening the all-photos grid.
 */
function OverflowLabel({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="absolute inset-0 flex items-center justify-center bg-black/55 hover:bg-black/45 transition-colors cursor-pointer px-2"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <span className="text-white font-bold text-xs sm:text-sm underline text-center leading-snug">
        {label}
      </span>
    </button>
  );
}

/** Booking.com's wording for its review scores. */
function ratingLabel(rating: number) {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4) return "Wonderful";
  if (rating >= 3.5) return "Very good";
  if (rating >= 3) return "Good";
  return "Review score";
}

/**
 * Demo listings are seeded with licensed stock photography. Showing those under
 * a real property's name without saying so would mislead someone about to book,
 * so any gallery served from the stock pool carries a visible caption.
 */
function isStockImage(url: string) {
  return url.includes("images.unsplash.com");
}

export default function VenueGallery({
  images,
  videos = [],
  venueName,
  variant = "hero",
  rating = 0,
  reviewCount = 0,
  reviews = [],
}: VenueGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [gridOpen, setGridOpen] = useState(false);

  const cleanImages = images.filter((img) => img && img.trim());
  const cleanVideos = videos.filter((vid) => vid && vid.trim());
  const allImages = cleanImages.length > 0 ? cleanImages : ["/soulswed/venue.jpg"];

  // Booking.com's main block is a wide hero, a tall middle, and two stacked on
  // the right. With fewer than four photos the survivors share the space
  // instead of leaving holes in the grid.
  const MAIN_SPANS: Record<number, string[]> = {
    1: ["col-span-12 row-span-2"],
    2: ["col-span-7 row-span-2", "col-span-5 row-span-2"],
    3: ["col-span-6 row-span-2", "col-span-6", "col-span-6"],
    4: ["col-span-5 row-span-2", "col-span-3 row-span-2", "col-span-4", "col-span-4"],
  };
  const mainCount = Math.min(allImages.length, 4);
  const spans = MAIN_SPANS[mainCount];
  const mainTiles = allImages
    .slice(0, mainCount)
    .map((src, index) => ({ src, index, span: spans[index] }));

  const thumbs = allImages.slice(4, 9).map((src, i) => ({ src, index: i + 4 }));
  const hiddenCount = allImages.length - 9;

  // Booking.com has no button under the collage — the last tile carries the
  // label that opens the all-photos grid. When nothing is hidden it still
  // needs to be reachable, so the label names the total instead of a remainder.
  const overflowLabel =
    hiddenCount > 0 ? `+${hiddenCount} photos` : `Show all ${allImages.length} photos`;
  const showOverflow = allImages.length > 1;
  const overflowOnThumb = thumbs.length > 0 ? thumbs.length - 1 : -1;
  const overflowOnMain = thumbs.length > 0 ? -1 : mainTiles.length - 1;

  const prev = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length));
  const next = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % allImages.length));

  // Escape closes the viewer first, then the grid, so one press never drops a
  // visitor straight back to the page from a photo they were looking at.
  // Arrow keys page through the viewer.
  const viewerOpen = lightboxIndex !== null;
  useEffect(() => {
    if (!viewerOpen && !gridOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewerOpen) setLightboxIndex(null);
        else setGridOpen(false);
      }
      if (!viewerOpen) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen, gridOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the page behind from scrolling under the overlay.
  useEffect(() => {
    if (!viewerOpen && !gridOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [viewerOpen, gridOpen]);

  if (variant === "videos") {
    return cleanVideos.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cleanVideos.map((vid, idx) => (
          <div key={idx} className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
            {isDirectVideoUrl(vid) ? (
              <video
                src={vid}
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <iframe
                src={toVideoEmbedUrl(vid)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={`${venueName} – video ${idx + 1}`}
              />
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
        <Images className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">No videos uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Booking.com collage: a 4-image main block (wide hero, tall middle,
          two stacked) above a strip of thumbnails, with the overflow count on
          the last thumbnail. */}
      <div className="flex flex-col gap-2">
        {/* Main block */}
        <div className="grid grid-cols-12 grid-rows-2 gap-2 h-[260px] sm:h-[340px] md:h-[400px]">
          {mainTiles.map(({ src, index, span }, i) => (
            <div
              key={index}
              className={`relative cursor-pointer overflow-hidden group first:rounded-l-xl last:rounded-r-xl ${span}`}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={src}
                alt={`${venueName} – photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
              {showOverflow && i === overflowOnMain && (
                <OverflowLabel label={overflowLabel} onOpen={() => setGridOpen(true)} />
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail strip — the columns follow the photo count so a listing
            with five spare photos and one with two both fill the row. */}
        {thumbs.length > 0 && (
          <div
            className="grid gap-2 h-[72px] sm:h-[90px] md:h-[104px]"
            style={{ gridTemplateColumns: `repeat(${thumbs.length}, minmax(0, 1fr))` }}
          >
            {thumbs.map(({ src, index }, i) => (
              <div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-lg group"
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={src}
                  alt={`${venueName} – photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
                {showOverflow && i === overflowOnThumb && (
                  <OverflowLabel label={overflowLabel} onOpen={() => setGridOpen(true)} />
                )}
              </div>
            ))}
          </div>
        )}

        {allImages.some(isStockImage) && (
          <p className="text-[11px] font-medium mt-1" style={{ color: "var(--sw-steel)" }}>
            Representative images — not photographs of this specific property.
          </p>
        )}
      </div>

      {/* All-photos grid — Booking.com opens this from "+N photos", a sheet of
          every photograph with the review panel alongside. */}
      {gridOpen && (
        <div
          className="fixed inset-0 z-[95] flex flex-col"
          style={{ background: "var(--sw-white, #fff)" }}
          role="dialog"
          aria-modal="true"
          aria-label={`All photos of ${venueName}`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b shrink-0"
            style={{ borderColor: "var(--sw-light-gray)" }}
          >
            <div className="min-w-0">
              <p
                className="font-bold text-base sm:text-lg truncate"
                style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              >
                {venueName}
              </p>
              <p className="text-xs" style={{ color: "var(--sw-steel)" }}>
                {allImages.length} photos
              </p>
            </div>
            <button
              onClick={() => setGridOpen(false)}
              className="flex items-center gap-1.5 text-sm font-bold shrink-0 px-3 py-2 rounded-full transition-colors hover:bg-slate-100 cursor-pointer"
              style={{ color: "var(--sw-navy)" }}
            >
              Close
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body: photo grid, with the review panel beside it on wide screens */}
          <div className="flex-1 overflow-y-auto">
            <div
              className={`mx-auto max-w-[1600px] px-4 sm:px-6 py-5 gap-6 ${
                rating > 0 ? "lg:grid lg:grid-cols-[1fr_320px]" : ""
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {allImages.map((src, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer bg-slate-100"
                    aria-label={`Open photo ${index + 1} of ${allImages.length}`}
                  >
                    <Image
                      src={src}
                      alt={`${venueName} – photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <aside className="hidden lg:block">
                  <div
                    className="rounded-lg border p-4 sticky top-0"
                    style={{ borderColor: "var(--sw-light-gray)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex items-center gap-1 text-white font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: "var(--sw-navy)" }}
                      >
                        <Star
                          className="w-4 h-4"
                          style={{ color: "var(--sw-secondary)", fill: "var(--sw-secondary)" }}
                        />
                        {rating.toFixed(1)}
                      </span>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--sw-navy)" }}>
                          {ratingLabel(rating)}
                        </p>
                        {reviewCount > 0 && (
                          <p className="text-xs" style={{ color: "var(--sw-steel)" }}>
                            {reviewCount} reviews
                          </p>
                        )}
                      </div>
                    </div>

                    {reviews.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <p className="text-xs font-bold" style={{ color: "var(--sw-navy)" }}>
                          What couples said:
                        </p>
                        {reviews.slice(0, 4).map((review, i) => (
                          <div
                            key={review.id ?? i}
                            className="pt-3 border-t"
                            style={{ borderColor: "var(--sw-light-gray)" }}
                          >
                            <p
                              className="text-[13px] leading-relaxed"
                              style={{ color: "var(--sw-steel)" }}
                            >
                              &ldquo;{review.text}&rdquo;
                            </p>
                            {review.author && (
                              <p
                                className="text-[11px] font-semibold mt-1.5"
                                style={{ color: "var(--sw-navy)" }}
                              >
                                {review.author}
                                {review.date ? ` · ${review.date}` : ""}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>
              )}
            </div>

            {allImages.some(isStockImage) && (
              <p
                className="mx-auto max-w-[1600px] px-4 sm:px-6 pb-6 text-[11px] font-medium"
                style={{ color: "var(--sw-steel)" }}
              >
                Representative images — not photographs of this specific property.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/10"
            onClick={() => setLightboxIndex(null)}
          >
            <XIcon className="w-6 h-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeftIcon className="w-7 h-7" />
          </button>

          <div
            className="relative w-full max-w-3xl mx-16"
            style={{ height: "70vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`${venueName} – photo ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRightIcon className="w-7 h-7" />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </p>
        </div>
      )}
    </>
  );
}
