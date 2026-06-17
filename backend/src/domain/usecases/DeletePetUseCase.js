class DeletePetUseCase {
  constructor({ petRepository }) { if (!petRepository) throw new Error("petRepository e obrigatorio"); this.petRepository = petRepository; }
  async execute(id) {
    if (!id) throw new Error("id e obrigatorio");
    const existing = await this.petRepository.findById(id);
    if (!existing) return false;
    if (existing.status === "adopted") throw new Error("pet ja foi adotado");
    await this.petRepository.delete(id); return true;
  }
}
module.exports = DeletePetUseCase;
