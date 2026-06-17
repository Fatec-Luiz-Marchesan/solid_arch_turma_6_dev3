class UpdateSettingsUseCase {
  constructor(settingsRepository) {
    if (!settingsRepository) throw new Error("settingsRepository e obrigatorio");
    this.settingsRepository = settingsRepository;
  }
  async execute(input) {
    if (!input || !input.userId) throw new Error("userId e obrigatorio");
    return this.settingsRepository.update(input);
  }
}
module.exports = UpdateSettingsUseCase;