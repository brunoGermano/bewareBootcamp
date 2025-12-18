import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
  
  eslint: {
    ignoreDuringBuilds: true, // only use this block to avoid the ESlint execution when running "npm run build" command and avoid errors.
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d4lgxe9bm8juw.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
