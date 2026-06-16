const INotificationGateway = require('../../../domain/ports/INotificationGateway');

class SocketNotificationAdapter extends INotificationGateway {
  constructor(io) {
    super();
    if (!io) throw new Error('SocketNotificationAdapter requer instancia de io');
    this.io = io;
  }

  emit(channel, payload) {
    this.io.emit(channel, payload);
  }

  emitToUser(userId, event, payload) {
    this.io.to(`user:${userId}`).emit(event, payload);
  }
}

module.exports = SocketNotificationAdapter;