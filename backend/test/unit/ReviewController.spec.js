const ReviewController = require("../../src/interface/controllers/ReviewController");
describe("ReviewController", () => {
  let controller, createReviewUseCase, listReviewsUseCase, getReviewUseCase, req, res;
  beforeEach(() => {
    createReviewUseCase = { execute: jest.fn().mockResolvedValue({ id: "r1", rating: 5, comment: "Otimo" }) };
    listReviewsUseCase  = { execute: jest.fn().mockResolvedValue({ reviews: [], total: 0, totalPages: 1 }) };
    getReviewUseCase    = { findById: jest.fn().mockResolvedValue({ id: "r1", rating: 5 }) };
    controller = new ReviewController({ createReviewUseCase, listReviewsUseCase, getReviewUseCase });
    res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  });
  describe("create", () => {
    it("retorna 201 com review criada", async () => {
      req = { body: { petId: "507f1f77bcf86cd799439011", userId: "507f1f77bcf86cd799439012", rating: 5, comment: "Otimo pet" } };
      await controller.create(req, res); expect(res.status).toHaveBeenCalledWith(201);
    });
    it("retorna 400 se payload invalido", async () => { req = { body: {} }; await controller.create(req, res); expect(res.status).toHaveBeenCalledWith(400); });
  });
  describe("list", () => {
    it("retorna lista de reviews", async () => { req = { query: {} }; await controller.list(req, res); expect(listReviewsUseCase.execute).toHaveBeenCalledTimes(1); expect(res.json).toHaveBeenCalled(); });
  });
  describe("getById", () => {
    it("retorna review por id", async () => { req = { params: { id: "r1" } }; await controller.getById(req, res); expect(getReviewUseCase.findById).toHaveBeenCalledWith("r1"); });
    it("retorna 404 se nao encontrada", async () => { getReviewUseCase.findById.mockResolvedValue(null); req = { params: { id: "ghost" } }; await controller.getById(req, res); expect(res.status).toHaveBeenCalledWith(404); });
  });
});
