const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  it('GET /api/test should return a success message', async () => {
    const res = await request(app).get('/api/test?userId=testUser');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Backend connection successful for user testUser!');
  });

  // Add more tests for other endpoints as they are implemented
});
