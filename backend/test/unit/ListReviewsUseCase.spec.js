const { ListReviewsUseCase, GetReviewUseCase } = require("../../src/domain/models/ListReviewsUseCase");
describe("ListReviewsUseCase", () => {
  let reviewRepository, usecase;
  beforeEach(() => {
    reviewRepository = { findAll: jest.fn().mockResolvedValue({ reviews: [{ id: "r1" }], total: 1 }), findById: jest.fn(), findByPetId: jest.fn() };
    usecase = new ListReviewsUseCase({ reviewRepository });
  });
  it("lista reviews com paginacao padrao", async () => { const result = await usecase.execute({}); expect(reviewRepository.findAll).toHaveBeenCalledTimes(1); expect(result).toHaveProperty("reviews"); expect(result).toHaveProperty("total"); });
  it("rejeita limit fora do range", async () => { await expect(usecase.execute({ limit: 200 })).rejects.toThrow("limit deve ser entre 1 e 100"); });
  it("lanca erro sem reviewRepository", () => { expect(() => new ListReviewsUseCase({})).toThrow("reviewRepository e obrigatorio"); });
});
describe("GetReviewUseCase", () => {
  let reviewRepository, usecase;
  beforeEach(() => {
    reviewRepository = { findById: jest.fn().mockResolvedValue({ id: "r1", rating: 5 }), findByPetId: jest.fn().mockResolvedValue([{ id: "r1" }]) };
    usecase = new GetReviewUseCase({ reviewRepository });
  });
  it("retorna review por id", async () => { const result = await usecase.findById("r1"); expect(result).toEqual({ id: "r1", rating: 5 }); });
  it("rejeita id nulo", async () => { await expect(usecase.findById(null)).rejects.toThrow("id e obrigatorio"); });
  it("retorna reviews por petId", async () => { const result = await usecase.findByPetId("p1"); expect(result).toHaveLength(1); });
  it("rejeita petId nulo", async () => { await expect(usecase.findByPetId(null)).rejects.toThrow("petId e obrigatorio"); });
});
