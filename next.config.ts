import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Traces only the files `next start` actually needs into `.next/standalone`
  // (plus a minimal server.js), so the production Docker image doesn't have
  // to ship the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
