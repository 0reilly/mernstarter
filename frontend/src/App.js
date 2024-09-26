import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

//simulated user ID
const userId = localStorage.getItem('userId');

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Replace this title</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <NavLink to="/" className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
                    }>Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink to="/feature1" className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
                    }>Feature 1</NavLink>
                  </li>
                  <li>
                    <NavLink to="/feature2" className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
                    }>Feature 2</NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
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
          } />
          <Route path="/feature1" element={
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature 1 Placeholder</h2>
              <p className="text-gray-600">Replace this with your Feature 1 component.</p>
            </div>
          } />
          <Route path="/feature2" element={
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature 2 Placeholder</h2>
              <p className="text-gray-600">Replace this with your Feature 2 component.</p>
            </div>
          } />
        </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">&copy; 2024 Replace this footer. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;