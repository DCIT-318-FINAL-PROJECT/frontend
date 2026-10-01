import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = (
      process.env.API_BASE_URL || "http://localhost:5050"
    ).replace(/\/$/, "");
    return {
      beforeFiles: [
        { source: "/api/:path*", destination: `${backend}/api/:path*` },
      ],
    };
  },
};
export default nextConfig;
