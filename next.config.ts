import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the root so Next doesn't walk up to ~/package-lock.json.
  turbopack: { root: __dirname },
};

export default nextConfig;
