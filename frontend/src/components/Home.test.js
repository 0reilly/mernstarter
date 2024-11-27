import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { UserContext } from '../context/UserContext';

describe('Home component', () => {
  it('renders welcome message when username is present', () => {
    render(
      <UserContext.Provider value={{ username: 'testuser', isIframe: false }}>
        <Home />
      </UserContext.Provider>
    );

    expect(screen.getByText(/Welcome to the application, testuser!/i)).toBeInTheDocument();
  });

  it('renders waiting message when no username is present', () => {
    render(
      <UserContext.Provider value={{ username: null, isIframe: false }}>
        <Home />
      </UserContext.Provider>
    );

    expect(screen.getByText(/Please sign in to access this application./i)).toBeInTheDocument();
  });
});
