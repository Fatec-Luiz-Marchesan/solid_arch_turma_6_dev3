class UpdateAdoptionUseCase {
  constructor({ adoptionRepository }) { if (!adoptionRepository) throw new Error("adoptionRepository e obrigatorio"); this.adoptionRepository = adoptionRepository; }
  async execute({ id, ...changes }) {
    if (!id) throw new Error("id e obrigatorio");
    const existing = await this.adoptionRepository.findById(id);
    if (!existing) return null;
    return this.adoptionRepository.update(id, { ...existing, ...changes });
  }
}
module.exports = UpdateAdoptionUseCase;
