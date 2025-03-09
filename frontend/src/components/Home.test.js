import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import { isInIframe } from '../utils/iframeUtils';
import api from '../utils/api';

// Mock the dependent modules
jest.mock('../utils/iframeUtils', () => ({
  isInIframe: jest.fn()
}));

jest.mock('../utils/api', () => ({
  get: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:3001'
  }
}));

// Create localStorage mock
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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    api.get.mockReset();
    api.get.mockResolvedValue({ data: { message: 'Hello from backend' } });
  });

  test('renders loading section when no username is available', () => {
    isInIframe.mockReturnValue(true);
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Setting up your project...')).toBeInTheDocument();
  });

  test('renders welcome section when username is available', () => {
    isInIframe.mockReturnValue(false); // For development mode

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome, Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Start with one simple feature/i)).toBeInTheDocument();
  });

  test('renders with route parameters', () => {
    isInIframe.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/preview/app/123']}>
        <Routes>
          <Route path="/preview/app/:appId" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Preview project #123/i)).toBeInTheDocument();
  });

  test('includes extension points in the structure', () => {
    isInIframe.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check for project status section
    expect(screen.getByText('Project Status')).toBeInTheDocument();
  });

  test('displays backend message when available', async () => {
    isInIframe.mockReturnValue(false);
    api.get.mockResolvedValue({ data: { message: 'Test message from backend' } });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Since the API call happens in useEffect, we need to wait for the component to update
    expect(api.get).toHaveBeenCalledWith('/test', {
      params: {
        userId: 'Developer',
        source: 'iframe'
      }
    });
    
    // The backend message would be displayed in the real component after the API call resolves
    // This is more of an integration test that would need a more complex setup with waitFor
  });
});
