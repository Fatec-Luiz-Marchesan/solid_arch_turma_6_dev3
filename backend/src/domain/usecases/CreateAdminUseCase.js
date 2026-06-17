const VALID_ROLES = ["admin", "superadmin"];
class CreateAdminUseCase {
  constructor({ adminRepository, hashGateway }) {
    if (!adminRepository) throw new Error("adminRepository e obrigatorio");
    if (!hashGateway) throw new Error("hashGateway e obrigatorio");
    this.adminRepository = adminRepository; this.hashGateway = hashGateway;
  }
  async execute({ name, email, password, role }) {
    if (!name || name.trim().length < 2) throw new Error("name e obrigatorio");
    if (!email) throw new Error("email e obrigatorio");
    if (!password) throw new Error("password e obrigatorio");
    if (!VALID_ROLES.includes(role)) throw new Error(`role inválida. Aceitas: ${VALID_ROLES.join(", ")}`);
    const existing = await this.adminRepository.findByEmail(email);
    if (existing) throw new Error("Admin já existe");
    const hashed = await this.hashGateway.hash(password);
    return this.adminRepository.create({ name, email, password: hashed, role });
  }
}
module.exports = CreateAdminUseCase;
