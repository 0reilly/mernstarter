import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';

/*
  Replace this boilerplate code with your own implementation.
*/
const Home = () => {
  const { username, isIframe } = useContext(UserContext);
  const [connectionStatus, setConnectionStatus] = useState(null);

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

  //REPLACE THIS BOILERPLATE CODE
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome, {username}!</h2>
        {/* Connection Status REPLACE THIS BOILERPLATE CODE */}
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