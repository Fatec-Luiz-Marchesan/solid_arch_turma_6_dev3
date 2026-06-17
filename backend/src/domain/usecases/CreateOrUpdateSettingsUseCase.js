const Settings = require("../entities/Settings");

class CreateOrUpdateSettingsUseCase {
  constructor({ settingsRepository }) {
    if (!settingsRepository) throw new Error("settingsRepository e obrigatorio");
    this.settingsRepository = settingsRepository;
  }

  async execute(input) {
    const settings = new Settings(input);
    const plain = {
      userId: settings.userId,
      language: settings.language,
      theme: settings.theme,
      notifications: settings.notifications,
      timezone: settings.timezone,
      updatedAt: settings.updatedAt,
    };
    const existing = await this.settingsRepository.findByUserId(settings.userId);
    if (existing) return this.settingsRepository.update(existing.id, plain);
    return this.settingsRepository.create(plain);
  }
}

module.exports = CreateOrUpdateSettingsUseCase;
