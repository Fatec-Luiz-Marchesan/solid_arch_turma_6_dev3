class CreateReviewUseCase {
  constructor({ reviewRepository, notificationGateway }) {
    this.reviewRepository = reviewRepository;
    this.notificationGateway = notificationGateway;
  }

  async execute({ userId, petId, rating, comment }) {
    if (!userId || !petId) throw new Error('userId e petId sao obrigatorios');
    if (rating < 1 || rating > 5) throw new Error('rating deve ser entre 1 e 5');

    const review = await this.reviewRepository.create({
      userId,
      petId,
      rating,
      comment,
      createdAt: new Date(),
    });

    this.notificationGateway.emit('review:created', {
      reviewId: review.id,
      petId: review.petId,
      rating: review.rating,
    });

    return review;
  }
}

module.exports = CreateReviewUseCase;