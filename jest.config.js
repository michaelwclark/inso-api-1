module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '^test/(.*)': '<rootDir>/test/$1',
  },
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,
};
