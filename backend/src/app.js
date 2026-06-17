const express = require("express");
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

try {
  const ReviewMongoRepository = require("./infrastructure/repositories/ReviewMongoRepository");
  const CreateReviewUseCase = require("./domain/usecases/CreateReviewUseCase");
  const { ListReviewsUseCase, GetReviewUseCase } = require("./domain/models/ListReviewsUseCase");
  const ReviewController = require("./interface/controllers/ReviewController");
  const reviewRepository = new ReviewMongoRepository();
  const reviewController = new ReviewController({
    createReviewUseCase: new CreateReviewUseCase({ reviewRepository, notificationGateway: { emit: () => {} } }),
    listReviewsUseCase: new ListReviewsUseCase({ reviewRepository }),
    getReviewUseCase: new GetReviewUseCase({ reviewRepository }),
  });
  app.post("/api/reviews", (req, res) => reviewController.create(req, res));
  app.get("/api/reviews", (req, res) => reviewController.list(req, res));
  app.get("/api/reviews/:id", (req, res) => reviewController.getById(req, res));
} catch (e) {}

try {
  const LocationMongoRepository = require("./infrastructure/repositories/LocationMongoRepository");
  const CreateLocationUseCase = require("./domain/usecases/CreateLocationUseCase");
  const FindNearbyLocationsUseCase = require("./domain/usecases/FindNearbyLocationsUseCase");
  const LocationController = require("./interface/controllers/LocationController");
  const makeLocationRouter = require("./interface/routes/locationRoutes");
  const locationRepository = new LocationMongoRepository();
  app.use("/api/locations", makeLocationRouter(new LocationController({
    createLocationUseCase: new CreateLocationUseCase({ locationRepository }),
    findNearbyLocationsUseCase: new FindNearbyLocationsUseCase({ locationRepository }),
  })));
} catch (e) {}

try {
  const NotificationMongoRepository = require("./infrastructure/repositories/NotificationMongoRepository");
  const CreateNotificationUseCase = require("./domain/usecases/CreateNotificationUseCase");
  const ListNotificationsUseCase = require("./domain/usecases/ListNotificationsUseCase");
  const MarkNotificationAsReadUseCase = require("./domain/usecases/MarkNotificationAsReadUseCase");
  const NotificationController = require("./interface/controllers/NotificationController");
  const makeNotificationRouter = require("./interface/routes/notificationRoutes");
  const notificationRepository = new NotificationMongoRepository();
  app.use("/api/notifications", makeNotificationRouter(new NotificationController({
    createNotificationUseCase: new CreateNotificationUseCase({ notificationRepository }),
    listNotificationsUseCase: new ListNotificationsUseCase({ notificationRepository }),
    markAsReadUseCase: new MarkNotificationAsReadUseCase({ notificationRepository }),
  })));
} catch (e) {}

try {
  const DietMongoRepository = require("./infrastructure/repositories/DietMongoRepository");
  const { CreateDietUseCase, GetActiveDietForPetUseCase, ListDietsUseCase, UpdateDietUseCase } = require("./domain/usecases/CreateDietUseCase");
  const DietController = require("./interface/controllers/DietController");
  const makeDietRouter = require("./interface/routes/dietRoutes");
  const dietRepository = new DietMongoRepository();
  app.use("/api/diets", makeDietRouter(new DietController({
    createDietUseCase: new CreateDietUseCase({ dietRepository }),
    listDietsUseCase: new ListDietsUseCase({ dietRepository }),
    getActiveDietForPetUseCase: new GetActiveDietForPetUseCase({ dietRepository }),
    updateDietUseCase: new UpdateDietUseCase({ dietRepository }),
  })));
} catch (e) {}

try {
  const LocalStorageAdapter = require("./infrastructure/adapters/storage/LocalStorageAdapter");
  const UploadMongoRepository = require("./infrastructure/repositories/UploadMongoRepository");
  const UploadFileUseCase = require("./domain/usecases/UploadFileUseCase");
  const UploadController = require("./interface/controllers/UploadController");
  const makeUploadRouter = require("./interface/routes/uploadRoutes");
  app.use("/api/uploads", makeUploadRouter(new UploadController({
    uploadFileUseCase: new UploadFileUseCase({
      storageGateway: new LocalStorageAdapter({ uploadDir: "./uploads" }),
      uploadRepository: new UploadMongoRepository(),
    }),
  })));
} catch (e) {}

try {
  const BreedMongoRepository = require("./infrastructure/repositories/BreedMongoRepository");
  const { CreateBreedUseCase, ListBreedsUseCase, GetBreedUseCase, UpdateBreedUseCase } = require("./domain/usecases/CreateBreedUseCase");
  const BreedController = require("./interface/controllers/BreedController");
  const breedRepository = new BreedMongoRepository();
  const breedController = new BreedController({
    createBreedUseCase: new CreateBreedUseCase({ breedRepository }),
    listBreedsUseCase: new ListBreedsUseCase({ breedRepository }),
    getBreedUseCase: new GetBreedUseCase({ breedRepository }),
    updateBreedUseCase: new UpdateBreedUseCase({ breedRepository }),
  });
  app.post("/api/breeds", (req, res) => breedController.create(req, res));
  app.get("/api/breeds", (req, res) => breedController.list(req, res));
  app.get("/api/breeds/:id", (req, res) => breedController.getById(req, res));
  app.put("/api/breeds/:id", (req, res) => breedController.update(req, res));
} catch (e) {}

module.exports = app;