class GetAdoptionUseCase {
  constructor({ adoptionRepository }) { if (!adoptionRepository) throw new Error("adoptionRepository e obrigatorio"); this.adoptionRepository = adoptionRepository; }
  async findById(id) { if (!id) throw new Error("id e obrigatorio"); return this.adoptionRepository.findById(id); }
  async findByAdopter(adopterId) { if (!adopterId) throw new Error("adopterId e obrigatorio"); return this.adoptionRepository.findByAdopter(adopterId); }
  async findByPetId(petId) { if (!petId) throw new Error("petId e obrigatorio"); return this.adoptionRepository.findByPetId(petId); }
}
module.exports = GetAdoptionUseCase;
