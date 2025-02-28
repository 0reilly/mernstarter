import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Home component since we're only testing App's structure
jest.mock('./components/Home', () => {
  return function MockHome() {
    return <div data-testid="mock-home">Mock Home Component</div>;
  };
});

describe('App Component', () => {
  test('renders header, main content area, and footer', () => {
    render(<App />);
    
    // Check for header
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.textContent).toContain('Replace this text with the name of your application');
    
    // Check for main content area
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    // Check for footer
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.textContent).toContain('Replace this footer');
  });

  test('renders routes within the main content area', () => {
    render(<App />);
    
    // Check that the Home component is rendered (we're using the mock)
    const homeComponent = screen.getByTestId('mock-home');
    expect(homeComponent).toBeInTheDocument();
  });
}); 