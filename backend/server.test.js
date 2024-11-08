const request = require('supertest');
const { app, connectDB } = require('./server');
const mongoose = require('mongoose');
const User = require('./model/User');

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  it('should signup a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not signup with existing username', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'User already exists');
  });

  it('should login an existing user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid Credentials');
  });
});