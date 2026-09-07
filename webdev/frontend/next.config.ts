import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel handles serverless outputs natively. Standalone is only needed for Docker */
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
};

export default nextConfig;
