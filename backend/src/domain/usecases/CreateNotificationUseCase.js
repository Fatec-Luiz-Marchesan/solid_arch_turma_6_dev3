const Notification = require("../entities/Notification");

class CreateNotificationUseCase {
  constructor({ notificationRepository }) {
    if (!notificationRepository)
      throw new Error("notificationRepository é obrigatório");
    this.notificationRepository = notificationRepository;
  }

  async execute({ userId, type, title, message, metadata }) {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      metadata,
    });
    return this.notificationRepository.create(notification);
  }
}
