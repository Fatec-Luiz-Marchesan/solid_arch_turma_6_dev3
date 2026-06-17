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
    batchNumber: "LOT-2024",
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

  it("rejeita type invalido (validacao da entidade)", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "covid" }),
    ).rejects.toThrow("type invalido");
    expect(vaccineRepository.create).not.toHaveBeenCalled();
  });

  it("lanca erro sem vaccineRepository", () => {
    expect(() => new CreateVaccineUseCase({})).toThrow(
      "vaccineRepository e obrigatorio",
    );
  });
});
