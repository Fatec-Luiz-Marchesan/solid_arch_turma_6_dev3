const CreateOrUpdateSettingsUseCase = require("../../src/domain/usecases/CreateOrUpdateSettingsUseCase");

describe("CreateOrUpdateSettingsUseCase", () => {
  let settingsRepository;
  let usecase;

  const validInput = {
    userId: "user-abc",
    language: "pt-BR",
    theme: "dark",
    notifications: true,
    timezone: "America/Sao_Paulo",
  };

  beforeEach(() => {
    settingsRepository = {
      findByUserId: jest.fn().mockResolvedValue(null),

      create: jest.fn().mockImplementation(async (s) => ({
        id: "set-1",
        ...s,
      })),

      update: jest.fn().mockImplementation(async (id, s) => ({
        id,
        ...s,
      })),
    };

    usecase = new CreateOrUpdateSettingsUseCase({
      settingsRepository,
    });
  });

  it("cria quando nao existe (CREATE)", async () => {
    const result = await usecase.execute(validInput);

    expect(settingsRepository.create).toHaveBeenCalledTimes(1);
    expect(settingsRepository.update).not.toHaveBeenCalled();

    expect(result.id).toBe("set-1");
  });

  it("atualiza quando ja existe (UPDATE)", async () => {
    settingsRepository.findByUserId.mockResolvedValue({
      id: "set-existente",
      userId: "user-abc",
    });

    await usecase.execute({
      ...validInput,
      theme: "dark",
    });

    expect(settingsRepository.update).toHaveBeenCalledWith(
      "set-existente",
      expect.objectContaining({
        theme: "dark",
      }),
    );

    expect(settingsRepository.create).not.toHaveBeenCalled();
  });

  it("rejeita language invalido", async () => {
    await expect(
      usecase.execute({
        ...validInput,
        language: "xx-XX",
      }),
    ).rejects.toThrow("language invalido");
  });

  it("rejeita theme invalido", async () => {
    await expect(
      usecase.execute({
        ...validInput,
        theme: "blue",
      }),
    ).rejects.toThrow("theme invalido");
  });

  it("rejeita notifications nao boolean", async () => {
    await expect(
      usecase.execute({
        ...validInput,
        notifications: "yes",
      }),
    ).rejects.toThrow("boolean");
  });

  it("rejeita userId vazio", async () => {
    await expect(
      usecase.execute({
        ...validInput,
        userId: "",
      }),
    ).rejects.toThrow("userId e obrigatorio");
  });
});
