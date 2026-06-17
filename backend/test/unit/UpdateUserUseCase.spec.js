const UpdatePetUseCase = require("../../src/domain/usecases/UpdatePetUseCase");

describe("UpdatePetUseCase", () => {
  let petRepository, usecase;

  beforeEach(() => {
    petRepository = {
      findById: jest.fn().mockResolvedValue({ id: "pet-1", name: "Rex" }),
      update: jest
        .fn()
        .mockImplementation(async (id, changes) => ({ id, ...changes })),
    };
    usecase = new UpdatePetUseCase({ petRepository });
  });

  it("atualiza pet com sucesso", async () => {
    const result = await usecase.execute({ id: "pet-1", name: "Buddy" });
    expect(result.name).toBe("Buddy");
    expect(petRepository.update).toHaveBeenCalledWith(
      "pet-1",
      expect.objectContaining({ name: "Buddy" }),
    );
  });

  it("retorna null se pet nao existir", async () => {
    petRepository.findById.mockResolvedValue(null);
    const result = await usecase.execute({ id: "nao-existe", name: "Buddy" });
    expect(result).toBeNull();
  });

  it("rejeita id ausente", async () => {
    await expect(
      usecase.execute({ name: "Buddy" }),
    ).rejects.toThrow("id e obrigatorio");
  });

  it("rejeita name muito curto", async () => {
    await expect(
      usecase.execute({ id: "pet-1", name: "A" }),
    ).rejects.toThrow("name deve ter pelo menos 2 caracteres");
  });

  it("lanca erro se petRepository nao for fornecido", () => {
    expect(() => new UpdatePetUseCase({ petRepository: null })).toThrow(
      "petRepository e obrigatorio",
    );
  });
});