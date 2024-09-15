const request = require('supertest');
const express = require('express');
const app = express();

// Import the routes and middleware
require('dotenv').config();
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  const userId = req.query.userId;
  res.json({ message: `Backend connection successful for user ${userId}!` });
});

describe('Server Endpoints', () => {
  it('should return a successful connection message', async () => {
    const userId = 'testUser123';
    const response = await request(app).get(`/api/test?userId=${userId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(`Backend connection successful for user ${userId}!`);
  });

  it('should use CORS middleware', async () => {
    const response = await request(app).get('/api/test');
    
    expect(response.headers['access-control-allow-origin']).toBe(process.env.FRONTEND_URL || 'http://localhost:3001');
  });
});
