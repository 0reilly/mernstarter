const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
const BASE_PATH = process.env.BASE_PATH || '';
const PREVIEW_MODE = process.env.PREVIEW_MODE === 'true';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://saas-quick.com';

mongoose.set('strictQuery', false);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://saas-quick.com',
      'https://www.saas-quick.com'
    ];

    // Allow the configured CORS_ORIGIN
    if (!allowedOrigins.includes(CORS_ORIGIN)) {
      allowedOrigins.push(CORS_ORIGIN);
    }

    if (allowedOrigins.includes(origin) || origin.endsWith('saas-quick.com')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Custom middleware to add CSP headers
app.use((req, res, next) => {
  // Get the referrer's origin if available
  const refererOrigin = req.get('Referer') ? new URL(req.get('Referer')).origin : '';
  
  // Build frame-ancestors directive
  const frameAncestors = [
    "'self'",
    CORS_ORIGIN,
    'https://saas-quick.com',
    'https://www.saas-quick.com'
  ];
  if (refererOrigin && !frameAncestors.includes(refererOrigin)) {
    frameAncestors.push(refererOrigin);
  }

  res.setHeader(
    'Content-Security-Policy',
    `frame-ancestors ${frameAncestors.join(' ')}; ` +
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self' https: http:; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' https: data:;"
  );

  // Set additional security headers for iframe support
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  next();
});

app.use(helmet({
  contentSecurityPolicy: false, // Disable helmet's CSP as we're handling it manually
  frameguard: false // Disable X-Frame-Options to let CSP handle it
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Apply rate limiter to API routes
app.use(`${BASE_PATH}/api/`, limiter);

// Mount routes with base path
app.use(BASE_PATH, routes);

// Error handling middleware
app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB database connection established successfully');
    if (PREVIEW_MODE) {
      console.log('Running in preview mode with base path:', BASE_PATH);
      console.log('CORS origin:', CORS_ORIGIN);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { app, connectDB };