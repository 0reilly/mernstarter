import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Dashboard = () => {
  const [backendStatus, setBackendStatus] = useState('');

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/test`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBackendStatus(response.data.message);
      } catch (error) {
        setBackendStatus('Failed to connect to backend');
        console.error('Backend connection error:', error);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to MERN Stack Boilerplate</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Backend Connection Status</h2>
          <p className={`text-lg ${backendStatus.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
            {backendStatus || 'Checking connection...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;