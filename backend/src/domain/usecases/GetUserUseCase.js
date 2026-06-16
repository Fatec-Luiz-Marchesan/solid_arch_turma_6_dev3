class GetUserUseCase {
  constructor({ userRepository }) {
    if (!userRepository) throw new Error("userRepository e obrigatorio");
    this.userRepository = userRepository;
  }

  async execute(id) {
    if (!id) throw new Error("id e obrigatorio");
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    delete user.password;
    return user;
  }
}

module.exports = GetUserUseCase;
