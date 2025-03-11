import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "via.placeholder.com",
      },
      {
        hostname: "i1.rgstatic.net",
      },
      {
        hostname: "img.freepik.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "png.pngtree.com",
      },
    ],
  },
};

export default nextConfig;
