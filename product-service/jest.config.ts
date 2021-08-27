import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from './tsconfig.paths.json';

export default {
  roots: [
    '<rootDir>'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!.serverless/**',
    '!.webpack/**',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
