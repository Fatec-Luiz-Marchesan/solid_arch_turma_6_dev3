const UserModel = require("../database/mongoose/models/UserModel");
const IUserRepository = require("../../domain/repositories/IUserRepository");

class UserMongoRepository extends IUserRepository {
  async create(data) {
    const doc = await UserModel.create(data);
    return this._toObject(doc);
  }

  async findById(id) {
    const doc = await UserModel.findById(id);
    return doc ? this._toObject(doc) : null;
  }

  async findByEmail(email) {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this._toObject(doc) : null;
  }

  async update(id, changes) {
    const doc = await UserModel.findByIdAndUpdate(id, changes, { new: true });
    return doc ? this._toObject(doc) : null;
  }

  async delete(id) {
    await UserModel.findByIdAndDelete(id);
  }

  _toObject(doc) {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      phoneNumber: doc.phoneNumber,
      image: doc.image,
      createdAt: doc.createdAt,
    };
  }
}

module.exports = UserMongoRepository;
