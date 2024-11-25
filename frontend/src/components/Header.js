import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const { username } = useContext(UserContext);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Application</h1>
          <nav>
            {username && (
              <div className="flex items-center">
                <span className="text-gray-700">Hello, {username}</span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
