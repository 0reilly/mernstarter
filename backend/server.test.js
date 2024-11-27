const request = require('supertest');
const { app, connectDB } = require('./server');
const mongoose = require('mongoose');
const UserLog = require('./model/UserLog');

beforeAll(async () => {
  await connectDB();
  await UserLog.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Endpoints', () => {
  it('should validate username presence', async () => {
    const res = await request(app)
      .get('/api/test')
      .send();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'userId is required');
  });

  it('should log user access and return success', async () => {
    const res = await request(app)
      .get('/api/test')
      .query({ userId: 'testuser', source: 'iframe' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Backend connection successful for user testuser!');
    
    // Verify log was created
    const logs = await UserLog.find({ username: 'testuser' });
    expect(logs).toHaveLength(1);
    expect(logs[0].source).toBe('iframe');
  });

  it('should retrieve user logs', async () => {
    const res = await request(app)
      .get('/api/user-logs/testuser');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe('testuser');
  });
});