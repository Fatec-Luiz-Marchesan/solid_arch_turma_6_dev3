const {
  validateBreedPayload,
} = require("../../src/interface/helpers/validateBreed");
describe("validateBreedPayload - novos campos Task 110", () => {
  const validBase = {
    name: "Labrador",
    species: "dog",
    size: "large",
    averageWeight: { min: 25, max: 40 },
  };

  it("aceita size valido", () => {
    const { valid } = validateBreedPayload(validBase);
    expect(valid).toBe(true);
  });
  it("rejeita size invalido", () => {
    const { valid, errors } = validateBreedPayload({
      ...validBase,
      size: "huge",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("size invalido"))).toBe(true);
  });
  it("aceita todos os sizes validos", () => {
    for (const size of ["small", "medium", "large", "giant"]) {
      const { valid } = validateBreedPayload({ ...validBase, size });
      expect(valid).toBe(true);
    }
  });

  it("aceita averageWeight valido", () => {
    const { valid, data } = validateBreedPayload(validBase);
    expect(valid).toBe(true);
    expect(data.averageWeight).toEqual({ min: 25, max: 40 });
  });
  it("rejeita quando min >= max", () => {
    const { valid, errors } = validateBreedPayload({
      ...validBase,
      averageWeight: { min: 40, max: 25 },
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("max deve ser maior"))).toBe(true);
  });
  it("rejeita min negativo", () => {
    const { valid, errors } = validateBreedPayload({
      ...validBase,
      averageWeight: { min: -1, max: 10 },
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("min deve ser positivo"))).toBe(true);
  });
  it("rejeita averageWeight ausente no create", () => {
    const { averageWeight, ...sem } = validBase;
    const { valid, errors } = validateBreedPayload(sem);
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("averageWeight"))).toBe(true);
  });

  it("aceita characteristics como array de strings", () => {
    const { valid, data } = validateBreedPayload({
      ...validBase,
      characteristics: ["amigavel", "ativo", "brincalhao"],
    });
    expect(valid).toBe(true);
    expect(data.characteristics).toHaveLength(3);
  });
  it("rejeita characteristics com mais de 10 itens", () => {
    const { valid, errors } = validateBreedPayload({
      ...validBase,
      characteristics: Array(11).fill("item"),
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("10 itens"))).toBe(true);
  });
  it("rejeita characteristics que nao e array", () => {
    const { valid, errors } = validateBreedPayload({
      ...validBase,
      characteristics: "amigavel",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("deve ser um array"))).toBe(true);
  });

  it("virtual weightRange retorna string formatada", () => {
    const BreedModel = require("../../src/infrastructure/database/mongoose/models/BreedModel");
    const breed = new BreedModel({
      name: "Labrador",
      species: "dog",
      size: "large",
      averageWeight: { min: 25, max: 40 },
    });
    expect(breed.weightRange).toBe("25kg - 40kg");
  });
});
