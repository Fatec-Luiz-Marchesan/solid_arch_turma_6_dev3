class CreateReviewUseCase {
  constructor({ reviewRepository } = {}) {
    if (!reviewRepository) {
      throw new Error('reviewRepository e obrigatorio')
    }
    this.reviewRepository = reviewRepository
  }

  async execute({ userId, petId, rating, comment, recommend } = {}) {
    if (!userId) {
      throw new Error('userId e obrigatorio')
    }
    if (!petId) {
      throw new Error('petId e obrigatorio')
    }
    if (rating === undefined || rating === null) {
      throw new Error('rating e obrigatorio')
    }
    const rNum = Number(rating)
    if (Number.isNaN(rNum) || rNum < 1 || rNum > 5) {
      throw new Error('rating deve ser entre 1 e 5')
    }

    const existing = await this.reviewRepository.findByUserAndPet(userId, petId)
    if (existing) {
      throw new Error('usuario ja avaliou este pet')
    }

    const recommendVal = recommend !== undefined ? recommend : true

    return await this.reviewRepository.create({
      userId,
      petId,
      rating: rNum,
      comment,
      recommend: recommendVal
    })
  }
}

module.exports = { CreateReviewUseCase }
