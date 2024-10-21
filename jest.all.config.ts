import type { Config } from 'jest';
import { config, createJestConfig } from './jest.config';

const extendedConfig: Config = {
  ...config,
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
    'src/lib/api.ts',
    'src/lib/logger.ts',
    'src/lib/openai.ts',
    'src/lib/prisma.ts',
    'src/lib/tailwind-utils.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
};

export default createJestConfig(extendedConfig);
