// jest.config.cjs (note .cjs extension)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testTimeout: 15000
};