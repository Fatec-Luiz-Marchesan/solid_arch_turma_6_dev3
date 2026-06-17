const BreedModel = require("../../domain/models/BreedModel");

const ALLOWED_SPECIES = ["dog", "cat", "rabbit", "bird", "other"];

class BreedMongoRepository {
  async create(data) {
    const doc = await BreedModel.create(data);
    return { ...doc.toObject(), id: doc._id.toString() };
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.species) {
      const species = String(filters.species);
      if (ALLOWED_SPECIES.includes(species)) {
        query.species = species;
      }
    }
    const docs = await BreedModel.find(query).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString() }));
  }

  async findById(id) {
    const doc = await BreedModel.findById(id).lean();
    return doc ? { ...doc, id: doc._id.toString() } : null;
  }

  async update(id, data) {
    const doc = await BreedModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? { ...doc, id: doc._id.toString() } : null;
  }
}

module.exports = BreedMongoRepository;