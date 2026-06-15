const DietModel = require("../database/mongoose/models/DietModel");
const Diet = require("../../domain/entities/Diet");

class DietMongoRepository {
  async create(diet) {
    const doc = await DietModel.create({
      petId: diet.petId,
      vetId: diet.vetId,
      type: diet.type,
      dailyCalories: diet.dailyCalories,
      restrictions: diet.restrictions,
      mealsPerDay: diet.mealsPerDay,
      notes: diet.notes,
      startDate: diet.startDate,
      endDate: diet.endDate,
      frequency: diet.frequency,
      targetWeight: diet.targetWeight,
    });
    return this._toEntity(doc);
  }

  async findById(id) {
    const doc = await DietModel.findById(id);
    return doc ? this._toEntity(doc) : null;
  }

  async findByPetId(petId) {
    const docs = await DietModel.find({ petId }).sort({ startDate: -1 });
    return docs.map((d) => this._toEntity(d));
  }

  async findAll({ petId, type, page = 1, limit = 20 } = {}) {
    const query = {};
    if (petId) query.petId = petId;
    if (type) query.type = type;
    const [diets, total] = await Promise.all([
      DietModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      DietModel.countDocuments(query),
    ]);
    return {
      diets: diets.map((d) => this._toEntity(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id, diet) {
    const doc = await DietModel.findByIdAndUpdate(
      id,
      {
        type: diet.type,
        dailyCalories: diet.dailyCalories,
        restrictions: diet.restrictions,
        mealsPerDay: diet.mealsPerDay,
        notes: diet.notes,
        endDate: diet.endDate,
        frequency: diet.frequency,
        targetWeight: diet.targetWeight,
      },
      { new: true },
    );
    return doc ? this._toEntity(doc) : null;
  }

  async delete(id) {
    await DietModel.findByIdAndDelete(id);
  }

  _toEntity(doc) {
    return new Diet({
      id: doc._id.toString(),
      petId: doc.petId.toString(),
      vetId: doc.vetId.toString(),
      type: doc.type,
      dailyCalories: doc.dailyCalories,
      restrictions: doc.restrictions,
      mealsPerDay: doc.mealsPerDay,
      notes: doc.notes,
      startDate: doc.startDate,
      endDate: doc.endDate,
      frequency: doc.frequency,
      targetWeight: doc.targetWeight,
    });
  }
}

module.exports = DietMongoRepository;
