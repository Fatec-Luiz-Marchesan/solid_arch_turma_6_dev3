const { validateProfilePayload } = require("../helpers/validateProfile");

class ProfileController {
  constructor({
    createProfileUseCase,
    updateProfileUseCase,
    getProfileUseCase,
    deleteProfileUseCase,
  }) {
    this.createProfileUseCase = createProfileUseCase;
    this.updateProfileUseCase = updateProfileUseCase;
    this.getProfileUseCase = getProfileUseCase;
    this.deleteProfileUseCase = deleteProfileUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateProfilePayload(req.body, false);
    if (!valid) return res.status(400).json({ errors });
    try {
      const profile = await this.createProfileUseCase.execute(data);
      return res.status(201).json(profile);
    } catch (err) {
      const code = err.message.includes("ja existe") ? 409 : 400;
      return res.status(code).json({ error: err.message });
    }
  }

  async update(req, res) {
    const { valid, errors, data } = validateProfilePayload(req.body, true);
    if (!valid) return res.status(400).json({ errors });
    try {
      const updated = await this.updateProfileUseCase.execute({
        userId: req.params.userId,
        ...data,
      });
      if (!updated)
        return res.status(404).json({ error: "Profile nao encontrado" });
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getByUser(req, res) {
    const profile = await this.getProfileUseCase.execute(req.params.userId);
    if (!profile)
      return res.status(404).json({ error: "Profile nao encontrado" });
    return res.json(profile);
  }
}

module.exports = ProfileController;
