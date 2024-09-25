import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Home } from 'lucide-react';

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
                      `px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
                    }>
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard userId={userId} />} />
            </Routes>
          </div>
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