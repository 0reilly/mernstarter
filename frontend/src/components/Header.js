import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { username, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Application</h1>
          <nav>
            {username ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {username}</span>
                <button
                  onClick={logout}
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-500 hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-green-500 hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
