"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { LinkIcon } from "@/components/ui/link";

interface ImageUploadInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  isDarkMode?: boolean;
}

export default function ImageUploadInput({ value, onChange, placeholder = "Image URL", className = "", isDarkMode = false }: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setErrorMsg(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full relative ${className}`}>
      <div className="relative flex-1 flex items-center min-w-0 w-full">
        <div className="absolute left-3 text-stone-400">
          <LinkIcon className="w-4 h-4" />
        </div>
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-xl pl-9 pr-4 py-2.5 outline-none font-semibold truncate ${isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200 focus:border-stone-600" : "bg-white border-stone-200 text-stone-800 focus:border-stone-400"}`}
        />
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
        <span className="text-xs font-bold text-stone-400 uppercase">OR</span>
        <div className="relative flex-1 sm:flex-none">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp, image/gif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition-colors ${
              isDarkMode 
                ? "bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200 disabled:opacity-50" 
                : "bg-stone-100 border-stone-200 hover:bg-stone-200 text-stone-700 disabled:opacity-50"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Upload from device
              </>
            )}
          </button>
        </div>
      </div>
      {errorMsg && (
        <div className="absolute -bottom-6 left-0 text-red-500 text-xs font-semibold">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
