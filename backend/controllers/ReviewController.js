const { validateReviewPayload } = require("../helpers/validateReview");

class ReviewController {
  constructor({ createReviewUseCase, listReviewsUseCase, getReviewUseCase }) {
    this.createReviewUseCase = createReviewUseCase;
    this.listReviewsUseCase = listReviewsUseCase;
    this.getReviewUseCase = getReviewUseCase;
  }

  async create(req, res) {
    const { valid, errors, data } = validateReviewPayload(req.body);
    if (!valid) {
      return res.status(400).json({ errors });
    }

    try {
      const review = await this.createReviewUseCase.execute(data);
      return res.status(201).json(review);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req, res) {
    try {
      const { page, limit, minRating, petId } = req.query;
      const result = await this.listReviewsUseCase.execute({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        petId,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const review = await this.getReviewUseCase.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review nao encontrada" });
      }
      return res.json(review);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = ReviewController;
