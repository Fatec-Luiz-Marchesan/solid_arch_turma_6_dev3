const VALID_METHODS = ["credit_card", "debit_card", "pix", "boleto"];
class CreatePaymentUseCase {
  constructor({ paymentRepository }) {
    if (!paymentRepository) throw new Error("paymentRepository e obrigatorio");
    this.paymentRepository = paymentRepository;
  }
  async execute({ userId, amount, method, reference }) {
    if (!userId) throw new Error("userId e obrigatorio");
    if (!amount || amount <= 0) throw new Error("amount deve ser maior que zero");
    if (!VALID_METHODS.includes(method)) throw new Error("method invalido");
    return this.paymentRepository.create({ userId, amount, method, reference, status: "pending" });
  }
}
module.exports = { CreatePaymentUseCase };
