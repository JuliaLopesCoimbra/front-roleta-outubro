import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Esta é a forma oficial e correta para o Next.js 15
  experimental: {
    allowedDevOrigins: [
      "192.168.15.11",
      "192.168.15.12",
      "192.168.1.178",
      "192.168.1.196"
    ],
  },
  
  reactStrictMode: true,
};

export default nextConfig;