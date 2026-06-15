const UpdateUserUseCase = require("../../src/domain/usecases/UpdateUserUseCase");

describe("UpdateUserUseCase", () => {
  let userRepository, hashGateway, usecase;

  beforeEach(() => {
    userRepository = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: "u1", name: "João", email: "j@j.com" }),
      update: jest
        .fn()
        .mockImplementation(async (id, data) => ({ id, ...data })),
    };
    hashGateway = { hash: jest.fn().mockResolvedValue("new-hash") };
    usecase = new UpdateUserUseCase({ userRepository, hashGateway });
  });

  it("atualiza name com sucesso", async () => {
    const result = await usecase.execute({ id: "u1", name: "João Atualizado" });
    expect(result.name).toBe("João Atualizado");
    expect(userRepository.update).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ name: "João Atualizado" }),
    );
  });

  it("hasheia nova senha quando fornecida", async () => {
    await usecase.execute({ id: "u1", password: "NovaSenha9" });
    expect(hashGateway.hash).toHaveBeenCalledWith("NovaSenha9");
    expect(userRepository.update).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ password: "new-hash" }),
    );
  });

  it("não chama hashGateway se senha não foi enviada", async () => {
    await usecase.execute({ id: "u1", name: "Novo Nome" });
    expect(hashGateway.hash).not.toHaveBeenCalled();
  });

  it("retorna null se usuário não existe", async () => {
    userRepository.findById.mockResolvedValue(null);
    const result = await usecase.execute({ id: "ghost", name: "X" });
    expect(result).toBeNull();
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it("rejeita update sem id", async () => {
    await expect(usecase.execute({ name: "Sem ID" })).rejects.toThrow(
      "id é obrigatório",
    );
  });
});
