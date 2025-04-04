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
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors *; " +
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self' https: http:; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' https: data:;"
  );
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

app.use('/api/', limiter);

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

const connectDB = async () => {
  try {
    // Use mongoose.connect options compatible with MongoDB Memory Server
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB database connection established successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error; // Throw the error so tests can catch it
    }
  }
};

module.exports = { app, connectDB };