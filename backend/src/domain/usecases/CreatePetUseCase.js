const VALID_SPECIES = ["dog", "cat", "bird", "rabbit", "other"];
class CreatePetUseCase {
  constructor({ petRepository }) { if (!petRepository) throw new Error("petRepository e obrigatorio"); this.petRepository = petRepository; }
  async execute({ name, species, age, ownerId, ...rest }) {
    if (!name || name.trim().length === 0) throw new Error("name e obrigatorio");
    if (!VALID_SPECIES.includes(species)) throw new Error(`species invalida. Aceitas: ${VALID_SPECIES.join(", ")}`);
    if (age < 0) throw new Error("age nao pode ser negativa");
    if (!ownerId) throw new Error("ownerId e obrigatorio");
    return this.petRepository.create({ name, species, age, ownerId, ...rest });
  }
}
module.exports = CreatePetUseCase;
