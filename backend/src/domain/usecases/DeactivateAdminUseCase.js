class DeactivateAdminUseCase {
  constructor({ adminRepository }) {
    if (!adminRepository) throw new Error("adminRepository e obrigatorio");
    this.adminRepository = adminRepository;
  }
  async execute(id) {
    if (!id) throw new Error("id é obrigatório");
    const existing = await this.adminRepository.findById(id);
    if (!existing) return null;
    if (!existing.isActive) throw new Error("Admin já está inativo");
    return this.adminRepository.update(id, { isActive: false });
  }
}
module.exports = DeactivateAdminUseCase;
