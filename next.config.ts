import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
  
  // eslint: {
  //   // only use this block to avoid the ESlint execution when running "npm run build" command and avoid errors.
  //   ignoreDuringBuilds: true,
  // },

  typescript: {
    // Isso ignora erros de tipagem no build (use com cautela)
    ignoreBuildErrors: true,
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
