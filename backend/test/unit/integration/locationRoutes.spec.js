const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../../src/app');

describe('POST /api/locations', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('cria location com 201', async () => {
    const res = await request(app)
      .post('/api/locations')
      .send({
        name: 'Parque', latitude: -23.5, longitude: -46.6,
        type: 'event', referenceId: '507f1f77bcf86cd799439011',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Parque');
  });

  it('retorna 400 com dados invalidos', async () => {
    const res = await request(app)
      .post('/api/locations')
      .send({ name: '', latitude: 999, longitude: 0, type: 'event', referenceId: '1' });
    expect(res.status).toBe(400);
  });
});