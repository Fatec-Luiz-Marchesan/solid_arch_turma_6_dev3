class ListReviewsUseCase {
  constructor({ reviewRepository } = {}) {
    if (!reviewRepository) {
      throw new Error("reviewRepository e obrigatorio");
    }
    this.reviewRepository = reviewRepository;
  }

  async execute({ page = 1, limit = 20, minRating, petId } = {}) {
    const p = Number(page);
    const l = Number(limit);

    if (l < 1 || l > 100) {
      throw new Error("limit deve ser entre 1 e 100");
    }

    const { reviews, total } = await this.reviewRepository.findAll({
      page: p,
      limit: l,
      minRating,
      petId,
    });

    const totalPages = Math.ceil(total / l);

    return {
      reviews,
      total,
      totalPages: totalPages || 1,
    };
  }
}

class GetReviewUseCase {
  constructor({ reviewRepository } = {}) {
    if (!reviewRepository) {
      throw new Error("reviewRepository e obrigatorio");
    }
    this.reviewRepository = reviewRepository;
  }

  async findById(id) {
    if (!id) {
      throw new Error("id e obrigatorio");
    }
    return await this.reviewRepository.findById(id);
  }

  async findByPetId(petId) {
    if (!petId) {
      throw new Error("petId e obrigatorio");
    }
    return await this.reviewRepository.findByPetId(petId);
  }
}

module.exports = { ListReviewsUseCase, GetReviewUseCase };
