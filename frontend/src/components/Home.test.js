import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';

describe('Home Component', () => {
  test('renders welcome section with getting started content', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to Your Project')).toBeInTheDocument();
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Start with one simple feature/i)).toBeInTheDocument();
  });

  test('renders with route parameters', () => {
    render(
      <MemoryRouter initialEntries={['/preview/app/123']}>
        <Routes>
          <Route path="/:mode/app/:appId" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );


});
