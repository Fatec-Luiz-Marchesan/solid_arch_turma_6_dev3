const Diet = require("../../src/domain/entities/Diet");
describe("Entidade Diet", () => {
  const validInput = {
    petId: "p1",
    vetId: "v1",
    type: "standard",
    mealsPerDay: 3,
  };
  it("cria dieta valida", () => {
    const d = new Diet(validInput);
    expect(d.petId).toBe("p1");
    expect(d.type).toBe("standard");
    expect(d.restrictions).toEqual([]);
  });
  it("rejeita type invalido", () => {
    expect(() => new Diet({ ...validInput, type: "junk" })).toThrow(
      "type invalido",
    );
  });
  it("rejeita mealsPerDay acima de 10", () => {
    expect(() => new Diet({ ...validInput, mealsPerDay: 15 })).toThrow(
      "entre 1 e 10",
    );
  });
  it("rejeita mealsPerDay zero", () => {
    expect(() => new Diet({ ...validInput, mealsPerDay: 0 })).toThrow(
      "entre 1 e 10",
    );
  });
  it("rejeita dailyCalories negativo", () => {
    expect(() => new Diet({ ...validInput, dailyCalories: -100 })).toThrow(
      "positivo",
    );
  });
  it("rejeita endDate anterior a startDate", () => {
    expect(
      () =>
        new Diet({
          ...validInput,
          startDate: "2025-12-31",
          endDate: "2025-01-01",
        }),
    ).toThrow("endDate deve ser posterior");
  });
  describe("isActive()", () => {
    it("retorna true para dieta sem endDate", () => {
      const d = new Diet(validInput);
      expect(d.isActive()).toBe(true);
    });
    it("retorna false para dieta cuja endDate ja passou", () => {
      const d = new Diet({
        ...validInput,
        startDate: "2020-01-01",
        endDate: "2020-12-31",
      });
      expect(d.isActive()).toBe(false);
    });
  });
});
