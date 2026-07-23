"use client";

import { useState } from "react";
import Image from "@/components/shared/CustomImage";
import { Images } from "lucide-react";
import { XIcon } from "@/components/ui/x";
import { ChevronLeftIcon } from "@/components/ui/chevron-left";
import { ChevronRightIcon } from "@/components/ui/chevron-right";
import { isDirectVideoUrl, toVideoEmbedUrl } from "@/lib/media";

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
}: VenueGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const prev = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length));
  const next = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % allImages.length));

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
      <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
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
          {mainTiles.map(({ src, index, span }) => (
            <div
              key={index}
              className={`relative cursor-pointer overflow-hidden group first:rounded-l-xl last:rounded-r-xl ${span}`}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={src}
                alt={`${venueName} – photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
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
            {thumbs.map(({ src, index }, i) => {
              const isLast = i === thumbs.length - 1;
              return (
                <div
                  key={index}
                  className="relative cursor-pointer overflow-hidden rounded-lg group"
                  onClick={() => setLightboxIndex(index)}
                >
                  <Image
                    src={src}
                    alt={`${venueName} – photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="20vw"
                  />
                  {isLast && hiddenCount > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/50 transition-colors">
                      <span className="text-white font-bold text-xs sm:text-sm underline">
                        +{hiddenCount} photos
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          {allImages.some(isStockImage) ? (
            <p className="text-[11px] font-medium" style={{ color: "var(--sw-steel)" }}>
              Representative images — not photographs of this specific property.
            </p>
          ) : (
            <span />
          )}

          {allImages.length > 1 && (
            <button
              onClick={() => setLightboxIndex(0)}
              className="px-5 py-1.5 rounded-full border text-xs font-bold transition-opacity hover:opacity-80 cursor-pointer whitespace-nowrap"
              style={{ borderColor: "var(--sw-primary)", color: "var(--sw-primary)" }}
            >
              Show all {allImages.length} photos
            </button>
          )}
        </div>
      </div>

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
