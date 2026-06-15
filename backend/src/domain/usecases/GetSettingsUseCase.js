class GetSettingsUseCase {
  constructor({ settingsRepository }) {
    if (!settingsRepository) {
      throw new Error("settingsRepository e obrigatorio");
    }
    this.settingsRepository = settingsRepository;
  }
  async execute(userId) {
    if (!userId) {
      throw new Error("userId e obrigatorio para buscar as configuracoes");
    }

    return this.settingsRepository.findByUserId(userId);
  }
}

module.exports = GetSettingsUseCase;
