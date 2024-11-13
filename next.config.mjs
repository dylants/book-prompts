/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['integration-tests', 'prisma', 'src', 'test-setup'],
  },
  generateBuildId: () => {
    return process.env.DOCKER_TAG;
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
  output: 'standalone',
};

export default nextConfig;
