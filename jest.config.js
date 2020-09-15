module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFiles: ["<rootDir>/src/test/setup.ts"],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.(interface|constant|type|model|enum).{ts,js}',
    '!src/**/__tests__/*.data.ts',
    '!**/__mocks__/**',
    '!**/node_modules/**'
  ]
};
