class CreateBreedUseCase {
  constructor({ breedRepository }) { if (!breedRepository) throw new Error("breedRepository e obrigatorio"); this.breedRepository = breedRepository; }
  async execute(data) { return this.breedRepository.create(data); }
}
class ListBreedsUseCase {
  constructor({ breedRepository }) { if (!breedRepository) throw new Error("breedRepository e obrigatorio"); this.breedRepository = breedRepository; }
  async execute(filters = {}) { return this.breedRepository.findAll(filters); }
}
class GetBreedUseCase {
  constructor({ breedRepository }) { if (!breedRepository) throw new Error("breedRepository e obrigatorio"); this.breedRepository = breedRepository; }
  async execute(id) { return this.breedRepository.findById(id); }
}
class UpdateBreedUseCase {
  constructor({ breedRepository }) { if (!breedRepository) throw new Error("breedRepository e obrigatorio"); this.breedRepository = breedRepository; }
  async execute({ id, ...data }) { return this.breedRepository.update(id, data); }
}
module.exports = { CreateBreedUseCase, ListBreedsUseCase, GetBreedUseCase, UpdateBreedUseCase };