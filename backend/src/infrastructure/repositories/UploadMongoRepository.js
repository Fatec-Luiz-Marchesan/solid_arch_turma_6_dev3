const UploadModel = require("../database/mongoose/models/UploadModel");

class UploadMongoRepository {
  async create(data) {
    return UploadModel.create(data);
  }

  async findByOwner(ownerId) {
    return UploadModel.find({ ownerId });
  }

  async delete(id) {
    return UploadModel.findByIdAndDelete(id);
  }
}

module.exports = UploadMongoReposito;
