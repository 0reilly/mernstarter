const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const UserLog = require('./models/UserLog');

const app = express();
const port = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost') {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    } catch (error) {
      callback(new Error('Invalid origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);

app.get('/api/user-logs/:username', async (req, res) => {
  try {
    const logs = await UserLog.find({ 
      username: req.params.username 
    })
    .sort({ timestamp: -1 })
    .limit(10);
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB database connection established successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { app, connectDB };