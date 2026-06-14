const router = require("express").Router();
const checkToken = require("../helpers/check-token");
const ReviewController = require("../controllers/ReviewController");
const ReviewRepository = require("../repositories/ReviewRepository");
const { CreateReviewUseCase } = require("../models/CreateReviewUseCase");
const {
  ListReviewsUseCase,
  GetReviewUseCase,
} = require("../models/ListReviewsUseCase");

const reviewRepository = new ReviewRepository();
const createReviewUseCase = new CreateReviewUseCase({ reviewRepository });
const listReviewsUseCase = new ListReviewsUseCase({ reviewRepository });
const getReviewUseCase = new GetReviewUseCase({ reviewRepository });

const controller = new ReviewController({
  createReviewUseCase,
  listReviewsUseCase,
  getReviewUseCase,
});

router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.list(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));

module.exports = router;
