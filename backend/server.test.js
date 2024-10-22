const request = require('supertest');
const { app } = require('./server');

describe('Server', () => {
  it('should respond with a message for a valid userId', async () => {
    const response = await request(app).get('/api/test?userId=testUser');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Backend connection successful for user testUser!');
  });

  it('should respond with an error for missing userId', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('userId is required');
  });
});

