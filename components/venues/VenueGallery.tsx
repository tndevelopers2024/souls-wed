"use client";

import { useState } from "react";
import Image from "@/components/shared/CustomImage";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

export default function VenueGallery({ images, venueName }: VenueGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = images.length > 0 ? images : ["/soulswed/pageimg_venues.jpg"];

  const prev = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length));
  const next = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % allImages.length));

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-white/10 mb-6">
        <button className="text-sm font-bold text-primary-600 border-b-2 border-primary-600 pb-3 uppercase tracking-wider">
          PORTFOLIO ({allImages.length})
        </button>
        <button className="text-sm font-semibold text-slate-400 dark:text-stone-500 hover:text-slate-600 dark:hover:text-stone-300 pb-3 uppercase tracking-wider transition-colors">
          ALBUMS (6)
        </button>
        <button className="text-sm font-semibold text-slate-400 dark:text-stone-500 hover:text-slate-600 dark:hover:text-stone-300 pb-3 uppercase tracking-wider transition-colors">
          VIDEOS (2)
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allImages.slice(0, 9).map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer aspect-square rounded-xl overflow-hidden group"
            onClick={() => setLightboxIndex(idx)}
          >
            <Image
              src={img}
              alt={`${venueName} – photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {idx === 8 && allImages.length > 9 && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 hover:bg-black/40 transition-colors"
              >
                <span className="text-white font-bold text-xl">+{allImages.length - 9}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* "View all photos" button */}
      {allImages.length > 9 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setLightboxIndex(0)}
            className="px-6 py-2 rounded-full border text-sm font-bold transition-all hover:bg-primary-50"
            style={{ borderColor: "var(--sw-primary)", color: "var(--sw-primary)" }}
          >
            View {allImages.length - 9} more
          </button>
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
            <X className="w-6 h-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-7 h-7" />
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
            <ChevronRight className="w-7 h-7" />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </p>
        </div>
      )}
    </>
  );
}
