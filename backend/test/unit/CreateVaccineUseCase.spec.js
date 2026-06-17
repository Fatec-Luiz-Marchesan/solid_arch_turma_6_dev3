const {
  CreateVaccineUseCase,
} = require("../../src/domain/usecases/CreateVaccineUseCase");

describe("CreateVaccineUseCase", () => {
  let vaccineRepository, usecase;

  const validInput = {
    petId: "p1",
    vetId: "v1",
    type: "rabies",
    name: "Antirrabica V8",
    batchNumber: "LOT-2024-001",
  };

  beforeEach(() => {
    vaccineRepository = {
      create: jest
        .fn()
        .mockImplementation(async (v) => ({ id: "vac-1", ...v })),
    };
    usecase = new CreateVaccineUseCase({ vaccineRepository });
  });

  it("cria vacina valida", async () => {
    const result = await usecase.execute(validInput);
    expect(result.id).toBe("vac-1");
    expect(vaccineRepository.create).toHaveBeenCalledTimes(1);
  });

  it("rejeita type invalido", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "covid" }),
    ).rejects.toThrow("type invalido");
  });

  it("rejeita appliedAt no futuro", async () => {
    const futuro = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await expect(
      usecase.execute({ ...validInput, appliedAt: futuro }),
    ).rejects.toThrow("nao pode ser no futuro");
  });

  it("rejeita nextDoseAt anterior a appliedAt", async () => {
    await expect(
      usecase.execute({
        ...validInput,
        appliedAt: "2025-06-01",
        nextDoseAt: "2025-01-01",
      }),
    ).rejects.toThrow("nextDoseAt deve ser posterior");
  });

  it("rejeita sem batchNumber", async () => {
    const { batchNumber, ...sem } = validInput;
    await expect(usecase.execute(sem)).rejects.toThrow(
      "batchNumber e obrigatorio",
    );
  });

  it("rejeita sem petId", async () => {
    const { petId, ...sem } = validInput;
    await expect(usecase.execute(sem)).rejects.toThrow("petId e obrigatorio");
  });
});
