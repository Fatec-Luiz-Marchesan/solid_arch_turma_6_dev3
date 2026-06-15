const UploadModel = require('../models/UploadModel');

class UploadMongoRepository {
  async create(data) {
    const upload = new UploadModel(data);
    await upload.save();
    return upload.toObject();
  }
}

module.exports = UploadMongoRepository;