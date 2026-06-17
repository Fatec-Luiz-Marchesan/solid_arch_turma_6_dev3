class CreateSettingsUseCase {
  constructor(settingsRepository) { if (!settingsRepository) throw new Error("settingsRepository e obrigatorio"); this.settingsRepository = settingsRepository; }
  async execute(input) { return this.settingsRepository.create(input); }
}
module.exports = CreateSettingsUseCase;
