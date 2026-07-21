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
}

export default function VenueGallery({ images, videos = [], venueName }: VenueGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"portfolio" | "albums" | "videos">("portfolio");

  const cleanImages = images.filter((img) => img && img.trim());
  const cleanVideos = videos.filter((vid) => vid && vid.trim());
  const allImages = cleanImages.length > 0 ? cleanImages : ["/soulswed/venue.jpg"];

  const prev = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length));
  const next = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % allImages.length));

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab("portfolio")}
          className={`text-sm pb-3 uppercase tracking-wider transition-colors ${
            activeTab === "portfolio" 
              ? "font-bold text-primary-600 border-b-2 border-primary-600" 
              : "font-semibold text-slate-400 hover:text-slate-600"
          }`}
        >
          PORTFOLIO ({allImages.length})
        </button>
        <button 
          onClick={() => setActiveTab("albums")}
          className={`text-sm pb-3 uppercase tracking-wider transition-colors ${
            activeTab === "albums" 
              ? "font-bold text-primary-600 border-b-2 border-primary-600" 
              : "font-semibold text-slate-400 hover:text-slate-600"
          }`}
        >
          ALBUMS (6)
        </button>
        <button 
          onClick={() => setActiveTab("videos")}
          className={`text-sm pb-3 uppercase tracking-wider transition-colors ${
            activeTab === "videos" 
              ? "font-bold text-primary-600 border-b-2 border-primary-600" 
              : "font-semibold text-slate-400 hover:text-slate-600"
          }`}
        >
          VIDEOS ({cleanVideos.length})
        </button>
      </div>

      {/* Grid */}
      {activeTab === "portfolio" && (
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
                className="object-cover"
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
      )}
      
      {activeTab === "albums" && (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
          <Images className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Albums are currently being curated.</p>
        </div>
      )}

      {activeTab === "videos" && (
        cleanVideos.length > 0 ? (
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
        )
      )}

      {/* "View all photos" button */}
      {allImages.length > 9 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setLightboxIndex(0)}
            className="px-6 py-2 rounded-full border text-sm font-bold"
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
