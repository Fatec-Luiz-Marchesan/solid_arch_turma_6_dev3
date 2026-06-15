const ListAdminsUseCase = require("../../src/domain/usecases/ListAdminsUseCase");
describe("ListAdminsUseCase", () => {
  let adminRepository, cacheGateway, usecase;
  beforeEach(() => {
    adminRepository = {
      findAll: jest.fn().mockResolvedValue([{ id: "a1", name: "Admin 1" }]),
    };
    cacheGateway = {
      get: jest.fn().mockResolvedValue(null), // MISS por padrao
      set: jest.fn().mockResolvedValue(undefined),
    };
    usecase = new ListAdminsUseCase({ adminRepository, cacheGateway });
  });
  it("busca no banco e armazena no cache quando MISS", async () => {
    const result = await usecase.execute();
    expect(adminRepository.findAll).toHaveBeenCalledTimes(1);
    expect(cacheGateway.set).toHaveBeenCalledWith(
      expect.stringContaining("admin:list"),
      expect.any(String),
      60,
    );
    expect(result).toHaveLength(1);
  });
  it("retorna do cache sem consultar banco quando HIT", async () => {
    cacheGateway.get.mockResolvedValue(JSON.stringify([{ id: "a1" }]));
    await usecase.execute();
    expect(adminRepository.findAll).not.toHaveBeenCalled();
    expect(cacheGateway.set).not.toHaveBeenCalled();
  });
  it("lanca erro sem adminRepository", () => {
    expect(() => new ListAdminsUseCase({ cacheGateway })).toThrow(
      "adminRepository e obrigatorio",
    );
  });
  it("lanca erro sem cacheGateway", () => {
    expect(() => new ListAdminsUseCase({ adminRepository })).toThrow(
      "cacheGateway e obrigatorio",
    );
  });
});
