import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Home = () => {
  const { username, isIframe } = useContext(UserContext);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  //ATTENTION:replace this boilerplate code with the users request
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
  }, [username]);

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

  //ATTENTION:replace this boilerplate code with the users request
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome</h2>
        <p className="text-gray-600 mb-4">
          Welcome to the application, {username}! Below are examples of our styled components.
        </p>
      </div>

      {/* Form Elements Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Form Elements</h3>
        
        {/* Text Input */}
        <div className="space-y-4 mb-6">
          <Input
            label="Standard Input"
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* Select Dropdown */}
        <div className="space-y-4 mb-6">
          <Select
            label="Select Menu"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            options={[
              { value: '', label: 'Select an option' },
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
              { value: '3', label: 'Option 3' }
            ]}
          />
        </div>

        {/* Buttons */}
        <div className="space-x-4">
          <button className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
            Primary Button
          </button>
          <button className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
            Secondary Button
          </button>
        </div>
      </div>

      {/* Card Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Card Title 1</h3>
          <p className="text-gray-500">This is an example card with some sample content.</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Card Title 2</h3>
          <p className="text-gray-500">Another example card with different content.</p>
        </div>
      </div>

      {/* Status Section */}
      {/*ATTENTION:replace this boilerplate code with the users request*/}
      {connectionStatus && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Backend Status: {connectionStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;