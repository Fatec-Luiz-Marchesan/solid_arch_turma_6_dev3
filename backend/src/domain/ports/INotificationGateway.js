class INotificationGateway {
  emit(channel, payload) {
    throw new Error('INotificationGateway.emit must be implemented');
  }

  emitToUser(userId, event, payload) {
    throw new Error('INotificationGateway.emitToUser must be implemented');
  }
}

module.exports = INotificationGateway;