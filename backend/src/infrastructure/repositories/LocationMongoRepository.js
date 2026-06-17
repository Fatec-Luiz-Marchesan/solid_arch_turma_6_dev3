const LocationModel = require("../../domain/models/LocationModel");
class LocationMongoRepository {
  async create(data) {
    const doc = await LocationModel.create({
      name: data.name,
      location: { type: "Point", coordinates: [data.longitude, data.latitude] },
      type: data.type,
      referenceId: data.referenceId,
    });
    return this._toPlain(doc);
  }
  async findNearby({ latitude, longitude, radiusKm = 5, type }) {
    const query = { location: { $near: { $geometry: { type: "Point", coordinates: [longitude, latitude] }, $maxDistance: radiusKm * 1000 } } };
    if (type) query.type = type;
    const docs = await LocationModel.find(query).limit(50);
    return docs.map((d) => this._toPlain(d));
  }
  _toPlain(doc) {
    return { id: doc._id.toString(), name: doc.name, latitude: doc.location.coordinates[1], longitude: doc.location.coordinates[0], type: doc.type, referenceId: doc.referenceId ? doc.referenceId.toString() : null, createdAt: doc.createdAt };
  }
}
module.exports = LocationMongoRepository;