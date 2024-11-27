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

  return (
    <div className="space-y-8">
      {/* Welcome Section with Connection Status */}
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

      {/* Instructions Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">How to Use This Environment</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">1. Making Changes</h4>
            <p className="text-gray-600">
              Use the chat interface to describe the changes you want to make. Be specific about:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Which component you want to modify</li>
              <li>What functionality you want to add or change</li>
              <li>Any specific styling preferences</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">2. Testing Features</h4>
            <p className="text-gray-600">
              All changes appear immediately in this preview environment. You can:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Test new features in real-time</li>
              <li>Verify styling and responsiveness</li>
              <li>Check component interactions</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">3. Best Practices</h4>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Test one feature at a time</li>
              <li>Verify changes across different screen sizes</li>
              <li>Check for any console errors</li>
              <li>Ensure all interactive elements work as expected</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Example Commands</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-medium text-gray-900">Add a new feature:</p>
            <p className="text-sm text-gray-600">"Add a dark mode toggle to the header component"</p>
          </div>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-medium text-gray-900">Modify styling:</p>
            <p className="text-sm text-gray-600">"Update the button styles to use rounded corners and a gradient background"</p>
          </div>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-medium text-gray-900">Add functionality:</p>
            <p className="text-sm text-gray-600">"Create a modal component for displaying user notifications"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;