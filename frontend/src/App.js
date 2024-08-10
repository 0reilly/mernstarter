import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import { Button } from './components/ui/button';
import Dashboard from './components/Dashboard';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">MERN SaaS Boilerplate</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <NavLink to="/" className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
                    }>Dashboard</NavLink>
                  </li>
                </ul>
              </nav>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
        <Route path="/" element={<Dashboard />} />
        </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">&copy; 2024 MERN SaaS Boilerplate (change this based on the prompt). All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;