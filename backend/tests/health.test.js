process.env.NODE_ENV = 'test';
jest.mock('../config/database', () => () => {}); // no-op database connect
const request = require('supertest');
const app = require('../server');

describe('Health endpoint', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
