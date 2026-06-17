class GetPetUseCase {
  constructor({ petRepository }) { if (!petRepository) throw new Error("petRepository e obrigatorio"); this.petRepository = petRepository; }
  async findById(id) { if (!id) throw new Error("id e obrigatorio"); return this.petRepository.findById(id); }
  async findByOwner(ownerId) { if (!ownerId) throw new Error("ownerId e obrigatorio"); return this.petRepository.findByOwnerId(ownerId); }
}
module.exports = GetPetUseCase;
