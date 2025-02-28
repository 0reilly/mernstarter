import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

const App = () => {
  return (
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-gray-900">Replace this text with the name of your application</h1>
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/preview/app/:appId" element={<Home />} />
              <Route path="/live/app/:appId" element={<Home />} />
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