import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';

const Home = () => {
  const { username, isIframe } = useContext(UserContext);
  const [connectionStatus, setConnectionStatus] = useState(null);

  //REMOVE THIS BOILERPLATE CODE
  useEffect(() => {
    const testBackendConnection = async () => {
      if (username) {
        try {
          const response = await api.get(`/api/test?userId=${username}&source=${isIframe ? 'iframe' : 'direct'}`);
          setConnectionStatus(response.data.message);
        } catch (error) {
          setConnectionStatus(`Error connecting to backend: ${error.message}`);
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


  //REMOVE THIS BOILERPLATE CODE
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to the Development Environment</h2>
        <p className="text-gray-600 mb-4">
          Hello {username}! This is your interactive development environment. Use the chat interface to modify and test features before deployment.
        </p>
        {connectionStatus && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{connectionStatus}</p>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default Home;