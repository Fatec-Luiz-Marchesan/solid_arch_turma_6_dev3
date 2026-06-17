class CreateReviewUseCase {
  constructor({ reviewRepository, notificationGateway }) {
    if (!reviewRepository) throw new Error("reviewRepository e obrigatorio");
    if (!notificationGateway) throw new Error("notificationGateway e obrigatorio");
    this.reviewRepository = reviewRepository;
    this.notificationGateway = notificationGateway;
  }

  async execute({ userId, petId, rating, comment, recommend }) {
    if (!userId) throw new Error("userId e obrigatorio");
    if (!petId) throw new Error("petId e obrigatorio");
    const rNum = Number(rating);
    if (Number.isNaN(rNum) || rNum < 1 || rNum > 5)
      throw new Error("rating deve ser entre 1 e 5");

    if (this.reviewRepository.findByUserAndPet) {
      const existing = await this.reviewRepository.findByUserAndPet(userId, petId);
      if (existing) throw new Error("usuario ja avaliou este pet");
    }

    const saved = await this.reviewRepository.create({
      userId, petId, rating: rNum,
      comment: comment || "",
      recommend: recommend !== undefined ? recommend : true,
      createdAt: new Date(),
    });

    this.notificationGateway.emit("review:created", {
      reviewId: saved.id,
      petId: saved.petId,
      userId: saved.userId,
      rating: saved.rating,
    });

    return saved;
  }
}

module.exports = CreateReviewUseCase;
