"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
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
          "bg-amber-50/80 flex flex-col items-center justify-center border border-amber-100 overflow-hidden", 
          fill ? "absolute inset-0 w-full h-full" : "",
          className,
          fallbackClassName
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
         <ImageIcon className="w-8 h-8 text-amber-200 mb-2 opacity-50" />
         <span className="text-amber-400/70 font-medium text-[10px] tracking-wider uppercase text-center px-2">
           Unavailable
         </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      className={className}
      fill={fill}
      width={width}
      height={height}
      onError={() => setError(true)}
      {...props}
    />
  );
}
