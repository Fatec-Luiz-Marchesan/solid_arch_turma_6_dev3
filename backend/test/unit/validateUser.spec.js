const {
  validateUserPayload,
  isStrongPassword,
  isValidBRPhone,
} = require("../../src/interface/helpers/validateUser");

describe("isStrongPassword", () => {
  it("aceita senha forte", () => {
    expect(isStrongPassword("Senha123")).toBe(true);
    expect(isStrongPassword("MyP4ssword!")).toBe(true);
  });

  it("rejeita senha sem maiúscula", () => {
    expect(isStrongPassword("senha123")).toBe(false);
  });

  it("rejeita senha sem número", () => {
    expect(isStrongPassword("SenhaSemNum")).toBe(false);
  });

  it("rejeita senha curta", () => {
    expect(isStrongPassword("Ab1")).toBe(false);
  });

  it("rejeita senha nula", () => {
    expect(isStrongPassword(null)).toBe(false);
  });
});

describe("isValidBRPhone", () => {
  it("aceita celular com 9 dígitos", () => {
    expect(isValidBRPhone("(11) 99999-9999")).toBe(true);
  });

  it("aceita fixo com 8 dígitos", () => {
    expect(isValidBRPhone("(11) 3333-3333")).toBe(true);
  });

  it("rejeita formato sem parênteses", () => {
    expect(isValidBRPhone("11 99999-9999")).toBe(false);
  });

  it("rejeita formato sem traço", () => {
    expect(isValidBRPhone("(11) 999999999")).toBe(false);
  });
});

describe("validateUserPayload — create", () => {
  const validPayload = {
    name: "João Pedro",
    email: "joao@test.com",
    password: "Senha123",
  };

  it("aceita payload válido", () => {
    const { valid } = validateUserPayload(validPayload);
    expect(valid).toBe(true);
  });

  it("aceita com phoneNumber válido", () => {
    const { valid, data } = validateUserPayload({
      ...validPayload,
      phoneNumber: "(11) 99999-8888",
    });
    expect(valid).toBe(true);
    expect(data.phoneNumber).toBe("(11) 99999-8888");
  });

  it("rejeita password fraca", () => {
    const { valid, errors } = validateUserPayload({
      ...validPayload,
      password: "123456",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("password"))).toBe(true);
  });

  it("rejeita email inválido", () => {
    const { valid, errors } = validateUserPayload({
      ...validPayload,
      email: "nao-e-email",
    });
    expect(valid).toBe(false);
    expect(errors).toContain("email inválido ou ausente");
  });

  it("rejeita phoneNumber em formato errado", () => {
    const { valid, errors } = validateUserPayload({
      ...validPayload,
      phoneNumber: "11999998888",
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("phoneNumber"))).toBe(true);
  });
});
