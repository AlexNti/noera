import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
  // Include workspace packages for transpilation and hot reload
  transpilePackages: ['@noera/ui'],
};

export default nextConfig;
