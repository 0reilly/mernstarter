import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Footer from './components/Footer';
import Header from './components/Header';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const App = () => {
  const userId = localStorage.getItem('userId');

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
         <Home userId={userId} />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;