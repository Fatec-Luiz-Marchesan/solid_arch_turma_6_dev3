const express = require("express");
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

try {
  const ReviewMongoRepository = require("./infrastructure/repositories/ReviewMongoRepository");
  const CreateReviewUseCase = require("./domain/usecases/CreateReviewUseCase");
  const { ListReviewsUseCase, GetReviewUseCase } = require("./domain/models/ListReviewsUseCase");
  const ReviewController = require("./interface/controllers/ReviewController");
  const r = new ReviewMongoRepository();
  const rc = new ReviewController({
    createReviewUseCase: new CreateReviewUseCase({ reviewRepository: r, notificationGateway: { emit: () => {} } }),
    listReviewsUseCase: new ListReviewsUseCase({ reviewRepository: r }),
    getReviewUseCase: new GetReviewUseCase({ reviewRepository: r }),
  });
  app.post("/api/reviews", (req, res) => rc.create(req, res));
  app.get("/api/reviews", (req, res) => rc.list(req, res));
  app.get("/api/reviews/:id", (req, res) => rc.getById(req, res));
} catch (e) {}

try {
  const LocationMongoRepository = require("./infrastructure/repositories/LocationMongoRepository");
  const CreateLocationUseCase = require("./domain/usecases/CreateLocationUseCase");
  const FindNearbyLocationsUseCase = require("./domain/usecases/FindNearbyLocationsUseCase");
  const LocationController = require("./interface/controllers/LocationController");
  const makeLocationRouter = require("./interface/routes/locationRoutes");
  const lr = new LocationMongoRepository();
  app.use("/api/locations", makeLocationRouter(new LocationController({
    createLocationUseCase: new CreateLocationUseCase({ locationRepository: lr }),
    findNearbyLocationsUseCase: new FindNearbyLocationsUseCase({ locationRepository: lr }),
  })));
} catch (e) {}

try {
  const NotificationMongoRepository = require("./infrastructure/repositories/NotificationMongoRepository");
  const CreateNotificationUseCase = require("./domain/usecases/CreateNotificationUseCase");
  const ListNotificationsUseCase = require("./domain/usecases/ListNotificationsUseCase");
  const MarkNotificationAsReadUseCase = require("./domain/usecases/MarkNotificationAsReadUseCase");
  const NotificationController = require("./interface/controllers/NotificationController");
  const makeNotificationRouter = require("./interface/routes/notificationRoutes");
  const nr = new NotificationMongoRepository();
  app.use("/api/notifications", makeNotificationRouter(new NotificationController({
    createNotificationUseCase: new CreateNotificationUseCase({ notificationRepository: nr }),
    listNotificationsUseCase: new ListNotificationsUseCase({ notificationRepository: nr }),
    markAsReadUseCase: new MarkNotificationAsReadUseCase({ notificationRepository: nr }),
  })));
} catch (e) {}

try {
  const DietMongoRepository = require("./infrastructure/repositories/DietMongoRepository");
  const { CreateDietUseCase, GetActiveDietForPetUseCase, ListDietsUseCase, UpdateDietUseCase } = require("./domain/usecases/CreateDietUseCase");
  const DietController = require("./interface/controllers/DietController");
  const makeDietRouter = require("./interface/routes/dietRoutes");
  const dr = new DietMongoRepository();
  app.use("/api/diets", makeDietRouter(new DietController({
    createDietUseCase: new CreateDietUseCase({ dietRepository: dr }),
    listDietsUseCase: new ListDietsUseCase({ dietRepository: dr }),
    getActiveDietForPetUseCase: new GetActiveDietForPetUseCase({ dietRepository: dr }),
    updateDietUseCase: new UpdateDietUseCase({ dietRepository: dr }),
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
  const br = new BreedMongoRepository();
  const bc = new BreedController({
    createBreedUseCase: new CreateBreedUseCase({ breedRepository: br }),
    listBreedsUseCase: new ListBreedsUseCase({ breedRepository: br }),
    getBreedUseCase: new GetBreedUseCase({ breedRepository: br }),
    updateBreedUseCase: new UpdateBreedUseCase({ breedRepository: br }),
  });
  app.post("/api/breeds", (req, res) => bc.create(req, res));
  app.get("/api/breeds", (req, res) => bc.list(req, res));
  app.get("/api/breeds/:id", (req, res) => bc.getById(req, res));
} catch (e) {}

module.exports = app;