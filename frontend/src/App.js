import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const App = () => {
  const userId = localStorage.getItem('userId');

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Replace this header title</h1>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard userId={userId} />} />
            <Route path="/feature1" element={
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature 1</h2>
                <p className="text-gray-600">This is a placeholder for Feature 1. Replace this with your actual Feature 1 implementation.</p>
              </div>
            } />
            <Route path="/feature2" element={
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature 2</h2>
                <p className="text-gray-600">This is a placeholder for Feature 2. Replace this with your actual Feature 2 implementation.</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;