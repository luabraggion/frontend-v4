import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Desabilita o ESLint no build do Next para evitar warnings redundantes;
    // mantemos lint no pre-commit/pre-push e CI.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
