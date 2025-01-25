import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Footer from './components/Footer';
import Header from './components/Header';

const App = () => {
  return (
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/preview/app/:appId" element={<Home />} />
              <Route path="/live/app/:appId" element={<Home />} />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
};

export default App;