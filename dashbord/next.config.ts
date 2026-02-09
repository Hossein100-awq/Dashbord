import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
      
        destination: 'https://uat-prosha.wingom.ir/auth/:path*',
      },
    ];
  },
};

export default nextConfig;