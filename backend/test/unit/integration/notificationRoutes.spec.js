const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require('../../../src/app');

describe("Notification API", () => {
  let mongoServer;
  const userId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("POST /api/notifications — cria com 201", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .send({
        userId,
        type: "adoption",
        title: "Novidade!",
        message: "Seu pet foi adotado.",
      });
    expect(res.status).toBe(201);
    expect(res.body.isRead).toBe(false);
  });

  it("POST /api/notifications — retorna 400 com type inválido", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .send({ userId, type: "invalido", title: "X", message: "Y" });
    expect(res.status).toBe(400);
  });

  it("GET /api/notifications/user/:userId — lista notificações", async () => {
    const res = await request(app).get(`/api/notifications/user/${userId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body) || res.body.data).toBeTruthy();
  });
});
