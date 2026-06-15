class ISettingsRepository {
  async findByUserId(userId) {
    throw new Error("Método findByUserId() deve ser implementado.");
  }

  async create(settings) {
    throw new Error("Método create() deve ser implementado.");
  }

  async update(id, settings) {
    throw new Error("Método update() deve ser implementado.");
  }
}

module.exports = ISettingsRepository;
