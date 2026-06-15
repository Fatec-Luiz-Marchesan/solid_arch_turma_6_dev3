const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('POST /api/uploads', () => {
  it('deve fazer upload com sucesso', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .field('ownerId', '507f1f77bcf86cd799439011')
      .field('purpose', 'pet-photo')
      .attach('file', Buffer.from('conteudo fake'), 'foto.jpg');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('url', '/uploads/...');
  });

  it('deve rejeitar arquivo muito grande', async () => {
  });
});