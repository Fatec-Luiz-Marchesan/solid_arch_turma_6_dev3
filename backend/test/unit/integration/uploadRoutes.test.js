const request = require('supertest');
const app = require('../../../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/uploads', () => {
  it('deve fazer upload com sucesso', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .field('ownerId', '507f1f77bcf86cd799439011')
      .field('purpose', 'pet-photo')
      .attach('file', Buffer.from('conteudo fake'), 'foto.jpg');
    expect(res.status).toBe(201);
  });

  it('deve rejeitar sem arquivo', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .field('ownerId', '507f1f77bcf86cd799439011')
      .field('purpose', 'pet-photo');
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});