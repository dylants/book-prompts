/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['integration-tests', 'prisma', 'src', 'test-setup'],
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
