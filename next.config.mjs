import bundleAnalyzer from '@next/bundle-analyzer';

import { securityHeaders } from './utils/security.mjs';

const configWithBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        protocol: process.env.APP_PROTOCOL,
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
