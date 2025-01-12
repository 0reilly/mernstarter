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

  // For production, use the current path to determine the backend URL
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const pathname = window.location.pathname;
  
  // Extract mode (preview/live) and projectId from the path
  const pathParts = pathname.split('/');
  const mode = pathParts.includes('preview') ? 'preview' : 'live';
  const appIndex = pathParts.indexOf('app');
  const projectId = appIndex !== -1 ? pathParts[appIndex + 1] : null;

  // The mode and projectId are already in the URL path, so we don't need to add them again
  if (projectId) {
    return `${protocol}//${window.location.hostname}/${mode}/app/${projectId}`;
  }

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

// Add request interceptor to include token and handle path prefixing
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always prefix with /api unless it's already there
    if (!config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }

    console.log('Making API request to:', `${BASE_URL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;