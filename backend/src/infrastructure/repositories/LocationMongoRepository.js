const LocationModel = require("../database/mongoose/models/LocationModel");
const Location = require("../../domain/entities/Location");

class LocationMongoRepository {
  async create(location) {
    const doc = await LocationModel.create({
      name: location.name,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      type: location.type,
      referenceId: location.referenceId,
      address: location.address,
    });
    return this._toPlain(doc);
  }

  async findById(id) {
    const doc = await LocationModel.findById(id);
    return doc ? this._toPlain(doc) : null;
  }

  async findNearby({ latitude, longitude, radiusKm, type } = {}) {
    const query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radiusKm * 1000,
        },
      },
    };
    if (type) query.type = type;
    const docs = await LocationModel.find(query).limit(50);
    return docs.map((d) => this._toPlain(d));
  }

  async delete(id) {
    await LocationModel.findByIdAndDelete(id);
  }

  _toPlain(doc) {
    return {
      id: doc._id.toString(),
      name: doc.name,
      latitude: doc.location.coordinates[1],
      longitude: doc.location.coordinates[0],
      type: doc.type,
      referenceId: doc.referenceId.toString(),
      address: doc.address,
      createdAt: doc.createdAt,
    };
  }
}

module.exports = LocationMongoRepository;