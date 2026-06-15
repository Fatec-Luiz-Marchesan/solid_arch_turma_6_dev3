const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static("public"));

const PetRoutes = require("./routers/PetRouters");
const UserRoutes = require("./routers/UserRouters");
const ReviewRoutes = require("./routers/ReviewRouters");
const reviewRepository = new ReviewMongoRepository();
const createReviewUseCase = new CreateReviewUseCase({ reviewRepository });
const listReviewsUseCase = new ListReviewsUseCase({ reviewRepository });
const getReviewUseCase = new GetReviewUseCase({ reviewRepository });
const deleteReviewUseCase = new DeleteReviewUseCase({ reviewRepository });

const reviewController = new ReviewController({
  createReviewUseCase,
  listReviewsUseCase,
  getReviewUseCase,
  deleteReviewUseCase,
});

app.use("/pets", PetRoutes);
app.use("/users", UserRoutes);
app.use("/reviews", ReviewRoutes);
app.use("/reviews", makeReviewRouter(reviewController));

app.listen(5000);
