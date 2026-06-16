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

const UserMongoRepository = require("./src/infrastructure/repositories/UserMongoRepository");
const BcryptHashAdapter = require("./src/infrastructure/adapters/auth/BcryptHashAdapter");
const CreateUserUseCase = require("./src/domain/usecases/CreateUserUseCase");
const GetUserUseCase = require("./src/domain/usecases/GetUserUseCase");
const UpdateUserUseCase = require("./src/domain/usecases/UpdateUserUseCase");
const DeleteUserUseCase = require("./src/domain/usecases/DeleteUserUseCase");
const NewUserController = require("./src/interface/controllers/UserController");
const makeUserRouter = require("./src/interface/routes/userRoutes");

const userRepository = new UserMongoRepository();
const hashGateway = new BcryptHashAdapter();
const newUserController = new NewUserController({
  createUserUseCase: new CreateUserUseCase({ userRepository, hashGateway }),
  getUserUseCase: new GetUserUseCase({ userRepository }),
  updateUserUseCase: new UpdateUserUseCase({ userRepository, hashGateway }),
  deleteUserUseCase: new DeleteUserUseCase({ userRepository }),
});

app.use("/pets", PetRoutes);
app.use("/users", UserRoutes);
app.use("/reviews", ReviewRoutes);
app.use("/admins", makeAdminRouter(listAdminsUseCase));
app.use("/api/diets", makeDietRouter(dietController));
app.use("/api/users", makeUserRouter(newUserController));
app.use("/uploads", express.static("uploads"));

app.listen(5000);

const winstonLogger = require("./infrastructure/adapters/logger/winstonLogger");
const WinstonLoggerAdapter = require("./infrastructure/adapters/logger/WinstonLoggerAdapter");
const AdoptionMongoRepository = require("./infrastructure/repositories/AdoptionMongoRepository");
const CreateAdoptionUseCase = require("./domain/usecases/CreateAdoptionUseCase");
const AdoptionController = require("./interface/controllers/AdoptionController");
const makeAdoptionRouter = require("./interface/routes/adoptionRoutes");

const logger = new WinstonLoggerAdapter(winstonLogger);

const adoptionRepository = new AdoptionMongoRepository();
const createAdoptionUseCase = new CreateAdoptionUseCase({
  adoptionRepository,
  logger,
});
const adoptionController = new AdoptionController({ createAdoptionUseCase });
app.use("/api/adoptions", makeAdoptionRouter(adoptionController));
