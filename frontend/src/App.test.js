import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react';
import App from './App';

test('renders main app components', async () => {
  await act(async () => {
    render(<App />);
  });
  const headerElement = screen.getByText(/Replace this title/i);
  expect(headerElement).toBeInTheDocument();

  const footerElement = screen.getByText(/Replace this footer/i);
  expect(footerElement).toBeInTheDocument();
});
