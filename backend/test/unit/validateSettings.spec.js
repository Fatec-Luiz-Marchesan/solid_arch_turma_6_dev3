const validateSettings = require("../../src/interface/helpers/validateSettings");
describe("validateSettings helper", () => {
  it("deve lancar erro se userId nao for fornecido", () => {
    const payload = { theme: "dark", notifications: true };

    expect(() => validateSettings(payload)).toThrow("userId e obrigatorio");
  });

  it("deve lancar erro se notifications nao for booleano", () => {
    const payload = { userId: "abc123", notifications: "sim" };

    expect(() => validateSettings(payload)).toThrow(
      "notifications deve ser booleano",
    );
  });

  it("deve retornar true para payload valido", () => {
    const payload = { userId: "abc123", theme: "light", notifications: false };

    const result = validateSettings(payload);

    expect(result).toBe(true);
  });
});
