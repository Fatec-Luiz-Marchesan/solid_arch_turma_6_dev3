const Adoption = require("../entities/Adoption");

class CreateAdoptionUseCase {
  constructor({ adoptionRepository, logger }) {
    if (!adoptionRepository) throw new Error("adoptionRepository e obrigatorio");
    if (!logger) throw new Error("logger e obrigatorio");
    this.adoptionRepository = adoptionRepository;
    this.logger = logger;
  }
  async execute({ petId, adopterId, notes }) {
    this.logger.info("Iniciando criacao de adocao", { petId, adopterId });
    try {
      const existing = await this.adoptionRepository.findByPetId(petId);
      if (existing) {
        this.logger.warn("Tentativa de adotar pet ja adotado", { petId, adopterId });
        throw new Error("Este pet ja foi adotado");
      }
      const adoption = new Adoption({ petId, adopterId, notes });
      const saved = await this.adoptionRepository.create({
        petId: adoption.petId, adopterId: adoption.adopterId,
        notes: adoption.notes, status: adoption.status, createdAt: adoption.createdAt,
      });
      this.logger.info("Adocao criada com sucesso", { adoptionId: saved.id, petId: saved.petId, adopterId: saved.adopterId });
      return saved;
    } catch (err) {
      if (err.message !== "Este pet ja foi adotado") this.logger.error("Erro ao criar adocao", err);
      throw err;
    }
  }
}
module.exports = CreateAdoptionUseCase;
