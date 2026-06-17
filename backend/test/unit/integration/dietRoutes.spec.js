const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require('../../../src/app');

describe("Diet API — Testes de Integracao", () => {
  let mongoServer;
  const petId = new mongoose.Types.ObjectId().toString();
  const vetId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) await collections[key].deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("POST /api/diets", () => {
    it("cria dieta valida com 201", async () => {
      const res = await request(app).post("/api/diets").send({
        petId,
        vetId,
        type: "standard",
        mealsPerDay: 3,
      });
      expect(res.status).toBe(201);
      expect(res.body.type).toBe("standard");
    });

    it("retorna 400 com type invalido", async () => {
      const res = await request(app).post("/api/diets").send({
        petId,
        vetId,
        type: "xyz",
        mealsPerDay: 3,
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/diets/pet/:petId/active", () => {
    it("retorna 404 quando pet nao tem dieta ativa", async () => {
      const res = await request(app).get(`/api/diets/pet/${petId}/active`);
      expect(res.status).toBe(404);
    });

    it("retorna a dieta ativa do pet", async () => {
      await request(app).post("/api/diets").send({
        petId,
        vetId,
        type: "hypocaloric",
        mealsPerDay: 2,
        targetWeight: 8,
      });
      const res = await request(app).get(`/api/diets/pet/${petId}/active`);
      expect(res.status).toBe(200);
      expect(res.body.petId).toBe(petId);
    });
  });
});
