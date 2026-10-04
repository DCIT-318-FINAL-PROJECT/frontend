import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = (
      process.env.API_BASE_URL || "https://backend-findmyid.onrender.com"
    ).replace(/\/$/, "");
    return {
      beforeFiles: [
        { source: "/api/:path*", destination: `${backend}/api/:path*` },
      ],
    };
  },
};
export default nextConfig;
