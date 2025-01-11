import axios from 'axios';

const getBackendUrl = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // For localhost development
  if (window.location.hostname === 'localhost') {
    const urlParams = new URLSearchParams(window.location.search);
    const backendPort = urlParams.get('backendPort') || '5001';
    const url = `http://localhost:${backendPort}`;
    console.log('Using localhost URL:', url);
    return url;
  }

  // For production, use the same protocol and domain as the frontend
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const url = `${protocol}//${window.location.hostname}`;
  console.log('Using production URL:', url);
  return url;
};

// Export the base URL for other uses
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
    // Log request details (excluding sensitive data)
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;