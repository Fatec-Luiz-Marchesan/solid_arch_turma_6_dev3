const Settings = require("../entities/Settings");

class CreateOrUpdateSettingsUseCase {
  constructor({ settingsRepository }) {
    if (!settingsRepository) {
      throw new Error("settingsRepository e obrigatorio");
    }
    this.settingsRepository = settingsRepository;
  }

  async execute(input) {
    const settings = new Settings(input);

    const existing = await this.settingsRepository.findByUserId(
      settings.userId,
    );

    if (existing) {
      return this.settingsRepository.update(existing.id, settings);
    }

    return this.settingsRepository.create(settings);
  }
}

module.exports = CreateOrUpdateSettingsUseCase;
