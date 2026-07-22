import type { NextConfig } from "next";
import path from "path";
import { OPTIMIZED_IMAGE_HOSTS } from "./lib/image-hosts";

const nextConfig: NextConfig = {
  async redirects() {
    return [];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  serverExternalPackages: ["mongoose"],
  images: {
    qualities: [75, 85],
    // Explicit allow-list instead of a `**` wildcard. Anything not listed here
    // is rendered unoptimized by CustomImage rather than 400ing.
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  allowedDevOrigins: ["192.0.0.2"],
};

export default nextConfig;
