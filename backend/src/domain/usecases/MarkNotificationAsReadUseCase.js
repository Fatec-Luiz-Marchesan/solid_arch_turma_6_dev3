class MarkNotificationAsReadUseCase {
  constructor({ notificationRepository }) {
    if (!notificationRepository)
      throw new Error("notificationRepository é obrigatório");
    this.notificationRepository = notificationRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id é obrigatório");

    const notification = await this.notificationRepository.findById(id);
    if (!notification) throw new Error("Notificação não encontrada");
    if (notification.userId !== userId) {
      throw new Error(
        "Você não tem permissão para marcar esta notificação como lida",
      );
    }

    notification.markAsRead();
    return this.notificationRepository.update(id, { isRead: true });
  }
}
