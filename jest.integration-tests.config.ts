import type { Config } from 'jest';
import { config, createJestConfig } from './jest.config';

const extendedConfig: Config = {
  ...config,
  testPathIgnorePatterns: ['/node_modules/', '/src/'],
};

export default createJestConfig(extendedConfig);
