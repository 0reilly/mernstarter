import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

describe('Home component', () => {
  it('renders the home component', () => {
    render(<Home userId="testUser" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Replace this with your actual Home component content.')).toBeInTheDocument();
  });
});
