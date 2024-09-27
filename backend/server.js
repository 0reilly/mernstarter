const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Test endpoint. Replace with your own endpoints.
app.get('/api/test', (req, res) => {
  const userId = req.query.userId;
  res.json({ message: `Backend connection successful for user ${userId}!` });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;