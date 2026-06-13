import { CreateReviewUseCase } from "./CreateReviewUseCase";

describe("CreateReviewUseCase (Unit Tests - JS)", () => {
  let sut;
  let mockReviewRepository;

  beforeEach(() => {
    mockReviewRepository = {
      findByUserAndPet: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation(async (r) => ({ id: "rev-1", ...r })),
    };

    sut = new CreateReviewUseCase({ reviewRepository: mockReviewRepository });
  });

  describe("Success Scenarios", () => {
    it("should successfully create a valid review", async () => {
      const requestData = { userId: "u1", petId: "p1", rating: 5 };

      const result = await sut.execute(requestData);

      expect(result.id).toBe("rev-1");
      expect(result.rating).toBe(5);
      expect(mockReviewRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should accept all valid ratings from 1 to 5", async () => {
      for (let rating = 1; rating <= 5; rating++) {
        mockReviewRepository.create.mockClear();

        await expect(
          sut.execute({ userId: "u1", petId: "p1", rating }),
        ).resolves.toBeDefined();
      }
    });

    it("should create a review without comment since it is an optional field", async () => {
      await expect(
        sut.execute({ userId: "u1", petId: "p1", rating: 4 }),
      ).resolves.toBeDefined();
    });
  });

  describe("Failure Scenarios", () => {
    it("should throw an error if the review is duplicated", async () => {
      mockReviewRepository.findByUserAndPet.mockResolvedValue({
        id: "existente",
      });

      const requestData = { userId: "u1", petId: "p1", rating: 4 };

      await expect(sut.execute(requestData)).rejects.toThrow("ja avaliou");
      expect(mockReviewRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if rating is above 5", async () => {
      const requestData = { userId: "u1", petId: "p1", rating: 6 };

      await expect(sut.execute(requestData)).rejects.toThrow("entre 1 e 5");
      expect(mockReviewRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if rating is below 1", async () => {
      const requestData = { userId: "u1", petId: "p1", rating: 0 };

      await expect(sut.execute(requestData)).rejects.toThrow("entre 1 e 5");
      expect(mockReviewRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if userId is missing", async () => {
      const requestData = { petId: "p1", rating: 3 };

      await expect(sut.execute(requestData)).rejects.toThrow(
        "userId e obrigatorio",
      );
      expect(mockReviewRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if petId is missing", async () => {
      const requestData = { userId: "u1", rating: 3 };

      await expect(sut.execute(requestData)).rejects.toThrow(
        "petId e obrigatorio",
      );
      expect(mockReviewRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if instantiated without reviewRepository", () => {
      expect(() => new CreateReviewUseCase({})).toThrow(
        "reviewRepository e obrigatorio",
      );
    });
  });
});
