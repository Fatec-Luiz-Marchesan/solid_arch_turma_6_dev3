const LocationModel = require("../models/LocationModel");
const Location = require("../../../../domain/entities/Location");

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
    return this._toEntity(doc);
  }

  async findById(id) {
    const doc = await LocationModel.findById(id);
    return doc ? this._toEntity(doc) : null;
  }

  async findNearby({ latitude, longitude, radiusKm, type } = {}) {
    const query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radiusKm * 1000, // metros
        },
      },
    };
    if (type) query.type = type;

    const docs = await LocationModel.find(query).limit(50);
    return docs.map((d) => this._toEntity(d));
  }

  async delete(id) {
    await LocationModel.findByIdAndDelete(id);
  }

  _toEntity(doc) {
    return new Location({
      id: doc._id.toString(),
      name: doc.name,
      latitude: doc.location.coordinates[1],
      longitude: doc.location.coordinates[0],
      type: doc.type,
      referenceId: doc.referenceId.toString(),
      address: doc.address,
      createdAt: doc.createdAt,
    });
  }
}

module.exports = LocationMongoRepository;
