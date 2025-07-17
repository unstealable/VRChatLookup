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
};

export default nextConfig;
