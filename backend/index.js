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

const {
  getRedisClient,
  closeRedisClient,
} = require("./infrastructure/adapters/cache/redisClient");
const RedisCacheAdapter = require("./infrastructure/adapters/cache/RedisCacheAdapter");
const ListAdminsUseCase = require("./domain/usecases/ListAdminsUseCase");
const redisClient = getRedisClient();
const cacheGateway = new RedisCacheAdapter(redisClient);
const listAdminsUseCase = new ListAdminsUseCase({
  adminRepository,
  cacheGateway,
});

app.use("/pets", PetRoutes);
app.use("/users", UserRoutes);
app.use("/reviews", ReviewRoutes);
app.use("/admins", makeAdminRouter(listAdminsUseCase));

app.listen(5000);

const DietMongoRepository = require("./infrastructure/repositories/DietMongoRepository");
const {
  CreateDietUseCase,
  GetActiveDietForPetUseCase,
  ListDietsUseCase,
  UpdateDietUseCase,
} = require("./domain/usecases/CreateDietUseCase");
const DietController = require("./interface/controllers/DietController");
const makeDietRouter = require("./interface/routes/dietRoutes");

const dietRepository = new DietMongoRepository();
const dietController = new DietController({
  createDietUseCase: new CreateDietUseCase({ dietRepository }),
  listDietsUseCase: new ListDietsUseCase({ dietRepository }),
  getActiveDietForPetUseCase: new GetActiveDietForPetUseCase({
    dietRepository,
  }),
  updateDietUseCase: new UpdateDietUseCase({ dietRepository }),
});

app.use("/api/diets", makeDietRouter(dietController));
