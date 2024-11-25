import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './tailwind.output.css';

// Add event listener for username messages from parent application
window.addEventListener('message', (event) => {
  if (event.data.type === 'SET_USERNAME') {
    localStorage.setItem('username', event.data.username);
  }
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);