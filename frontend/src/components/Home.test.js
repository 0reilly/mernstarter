import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import api from '../utils/api';
import { BrowserRouter } from 'react-router-dom';
import * as iframeUtils from '../utils/iframeUtils';

// Mock the api module
jest.mock('../utils/api');

// Mock iframeUtils
jest.mock('../utils/iframeUtils', () => ({
  isInIframe: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('Home component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
    iframeUtils.isInIframe.mockReturnValue(false);
  });

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders welcome message when username is present', async () => {
    // Set up localStorage mock
    localStorage.getItem.mockReturnValue('testuser');

    // Mock successful API responses
    api.get.mockImplementation((url) => {
      if (url === '/api/test') {
        return Promise.resolve({ 
          data: { message: 'Backend connection successful for user testuser!' }
        });
      }
      if (url === '/api/user-logs/testuser') {
        return Promise.resolve({ 
          data: [{
            _id: '1',
            username: 'testuser',
            timestamp: new Date().toISOString(),
            source: 'direct'
          }]
        });
      }
    });

    renderWithRouter(<Home />);

    // Check for initial welcome message
    expect(screen.getByText(/Welcome to the application, testuser!/i)).toBeInTheDocument();

    // Wait for API responses and check their results
    await waitFor(() => {
      expect(screen.getByText(/Backend connection successful for user testuser!/i)).toBeInTheDocument();
    });

    // Verify API calls were made correctly
    expect(api.get).toHaveBeenCalledWith('/api/test', {
      params: {
        userId: 'testuser',
        source: 'direct'
      }
    });
    expect(api.get).toHaveBeenCalledWith('/api/user-logs/testuser');
  });

  it('renders waiting message when no username is present', () => {
    // Set up localStorage mock to return null
    localStorage.getItem.mockReturnValue(null);

    renderWithRouter(<Home />);

    expect(screen.getByText(/Waiting for username from parent application.../i)).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it('displays error message when API call fails', async () => {
    // Set up localStorage mock
    localStorage.getItem.mockReturnValue('testuser');

    // Mock API failure
    api.get.mockRejectedValue({ 
      response: { 
        data: { error: 'Connection failed' }
      }
    });

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to connect to backend: Connection failed/i)).toBeInTheDocument();
    });
  });

  it('shows iframe-specific message when in iframe without username', () => {
    // Set up localStorage mock to return null
    localStorage.getItem.mockReturnValue(null);
    // Mock isInIframe to return true
    iframeUtils.isInIframe.mockReturnValue(true);

    renderWithRouter(<Home />);

    expect(screen.getByText(/Waiting for username from parent application.../i)).toBeInTheDocument();
  });

  it('displays user logs when available', async () => {
    // Set up localStorage mock
    localStorage.getItem.mockReturnValue('testuser');

    const mockLogs = [
      {
        _id: '1',
        username: 'testuser',
        timestamp: '2024-03-14T12:00:00Z',
        source: 'direct'
      },
      {
        _id: '2',
        username: 'testuser',
        timestamp: '2024-03-14T11:00:00Z',
        source: 'iframe'
      }
    ];

    api.get.mockImplementation((url) => {
      if (url === '/api/test') {
        return Promise.resolve({ 
          data: { message: 'Backend connection successful for user testuser!' }
        });
      }
      if (url === '/api/user-logs/testuser') {
        return Promise.resolve({ data: mockLogs });
      }
    });

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Recent Access Logs:/i)).toBeInTheDocument();
      expect(screen.getByText(/Accessed via direct/i)).toBeInTheDocument();
      expect(screen.getByText(/Accessed via iframe/i)).toBeInTheDocument();
    });
  });
});
