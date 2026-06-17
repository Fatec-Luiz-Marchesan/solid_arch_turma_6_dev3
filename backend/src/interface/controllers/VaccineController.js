const { validateVaccinePayload } = require("../helpers/validateVaccine");

class VaccineController {
  constructor({ createVaccineUseCase, getVaccineStatusUseCase }) {
    this.createVaccineUseCase = createVaccineUseCase;
    this.getVaccineStatusUseCase = getVaccineStatusUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateVaccinePayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    try {
      const vaccine = await this.createVaccineUseCase.execute(data);
      return res.status(201).json(vaccine);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getStatusForPet(req, res) {
    try {
      const status = await this.getVaccineStatusUseCase.execute(
        req.params.petId,
      );
      return res.json(status);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = VaccineController;
