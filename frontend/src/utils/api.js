import axios from 'axios';

const getBackendUrl = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For localhost development
  if (window.location.hostname === 'localhost') {
    const urlParams = new URLSearchParams(window.location.search);
    const backendPort = urlParams.get('backendPort') || '5001';
    return `http://localhost:${backendPort}`;
  }

  // For production, use the same protocol and domain as the frontend
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  return `${protocol}//${window.location.hostname}`;
};

// Export the base URL for other uses (like WebSocket connections)
export const BASE_URL = getBackendUrl();

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;