import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock the localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui);
};

describe('App Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
  });

  test('renders header with title', () => {
    renderWithRouter(<App />);
    const headerElement = screen.getByText(/Replace this title/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithRouter(<App />);
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const feature1Link = screen.getByRole('link', { name: /feature 1/i });
    const feature2Link = screen.getByRole('link', { name: /feature 2/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(feature1Link).toBeInTheDocument();
    expect(feature2Link).toBeInTheDocument();
  });

  test('renders footer', () => {
    renderWithRouter(<App />);
    const footerElement = screen.getByText(/Replace this footer/i);
    expect(footerElement).toBeInTheDocument();
  });

  test('renders dashboard content when userId is present', () => {
    mockLocalStorage.getItem.mockReturnValue('user123');
    renderWithRouter(<App />);
    const welcomeMessage = screen.getByText(/Welcome, User user123!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('renders default dashboard content when userId is not present', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderWithRouter(<App />);
    const defaultMessage = screen.getByText(/Welcome to the dashboard. Please log in to see personalized content./i);
    expect(defaultMessage).toBeInTheDocument();
  });
});
