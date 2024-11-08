import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const res = await api.post('/api/auth/login', { username, password });
      login(res.data.token);
      navigate('/'); // Redirect to Home page after successful login
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors
        setErrors(err.response.data.errors.map(error => error.msg));
      } else if (err.response?.data?.error) {
        // Handle other errors (e.g., invalid credentials)
        setErrors([err.response.data.error]);
      } else {
        setErrors(['An unexpected error occurred during login.']);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>
      {errors.length > 0 && (
        <div className="mb-4">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
