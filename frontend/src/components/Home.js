import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { isInIframe } from '../utils/iframeUtils';
import Card from './ui/Card';
import { FaUser, FaExclamationCircle, FaCheckCircle, FaClock, FaKeyboard, FaRobot } from 'react-icons/fa';

/**
 * LLM IMPLEMENTATION GUIDE
 * 
 * This is a modular Home component with clearly defined extension points.
 * Structure:
 * 1. Sections are separated into their own components for easier maintenance
 * 2. Each section uses Card components for consistent styling
 * 3. Extension points are clearly marked with comments
 * 4. The component handles loading states and different user scenarios
 */

// Loading section component - shown while waiting for username
const LoadingSection = () => (
  <Card className="mb-4" title="Loading your workspace..." icon={<FaClock className="text-blue-500" />}>
    <div className="p-4 text-center">
      <div className="animate-pulse">
        <div className="text-lg text-gray-600">Setting up your project...</div>
        <div className="mt-2 text-sm text-gray-500">This will only take a moment.</div>
      </div>
    </div>
  </Card>
);

// Welcome section component - main instructions for the user
const WelcomeSection = ({ username, mode, appId }) => (
  <Card 
    className="mb-4" 
    title={`Welcome, ${username}`} 
    icon={<FaUser className="text-green-500" />}
    subtitle={`${mode === 'preview' ? 'Preview' : 'Published'} project${appId ? ` #${appId}` : ''}`}
  >
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
      <p className="mb-3">
        Welcome to your project dashboard. Here you can build your application without writing any code:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Add new features to your application</li>
        <li>Customize your project's appearance</li>
        <li>Set up connections to your data</li>
        <li>Configure your project settings</li>
      </ul>
      <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> Start with one simple feature and gradually build up your project over time.
        </p>
      </div>
    </div>
  </Card>
);

// Status section - shows connection status without technical logs
const StatusSection = ({ status }) => (
  <Card 
    className="mb-4" 
    title="Project Status" 
    icon={status === 'error' ? 
      <FaExclamationCircle className="text-red-500" /> : 
      <FaCheckCircle className="text-green-500" />
    }
    subtitle={status === 'error' ? "We're having trouble connecting" : "Everything is running smoothly"}
  >
    <div className="p-4">
      {/* EXTENSION POINT 2: Add more status indicators or debug info */}
      <p className="text-sm text-gray-600">
        {status === 'connecting' && "Your project is connecting..."}
        {status === 'connected' && "Your project is fully operational and ready to use."}
        {status === 'error' && "There seems to be an issue with your project connection. Please try again later."}
      </p>
      {/* END EXTENSION POINT 2 */}
    </div>
  </Card>
);

/**
 * Main Home component
 */
const Home = () => {
  const { appId } = useParams();
  const location = useLocation();
  
  const [username, setUsername] = useState(null);
  const [backendMessage, setBackendMessage] = useState('');
  const [userLogs, setUserLogs] = useState([]);
  const [error, setError] = useState('');
  const [appStatus, setAppStatus] = useState('connecting');

  const mode = location.pathname.includes('preview') ? 'preview' : 'live';

  // Debug information (can be removed in production)
  console.log({
    appId,
    mode,
    pathname: location.pathname,
    baseURL: api.defaults.baseURL
  });

  // EXAMPLE OF HOW TO COMMUNICATE WITH THE BACKEND
  useEffect(() => {
    // Get username
    if (isInIframe()) {
      const handleStorageChange = () => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      };

      handleStorageChange(); // Check immediately
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    } else {
      // For development/testing outside iframe
      setUsername('Developer');
    }
  }, []);

  // Connect to backend example
  useEffect(() => {
    if (username) {
      const connectToBackend = async () => {
        try {
          setAppStatus('connecting');
          addLog('Attempting to connect to backend...');
          
          const response = await api.get('/test', {
            params: {
              userId: username,
              source: 'iframe'
            }
          });
          setBackendMessage(response.data.message);
          setAppStatus('connected');
          addLog('Backend connection established');
        } catch (err) {
          console.error('Backend connection error:', err);
          setError('Failed to connect to backend');
          setAppStatus('error');
          addLog('Backend connection error: ' + (err.message || 'Unknown error'));
        }
      };

      connectToBackend();
    }
  }, [username]);

  // Helper function to add logs (kept for LLM functionality but not displayed to users)
  const addLog = (message) => {
    setUserLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  // If no username is available yet, show loading state
  if (!username) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSection />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Main content container with all sections */}
      <WelcomeSection username={username} mode={mode} appId={appId} />
      
      <StatusSection status={appStatus} />
      
      {/* EXTENSION POINT 3: Add additional sections here */}
      {/* Additional sections can be added here as needed */}
      {/* END EXTENSION POINT 3 */}
      
      {/* Error display */}
      {error && (
        <Card className="mb-4 bg-red-50" title="Oops! Something went wrong" icon={<FaExclamationCircle className="text-red-500" />}>
          <div className="p-4">
            <p className="text-red-700">We encountered an issue connecting to your project. Please try again later or contact support if the problem persists.</p>
          </div>
        </Card>
      )}
      
      {/* Backend message display (if any) */}
      {backendMessage && (
        <Card className="mb-4" title="Message">
          <div className="p-4">
            <p>{backendMessage}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;