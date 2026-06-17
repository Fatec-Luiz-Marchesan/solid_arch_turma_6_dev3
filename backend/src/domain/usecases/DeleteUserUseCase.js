class DeleteUserUseCase {
  constructor({ userRepository }) {
    if (!userRepository) throw new Error("userRepository é obrigatório");
    this.userRepository = userRepository;
  }
  async execute(id) {
    if (!id) throw new Error("id é obrigatório");
    const existing = await this.userRepository.findById(id);
    if (!existing) return false;
    await this.userRepository.delete(id); return true;
  }
}
module.exports = DeleteUserUseCase;
