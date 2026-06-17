const Vaccine = require("../../src/domain/entities/Vaccine");

describe("Entidade Vaccine", () => {
  const validInput = {
    petId: "p1",
    vetId: "v1",
    type: "rabies",
    name: "Antirrabica",
    batchNumber: "LOT-001",
  };

  it("cria vacina valida com defaults", () => {
    const v = new Vaccine(validInput);
    expect(v.type).toBe("rabies");
    expect(v.name).toBe("Antirrabica");
    expect(v.appliedAt).toBeInstanceOf(Date);
    expect(v.nextDoseAt).toBeNull();
  });

  it("aceita todos os types validos", () => {
    for (const type of [
      "rabies",
      "distemper",
      "parvovirus",
      "leptospirosis",
      "hepatitis",
      "feline-leukemia",
      "other",
    ]) {
      expect(() => new Vaccine({ ...validInput, type })).not.toThrow();
    }
  });

  it("aceita manufacturer e notes opcionais", () => {
    const v = new Vaccine({
      ...validInput,
      manufacturer: "Zoetis",
      notes: "Sem reacao",
    });
    expect(v.manufacturer).toBe("Zoetis");
    expect(v.notes).toBe("Sem reacao");
  });

  it("rejeita sem petId", () => {
    const { petId, ...sem } = validInput;
    expect(() => new Vaccine(sem)).toThrow("petId e obrigatorio");
  });

  it("rejeita sem vetId", () => {
    const { vetId, ...sem } = validInput;
    expect(() => new Vaccine(sem)).toThrow("vetId e obrigatorio");
  });

  it("rejeita sem batchNumber", () => {
    const { batchNumber, ...sem } = validInput;
    expect(() => new Vaccine(sem)).toThrow("batchNumber e obrigatorio");
  });

  it("rejeita type invalido", () => {
    expect(() => new Vaccine({ ...validInput, type: "covid" })).toThrow(
      "type invalido",
    );
  });

  it("rejeita appliedAt no futuro", () => {
    const futuro = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    expect(() => new Vaccine({ ...validInput, appliedAt: futuro })).toThrow(
      "nao pode ser no futuro",
    );
  });

  it("rejeita appliedAt invalida", () => {
    expect(
      () => new Vaccine({ ...validInput, appliedAt: "nao-e-data" }),
    ).toThrow("data valida");
  });

  it("rejeita nextDoseAt anterior a appliedAt", () => {
    expect(
      () =>
        new Vaccine({
          ...validInput,
          appliedAt: "2025-06-01",
          nextDoseAt: "2025-01-01",
        }),
    ).toThrow("posterior a appliedAt");
  });

  describe("isOverdue()", () => {
    it("retorna false sem nextDoseAt", () => {
      const v = new Vaccine(validInput);
      expect(v.isOverdue()).toBe(false);
    });

    it("retorna true quando nextDoseAt ja passou", () => {
      const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const v = new Vaccine({
        ...validInput,
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextDoseAt: ontem,
      });
      expect(v.isOverdue()).toBe(true);
    });

    it("retorna false quando nextDoseAt e no futuro", () => {
      const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const v = new Vaccine({ ...validInput, nextDoseAt: amanha });
      expect(v.isOverdue()).toBe(false);
    });
  });

  describe("daysUntilNextDose()", () => {
    it("retorna null sem nextDoseAt", () => {
      expect(new Vaccine(validInput).daysUntilNextDose()).toBeNull();
    });

    it("retorna numero positivo para data futura", () => {
      const dias10 = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const v = new Vaccine({ ...validInput, nextDoseAt: dias10 });
      expect(v.daysUntilNextDose()).toBeGreaterThan(8);
      expect(v.daysUntilNextDose()).toBeLessThanOrEqual(10);
    });

    it("retorna numero negativo para data passada", () => {
      const v = new Vaccine({
        ...validInput,
        appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextDoseAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });
      expect(v.daysUntilNextDose()).toBeLessThan(0);
    });
  });
});
