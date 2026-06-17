const Notification = require("../entities/Notification");

class CreateNotificationUseCase {
  constructor({ notificationRepository }) {
    if (!notificationRepository)
      throw new Error("notificationRepository é obrigatório");
    this.notificationRepository = notificationRepository;
  }

  async execute({ userId, type, title, message, metadata }) {
    const n = new Notification({ userId, type, title, message, metadata });
    return this.notificationRepository.create({
      userId: n.userId, type: n.type, title: n.title,
      message: n.message, isRead: n.isRead,
      metadata: n.metadata, createdAt: n.createdAt,
    });
  }
}

module.exports = CreateNotificationUseCase;