const GetAdoptionUseCase = require("../../src/domain/usecases/GetAdoptionUseCase");
const UpdateAdoptionUseCase = require("../../src/domain/usecases/UpdateAdoptionUseCase");
describe("GetAdoptionUseCase", () => {
  let repo, usecase;
  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findByPetId: jest.fn(),
      findByAdopter: jest.fn(),
    };
    usecase = new GetAdoptionUseCase({ adoptionRepository: repo });
  });
  it("retorna adocao quando id existe", async () => {
    repo.findById.mockResolvedValue({ id: "a1", petId: "p1" });
    const result = await usecase.findById("a1");
    expect(result).toEqual({ id: "a1", petId: "p1" });
  });
  it("retorna null quando id nao existe", async () => {
    repo.findById.mockResolvedValue(null);
    expect(await usecase.findById("ghost")).toBeNull();
  });
  it("rejeita id nulo", async () => {
    await expect(usecase.findById(null)).rejects.toThrow("id e obrigatorio");
  });
  it("lista adocoes de um adotante", async () => {
    repo.findByAdopter.mockResolvedValue([{ id: "a1" }, { id: "a2" }]);
    const result = await usecase.findByAdopter("u1");
    expect(result).toHaveLength(2);
  });
});
describe("UpdateAdoptionUseCase", () => {
  let repo, usecase;
  beforeEach(() => {
    repo = {
      findById: jest.fn().mockResolvedValue({ id: "a1", notes: "" }),
      update: jest.fn().mockImplementation(async (id, d) => ({ id, ...d })),
    };
    usecase = new UpdateAdoptionUseCase({ adoptionRepository: repo });
  });
  it("atualiza notes com sucesso", async () => {
    const result = await usecase.execute({ id: "a1", notes: "Atualizacao" });
    expect(result.notes).toBe("Atualizacao");
    expect(repo.update).toHaveBeenCalledWith(
      "a1",
      expect.objectContaining({ notes: "Atualizacao" }),
    );
  });
  it("retorna null se adocao nao existe", async () => {
    repo.findById.mockResolvedValue(null);
    const result = await usecase.execute({ id: "ghost", notes: "X" });
    expect(result).toBeNull();
    expect(repo.update).not.toHaveBeenCalled();
  });
  it("rejeita sem id", async () => {
    await expect(usecase.execute({ notes: "X" })).rejects.toThrow(
      "id e obrigatorio",
    );
  });
});
