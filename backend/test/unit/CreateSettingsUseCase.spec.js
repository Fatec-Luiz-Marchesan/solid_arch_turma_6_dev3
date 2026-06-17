const CreateSettingsUseCase = require("../../src/domain/usecases/settings/CreateSettingsUseCase");
describe("CreateSettingsUseCase", () => {
  it("deve chamar o repositorio com os dados corretos", async () => {
    const mockRepo = { create: jest.fn().mockResolvedValue({ id: "1" }) };
    const useCase = new CreateSettingsUseCase(mockRepo);
    const input = { userId: "abc123", theme: "dark", notifications: true };

    const result = await useCase.execute(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toHaveProperty("id");
  });
  it("deve lancar erro se o repositorio falhar", async () => {
    const mockRepo = {
      create: jest.fn().mockRejectedValue(new Error("DB error")),
    };
    const useCase = new CreateSettingsUseCase(mockRepo);

    await expect(useCase.execute({ userId: "x" })).rejects.toThrow("DB error");
  });
});
