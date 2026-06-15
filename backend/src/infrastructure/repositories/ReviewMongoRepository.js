const ReviewModel = require("../database/mongoose/models/ReviewModel");
const Review = require("../../domain/entities/Review");
class ReviewMongoRepository {
  async create(review) {
    const doc = await ReviewModel.create({
      userId: review.userId,
      petId: review.petId,
      rating: review.rating,
      comment: review.comment,
    });
    return this._toEntity(doc);
  }
  async findById(id) {
    const doc = await ReviewModel.findById(id);
    return doc ? this._toEntity(doc) : null;
  }
  async findByUserAndPet(userId, petId) {
    const doc = await ReviewModel.findOne({ userId, petId });
    return doc ? this._toEntity(doc) : null;
  }
  async findAll({ petId, page = 1, limit = 20, minRating } = {}) {
    const query = {};
    if (petId) query.petId = petId;
    if (minRating) query.rating = { $gte: minRating };
    const [reviews, total] = await Promise.all([
      ReviewModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ReviewModel.countDocuments(query),
    ]);
    return { reviews: reviews.map((d) => this._toEntity(d)), total };
  }
  async delete(id) {
    await ReviewModel.findByIdAndDelete(id);
  }
  _toEntity(doc) {
    return new Review({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      petId: doc.petId.toString(),
      rating: doc.rating,
      comment: doc.comment,
      createdAt: doc.createdAt,
    });
  }
}
module.exports = ReviewMongoRepository;
