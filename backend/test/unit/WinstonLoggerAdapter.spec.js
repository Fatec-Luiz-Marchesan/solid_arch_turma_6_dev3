const WinstonLoggerAdapter = require("../../src/infrastructure/adapters/logger/WinstonLoggerAdapter");

describe("WinstonLoggerAdapter", () => {
  let winstonMock;
  let adapter;

  beforeEach(() => {
    winstonMock = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    adapter = new WinstonLoggerAdapter(winstonMock);
  });

  it("delega info para winston.info com meta", () => {
    adapter.info("Mensagem de info", { userId: "u1" });
    expect(winstonMock.info).toHaveBeenCalledWith("Mensagem de info", {
      userId: "u1",
    });
  });

  it("delega warn para winston.warn", () => {
    adapter.warn("Aviso de seguranca", { ip: "1.2.3.4" });
    expect(winstonMock.warn).toHaveBeenCalledWith("Aviso de seguranca", {
      ip: "1.2.3.4",
    });
  });

  it("extrai stack trace quando error e instancia de Error", () => {
    const err = new Error("Falha critica");
    adapter.error("Erro inesperado", err);
    expect(winstonMock.error).toHaveBeenCalledWith("Erro inesperado", {
      errorMessage: "Falha critica",
      stack: expect.stringContaining("Error: Falha critica"),
    });
  });

  it("trata meta como objeto quando error nao e instancia de Error", () => {
    adapter.error("Erro customizado", { code: "DB_TIMEOUT" });
    expect(winstonMock.error).toHaveBeenCalledWith("Erro customizado", {
      code: "DB_TIMEOUT",
    });
  });

  it("lanca erro sem instancia Winston", () => {
    expect(() => new WinstonLoggerAdapter(null)).toThrow(
      "WinstonLoggerAdapter requer instancia do Winston",
    );
  });
});
