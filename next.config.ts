import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

import { securityHeaders } from './security/headers';

const configWithBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: `${process.env.APP_DOMAIN}/**`,
        port: process.env.APP_API_PORT || '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default configWithBundleAnalyzer(nextConfig);
