import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';

const Home = () => {
  const { username, isIframe } = useContext(UserContext);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      if (username) {
        try {
          const response = await api.get(`/api/test?userId=${username}`);
          setConnectionStatus(response.data.message);
        } catch (error) {
          setConnectionStatus(`Error connecting to backend: ${error.message}`);
        }
      }
    };

    testBackendConnection();
  }, [username]);

  if (!username) {
    return (
      <div className="text-center">
        <p>
          {isIframe 
            ? "Waiting for username from parent application..."
            : "Please sign in to access this application."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome</h2>
      <p className="text-gray-600 mb-4">
        Welcome to the application, {username}! You have full access to all features.
      </p>
      {connectionStatus && (
        <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded">
          Backend Status: {connectionStatus}
        </p>
      )}
    </div>
  );
};

export default Home;