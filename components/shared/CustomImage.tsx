"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { isOptimizableSrc } from "@/lib/image-hosts";
import { ImageIcon } from "lucide-react";

interface CustomImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

export default function CustomImage({ 
  src, 
  alt, 
  className, 
  fallbackClassName,
  fill,
  width,
  height,
  ...props 
}: CustomImageProps) {
  const [error, setError] = useState(false);

  if (error || !src || src === "") {
    return (
      <div
        className={cn(
          "bg-amber-50/80 dark:bg-amber-500/10 flex flex-col items-center justify-center border border-amber-100 dark:border-amber-500/20 overflow-hidden",
          fill ? "absolute inset-0 w-full h-full" : "",
          className,
          fallbackClassName
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
         <ImageIcon className="w-8 h-8 text-amber-200 dark:text-amber-500/40 mb-2 opacity-50" />
         <span className="text-amber-400/70 dark:text-amber-400/60 font-medium text-[10px] tracking-wider uppercase text-center px-2">
           Unavailable
         </span>
      </div>
    );
  }

  // Hosts outside the allow-list can't go through the optimizer, so serve them
  // directly instead of letting /_next/image return a 400.
  const unoptimized =
    props.unoptimized ?? (typeof src === "string" ? !isOptimizableSrc(src) : false);

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      className={className}
      fill={fill}
      width={width}
      height={height}
      quality={props.quality || 85}
      sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      onError={() => setError(true)}
      {...props}
      unoptimized={unoptimized}
    />
  );
}
