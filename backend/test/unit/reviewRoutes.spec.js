const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../../src/app");
describe("Review API", () => {
  let mongoServer;
  const userId = new mongoose.Types.ObjectId().toString();
  const petId = new mongoose.Types.ObjectId().toString();
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  it("POST /api/reviews - cria com 201", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({ userId, petId, rating: 5, comment: "Otimo pet!" });
    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(5);
  });
  it("POST /api/reviews - retorna 409 ao tentar duplicar", async () => {
    await request(app).post("/api/reviews").send({ userId, petId, rating: 4 });
    const res = await request(app)
      .post("/api/reviews")
      .send({ userId, petId, rating: 3 });
    expect(res.status).toBe(409);
  });
  it("GET /api/reviews - lista reviews", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reviews");
    expect(res.body).toHaveProperty("total");
  });
  it("GET /api/reviews - filtra por petId", async () => {
    const res = await request(app).get(`/api/reviews?petId=${petId}`);
    expect(res.status).toBe(200);
    expect(res.body.reviews.every((r) => r.petId === petId)).toBe(true);
  });
  it("GET /api/reviews - filtra por minRating", async () => {
    const res = await request(app).get("/api/reviews?minRating=4");
    expect(res.status).toBe(200);
    expect(res.body.reviews.every((r) => r.rating >= 4)).toBe(true);
  });
});
