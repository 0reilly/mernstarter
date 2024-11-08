import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Home component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    useNavigate.mockClear();
  });

  it('renders the home component with authenticated user', () => {
    const mockNavigate = jest.fn();

    // Set up the mock for useNavigate
    useNavigate.mockReturnValue(mockNavigate);

    const authContextValue = {
      token: 'mocked_jwt_token',
      user: 'testUser',
      login: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <Home />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to the protected Home component. Only authenticated users can see this.')
    ).toBeInTheDocument();
  });

  it('redirects to login if no token is present', () => {
    const mockNavigate = jest.fn();

    // Set up the mock for useNavigate
    useNavigate.mockReturnValue(mockNavigate);

    const authContextValue = {
      token: null,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <Home />
        </Router>
      </AuthContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
