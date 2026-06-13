import { ListReviewsUseCase } from "../../models/ListReviewsUseCase";

describe("Review Queries (Unit Tests - JS)", () => {
  describe("ListReviewsUseCase", () => {
    let sut;
    let mockReviewRepository;

    beforeEach(() => {
      mockReviewRepository = {
        findAll: jest.fn().mockResolvedValue({
          reviews: [
            { id: "r1", rating: 4 },
            { id: "r2", rating: 5 },
          ],
          total: 2,
        }),
      };

      sut = new ListReviewsUseCase({ reviewRepository: mockReviewRepository });
    });

    describe("Success Scenarios", () => {
      it("should return a paginated list with default values (page=1, limit=20)", async () => {
        const result = await sut.execute({});

        expect(mockReviewRepository.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ page: 1, limit: 20 }),
        );
        expect(result.reviews).toHaveLength(2);
        expect(result.totalPages).toBe(1);
      });

      it("should successfully apply the minRating filter", async () => {
        await sut.execute({ minRating: 4, page: 1, limit: 10 });

        expect(mockReviewRepository.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ minRating: 4 }),
        );
      });

      it("should successfully apply the petId filter", async () => {
        await sut.execute({ petId: "pet-xyz", page: 1, limit: 10 });

        expect(mockReviewRepository.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ petId: "pet-xyz" }),
        );
      });
    });

    describe("Failure Scenarios", () => {
      it("should throw an error if the limit is higher than 100", async () => {
        await expect(sut.execute({ limit: 200 })).rejects.toThrow(
          "entre 1 e 100",
        );
      });

      it("should throw an error if instantiated without reviewRepository", () => {
        expect(() => new ListReviewsUseCase({})).toThrow(
          "reviewRepository e obrigatorio",
        );
      });
    });
  });

  describe("GetReviewUseCase", () => {
    let sut;
    let mockReviewRepository;

    beforeEach(() => {
      mockReviewRepository = {
        findById: jest.fn(),
        findByPetId: jest.fn(),
      };

      sut = new GetReviewUseCase({ reviewRepository: mockReviewRepository });
    });

    describe("Success Scenarios", () => {
      it("should return the review when the id exists", async () => {
        mockReviewRepository.findById.mockResolvedValue({
          id: "r1",
          rating: 5,
        });

        const result = await sut.findById("r1");

        expect(result).toEqual({ id: "r1", rating: 5 });
      });

      it("should return null when the review id does not exist", async () => {
        mockReviewRepository.findById.mockResolvedValue(null);

        const result = await sut.findById("ghost");

        expect(result).toBeNull();
      });

      it("should successfully list all reviews of a specific pet", async () => {
        mockReviewRepository.findByPetId.mockResolvedValue([
          { id: "r1" },
          { id: "r2" },
        ]);

        const result = await sut.findByPetId("pet-1");

        expect(result).toHaveLength(2);
      });
    });

    describe("Failure Scenarios", () => {
      it("should throw an error if the id is null/missing", async () => {
        await expect(sut.findById(null)).rejects.toThrow("id e obrigatorio");
      });
    });
  });
});
