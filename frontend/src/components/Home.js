import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import Input from './ui/Input';

const Home = () => {
  const { username, isIframe } = useContext(UserContext);
  const [testInput, setTestInput] = useState('');

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
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Welcome to the application, {username}!
        </h2>
        <div className="max-w-md">
          <Input
            label="Test Input"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type something to test the styling..."
          />
          {testInput && (
            <p className="mt-2 text-sm text-gray-600">
              You typed: {testInput}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;