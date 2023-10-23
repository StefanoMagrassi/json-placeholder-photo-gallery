import type {Config} from 'jest';

const BASE: Config = {
  clearMocks: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/[\\w/]*test/_[a-zA-Z]+\\.ts',
    '<rootDir>/node_modules/'
  ],
  roots: ['<rootDir>/src/']
};

const config: Config = {
  bail: true,
  collectCoverage: true,
  coverageReporters: ['text'],
  maxWorkers: '50%',

  projects: [
    {
      ...BASE,
      displayName: 'NODE',
      testRegex: '(\\.|/)(test|spec)\\.[jt]s$'
    },
    {
      ...BASE,
      displayName: 'DOM',
      setupFilesAfterEnv: ['<rootDir>/setup.test.ts'],
      testEnvironment: 'jsdom',
      testRegex: '(\\.|/)(test|spec)\\.[jt]sx$'
    }
  ]
};

export default config;
