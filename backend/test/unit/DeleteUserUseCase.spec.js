const DeleteUserUseCase = require("../../src/domain/usecases/DeleteUserUseCase");

describe("DeleteUserUseCase", () => {
  let userRepository, usecase;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn().mockResolvedValue({ id: "u1", name: "João" }),
      delete: jest.fn().mockResolvedValue(true),
    };
    usecase = new DeleteUserUseCase({ userRepository });
  });

  it("deleta usuário existente e retorna true", async () => {
    const result = await usecase.execute("u1");
    expect(result).toBe(true);
    expect(userRepository.delete).toHaveBeenCalledWith("u1");
  });

  it("retorna false se usuário não existe", async () => {
    userRepository.findById.mockResolvedValue(null);
    const result = await usecase.execute("ghost");
    expect(result).toBe(false);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it("rejeita delete sem id", async () => {
    await expect(usecase.execute(null)).rejects.toThrow("id é obrigatório");
  });

  it("chama findById antes de deletar", async () => {
    await usecase.execute("u1");
    expect(userRepository.findById).toHaveBeenCalledWith("u1");
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("lança erro sem userRepository", () => {
    expect(() => new DeleteUserUseCase({})).toThrow(
      "userRepository é obrigatório",
    );
  });
});
