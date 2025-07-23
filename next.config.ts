import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.vrchat.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.unstealable.cloud",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // Rewrite localized routes to the base app structure
      {
        source: '/fr/:path*',
        destination: '/:path*',
      },
      {
        source: '/en/:path*', 
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;