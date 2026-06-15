const {
  validateDietPayload,
} = require("../../src/interface/helpers/validateDiet");

describe("validateDietPayload — Task 54 (novos campos)", () => {
  const validBase = {
    petId: "p1",
    vetId: "v1",
    type: "hypocaloric",
    mealsPerDay: 2,
  };

  describe("frequency", () => {
    it("aceita frequency valido", () => {
      const { valid, data } = validateDietPayload({
        ...validBase,
        frequency: "weekly",
      });

      expect(valid).toBe(true);
      expect(data.frequency).toBe("weekly");
    });

    it("rejeita frequency invalido", () => {
      const { valid, errors } = validateDietPayload({
        ...validBase,
        frequency: "hourly",
      });

      expect(valid).toBe(false);
      expect(errors.some((e) => e.includes("frequency invalido"))).toBe(true);
    });

    it("aceita todos os frequency validos", () => {
      for (const f of ["daily", "weekly", "custom"]) {
        const { valid } = validateDietPayload({ ...validBase, frequency: f });
        expect(valid).toBe(true);
      }
    });
  });

  describe("targetWeight", () => {
    it("aceita targetWeight para type hypocaloric", () => {
      const { valid, data } = validateDietPayload({
        ...validBase,
        targetWeight: 5.5,
      });

      expect(valid).toBe(true);
      expect(data.targetWeight).toBe(5.5);
    });

    it("aceita targetWeight para type therapeutic", () => {
      const { valid } = validateDietPayload({
        ...validBase,
        type: "therapeutic",
        targetWeight: 8,
      });

      expect(valid).toBe(true);
    });

    it("rejeita targetWeight para type standard", () => {
      const { valid, errors } = validateDietPayload({
        ...validBase,
        type: "standard",
        targetWeight: 5,
      });

      expect(valid).toBe(false);
      expect(
        errors.some((e) => e.includes("targetWeight so e permitido")),
      ).toBe(true);
    });

    it("rejeita targetWeight negativo", () => {
      const { valid, errors } = validateDietPayload({
        ...validBase,
        targetWeight: -1,
      });

      expect(valid).toBe(false);
      expect(errors.some((e) => e.includes("positivo"))).toBe(true);
    });
  });
});
