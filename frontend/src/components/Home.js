import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Input from './ui/Input';
import api from '../utils/api';
import { FaUser, FaExclamationCircle, FaCheckCircle, FaClock, FaKeyboard, FaRobot } from 'react-icons/fa';
import { isInIframe } from '../utils/iframeUtils';

const Home = () => {
  const username = localStorage.getItem('username') || '';
  const { appId } = useParams();
  const location = useLocation();
  const [testInput, setTestInput] = useState('');
  const [backendMessage, setBackendMessage] = useState('');
  const [userLogs, setUserLogs] = useState([]);
  const [error, setError] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mode = location.pathname.includes('preview') ? 'preview' : 'live';

  console.log('Home component rendered:', { 
    username, 
    appId,
    mode,
    pathname: location.pathname,
    baseURL: api.defaults.baseURL
  });

  // EXAMPLE OF HOW TO COMMUNICATE WITH THE BACKEND
  useEffect(() => {
    const testBackendConnection = async () => {
      if (username) {
        setError('');
        try {
          console.log('Testing backend connection for user:', username);
          console.log('API base URL:', api.defaults.baseURL);
          console.log('App ID:', appId);
          console.log('Mode:', mode);
          console.log('Current path:', location.pathname);
          
          // Test backend connection
          const response = await api.get('/test', {
            params: {
              userId: username,
              source: 'iframe'
            }
          });
          console.log('Backend response:', response.data);
          setBackendMessage(response.data.message);

          // Fetch user logs
          const logsResponse = await api.get(`/user-logs/${username}`);
          console.log('User logs response:', logsResponse.data);
          setUserLogs(logsResponse.data);
        } catch (err) {
          console.error('Backend connection error:', err);
          console.error('Error details:', {
            message: err.message,
            response: err.response,
            status: err.response?.status,
            data: err.response?.data
          });
          setError('Failed to connect to backend: ' + (err.response?.data?.error || err.message));
        }
      } else {
        console.log('No username available yet');
      }
    };

    console.log('Running testBackendConnection effect');
    testBackendConnection();
  }, [username, appId, mode, location.pathname]);

  // EXAMPLE OF HOW TO USE THE AI ENDPOINT
  const handleAiTest = async () => {
    if (!aiPrompt) return;
    
    setIsLoading(true);
    setError('');
    setAiResponse('');
    
    try {
      const response = await api.post('/ai/test', { 
        prompt: aiPrompt,
        userId: username
      });
      setAiResponse(response.data.response);
    } catch (err) {
      setError('Failed to get AI response: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (!username) {
    console.log('Rendering waiting state');
    return (
      <div className="text-center">
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <FaUser className="text-gray-400" />
          Waiting for username from parent application...
        </p>
      </div>
    );
  }

  /*
    The content of this file is a placeholder for the actual content of the application. Please replace the placeholder content with the actual content of the application.
    DON'T FORGET!
    All components on this page should be replaced with the actual content of the application.
  */
  return (
    <>
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-blue-500" />
          Welcome to the application, {username}!
        </h2>
      </div>
    </div>
    </>
    
  );
};

export default Home;