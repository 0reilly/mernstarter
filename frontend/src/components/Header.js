import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const { username, clearUser } = useContext(UserContext);

  const handleLogout = () => {
    clearUser();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Replace this header with the name of your application</h1>
          <nav>
            {username && (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Hello, {username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
