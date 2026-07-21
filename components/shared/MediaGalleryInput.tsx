"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { UploadCloud, Loader2, Film, PlayCircle, AlertCircle } from "lucide-react";
import { XIcon } from "@/components/ui/x";
import { PlusIcon } from "@/components/ui/plus";
import { LinkIcon } from "@/components/ui/link";
import { isDirectVideoUrl, toVideoEmbedUrl } from "@/lib/media";

interface MediaGalleryInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  mode: "image" | "video";
  isDarkMode?: boolean;
  max?: number;
}

const IMAGE_ACCEPT = "image/jpeg, image/png, image/webp, image/gif, image/avif";
const VIDEO_ACCEPT = "video/mp4, video/webm, video/quicktime, video/x-m4v";

function youtubeThumb(url: string): string | null {
  const m = url.match(/youtube\.com\/embed\/([\w-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

export default function MediaGalleryInput({ items, onChange, mode, isDarkMode = false, max = 30 }: MediaGalleryInputProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Keep a ref of the latest list so parallel upload callbacks don't clobber each other
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const isVideo = mode === "video";
  const remaining = max - items.length;

  const appendItems = useCallback((urls: string[]) => {
    const merged = [...itemsRef.current];
    for (const url of urls) {
      if (url && !merged.includes(url) && merged.length < max) merged.push(url);
    }
    itemsRef.current = merged;
    onChange(merged);
  }, [max, onChange]);

  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    if (files.length > remaining) {
      setError(`Only ${remaining} more ${remaining === 1 ? "item" : "items"} allowed.`);
      files = files.slice(0, Math.max(remaining, 0));
      if (files.length === 0) return;
    } else {
      setError(null);
    }

    setPendingCount(c => c + files.length);
    await Promise.all(files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", mode);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          appendItems([data.url]);
        } else {
          setError(data.message || `Failed to upload ${file.name}`);
        }
      } catch {
        setError(`Failed to upload ${file.name}`);
      } finally {
        setPendingCount(c => c - 1);
      }
    }));
  }, [appendItems, mode, remaining]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const accepted = Array.from(e.dataTransfer.files).filter(f =>
      isVideo ? f.type.startsWith("video/") : f.type.startsWith("image/")
    );
    if (accepted.length === 0) {
      setError(`Drop ${isVideo ? "video" : "image"} files here.`);
      return;
    }
    uploadFiles(accepted);
  };

  const addUrl = () => {
    const raw = urlDraft.trim();
    if (!raw) return;
    if (!/^(https?:\/\/|\/)/.test(raw)) {
      setError("Enter a valid URL (must start with http(s):// or /).");
      return;
    }
    setError(null);
    appendItems([isVideo ? toVideoEmbedUrl(raw) : raw]);
    setUrlDraft("");
  };

  const removeAt = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    itemsRef.current = next;
    onChange(next);
  };

  const tileBase = `relative group rounded-xl overflow-hidden border ${isDarkMode ? "border-stone-800 bg-stone-900" : "border-stone-200 bg-stone-100"}`;

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors ${
        isDragOver
          ? "border-primary-500 bg-primary-500/5"
          : isDarkMode ? "border-stone-800" : "border-stone-200"
      }`}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Tiles */}
      <div className={`grid gap-3 ${isVideo ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"}`}>
        {items.map((url, idx) => {
          const thumb = isVideo ? youtubeThumb(url) : url;
          return (
            <div key={`${url}-${idx}`} className={`${tileBase} ${isVideo ? "aspect-video" : "aspect-square"}`}>
              {isVideo && isDirectVideoUrl(url) ? (
                <video src={url} muted preload="metadata" className="w-full h-full object-cover" />
              ) : thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center gap-1.5 px-2 ${isDarkMode ? "text-stone-500" : "text-stone-400"}`}>
                  <Film className="w-6 h-6" />
                  <span className="text-[9px] font-semibold truncate w-full text-center">{url}</span>
                </div>
              )}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="w-8 h-8 text-white drop-shadow-md opacity-80" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label="Remove"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {Array.from({ length: pendingCount }).map((_, i) => (
          <div key={`pending-${i}`} className={`${tileBase} ${isVideo ? "aspect-video" : "aspect-square"} flex flex-col items-center justify-center gap-1.5`}>
            <Loader2 className={`w-5 h-5 animate-spin ${isDarkMode ? "text-stone-400" : "text-stone-500"}`} />
            <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? "text-stone-500" : "text-stone-400"}`}>Uploading</span>
          </div>
        ))}

        {items.length + pendingCount < max && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${isVideo ? "aspect-video" : "aspect-square"} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isDarkMode
                ? "border-stone-700 hover:border-stone-500 text-stone-500 hover:text-stone-300"
                : "border-stone-300 hover:border-stone-400 text-stone-400 hover:text-stone-600"
            }`}
          >
            <UploadCloud className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
              <PlusIcon className="w-3 h-3" /> {isVideo ? "Add video" : "Add photos"}
            </span>
          </button>
        )}
      </div>

      <input
        type="file"
        multiple
        accept={isVideo ? VIDEO_ACCEPT : IMAGE_ACCEPT}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {/* URL row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center min-w-0">
          <LinkIcon className="absolute left-3 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          <input
            type="url"
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
            placeholder={isVideo ? "Or paste a YouTube / Vimeo / video URL" : "Or paste an image URL"}
            className={`w-full border rounded-xl pl-8 pr-3 py-2 outline-none font-semibold text-xs truncate transition-colors ${
              isDarkMode
                ? "bg-stone-950 border-stone-800 text-stone-200 focus:border-stone-600 placeholder:text-stone-600"
                : "bg-white border-stone-200 text-stone-800 focus:border-stone-400 placeholder:text-stone-400"
            }`}
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          disabled={!urlDraft.trim()}
          className={`px-4 py-2 rounded-xl border font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default ${
            isDarkMode
              ? "bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200"
              : "bg-stone-100 border-stone-200 hover:bg-stone-200 text-stone-700"
          }`}
        >
          Add
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className={`text-[10px] ${isDarkMode ? "text-stone-600" : "text-stone-400"}`}>
          {isVideo
            ? "Drag & drop MP4/WebM/MOV (max 200 MB each), or paste YouTube/Vimeo links."
            : "Drag & drop JPEG/PNG/WebP (max 15 MB each). First photo is shown first in the gallery."}
        </p>
        <span className={`text-[10px] font-bold shrink-0 ${isDarkMode ? "text-stone-600" : "text-stone-400"}`}>
          {items.length}/{max}
        </span>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
