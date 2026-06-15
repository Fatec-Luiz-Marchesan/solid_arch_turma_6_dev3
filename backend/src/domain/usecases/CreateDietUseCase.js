const Diet = require("../entities/Diet");

class CreateDietUseCase {
  constructor({ dietRepository }) {
    if (!dietRepository) throw new Error("dietRepository e obrigatorio");
    this.dietRepository = dietRepository;
  }

  async execute(input) {
    const diet = new Diet(input);
    return this.dietRepository.create(diet);
  }
}

class GetActiveDietForPetUseCase {
  constructor({ dietRepository }) {
    if (!dietRepository) throw new Error("dietRepository e obrigatorio");
    this.dietRepository = dietRepository;
  }

  async execute(petId) {
    if (!petId) throw new Error("petId e obrigatorio");
    const diets = await this.dietRepository.findByPetId(petId);
    return diets.find((d) => d.isActive()) || null;
  }
}

class ListDietsUseCase {
  constructor({ dietRepository }) {
    if (!dietRepository) throw new Error("dietRepository e obrigatorio");
    this.dietRepository = dietRepository;
  }

  async execute({ petId, type, page = 1, limit = 20 } = {}) {
    if (limit < 1 || limit > 100)
      throw new Error("limit deve estar entre 1 e 100");
    return this.dietRepository.findAll({ petId, type, page, limit });
  }
}

class UpdateDietUseCase {
  constructor({ dietRepository }) {
    if (!dietRepository) throw new Error("dietRepository e obrigatorio");
    this.dietRepository = dietRepository;
  }

  async execute({ id, ...changes }) {
    if (!id) throw new Error("id e obrigatorio");
    const existing = await this.dietRepository.findById(id);
    if (!existing) return null;
    const merged = new Diet({ ...existing, ...changes });
    return this.dietRepository.update(id, merged);
  }
}

module.exports = {
  CreateDietUseCase,
  GetActiveDietForPetUseCase,
  ListDietsUseCase,
  UpdateDietUseCase,
};
