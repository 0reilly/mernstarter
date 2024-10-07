import React from 'react';

const Dashboard = ({ userId }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
      {userId ? (
        <div className="mb-4">
          <p className="text-lg text-gray-700">Welcome, User {userId}!</p>
          <p className="text-gray-600">We're glad to see you back.</p>
        </div>
      ) : (
        <p className="text-gray-600">Welcome to the dashboard. Please log in to see personalized content.</p>
      )}
      <p className="text-gray-600">Replace this with your actual Dashboard component content.</p>
    </div>
  );
};

export default Dashboard;