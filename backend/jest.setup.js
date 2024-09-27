const mongoose = require('mongoose');

// Mock the mongoose connection
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn(),
  },
}));

// Set up global test environment
process.env.NODE_ENV = 'test';

// Mock console methods
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Global setup
beforeAll(() => {
  // This runs once before all tests
});

// Global teardown
afterAll(() => {
  // This runs once after all tests
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
