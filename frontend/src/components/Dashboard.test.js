import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  it('renders the dashboard title', () => {
    render(<Dashboard userId="testUser123" />);
    const titleElement = screen.getByText(/Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('displays the user ID', () => {
    const testUserId = 'testUser123';
    render(<Dashboard userId={testUserId} />);
    const userIdElement = screen.getByText(`userId: ${testUserId}`);
    expect(userIdElement).toBeInTheDocument();
  });

  it('shows the application status', () => {
    render(<Dashboard userId="testUser123" />);
    const statusElement = screen.getByText(/Status: Active/i);
    expect(statusElement).toBeInTheDocument();
  });
});
