class ListNotificationsUseCase {
  constructor({ notificationRepository }) {
    if (!notificationRepository)
      throw new Error("notificationRepository é obrigatório");
    this.notificationRepository = notificationRepository;
  }

  async execute({ userId, onlyUnread = false, page = 1, limit = 20 }) {
    if (!userId) throw new Error("userId é obrigatório");
    if (limit < 1 || limit > 100)
      throw new Error("limit deve estar entre 1 e 100");

    return this.notificationRepository.findByUserId({
      userId,
      onlyUnread,
      page,
      limit,
    });
  }
}

module.exports = ListNotificationsUseCase;