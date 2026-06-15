const CreateAdoptionUseCase = require("../../src/domain/usecases/CreateAdoptionUseCase");
describe("CreateAdoptionUseCase", () => {
  let adoptionRepository, logger, usecase;
  beforeEach(() => {
    adoptionRepository = {
      findByPetId: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation(async (a) => ({ id: "adoption-1", ...a })),
    };
    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    usecase = new CreateAdoptionUseCase({ adoptionRepository, logger });
  });
  it("cria adocao valida", async () => {
    const result = await usecase.execute({
      petId: "p1",
      adopterId: "u1",
      notes: "Cuidarei bem",
    });
    expect(result.id).toBe("adoption-1");
    expect(adoptionRepository.create).toHaveBeenCalledTimes(1);
  });
  it("loga info ao iniciar e ao concluir", async () => {
    await usecase.execute({ petId: "p1", adopterId: "u1" });
    expect(logger.info).toHaveBeenCalledTimes(2);
  });
  it("rejeita pet ja adotado", async () => {
    adoptionRepository.findByPetId.mockResolvedValue({ id: "existente" });
    await expect(
      usecase.execute({ petId: "p1", adopterId: "u2" }),
    ).rejects.toThrow("Este pet ja foi adotado");
    expect(adoptionRepository.create).not.toHaveBeenCalled();
  });
  it("loga warn quando pet ja adotado", async () => {
    adoptionRepository.findByPetId.mockResolvedValue({ id: "existente" });
    await usecase.execute({ petId: "p1", adopterId: "u2" }).catch(() => {});
    expect(logger.warn).toHaveBeenCalledWith(
      "Tentativa de adotar pet ja adotado",
      expect.any(Object),
    );
  });
  it("loga error em excecao inesperada do banco", async () => {
    const err = new Error("DB Timeout");
    adoptionRepository.create.mockRejectedValue(err);
    await usecase.execute({ petId: "p1", adopterId: "u1" }).catch(() => {});
    expect(logger.error).toHaveBeenCalledWith("Erro ao criar adocao", err);
  });
  it("rejeita sem petId", async () => {
    await expect(usecase.execute({ adopterId: "u1" })).rejects.toThrow("petId");
  });
  it("rejeita sem adopterId", async () => {
    await expect(usecase.execute({ petId: "p1" })).rejects.toThrow("adopterId");
  });
  it("lanca erro sem logger", () => {
    expect(() => new CreateAdoptionUseCase({ adoptionRepository })).toThrow(
      "logger e obrigatorio",
    );
  });
});
