import React from 'react';

const Header = () => {
  const username = localStorage.getItem('username');

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Replace this text with the name of your application</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
