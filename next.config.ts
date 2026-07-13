import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/vendors/:category',
        destination: '/:category',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  allowedDevOrigins: ["192.0.0.2"],
};

export default nextConfig;
