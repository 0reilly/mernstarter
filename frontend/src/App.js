import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';

/**
 * LLM IMPLEMENTATION GUIDE
 * 
 * This is the main App component that serves as the entry point for the application.
 * When implementing features requested by users:
 * 
 * 1. You can add new routes here for additional pages
 * 2. The Home component contains user-facing instructions - you can replace it entirely
 * 3. This application runs in an iframe, so avoid full page navigation where possible
 * 4. All styling is done with Tailwind CSS
 */

/**
 * Determines the environment and appId from the current URL path
 * This helps preserve context when redirecting
 */
const getEnvironmentFromUrl = () => {
  const path = window.location.pathname;
  let environment = 'preview'; // Default to preview
  let appId = 'default';      // Default appId
  
  // Check if we're in a live environment
  if (path.includes('/live/')) {
    environment = 'live';
  }
  
  // Try to extract appId from URL if it exists
  const appIdMatch = path.match(/\/(?:preview|live)\/app\/([^/]+)/);
  if (appIdMatch && appIdMatch[1]) {
    appId = appIdMatch[1];
  }
  
  return { environment, appId };
};

const App = () => {
  const [initialEnv, setInitialEnv] = useState({ environment: 'preview', appId: 'default' });
  
  useEffect(() => {
    // Set environment and appId based on URL on initial load
    setInitialEnv(getEnvironmentFromUrl());
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Main content area - all UI renders here */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to={`/${initialEnv.environment}/app/${initialEnv.appId}`} replace />} />
            <Route path="*" element={<Navigate to={`/${initialEnv.environment}/app/${initialEnv.appId}`} replace />} />
            <Route path="/preview/app/:appId" element={<Home />} />
            <Route path="/live/app/:appId" element={<Home />} />
            {/* Add any new routes here as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;