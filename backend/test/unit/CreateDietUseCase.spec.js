const {
  CreateDietUseCase,
} = require("../../src/domain/usecases/CreateDietUseCase");
describe("CreateDietUseCase", () => {
  let dietRepository, usecase;
  const validInput = {
    petId: "p1",
    vetId: "v1",
    type: "hypocaloric",
    mealsPerDay: 2,
  };
  beforeEach(() => {
    dietRepository = {
      create: jest
        .fn()
        .mockImplementation(async (d) => ({ id: "diet-1", ...d })),
    };
    usecase = new CreateDietUseCase({ dietRepository });
  });
  it("cria dieta valida", async () => {
    const result = await usecase.execute(validInput);
    expect(result.id).toBe("diet-1");
    expect(dietRepository.create).toHaveBeenCalledTimes(1);
  });
  it("invalida cache apos criar se cacheGateway presente", async () => {
    const cacheGateway = {
      delByPattern: jest.fn().mockResolvedValue(undefined),
    };
    const usecaseComCache = new CreateDietUseCase({
      dietRepository,
      cacheGateway,
    });
    await usecaseComCache.execute(validInput);
    expect(cacheGateway.delByPattern).toHaveBeenCalledWith("diet:list:*");
  });
  it("funciona sem cacheGateway (opcional)", async () => {
    await expect(usecase.execute(validInput)).resolves.toBeDefined();
  });
  it("rejeita type invalido", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "vegano" }),
    ).rejects.toThrow("type invalido");
  });
  it("rejeita petId ausente", async () => {
    const { petId, ...sem } = validInput;
    await expect(usecase.execute(sem)).rejects.toThrow("petId e obrigatorio");
  });
  it("lanca erro sem dietRepository", () => {
    expect(() => new CreateDietUseCase({})).toThrow(
      "dietRepository e obrigatorio",
    );
  });
});
