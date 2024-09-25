import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Dashboard = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/test?userId=${userId}`);
        setMessage(response.data.message);
      } catch (err) {
        setError('Failed to fetch data from the server');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2" />
            User Information
          </h2>
          <p className="text-lg text-gray-600">userId: {userId}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Backend Connection</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-lg text-gray-600">{message || 'Loading...'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;