import axios from 'axios';

const getBackendPort = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    try {
      const url = new URL(process.env.REACT_APP_API_URL);
      return url.port;
    } catch (e) {
      console.warn('Invalid REACT_APP_API_URL:', e);
    }
  }

  // For localhost development, get port from window location
  if (window.location.hostname === 'localhost') {
    // Extract backend port from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const backendPort = urlParams.get('backendPort');
    if (backendPort) {
      return backendPort;
    }
  }

  return '5001'; // fallback port
};

const API_URL = process.env.REACT_APP_API_URL || 
  `http://${window.location.hostname}:${getBackendPort()}`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;