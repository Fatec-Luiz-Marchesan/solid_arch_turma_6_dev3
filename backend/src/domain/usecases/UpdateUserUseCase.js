class UpdateUserUseCase {
  constructor({ userRepository, hashGateway }) {
    if (!userRepository) throw new Error("userRepository é obrigatório");
    if (!hashGateway) throw new Error("hashGateway é obrigatório");
    this.userRepository = userRepository; this.hashGateway = hashGateway;
  }
  async execute({ id, ...changes }) {
    if (!id) throw new Error("id é obrigatório");
    const existing = await this.userRepository.findById(id);
    if (!existing) return null;
    if (changes.password) changes.password = await this.hashGateway.hash(changes.password);
    const updated = await this.userRepository.update(id, changes);
    delete updated.password; return updated;
  }
}
module.exports = UpdateUserUseCase;
