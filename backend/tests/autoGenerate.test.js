process.env.NODE_ENV = 'test';
// Mock database connection as no-op
jest.mock('../config/database', () => () => {});

// Simple in-memory mocks for Mongoose models used by auto-generate endpoint
const mockSpecIds = ['b1','b2','b3'];

jest.mock('../models/BuildingSpec', () => ({
  find: jest.fn(() => ({
    lean: () => Promise.resolve(mockSpecIds.map(id => ({ _id: id })))
  }))
}));

// Mock ReconstructionSnapshot constructor & prototype
jest.mock('../models/ReconstructionSnapshot', () => {
  return function FakeSnapshot(data) {
    Object.assign(this, data);
    this._id = 'auto123';
    this.save = jest.fn().mockResolvedValue(this);
  };
});

const request = require('supertest');
const app = require('../server');

describe('Auto-generate snapshot endpoint', () => {
  it('creates snapshot with filtered specs', async () => {
    const res = await request(app).post('/api/reconstructions/auto-generate?year=1905&style=Beaux-Arts');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'auto123');
    expect(res.body).toHaveProperty('count', mockSpecIds.length);
  });

  it('validates missing year param', async () => {
    const res = await request(app).post('/api/reconstructions/auto-generate');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/year parameter required/i);
  });
});
