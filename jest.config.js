const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec.jest).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.test.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: 'coverage/bdd-testing-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: '<rootDir>/tsconfig.jest.spec.json',
      stringifyContentPathRegex: '\\.html$',
    },
  },
};
