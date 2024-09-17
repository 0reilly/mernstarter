import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './tailwind.output.css';

// Set a simulated userId in localStorage
const simulatedUserId = 'user123'; // Replace with your desired user ID
localStorage.setItem('userId', simulatedUserId);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);