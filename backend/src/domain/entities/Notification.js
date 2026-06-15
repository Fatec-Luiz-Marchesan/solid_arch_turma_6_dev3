class Notification {
  static VALID_TYPES = ["adoption", "message", "event", "system", "alert"];

  constructor({
    id,
    userId,
    type,
    title,
    message,
    isRead = false,
    metadata = {},
    createdAt,
  }) {
    if (!userId || typeof userId !== "string") {
      throw new Error("Notification.userId é obrigatório");
    }
    if (!Notification.VALID_TYPES.includes(type)) {
      throw new Error(
        `Notification.type inválido. Aceitos: ${Notification.VALID_TYPES.join(", ")}`,
      );
    }
    if (!title || title.trim().length < 3) {
      throw new Error(
        "Notification.title é obrigatório e deve ter mínimo 3 caracteres",
      );
    }
    if (!message || message.trim().length < 5) {
      throw new Error(
        "Notification.message é obrigatório e deve ter mínimo 5 caracteres",
      );
    }
    if (typeof isRead !== "boolean") {
      throw new Error("Notification.isRead deve ser boolean");
    }

    this.id = id;
    this.userId = userId;
    this.type = type;
    this.title = title.trim();
    this.message = message.trim();
    this.isRead = isRead;
    this.metadata = metadata;
    this.createdAt = createdAt || new Date();
  }

  markAsRead() {
    if (this.isRead) {
      throw new Error("Notificação já foi marcada como lida");
    }
    this.isRead = true;
    return this;
  }
}

module.exports = Notification;
