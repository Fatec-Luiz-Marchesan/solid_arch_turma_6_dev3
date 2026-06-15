const { validateDietPayload } = require("../helpers/validateDiet");

class DietController {
  constructor({
    createDietUseCase,
    listDietsUseCase,
    getActiveDietForPetUseCase,
    updateDietUseCase,
  }) {
    this.createDietUseCase = createDietUseCase;
    this.listDietsUseCase = listDietsUseCase;
    this.getActiveDietForPetUseCase = getActiveDietForPetUseCase;
    this.updateDietUseCase = updateDietUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateDietPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    try {
      const diet = await this.createDietUseCase.execute(data);
      return res.status(201).json(diet);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req, res) {
    try {
      const result = await this.listDietsUseCase.execute({
        petId: req.query.petId,
        type: req.query.type,
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getActiveForPet(req, res) {
    try {
      const diet = await this.getActiveDietForPetUseCase.execute(
        req.params.petId,
      );
      if (!diet)
        return res
          .status(404)
          .json({ error: "Nenhuma dieta ativa para este pet" });
      return res.json(diet);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    const { valid, errors, data } = validateDietPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    try {
      const updated = await this.updateDietUseCase.execute({
        id: req.params.id,
        ...data,
      });
      if (!updated)
        return res.status(404).json({ error: "Dieta nao encontrada" });
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = DietController;
