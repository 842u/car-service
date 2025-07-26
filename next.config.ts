import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

import { allowedOrigins } from '@/security/allowed-origins';

import { securityHeaders } from './src/security/headers';

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
        protocol: allowedOrigins.google.avatars.protocol.replace(':', '') as
          | 'https'
          | 'http',
        hostname: allowedOrigins.google.avatars.hostname,
      },
      {
        protocol: allowedOrigins.github.avatars.protocol.replace(':', '') as
          | 'https'
          | 'http',
        hostname: allowedOrigins.github.avatars.hostname,
      },
      {
        protocol: allowedOrigins.supabase.app.protocol.replace(':', '') as
          | 'https'
          | 'http',
        hostname: allowedOrigins.supabase.app.hostname,
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
