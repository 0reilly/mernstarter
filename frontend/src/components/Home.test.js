import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import api from '../utils/api';

// Mock the API module
jest.mock('../utils/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:5001/api'
  }
}));

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

describe('Home Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Setup default API responses
    api.get.mockImplementation((url, config) => {
      if (url === '/test') {
        return Promise.resolve({
          data: { message: 'Backend connection successful for user testuser!' }
        });
      } else if (url.includes('/user-logs')) {
        return Promise.resolve({
          data: [{ username: 'testuser', timestamp: new Date().toISOString(), source: 'test' }]
        });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    api.post.mockImplementation((url, data) => {
      if (url === '/ai/test') {
        return Promise.resolve({
          data: { response: 'AI test response' }
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders waiting message when no username is available', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/waiting for username/i)).toBeInTheDocument();
  });

  test('renders welcome message when username is available', async () => {
    // Set username in localStorage
    localStorageMock.getItem.mockReturnValue('testuser');
    
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    // Check for welcome message
    await waitFor(() => {
      expect(screen.getByText(/welcome to the application, testuser/i)).toBeInTheDocument();
    });
    
    // Verify API calls
    expect(api.get).toHaveBeenCalledWith('/test', expect.any(Object));
    expect(api.get).toHaveBeenCalledWith('/user-logs/testuser');
  });

  test('handles API error gracefully', async () => {
    // Set username in localStorage
    localStorageMock.getItem.mockReturnValue('testuser');
    
    // Mock API error
    api.get.mockRejectedValueOnce({
      message: 'Network Error',
      response: { data: { error: 'Backend unavailable' }, status: 500 }
    });
    
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    // The error message is set in state but might not be rendered in the DOM
    // Instead, we can verify that the API call was made and rejected
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/test', expect.any(Object));
    });
    
    // We can also check that the second API call wasn't made due to the error
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  test('renders with route parameters', async () => {
    // Set username in localStorage
    localStorageMock.getItem.mockReturnValue('testuser');
    
    render(
      <MemoryRouter initialEntries={['/preview/app/123']}>
        <Routes>
          <Route path="/preview/app/:appId" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Check for welcome message
    await waitFor(() => {
      expect(screen.getByText(/welcome to the application, testuser/i)).toBeInTheDocument();
    });
    
    // Verify API calls with correct parameters
    expect(api.get).toHaveBeenCalledWith('/test', expect.objectContaining({
      params: expect.objectContaining({
        userId: 'testuser',
        source: 'iframe'
      })
    }));
  });
});
