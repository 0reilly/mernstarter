import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import api from '../utils/api';

// Mock the api.post method
jest.mock('../utils/api');

describe('Login component', () => {
  it('renders the login form', () => {
    render(
      <AuthContext.Provider value={{ login: jest.fn() }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

    // Use getByRole to specifically target the heading
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('submits the form and calls login on successful login', async () => {
    const mockLogin = jest.fn();
    api.post.mockResolvedValue({ data: { token: 'mocked_jwt_token' } });

    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for async actions to complete
    expect(await screen.findByRole('button', { name: /login/i })).toBeEnabled();

    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'testuser',
      password: 'password123',
    });
    expect(mockLogin).toHaveBeenCalledWith('mocked_jwt_token');
  });
});
