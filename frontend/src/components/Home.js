import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { username, isSubscribed } = useContext(UserContext);

  if (!username) {
    return (
      <div className="text-center">
        <p>Please sign in to access this application.</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="text-center">
        <p>Please subscribe to access this application.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome</h2>
      <p className="text-gray-600">
        Welcome to the application, {username}! You have full access to all features.
      </p>
    </div>
  );
};

export default Home;