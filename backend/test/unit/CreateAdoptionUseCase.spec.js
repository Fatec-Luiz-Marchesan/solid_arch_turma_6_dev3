const CreateAdoptionUseCase = require("../../src/domain/usecases/CreateAdoptionUseCase");

describe("CreateAdoptionUseCase — com logger", () => {
  let adoptionRepository;
  let logger;
  let usecase;

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

  it("cria adocao valida e loga info duas vezes", async () => {
    const result = await usecase.execute({
      petId: "p1",
      adopterId: "u1",
      notes: "Cuidar bem",
    });

    expect(result.id).toBe("adoption-1");
    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalledWith("Iniciando criacao de adocao", {
      petId: "p1",
      adopterId: "u1",
    });
    expect(logger.info).toHaveBeenCalledWith(
      "Adocao criada com sucesso",
      expect.objectContaining({ adoptionId: "adoption-1" }),
    );
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("loga warn e lanca erro quando pet ja adotado", async () => {
    adoptionRepository.findByPetId.mockResolvedValue({ id: "existente" });

    await expect(
      usecase.execute({ petId: "p1", adopterId: "u2" }),
    ).rejects.toThrow("Este pet ja foi adotado");
    expect(logger.warn).toHaveBeenCalledWith(
      "Tentativa de adotar pet ja adotado",
      { petId: "p1", adopterId: "u2" },
    );
    expect(adoptionRepository.create).not.toHaveBeenCalled();
  });

  it("loga error quando repositorio lanca excecao inesperada", async () => {
    const dbError = new Error("Conexao perdida com MongoDB");
    adoptionRepository.create.mockRejectedValue(dbError);

    await expect(
      usecase.execute({ petId: "p1", adopterId: "u1" }),
    ).rejects.toThrow("Conexao perdida");
    expect(logger.error).toHaveBeenCalledWith("Erro ao criar adocao", dbError);
  });

  it("lanca erro sem logger", () => {
    expect(() => new CreateAdoptionUseCase({ adoptionRepository })).toThrow(
      "logger e obrigatorio",
    );
  });

  it("lanca erro sem adoptionRepository", () => {
    expect(() => new CreateAdoptionUseCase({ logger })).toThrow(
      "adoptionRepository e obrigatorio",
    );
  });
});
