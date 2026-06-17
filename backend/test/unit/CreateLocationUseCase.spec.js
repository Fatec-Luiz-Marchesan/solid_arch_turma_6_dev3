const CreateLocationUseCase = require("../../src/domain/usecases/CreateLocationUseCase");

describe("CreateLocationUseCase", () => {
  let locationRepository, usecase;

  const validInput = {
    name: "Parque Ibirapuera",
    latitude: -23.587,
    longitude: -46.657,
    type: "event",
    referenceId: "event-1",
  };

  beforeEach(() => {
    locationRepository = {
      create: jest
        .fn()
        .mockImplementation(async (l) => ({ id: "loc-1", ...l })),
    };
    usecase = new CreateLocationUseCase({ locationRepository });
  });

  it("cria location valida", async () => {
    const result = await usecase.execute(validInput);
    expect(result.id).toBe("loc-1");
    expect(result.name).toBe("Parque Ibirapuera");
    expect(locationRepository.create).toHaveBeenCalledTimes(1);
  });

  it("rejeita latitude acima de 90", async () => {
    await expect(
      usecase.execute({ ...validInput, latitude: 95 }),
    ).rejects.toThrow("latitude deve estar entre -90 e 90");
  });

  it("rejeita longitude abaixo de -180", async () => {
    await expect(
      usecase.execute({ ...validInput, longitude: -200 }),
    ).rejects.toThrow("longitude deve estar entre -180 e 180");
  });

  it("rejeita type invalido", async () => {
    await expect(
      usecase.execute({ ...validInput, type: "banco" }),
    ).rejects.toThrow("type invalido");
  });

  it("rejeita name muito curto", async () => {
    await expect(usecase.execute({ ...validInput, name: "A" })).rejects.toThrow(
      "min 2 caracteres",
    );
  });

  it("rejeita sem referenceId", async () => {
    const { referenceId, ...sem } = validInput;
    await expect(usecase.execute(sem)).rejects.toThrow("referenceId");
  });

  it("lanca erro sem locationRepository", () => {
    expect(() => new CreateLocationUseCase({})).toThrow(
      "locationRepository e obrigatorio",
    );
  });
});
