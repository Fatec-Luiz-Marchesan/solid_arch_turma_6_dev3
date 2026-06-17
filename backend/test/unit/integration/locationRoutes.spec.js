const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../../src/app");

describe("Location API", () => {
  let mongoServer;

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

  it("POST /api/locations - cria com 201", async () => {
    const res = await request(app).post("/api/locations").send({
      name: "Parque",
      latitude: -23.5,
      longitude: -46.6,
      type: "event",
      referenceId: new mongoose.Types.ObjectId().toString(),
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Parque");
  });

  it("POST /api/locations - retorna 400 com latitude invalida", async () => {
    const res = await request(app).post("/api/locations").send({
      name: "Parque",
      latitude: 999,
      longitude: 0,
      type: "event",
      referenceId: "x",
    });
    expect(res.status).toBe(400);
  });

  it("GET /api/locations/nearby - retorna locations proximas", async () => {
    const refId = new mongoose.Types.ObjectId().toString();
    await request(app).post("/api/locations").send({
      name: "Parque",
      latitude: -23.5,
      longitude: -46.6,
      type: "event",
      referenceId: refId,
    });

    const res = await request(app).get(
      "/api/locations/nearby?lat=-23.5&lng=-46.6&radius=10",
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
