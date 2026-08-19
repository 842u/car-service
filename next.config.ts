import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

import { allowedOrigins } from '@/security/allowed-origins';
import { securityHeaders } from '@/security/headers';

const configWithBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  typedRoutes: true,
  // TanStack Table v9 ships ESM only. Listing it here also feeds next/jest,
  // which otherwise leaves the package untransformed and fails to parse it.
  transpilePackages: ['@tanstack/react-table', '@tanstack/table-core'],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: allowedOrigins.google.avatars.protocol.replace(':', '') as
          'https' | 'http',
        hostname: allowedOrigins.google.avatars.hostname,
      },
      {
        protocol: allowedOrigins.github.avatars.protocol.replace(':', '') as
          'https' | 'http',
        hostname: allowedOrigins.github.avatars.hostname,
      },
      {
        protocol: allowedOrigins.supabase.app.protocol.replace(':', '') as
          'https' | 'http',
        hostname: allowedOrigins.supabase.app.hostname,
      },
    ],
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
