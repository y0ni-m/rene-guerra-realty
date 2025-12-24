import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Spark Platform / Beaches MLS image CDNs
      {
        protocol: "https",
        hostname: "**.sparkplatform.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "photos.sparkplatform.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.reso.media",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.mlsmatrix.com",
        pathname: "/**",
      },
      // Beaches MLS specific CDNs
      {
        protocol: "https",
        hostname: "**.beachesmls.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbsdata.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.listhub.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.listingphotos.com",
        pathname: "/**",
      },
      // Common MLS photo CDNs
      {
        protocol: "https",
        hostname: "**.mredllc.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.corelogic.com",
        pathname: "/**",
      },
      // Catch-all for any https images (use with caution in production)
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
