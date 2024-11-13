import { execSync } from 'child_process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['integration-tests', 'prisma', 'src', 'test-setup'],
  },
  generateBuildId: async () => {
    return execSync('git rev-parse --short HEAD').toString().trim();
  },
  images: {
    remotePatterns: [
      {
        hostname: 'books.google.com',
        protocol: 'https',
      },
      {
        hostname: 'picsum.photos',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
