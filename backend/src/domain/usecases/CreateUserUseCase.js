const User = require("../entities/User");
class CreateUserUseCase {
  constructor({ userRepository, hashGateway }) {
    if (!userRepository) throw new Error("userRepository é obrigatório");
    if (!hashGateway) throw new Error("hashGateway é obrigatório");
    this.userRepository = userRepository; this.hashGateway = hashGateway;
  }
  async execute(input) {
    const user = new User(input);
    const existing = await this.userRepository.findByEmail(user.email);
    if (existing) throw new Error("Email já existe");
    const hashed = await this.hashGateway.hash(user.password);
    const saved = await this.userRepository.create({ name: user.name, email: user.email, password: hashed, phoneNumber: user.phoneNumber, image: user.image });
    delete saved.password; return saved;
  }
}
module.exports = CreateUserUseCase;
