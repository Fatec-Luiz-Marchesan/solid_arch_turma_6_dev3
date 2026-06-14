const Review = require("../models/Review");

class ReviewRepository {
  async findByUserAndPet(userId, petId) {
    return await Review.findOne({ userId, petId });
  }

  async create(data) {
    const review = new Review(data);
    return await review.save();
  }

  async findAll({ page = 1, limit = 20, minRating, petId } = {}) {
    const query = {};
    if (minRating !== undefined && minRating !== null) {
      query.rating = { $gte: Number(minRating) };
    }
    if (petId !== undefined && petId !== null) {
      query.petId = petId;
    }

    const skip = (page - 1) * limit;
    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    return { reviews, total };
  }

  async findById(id) {
    return await Review.findById(id);
  }

  async findByPetId(petId) {
    return await Review.find({ petId }).sort("-createdAt");
  }
}

module.exports = ReviewRepository;
