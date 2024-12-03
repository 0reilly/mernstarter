import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';

// Mock the api module
jest.mock('../utils/api');

describe('Home component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders welcome message when username is present', async () => {
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

    render(
      <UserContext.Provider value={{ username: 'testuser', isIframe: false }}>
        <Home />
      </UserContext.Provider>
    );

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
    render(
      <UserContext.Provider value={{ username: null, isIframe: false }}>
        <Home />
      </UserContext.Provider>
    );

    expect(screen.getByText(/Please sign in to access this application./i)).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it('displays error message when API call fails', async () => {
    // Mock API failure
    api.get.mockRejectedValue({ 
      response: { 
        data: { error: 'Connection failed' }
      }
    });

    render(
      <UserContext.Provider value={{ username: 'testuser', isIframe: false }}>
        <Home />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to connect to backend: Connection failed/i)).toBeInTheDocument();
    });
  });

  it('shows iframe-specific message when in iframe without username', () => {
    render(
      <UserContext.Provider value={{ username: null, isIframe: true }}>
        <Home />
      </UserContext.Provider>
    );

    expect(screen.getByText(/Waiting for username from parent application.../i)).toBeInTheDocument();
  });

  it('displays user logs when available', async () => {
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

    render(
      <UserContext.Provider value={{ username: 'testuser', isIframe: false }}>
        <Home />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Recent Access Logs:/i)).toBeInTheDocument();
      expect(screen.getByText(/Accessed via direct/i)).toBeInTheDocument();
      expect(screen.getByText(/Accessed via iframe/i)).toBeInTheDocument();
    });
  });
});
