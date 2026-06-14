const ReviewController = require("../../controllers/ReviewController");

describe("ReviewController", () => {
  let controller;
  let createReviewUseCase;
  let listReviewsUseCase;
  let getReviewUseCase;
  let req, res;

  beforeEach(() => {
    createReviewUseCase = { execute: jest.fn() };
    listReviewsUseCase = { execute: jest.fn() };
    getReviewUseCase = { findById: jest.fn() };

    controller = new ReviewController({
      createReviewUseCase,
      listReviewsUseCase,
      getReviewUseCase,
    });

    req = {
      body: {},
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("create", () => {
    it("deve retornar 400 se o payload for invalido", async () => {
      req.body = { rating: 6 };
      await controller.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) }),
      );
    });

    it("deve retornar 201 e o review criado se for sucesso", async () => {
      req.body = {
        userId: "507f1f77bcf86cd799439011",
        petId: "507f1f77bcf86cd799439012",
        rating: 4,
        recommend: false,
      };
      createReviewUseCase.execute.mockResolvedValue({
        id: "rev-123",
        ...req.body,
      });

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: "rev-123", recommend: false }),
      );
    });

    it("deve retornar 400 se o usecase falhar", async () => {
      req.body = {
        userId: "507f1f77bcf86cd799439011",
        petId: "507f1f77bcf86cd799439012",
        rating: 4,
      };
      createReviewUseCase.execute.mockRejectedValue(new Error("Usecase error"));

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Usecase error" });
    });
  });

  describe("list", () => {
    it("deve retornar lista com status 200", async () => {
      req.query = { page: "1", limit: "10", minRating: "4" };
      listReviewsUseCase.execute.mockResolvedValue({
        reviews: [],
        total: 0,
        totalPages: 1,
      });

      await controller.list(req, res);

      expect(listReviewsUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        minRating: 4,
        petId: undefined,
      });
      expect(res.json).toHaveBeenCalledWith({
        reviews: [],
        total: 0,
        totalPages: 1,
      });
    });
  });

  describe("getById", () => {
    it("deve retornar 404 se nao encontrar o review", async () => {
      req.params.id = "r-1";
      getReviewUseCase.findById.mockResolvedValue(null);

      await controller.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Review nao encontrada" });
    });

    it("deve retornar o review se for encontrado", async () => {
      req.params.id = "r-1";
      getReviewUseCase.findById.mockResolvedValue({ id: "r-1", rating: 5 });

      await controller.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: "r-1", rating: 5 });
    });
  });
});
