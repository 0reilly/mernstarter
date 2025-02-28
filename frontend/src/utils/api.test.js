import axios from 'axios';

// Mock axios
jest.mock('axios', () => {
  const mockInterceptors = {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  };
  
  const mockAxios = {
    create: jest.fn(() => ({
      interceptors: mockInterceptors,
      defaults: {
        baseURL: '',
        headers: { common: {} }
      }
    })),
    interceptors: mockInterceptors
  };
  
  return mockAxios;
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Utility', () => {
  let originalWindowLocation;
  
  beforeEach(() => {
    // Save original window.location
    originalWindowLocation = window.location;
    
    // Mock window.location
    delete window.location;
    window.location = {
      protocol: 'http:',
      hostname: 'localhost',
      pathname: '/',
      search: '',
      href: 'http://localhost/'
    };
    
    // Clear localStorage mock
    localStorageMock.clear();
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore window.location
    window.location = originalWindowLocation;
  });
  
  test('creates axios instance with correct configuration', () => {
    // Import the module to trigger the code
    jest.isolateModules(() => {
      require('./api');
    });
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
  
  test('registers request interceptor', () => {
    // Import the module to trigger the code
    jest.isolateModules(() => {
      require('./api');
    });
    
    expect(axios.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });
  
  test('uses correct backend URL for localhost', () => {
    // Set window.location to localhost
    window.location = {
      ...window.location,
      hostname: 'localhost',
      search: '?backendPort=5002'
    };
    
    // Re-import to trigger URL calculation
    jest.resetModules();
    const { BASE_URL } = require('./api');
    
    // Check that the correct URL was used
    expect(BASE_URL).toBe('http://localhost:5002');
  });
  
  test('uses correct backend URL for production with app path', () => {
    // Set window.location to a production-like URL
    window.location = {
      ...window.location,
      protocol: 'https:',
      hostname: 'example.com',
      pathname: '/preview/app/123'
    };
    
    // Re-import to trigger URL calculation
    jest.resetModules();
    const { BASE_URL } = require('./api');
    
    // Check that the correct URL was used
    expect(BASE_URL).toBe('https://example.com/preview/app/123');
  });
}); 