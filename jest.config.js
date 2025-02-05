module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    }
  };