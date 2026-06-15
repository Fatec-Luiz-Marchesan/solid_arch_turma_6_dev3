const {
  CreateNotificationUseCase,
} = require("../../src/domain/usecases/CreateNotificationUseCase");

describe("CreateNotificationUseCase", () => {
  let repo, usecase;

  beforeEach(() => {
    repo = {
      create: jest
        .fn()
        .mockImplementation(async (n) => ({ id: "notif-1", ...n })),
    };
    usecase = new CreateNotificationUseCase({ notificationRepository: repo });
  });

  it("cria notificação válida", async () => {
    const result = await usecase.execute({
      userId: "user-123",
      type: "adoption",
      title: "Pet adotado!",
      message: "Seu pet Rex foi adotado com sucesso.",
    });
    expect(result.id).toBe("notif-1");
    expect(result.isRead).toBe(false);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it("rejeita type inválido", async () => {
    await expect(
      usecase.execute({
        userId: "u1",
        type: "spam",
        title: "Teste",
        message: "Mensagem de teste aqui.",
      }),
    ).rejects.toThrow("type inválido");
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("rejeita title muito curto", async () => {
    await expect(
      usecase.execute({
        userId: "u1",
        type: "system",
        title: "AB",
        message: "Mensagem válida aqui.",
      }),
    ).rejects.toThrow("mínimo 3 caracteres");
  });

  it("rejeita userId ausente", async () => {
    await expect(
      usecase.execute({
        type: "alert",
        title: "Alerta",
        message: "Mensagem de alerta.",
      }),
    ).rejects.toThrow("userId é obrigatório");
  });
});
