const {
  CreateDietUseCase,
} = require("../../src/domain/usecases/CreateDietUseCase");

describe("CreateDietUseCase", () => {
  let dietRepository, usecase;
  const validInput = {
    petId: "p1",
    vetId: "v1",
    type: "standard",
    mealsPerDay: 3,
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

  it("aceita todos os types validos", async () => {
    for (const type of [
      "standard",
      "hypocaloric",
      "hyperproteic",
      "therapeutic",
      "raw",
    ]) {
      await expect(
        usecase.execute({ ...validInput, type }),
      ).resolves.toBeDefined();
    }
  });

  it("rejeita type invalido", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "junk-food" }),
    ).rejects.toThrow("type invalido");
  });

  it("rejeita mealsPerDay acima de 10", async () => {
    await expect(
      usecase.execute({ ...validInput, mealsPerDay: 15 }),
    ).rejects.toThrow("entre 1 e 10");
  });

  it("rejeita endDate anterior a startDate", async () => {
    await expect(
      usecase.execute({
        ...validInput,
        startDate: "2025-12-31",
        endDate: "2025-01-01",
      }),
    ).rejects.toThrow("endDate deve ser posterior");
  });

  it("rejeita targetWeight para type standard", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "standard", targetWeight: 5 }),
    ).rejects.toThrow("hypocaloric ou therapeutic");
  });

  it("aceita targetWeight para type hypocaloric", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "hypocaloric", targetWeight: 5 }),
    ).resolves.toBeDefined();
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
