class Settings {
  static SUPPORTED_LANGUAGES = ["pt-BR"];
  static SUPPORTED_THEMES = ["light", "dark", "system"];

  constructor({
    id, userId, language = "pt-BR", theme = "system",
    notifications = true, timezone = "America/Sao_Paulo", updatedAt,
  }) {
    if (!userId) throw new Error("userId e obrigatorio");
    if (!Settings.SUPPORTED_LANGUAGES.includes(language)) throw new Error("language invalido");
    if (!Settings.SUPPORTED_THEMES.includes(theme)) throw new Error("theme invalido");
    if (typeof notifications !== "boolean") throw new Error("Settings.notifications deve ser boolean");
    if (!timezone) throw new Error("Settings.timezone e obrigatorio");

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
