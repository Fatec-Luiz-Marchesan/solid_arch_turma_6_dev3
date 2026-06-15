const CreateUserUseCase = require("../../src/domain/usecases/CreateUserUseCase");

describe("CreateUserUseCase", () => {
  let userRepository;
  let hashGateway;
  let usecase;

  const validInput = {
    name: "João Pedro Silva",
    email: "joaopedro@email.com",
    password: "Senha@123",
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (u) => ({
        id: "user-gen-id",
        ...u,
        password: undefined,
      })),
    };
    hashGateway = {
      hash: jest.fn().mockResolvedValue("hashed-password-abc"),
      compare: jest.fn(),
    };
    usecase = new CreateUserUseCase({ userRepository, hashGateway });
  });

  it("cria usuário com dados válidos", async () => {
    const result = await usecase.execute(validInput);

    expect(result.id).toBe("user-gen-id");
    expect(result.name).toBe("João Pedro Silva");
    expect(result.password).toBeUndefined();
  });

  it("hasheia a senha antes de salvar", async () => {
    await usecase.execute(validInput);

    expect(hashGateway.hash).toHaveBeenCalledWith("Senha@123");
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: "hashed-password-abc" }),
    );
  });

  it("verifica se email já existe antes de criar", async () => {
    await usecase.execute(validInput);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "joaopedro@email.com",
    );
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  it("chama repository.create exatamente uma vez", async () => {
    await usecase.execute(validInput);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  it("lança erro se email já está cadastrado", async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: "existing",
      email: validInput.email,
    });

    await expect(usecase.execute(validInput)).rejects.toThrow("já existe");
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("rejeita name ausente", async () => {
    const { name, ...withoutName } = validInput;
    await expect(usecase.execute(withoutName)).rejects.toThrow();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("rejeita email inválido", async () => {
    await expect(
      usecase.execute({ ...validInput, email: "nao-e-email" }),
    ).rejects.toThrow();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("rejeita password ausente", async () => {
    const { password, ...withoutPwd } = validInput;
    await expect(usecase.execute(withoutPwd)).rejects.toThrow();
  });

  it("lança erro sem userRepository", () => {
    expect(() => new CreateUserUseCase({ hashGateway })).toThrow(
      "userRepository é obrigatório",
    );
  });

  it("lança erro sem hashGateway", () => {
    expect(() => new CreateUserUseCase({ userRepository })).toThrow(
      "hashGateway é obrigatório",
    );
  });
});
