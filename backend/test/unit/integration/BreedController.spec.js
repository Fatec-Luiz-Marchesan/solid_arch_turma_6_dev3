const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../../src/app');

describe('POST /api/breeds', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('cria breed com campos novos (origin, lifeExpectancy)', async () => {
    const res = await request(app)
      .post('/api/breeds')
      .send({
        name: 'Golden Retriever', species: 'dog',
        origin: 'Escocia', lifeExpectancy: 12,
      });
    expect(res.status).toBe(201);
    expect(res.body.origin).toBe('Escocia');
    expect(res.body.lifeExpectancy).toBe(12);
  });

  it('retorna 400 com array de erros quando payload invalido', async () => {
    const res = await request(app)
      .post('/api/breeds')
      .send({ name: '', species: 'xyz' });
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(2);
  });
});