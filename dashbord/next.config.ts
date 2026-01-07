import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // نکته: اگر آدرس دقیق API شما /api دارد، در خط زیر اضافه کنید.
        // فرض بر این است که آدرس سرور شما http://uat-prosha.dayatadbir.com/api/... نیست
        // و مستقیماً روی روت یا کنترلرها پاسخ می‌دهد.
        destination: 'http://uat-prosha.dayatadbir.com/:path*',
      },
    ];
  },
};

export default nextConfig;