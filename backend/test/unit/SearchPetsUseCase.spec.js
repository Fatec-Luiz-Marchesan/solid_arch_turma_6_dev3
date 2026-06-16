const SearchPetsUseCase = require("../../src/domain/usecases/SearchPetsUseCase");

describe("SearchPetsUseCase", () => {
  let searchGateway;
  let usecase;

  const fakeResult = {
    hits: [{ id: "pet-1", name: "Rex", species: "dog", score: 1.5 }],
    total: 1,
  };

  beforeEach(() => {
    searchGateway = {
      search: jest.fn().mockResolvedValue(fakeResult),
      index: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    usecase = new SearchPetsUseCase({ searchGateway });
  });

  describe("busca com texto livre", () => {
    it("retorna pets que batem com a query", async () => {
      const result = await usecase.execute({ q: "Rex", page: 1, limit: 10 });
      expect(result.pets).toHaveLength(1);
      expect(result.pets[0].name).toBe("Rex");
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it("chama o gateway com query multi_match quando há texto", async () => {
      await usecase.execute({ q: "labrador", page: 1, limit: 10 });
      const callArg = searchGateway.search.mock.calls[0][1];
      expect(callArg.bool.must).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            multi_match: expect.objectContaining({ query: "labrador" }),
          }),
        ]),
      );
    });
  });

  describe("busca sem texto (só filtros)", () => {
    it("usa query bool.filter sem must quando não há texto", async () => {
      await usecase.execute({ species: "cat", page: 1, limit: 5 });
      const callArg = searchGateway.search.mock.calls[0][1];
      expect(callArg.bool.must).toBeUndefined();
      expect(callArg.bool.filter).toEqual(
        expect.arrayContaining([
          { term: { status: "available" } },
          { term: { species: "cat" } },
        ]),
      );
    });
  });

  describe("paginação", () => {
    it("calcula from corretamente para página 2", async () => {
      await usecase.execute({ page: 2, limit: 10 });
      const [, , options] = searchGateway.search.mock.calls[0];
      expect(options.from).toBe(10);
      expect(options.size).toBe(10);
    });

    it("rejeita limit acima de 100", async () => {
      await expect(usecase.execute({ limit: 200 })).rejects.toThrow(
        "limit deve estar entre 1 e 100",
      );
      expect(searchGateway.search).not.toHaveBeenCalled();
    });
  });

  describe("instanciação", () => {
    it("lança erro sem searchGateway", () => {
      expect(() => new SearchPetsUseCase({})).toThrow(
        "searchGateway é obrigatório",
      );
    });
  });
});
