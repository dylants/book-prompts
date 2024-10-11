/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['integration-tests', 'prisma', 'src', 'test-setup'],
  },
};

export default nextConfig;
