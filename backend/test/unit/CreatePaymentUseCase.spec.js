const {
  CreatePaymentUseCase,
} = require("../../models/CreatePaymentUseCase.js");
describe("CreatePaymentUseCase", () => {
  let paymentRepository, usecase;
  const validInput = {
    userId: "u1",
    amount: 149.9,
    method: "pix",
    reference: "ref-1",
  };
  beforeEach(() => {
    paymentRepository = {
      create: jest
        .fn()
        .mockImplementation(async (p) => ({ id: "pay-1", ...p })),
    };
    usecase = new CreatePaymentUseCase({ paymentRepository });
  });
  it("cria pagamento valido com status pending", async () => {
    const result = await usecase.execute(validInput);
    expect(result.id).toBe("pay-1");
    expect(result.status).toBe("pending");
  });
  it("chama repository.create uma vez com dados corretos", async () => {
    await usecase.execute(validInput);
    expect(paymentRepository.create).toHaveBeenCalledTimes(1);
    expect(paymentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", amount: 149.9, method: "pix" }),
    );
  });
  it("aceita todos os metodos de pagamento validos", async () => {
    for (const method of ["credit_card", "debit_card", "pix", "boleto"]) {
      await expect(
        usecase.execute({ ...validInput, method }),
      ).resolves.toBeDefined();
    }
  });
  it("rejeita amount zero", async () => {
    await expect(
      usecase.execute({ ...validInput, amount: 0 }),
    ).rejects.toThrow();
    expect(paymentRepository.create).not.toHaveBeenCalled();
  });
  it("rejeita amount negativo", async () => {
    await expect(
      usecase.execute({ ...validInput, amount: -50 }),
    ).rejects.toThrow();
  });
  it("rejeita method invalido", async () => {
    await expect(
      usecase.execute({ ...validInput, method: "cripto" }),
    ).rejects.toThrow("method invalido");
  });
  it("rejeita userId ausente", async () => {
    const { userId, ...sem } = validInput;
    await expect(usecase.execute(sem)).rejects.toThrow("userId e obrigatorio");
  });
  it("lanca erro sem paymentRepository", () => {
    expect(() => new CreatePaymentUseCase({})).toThrow(
      "paymentRepository e obrigatorio",
    );
  });
});
