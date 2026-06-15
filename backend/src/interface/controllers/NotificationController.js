const { validateNotificationPayload } = require('../helpers/validateNotification');

class NotificationController {
  constructor({ createNotificationUseCase, markAsReadUseCase, listNotificationsUseCase }) {
    this.createNotificationUseCase = createNotificationUseCase;
    this.markAsReadUseCase = markAsReadUseCase;
    this.listNotificationsUseCase = listNotificationsUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateNotificationPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    try {
      const notif = await this.createNotificationUseCase.execute(data);
      return res.status(201).json(notif);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async listByUser(req, res) {
    try {
      const { onlyUnread, page, limit } = req.query;
      const result = await this.listNotificationsUseCase.execute({
        userId: req.params.userId,
        onlyUnread: onlyUnread === 'true',
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const updated = await this.markAsReadUseCase.execute({
        id: req.params.id,
        userId: req.body.userId,
      });
      return res.json(updated);
    } catch (err) {
      const code = err.message.includes('não encontrada') ? 404
                 : err.message.includes('permissão') ? 403 : 400;
      return res.status(code).json({ error: err.message });
    }
  }
}

module.exports = NotificationController;