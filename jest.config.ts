import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  collectCoverageFrom: [
    'src/**/*.ts*',
    // exclude everything but api from /app
    '!src/app/**',
    'src/app/api/**',
    // exclude all these directories and everything below them
    '!src/config/**',
    '!src/lib/fakes/**',
    '!src/lib/schemas/**',
    '!src/lib/scratch-data/**',
    '!src/scripts/**',
    '!src/types/**',
  ],
  coveragePathIgnorePatterns: [
    'src/components/*',
    'src/lib/logger.ts',
    'src/lib/openai.ts',
    'src/lib/prisma.ts',
    'src/lib/tailwind-utils.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test-setup/openai-mock.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
