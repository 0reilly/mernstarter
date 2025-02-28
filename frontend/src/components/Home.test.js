import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';
import * as iframeUtils from '../utils/iframeUtils';

// Mock iframeUtils
jest.mock('../utils/iframeUtils', () => ({
  isInIframe: jest.fn()
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

describe('Home component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    window.localStorage.clear.mockClear();
    window.localStorage.getItem.mockClear();
    window.localStorage.setItem.mockClear();
    iframeUtils.isInIframe.mockReturnValue(false);
  });

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders welcome message when username is present', () => {
    // Set up localStorage mock
    window.localStorage.getItem.mockReturnValue('testuser');

    renderWithRouter(<Home />);

    // Check for welcome message
    expect(screen.getByText(/Welcome to the application, testuser!/i)).toBeInTheDocument();
    
    // Check for user icon
    expect(screen.getByText(/Welcome to the application, testuser!/i).querySelector('svg')).toBeInTheDocument();
  });

  it('renders waiting message when no username is present', () => {
    // Set up localStorage mock to return null
    window.localStorage.getItem.mockReturnValue(null);

    renderWithRouter(<Home />);

    // Check for waiting message
    expect(screen.getByText(/Waiting for username from parent application.../i)).toBeInTheDocument();
    
    // Check for user icon in waiting state
    expect(screen.getByText(/Waiting for username from parent application.../i).querySelector('svg')).toBeInTheDocument();
  });
});
