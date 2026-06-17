const NotificationModel = require("../database/mongoose/models/NotificationModel");

class NotificationMongoRepository {
  async create(data) {
    const doc = await NotificationModel.create(data);
    return this._toPlain(doc);
  }

  async findById(id) {
    const doc = await NotificationModel.findById(id);
    return doc ? this._toPlain(doc) : null;
  }

  async findByUserId({ userId, onlyUnread = false, page = 1, limit = 20 }) {
    const query = { userId };
    if (onlyUnread) query.isRead = false;
    const docs = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return docs.map((d) => this._toPlain(d));
  }

  async update(id, data) {
    const doc = await NotificationModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this._toPlain(doc) : null;
  }

  _toPlain(doc) {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      type: doc.type,
      title: doc.title,
      message: doc.message,
      isRead: doc.isRead,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
    };
  }
}

module.exports = NotificationMongoRepository;