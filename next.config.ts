import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server only serves its HMR client to trusted hosts. Without this,
  // opening the site on 127.0.0.1 blocks hydration entirely.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
