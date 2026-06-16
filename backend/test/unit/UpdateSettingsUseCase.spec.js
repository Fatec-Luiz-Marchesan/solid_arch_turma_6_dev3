const UpdateSettingsUseCase = require("../../../src/domain/usecases/UpdateSettingsUseCase");

describe("UpdateSettingsUseCase", () => {
  it("deve atualizar apenas os campos enviados", async () => {
    const existing = { userId: "abc123", theme: "light", notifications: true };
    const mockRepo = {
      update: jest.fn().mockResolvedValue({ ...existing, theme: "dark" }),
    };
    const useCase = new UpdateSettingsUseCase(mockRepo);

    const result = await useCase.execute({ userId: "abc123", theme: "dark" });

    expect(mockRepo.update).toHaveBeenCalledWith({
      userId: "abc123",
      theme: "dark",
    });
    expect(result.theme).toBe("dark");
    expect(result.notifications).toBe(true);
  });

  it("deve lancar erro se o repositorio falhar", async () => {
    const mockRepo = {
      update: jest.fn().mockRejectedValue(new Error("DB error")),
    };
    const useCase = new UpdateSettingsUseCase(mockRepo);

    await expect(useCase.execute({ userId: "abc123" })).rejects.toThrow(
      "DB error",
    );
  });

  it("deve lancar erro se userId nao for informado", async () => {
    const mockRepo = { update: jest.fn() };
    const useCase = new UpdateSettingsUseCase(mockRepo);

    await expect(useCase.execute({})).rejects.toThrow();
  });
});
