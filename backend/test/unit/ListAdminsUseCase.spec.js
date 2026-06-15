const ListAdminsUseCase = require("../../src/domain/usecases/ListAdminsUseCase");

describe("ListAdminsUseCase (sem cache)", () => {
  let adminRepository, usecase;

  beforeEach(() => {
    adminRepository = {
      findAll: jest.fn().mockResolvedValue([
        { id: "a1", name: "Admin 1", role: "admin" },
        { id: "a2", name: "Admin 2", role: "superadmin" },
      ]),
    };

    usecase = new ListAdminsUseCase({ adminRepository, cacheGateway: null });
  });

  it("retorna lista de admins do repositório", async () => {
    const result = await usecase.execute({});
    expect(result).toHaveLength(2);
    expect(adminRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("filtra por role quando passado", async () => {
    await usecase.execute({ role: "superadmin" });
    expect(adminRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ role: "superadmin" }),
    );
  });

  it("retorna array vazio quando não há admins", async () => {
    adminRepository.findAll.mockResolvedValue([]);
    const result = await usecase.execute({});
    expect(result).toEqual([]);
  });
});
