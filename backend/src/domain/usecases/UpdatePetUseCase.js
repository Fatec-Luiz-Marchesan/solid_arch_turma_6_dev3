class UpdatePetUseCase {
  constructor({ petRepository }) {
    if (!petRepository) throw new Error("petRepository e obrigatorio");
    this.petRepository = petRepository;
  }
  async execute({ id, ...changes }) {
    if (!id) throw new Error("id e obrigatorio");
    const existing = await this.petRepository.findById(id);
    if (!existing) return null;
    if (changes.name !== undefined && changes.name.trim().length < 2)
      throw new Error("name deve ter pelo menos 2 caracteres");
    return this.petRepository.update(id, changes);
  }
}
module.exports = UpdatePetUseCase;