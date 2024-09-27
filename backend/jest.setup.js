const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongod;

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
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
});

// Global teardown
afterAll(async () => {
  await mongod.stop();
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
