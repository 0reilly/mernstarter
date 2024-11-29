import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';

/*
  Replace this boilerplate code with your own implementation.
*/
const Home = () => {
  const { username, isIframe } = useContext(UserContext);

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
        <h2 className="text-2xl font-semibold text-gray-900">Welcome, {username}!</h2>
      </div>
    </div>
  );
};

export default Home;