import React, { useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Input from './ui/Input';
import api from '../utils/api';
import { FaUser, FaExclamationCircle, FaCheckCircle, FaClock, FaKeyboard, FaRobot } from 'react-icons/fa';

const Home = () => {
  const { username, isIframe } = useContext(UserContext);
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
    isIframe,
    appId,
    mode,
    pathname: location.pathname,
    baseURL: api.defaults.baseURL
  });

  useEffect(() => {
    const testBackendConnection = async () => {
      if (username) {
        setError('');
        try {
          console.log('Testing backend connection for user:', username);
          console.log('API base URL:', api.defaults.baseURL);
          console.log('Is in iframe:', isIframe);
          console.log('App ID:', appId);
          console.log('Mode:', mode);
          console.log('Current path:', location.pathname);
          
          // Test backend connection
          const response = await api.get('/test', {
            params: {
              userId: username,
              source: isIframe ? 'iframe' : 'direct'
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
  }, [username, isIframe, appId, mode, location.pathname]);

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
          {isIframe 
            ? "Waiting for username from parent application..."
            : "Please sign in to access this application."}
        </p>
      </div>
    );
  }

  /*
    NOTE TO LLM for code generation:
    The content of this file is a placeholder for the actual content of the application. Please replace the placeholder content with the actual content of the application.
    DON'T FORGET!
  */
  console.log('Rendering main content');
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-blue-500" />
          Welcome to the application, {username}!
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4 flex items-center gap-2">
            <FaExclamationCircle className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {backendMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            <span>{backendMessage}</span>
          </div>
        )}

        <div className="max-w-md">
          <Input
            label={
              <span className="flex items-center gap-2">
                <FaKeyboard className="text-gray-400" />
                Test Input
              </span>
            }
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type something to test the styling..."
          />
          {testInput && (
            <p className="mt-2 text-sm text-gray-600">
              You typed: {testInput}
            </p>
          )}
        </div>

        {userLogs.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Recent Access Logs:
            </h3>
            <div className="bg-gray-50 rounded-md p-4">
              {userLogs.map((log, index) => (
                <div key={log._id || index} className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <FaUser className="text-gray-400 flex-shrink-0" />
                  Accessed via {log.source} on {new Date(log.timestamp).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FaRobot className="text-blue-500" />
            Test OpenAI Integration
          </h3>
          <div className="max-w-md space-y-4">
            <Input
              label={
                <span className="flex items-center gap-2">
                  <FaKeyboard className="text-gray-400" />
                  Enter your prompt
                </span>
              }
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Type your prompt for OpenAI..."
            />
            <button
              onClick={handleAiTest}
              disabled={isLoading || !aiPrompt}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaRobot />
              {isLoading ? 'Processing...' : 'Send to AI'}
            </button>
            {aiResponse && (
              <div className="bg-gray-50 rounded-md p-4 mt-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;