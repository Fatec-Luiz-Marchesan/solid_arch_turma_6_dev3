class Review {
  constructor({ id, userId, petId, rating, comment, recommend = true, createdAt }) {
    if (!userId) throw new Error("userId e obrigatorio");
    if (!petId) throw new Error("petId e obrigatorio");
    if (!rating || rating < 1 || rating > 5) throw new Error("rating deve ser entre 1 e 5");
    this.id = id; this.userId = userId; this.petId = petId;
    this.rating = Number(rating); this.comment = comment || "";
    this.recommend = recommend; this.createdAt = createdAt || new Date();
  }
}
module.exports = Review;
