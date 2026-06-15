const CreateAdminUseCase = require("../../src/domain/usecases/CreateAdminUseCase");

describe("CreateAdminUseCase", () => {
  let adminRepository, hashGateway, usecase;

  beforeEach(() => {
    adminRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation(async (a) => ({ id: "admin-1", ...a })),
    };
    hashGateway = { hash: jest.fn().mockResolvedValue("hashed-pwd") };
    usecase = new CreateAdminUseCase({ adminRepository, hashGateway });
  });

  it("cria admin com dados válidos", async () => {
    const result = await usecase.execute({
      name: "Admin Sistema",
      email: "admin@sistema.com",
      password: "AdminPass1",
      role: "superadmin",
    });
    expect(result.id).toBe("admin-1");
    expect(result.role).toBe("superadmin");
  });

  it("hasheia a senha antes de salvar", async () => {
    await usecase.execute({
      name: "Admin",
      email: "a@a.com",
      password: "Admin123",
      role: "admin",
    });
    expect(hashGateway.hash).toHaveBeenCalledWith("Admin123");
  });

  it("rejeita email duplicado", async () => {
    adminRepository.findByEmail.mockResolvedValue({ id: "existing" });
    await expect(
      usecase.execute({
        name: "Admin",
        email: "duplicado@a.com",
        password: "Admin123",
        role: "admin",
      }),
    ).rejects.toThrow("já existe");
    expect(adminRepository.create).not.toHaveBeenCalled();
  });

  it("rejeita role inválida", async () => {
    await expect(
      usecase.execute({
        name: "Admin",
        email: "a@a.com",
        password: "Admin123",
        role: "hacker",
      }),
    ).rejects.toThrow();
  });
});
