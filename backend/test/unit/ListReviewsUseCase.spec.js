const {
  ListReviewsUseCase,
  GetReviewUseCase,
} = require("../../models/ListReviewsUseCase");

describe("ListReviewsUseCase", () => {
  let reviewRepository, usecase;

  beforeEach(() => {
    reviewRepository = {
      findAll: jest.fn().mockResolvedValue({
        reviews: [
          { id: "r1", rating: 4 },
          { id: "r2", rating: 5 },
        ],
        total: 2,
      }),
    };
    usecase = new ListReviewsUseCase({ reviewRepository });
  });

  it("retorna lista paginada com padroes (page=1, limit=20)", async () => {
    const result = await usecase.execute({});
    expect(reviewRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 20 }),
    );
    expect(result.reviews).toHaveLength(2);
    expect(result.totalPages).toBe(1);
  });

  it("aplica filtro de minRating", async () => {
    await usecase.execute({ minRating: 4, page: 1, limit: 10 });
    expect(reviewRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ minRating: 4 }),
    );
  });

  it("aplica filtro de petId", async () => {
    await usecase.execute({ petId: "pet-xyz", page: 1, limit: 10 });
    expect(reviewRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ petId: "pet-xyz" }),
    );
  });

  it("rejeita limit maior que 100", async () => {
    await expect(usecase.execute({ limit: 200 })).rejects.toThrow(
      "entre 1 e 100",
    );
  });

  it("lanca erro sem reviewRepository", () => {
    expect(() => new ListReviewsUseCase({})).toThrow(
      "reviewRepository e obrigatorio",
    );
  });
});

describe("GetReviewUseCase", () => {
  let reviewRepository, usecase;

  beforeEach(() => {
    reviewRepository = { findById: jest.fn(), findByPetId: jest.fn() };
    usecase = new GetReviewUseCase({ reviewRepository });
  });

  it("retorna review quando id existe", async () => {
    reviewRepository.findById.mockResolvedValue({ id: "r1", rating: 5 });
    const result = await usecase.findById("r1");
    expect(result).toEqual({ id: "r1", rating: 5 });
  });

  it("retorna null quando id nao existe", async () => {
    reviewRepository.findById.mockResolvedValue(null);
    expect(await usecase.findById("ghost")).toBeNull();
  });

  it("rejeita id nulo", async () => {
    await expect(usecase.findById(null)).rejects.toThrow("id e obrigatorio");
  });

  it("lista reviews de um pet", async () => {
    reviewRepository.findByPetId.mockResolvedValue([
      { id: "r1" },
      { id: "r2" },
    ]);
    const result = await usecase.findByPetId("pet-1");
    expect(result).toHaveLength(2);
  });
});
