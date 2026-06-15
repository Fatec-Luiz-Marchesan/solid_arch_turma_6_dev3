class Settings {
  static SUPPORTED_LANGUAGES = ["pt-BR"];

  static SUPPORTED_THEMES = ["light", "dark", "system"];

  constructor({
    id,
    userId,
    language = "pt-BR",
    theme = "system",
    notifications = true,
    timezone = "America/Sao_Paulo",
    updatedAt,
  }) {
    if (!userId) {
      throw new Error("Settings.userId é obrigatório");
    }

    if (!Settings.SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error(
        `Settings.language inválido. Aceitos: ${Settings.SUPPORTED_LANGUAGES.join(", ")}`,
      );
    }

    if (!Settings.SUPPORTED_THEMES.includes(theme)) {
      throw new Error(
        `Settings.theme inválido. Aceitos: ${Settings.SUPPORTED_THEMES.join(", ")}`,
      );
    }

    if (typeof notifications !== "boolean") {
      throw new Error("Settings.notifications deve ser boolean");
    }

    if (!timezone) {
      throw new Error("Settings.timezone é obrigatório");
    }

    this.id = id;
    this.userId = userId;
    this.language = language;
    this.theme = theme;
    this.notifications = notifications;
    this.timezone = timezone;
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = Settings;
