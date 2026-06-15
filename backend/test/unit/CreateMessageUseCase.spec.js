const {
  CreateMessageUseCase,
} = require("../../src/domain/usecases/CreateMessageUseCase");

describe("CreateMessageUseCase", () => {
  let repo, usecase;

  beforeEach(() => {
    repo = {
      create: jest
        .fn()
        .mockImplementation(async (m) => ({ id: "msg-1", ...m })),
    };
    usecase = new CreateMessageUseCase({ messageRepository: repo });
  });

  it("cria mensagem válida", async () => {
    const result = await usecase.execute({
      senderId: "u1",
      receiverId: "u2",
      content: "Olá!",
      type: "text",
    });
    expect(result.id).toBe("msg-1");
    expect(result.conversationId).toContain("u1");
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it("rejeita remetente igual ao destinatário", async () => {
    await expect(
      usecase.execute({ senderId: "u1", receiverId: "u1", content: "Oi" }),
    ).rejects.toThrow("Remetente e destinatário não podem ser o mesmo");
  });

  it("rejeita content vazio", async () => {
    await expect(
      usecase.execute({ senderId: "u1", receiverId: "u2", content: "" }),
    ).rejects.toThrow("content é obrigatório");
  });

  it("rejeita content acima de 2000 caracteres", async () => {
    await expect(
      usecase.execute({
        senderId: "u1",
        receiverId: "u2",
        content: "x".repeat(2001),
      }),
    ).rejects.toThrow("2000 caracteres");
  });

  it("gera conversationId consistente independente da ordem", async () => {
    const r1 = await usecase.execute({
      senderId: "aaa",
      receiverId: "bbb",
      content: "Oi",
    });
    const r2 = await usecase.execute({
      senderId: "bbb",
      receiverId: "aaa",
      content: "Olá",
    });
    expect(r1.conversationId).toBe(r2.conversationId);
  });
});
