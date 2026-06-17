const {
  validateLocationPayload,
  validateNearbyQuery,
} = require("../../src/interface/helpers/validateLocation");

describe("validateLocationPayload", () => {
  const validBase = {
    name: "Parque",
    latitude: -23.5,
    longitude: -46.6,
    type: "event",
    referenceId: "ref-1",
  };

  it("aceita payload valido minimo", () => {
    const { valid, errors, data } = validateLocationPayload(validBase);
    expect(valid).toBe(true);
    expect(errors).toEqual([]);
    expect(data.name).toBe("Parque");
  });

  it("aceita com address opcional", () => {
    const { valid, data } = validateLocationPayload({
      ...validBase,
      address: "Av. Paulista, 1000",
    });
    expect(valid).toBe(true);
    expect(data.address).toBe("Av. Paulista, 1000");
  });

  it("aceita lat/lng como string numerica", () => {
    const { valid, data } = validateLocationPayload({
      ...validBase,
      latitude: "-23.5",
      longitude: "-46.6",
    });
    expect(valid).toBe(true);
    expect(data.latitude).toBe(-23.5);
    expect(data.longitude).toBe(-46.6);
  });

  it("trim no name", () => {
    const { data } = validateLocationPayload({
      ...validBase,
      name: " Parque ",
    });
    expect(data.name).toBe("Parque");
  });

  it("rejeita name vazio", () => {
    const { valid, errors } = validateLocationPayload({
      ...validBase,
      name: "",
    });
    expect(valid).toBe(false);
    expect(errors).toContain("name e obrigatorio (min 2 caracteres)");
  });

  it("rejeita name acima de 100 caracteres", () => {
    const { valid, errors } = validateLocationPayload({
      ...validBase,
      name: "x".repeat(101),
    });
    expect(valid).toBe(false);
    expect(errors).toContain("name nao pode passar de 100 caracteres");
  });

  it("rejeita latitude acima de 90", () => {
    const { valid, errors } = validateLocationPayload({
      ...validBase,
      latitude: 91,
    });
    expect(valid).toBe(false);
    expect(errors).toContain("latitude deve estar entre -90 e 90");
  });

  it("rejeita latitude abaixo de -90", () => {
    const { valid } = validateLocationPayload({ ...validBase, latitude: -91 });
    expect(valid).toBe(false);
  });

  it("rejeita latitude nao numerica", () => {
    const { valid } = validateLocationPayload({
      ...validBase,
      latitude: "abc",
    });
    expect(valid).toBe(false);
  });

  it("rejeita longitude acima de 180", () => {
    const { valid, errors } = validateLocationPayload({
      ...validBase,
      longitude: 181,
    });
    expect(valid).toBe(false);
    expect(errors).toContain("longitude deve estar entre -180 e 180");
  });

  it("rejeita longitude abaixo de -180", () => {
    const { valid } = validateLocationPayload({
      ...validBase,
      longitude: -181,
    });
    expect(valid).toBe(false);
  });

  it("rejeita type invalido", () => {
    const { valid, errors } = validateLocationPayload({
      ...validBase,
      type: "restaurante",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("type invalido"))).toBe(true);
  });

  it("rejeita sem referenceId", () => {
    const { referenceId, ...sem } = validBase;
    const { valid, errors } = validateLocationPayload(sem);
    expect(valid).toBe(false);
    expect(errors).toContain("referenceId e obrigatorio");
  });

  it("reporta multiplos erros simultaneamente", () => {
    const { valid, errors } = validateLocationPayload({
      name: "",
      latitude: 999,
      longitude: -999,
      type: "inexistente",
    });
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});

describe("validateNearbyQuery", () => {
  it("aceita query valida com radius padrao", () => {
    const { valid, data } = validateNearbyQuery({ lat: "-23.5", lng: "-46.6" });
    expect(valid).toBe(true);
    expect(data.latitude).toBe(-23.5);
    expect(data.longitude).toBe(-46.6);
    expect(data.radiusKm).toBe(5);
  });

  it("parseia radius customizado", () => {
    const { valid, data } = validateNearbyQuery({
      lat: "0",
      lng: "0",
      radius: "15",
    });
    expect(valid).toBe(true);
    expect(data.radiusKm).toBe(15);
  });

  it("filtra por type", () => {
    const { valid, data } = validateNearbyQuery({
      lat: "0",
      lng: "0",
      type: "clinic",
    });
    expect(valid).toBe(true);
    expect(data.type).toBe("clinic");
  });

  it("rejeita type invalido", () => {
    const { valid, errors } = validateNearbyQuery({
      lat: "0",
      lng: "0",
      type: "invalido",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("type invalido"))).toBe(true);
  });

  it("rejeita lat ausente", () => {
    const { valid, errors } = validateNearbyQuery({ lng: "0" });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("lat"))).toBe(true);
  });

  it("rejeita radius zero", () => {
    const { valid } = validateNearbyQuery({ lat: "0", lng: "0", radius: "0" });
    expect(valid).toBe(false);
  });

  it("rejeita radius maior que 100", () => {
    const { valid, errors } = validateNearbyQuery({
      lat: "0",
      lng: "0",
      radius: "150",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("entre 0 e 100"))).toBe(true);
  });
});
