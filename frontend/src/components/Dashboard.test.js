import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react';
import Dashboard from './Dashboard';

test('renders dashboard with user information', async () => {
  const userId = 'testUser123';
  await act(async () => {
    render(<Dashboard userId={userId} />);
  });

  const dashboardTitle = screen.getByText(/Dashboard/i);
  expect(dashboardTitle).toBeInTheDocument();

  const userIdElement = screen.getByText(`userId: ${userId}`);
  expect(userIdElement).toBeInTheDocument();

  const statusElement = screen.getByText(/Status: Active/i);
  expect(statusElement).toBeInTheDocument();
});
