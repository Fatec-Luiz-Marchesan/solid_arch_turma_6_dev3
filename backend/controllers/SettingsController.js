const { validateSettingsPayload } = require("../helpers/validateSettings");
class SettingsController {
  constructor({ createOrUpdateSettingsUseCase, getSettingsUseCase }) {
    this.createOrUpdateSettingsUseCase = createOrUpdateSettingsUseCase;
    this.getSettingsUseCase = getSettingsUseCase;
  }
  async upsert(req, res) {
    const { valid, errors, data } = validateSettingsPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    try {
      const settings = await this.createOrUpdateSettingsUseCase.execute(data);
      return res.status(200).json(settings);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  async getByUser(req, res) {
    try {
      const settings = await this.getSettingsUseCase.execute(req.params.userId);
      if (!settings)
        return res.status(404).json({ error: "Settings nao encontradas" });
      return res.json(settings);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
module.exports = SettingsController;
