import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import URLHandler from './components/URLHandler';
import './index.css';
import './tailwind.output.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <URLHandler />
    <App />
  </React.StrictMode>
);