import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Home component since we're only testing App's structure
jest.mock('./components/Home', () => {
  return function MockHome() {
    return <div data-testid="mock-home">Mock Home Component</div>;
  };
});

// Mock the router components to avoid rendering actual routes
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div data-testid="routes">{children}</div>,
    Route: () => null
  };
});

describe('App Component', () => {
  test('renders main structure correctly', () => {
    render(<App />);
    
    // Check for main content area
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    // Check that routes container is rendered
    const routesElement = screen.getByTestId('routes');
    expect(routesElement).toBeInTheDocument();
    
    // Verify the app has the expected structure and styling
    const rootElement = mainElement.parentElement;
    expect(rootElement).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-gray-50');
  });
}); 