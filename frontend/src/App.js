import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

/**
 * LLM IMPLEMENTATION GUIDE
 * 
 * This is the main App component that serves as the entry point for the application.
 * When implementing features requested by users:
 * 
 * 1. You can add new routes here for additional pages
 * 2. The Home component contains user-facing instructions
 * 3. This application runs in an iframe, so avoid full page navigation where possible
 * 4. All styling is done with Tailwind CSS
 */

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Main content area - all UI renders here */}
        <main className="flex-grow">
          <Routes>
            {/* Support both preview and live modes with the same component */}
            <Route path="/:mode/app/:appId" element={<Home />} />
            {/* Default route redirects handled by parent platform */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;