const User = require("../../src/domain/entities/User");

describe("Entidade User", () => {
  const validInput = {
    name: "Joao Silva",
    email: "joao@test.com",
    password: "senha123",
  };

  it("cria user valido", () => {
    const u = new User(validInput);
    expect(u.name).toBe("Joao Silva");
    expect(u.email).toBe("joao@test.com");
  });

  it("aceita phoneNumber valido", () => {
    const u = new User({ ...validInput, phoneNumber: "(11) 99999-8888" });
    expect(u.phoneNumber).toBe("(11) 99999-8888");
  });

  it("rejeita name muito curto", () => {
    expect(() => new User({ ...validInput, name: "A" })).toThrow(
      "min 2 caracteres",
    );
  });

  it("rejeita email invalido", () => {
    expect(() => new User({ ...validInput, email: "nao-e-email" })).toThrow(
      "User.email invalido",
    );
  });

  it("rejeita password curta", () => {
    expect(() => new User({ ...validInput, password: "123" })).toThrow(
      "min 6 caracteres",
    );
  });

  it("rejeita phoneNumber em formato errado", () => {
    expect(
      () => new User({ ...validInput, phoneNumber: "11999998888" }),
    ).toThrow("phoneNumber invalido");
  });

  it("email e armazenado em lowercase", () => {
    const u = new User({ ...validInput, email: "JOAO@TEST.COM" });
    expect(u.email).toBe("joao@test.com");
  });
});
