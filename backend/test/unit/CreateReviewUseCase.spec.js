const { CreateReviewUseCase } = require("../../models/CreateReviewUseCase");

describe("CreateReviewUseCase (Unit Tests - JS)", () => {
  let sut;
  let mockReviewRepository;
  let mockNotificationGateway;

  beforeEach(() => {
    mockReviewRepository = {
      findByUserAndPet: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (r) => ({ id: "rev-1", ...r })),
    };

    mockNotificationGateway = {
      emit: jest.fn(),
      emitToUser: jest.fn(),
    };

    sut = new CreateReviewUseCase({ reviewRepository: mockReviewRepository,notificationGateway: mockNotificationGateway, });
  });

  describe("Success Scenarios", () => {
    it("should successfully create a valid review and emit notification", async () => {
      const requestData = { userId: "u1", petId: "p1", rating: 5 };

      const result = await sut.execute(requestData);

      expect(result.id).toBe("rev-1");
      expect(result.rating).toBe(5);
      expect(result.recommend).toBe(true); // Default to true
      expect(mockReviewRepository.create).toHaveBeenCalledTimes(1);
      expect(mockNotificationGateway.emit).toHaveBeenCalledWith(
        'review:created',
        expect.objectContaining({
          reviewId: "rev-1",
          petId: "p1",
          userId: "u1",
          rating: 5,
        })
      );
    });

    it("should successfully create a review with recommend as false", async () => {
      const requestData = {
        userId: "u1",
        petId: "p1",
        rating: 4,
        recommend: false,
      };

      const result = await sut.execute(requestData);

      expect(result.id).toBe("rev-1");
      expect(result.rating).toBe(4);
      expect(result.recommend).toBe(false);
      expect(mockReviewRepository.create).toHaveBeenCalledTimes(1);
      expect(mockNotificationGateway.emit).toHaveBeenCalled();
    });

    it("should accept all valid ratings from 1 to 5", async () => {
      for (let rating = 1; rating <= 5; rating++) {
        mockReviewRepository.create.mockClear();
        mockNotificationGateway.emit.mockClear();
        await expect(
          sut.execute({ userId: "u1", petId: "p1", rating }),
        ).resolves.toBeDefined();
        expect(mockNotificationGateway.emit).toHaveBeenCalled();
      }
    });

    it("should create a review without comment since it is an optional field", async () => {
      await expect(
        sut.execute({ userId: "u1", petId: "p1", rating: 4 }),
      ).resolves.toBeDefined();
      expect(mockNotificationGateway.emit).toHaveBeenCalled();
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
      expect(mockNotificationGateway.emit).not.toHaveBeenCalled();
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
      expect(() => new CreateReviewUseCase({notificationGateway: mockNotificationGateway })).toThrow(
        "reviewRepository e obrigatorio",
      );
    });
    it("should throw an error if instantiated without notificationGateway", () => {
      expect(() => new CreateReviewUseCase({ reviewRepository: mockReviewRepository }))
        .toThrow("notificationGateway e obrigatorio");
    });
  });
});
