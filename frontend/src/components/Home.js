import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import Input from './ui/Input';
import api from '../utils/api';

/*
  Replace this boilerplate code with your own implementation.
*/
const Home = () => {
  const { username, isIframe } = useContext(UserContext);
  const [testInput, setTestInput] = useState('');
  const [backendMessage, setBackendMessage] = useState('');
  const [userLogs, setUserLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const testBackendConnection = async () => {
      if (username) {
        try {
          // Test backend connection
          const response = await api.get('/api/test', {
            params: {
              userId: username,
              source: isIframe ? 'iframe' : 'direct'
            }
          });
          setBackendMessage(response.data.message);

          // Fetch user logs
          const logsResponse = await api.get(`/api/user-logs/${username}`);
          setUserLogs(logsResponse.data);
        } catch (err) {
          setError('Failed to connect to backend: ' + (err.response?.data?.error || err.message));
        }
      }
    };

    testBackendConnection();
  }, [username, isIframe]);

  if (!username) {
    return (
      <div className="text-center">
        <p className="text-gray-600">
          {isIframe 
            ? "Waiting for username from parent application..."
            : "Please sign in to access this application."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Welcome to the application, {username}!
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {backendMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4">
            {backendMessage}
          </div>
        )}

        <div className="max-w-md">
          <Input
            label="Test Input"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Access Logs:</h3>
            <div className="bg-gray-50 rounded-md p-4">
              {userLogs.map((log, index) => (
                <div key={log._id || index} className="text-sm text-gray-600 mb-1">
                  Accessed via {log.source} on {new Date(log.timestamp).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;