const UpdateSettingsUseCase = require("../../src/domain/usecases/UpdateSettingsUseCase");

describe("UpdateSettingsUseCase", () => {
  let settingsRepository, usecase;

  beforeEach(() => {
    settingsRepository = {
      update: jest
        .fn()
        .mockImplementation(async (input) => ({ id: "s-1", ...input })),
    };
    usecase = new UpdateSettingsUseCase(settingsRepository);
  });

  it("atualiza settings com sucesso", async () => {
    const input = { userId: "user-1", theme: "dark", notifications: false };
    const result = await usecase.execute(input);
    expect(settingsRepository.update).toHaveBeenCalledWith(input);
    expect(result).toHaveProperty("userId", "user-1");
  });

  it("rejeita userId ausente", async () => {
    await expect(
      usecase.execute({ theme: "dark" }),
    ).rejects.toThrow("userId e obrigatorio");
  });

  it("rejeita input nulo", async () => {
    await expect(usecase.execute(null)).rejects.toThrow("userId e obrigatorio");
  });

  it("lanca erro se settingsRepository nao for fornecido", () => {
    expect(() => new UpdateSettingsUseCase(null)).toThrow(
      "settingsRepository e obrigatorio",
    );
  });
});