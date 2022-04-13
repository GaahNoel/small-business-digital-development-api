export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc:{
          parser:{
            syntax:'typescript',
            tsx: false,
            decorators: true,
          },
          target: 'es2017',
          keepClassNames: true,
          transform: {
            legacyDecorator:true,
            decoratorMetadata: true,
          },
        },
        module: {
          type: 'es6',
          noInterop: false,
        },
      },
    ],
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.protocols.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/main/**',
    '!**/test/**',
    '!**/protocols/**',
    '!**/domain/**',
  ],
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-node',
  coverageThreshold: {
    "global": {
      "branches": 100,
      "functions": 100,
      "lines": 100,
      "statements": 100
    }
  }
};
