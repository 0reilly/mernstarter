const request = require('supertest');
const mongoose = require('mongoose');
const { app, connectDB } = require('../server');

describe('Server', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/test', () => {
    it('should return a success message', async () => {
      const res = await request(app).get('/api/test?userId=testUser');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Backend connection successful for user testUser!');
    });

    it('should handle missing userId', async () => {
      const res = await request(app).get('/api/test');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('userId is required');
    });
  });

  // Add more test suites for other server-related functionality
});
