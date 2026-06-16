const express = require('express');
const mongoose = require('mongoose');
const LocalStorageAdapter = require('./infrastructure/adapters/storage/LocalStorageAdapter');
const UploadMongoRepository = require('./infrastructure/repositories/UploadMongoRepository');
const UploadFileUseCase = require('./domain/usecases/UploadFileUseCase');
const UploadController = require('./interface/controllers/UploadController');
const makeUploadRouter = require('./interface/routes/uploadRoutes');
const LocationMongoRepository = require('./infrastructure/repositories/LocationMongoRepository');
const CreateLocationUseCase = require('./domain/usecases/CreateLocationUseCase');
const FindNearbyLocationsUseCase = require('./domain/usecases/FindNearbyLocationsUseCase');
const LocationController = require('./interface/controllers/LocationController');
const makeLocationRouter = require('./interface/routes/locationRoutes');
const http = require('http');
const { initSocketServer } = require('./infrastructure/adapters/socket/socketServer');
const SocketNotificationAdapter = require('./infrastructure/adapters/socket/SocketNotificationAdapter');
const ReviewMongoRepository = require('./infrastructure/repositories/ReviewMongoRepository');
const CreateReviewUseCase = require('./domain/usecases/CreateReviewUseCase');
const ReviewController = require('./interface/controllers/ReviewController');
const makeHealthRouter = require('./interface/routes/healthRoutes');

const app = express();

mongoose.connect('mongodb://localhost:27017/seu_db');

const storageGateway = new LocalStorageAdapter({ uploadDir: './uploads' });
const uploadRepository = new UploadMongoRepository();
const uploadFileUseCase = new UploadFileUseCase({ storageGateway, uploadRepository });
const uploadController = new UploadController({ uploadFileUseCase });
const locationRepository = new LocationMongoRepository();
const createLocationUseCase = new CreateLocationUseCase({ locationRepository });
const findNearbyLocationsUseCase = new FindNearbyLocationsUseCase({ locationRepository });
const locationController = new LocationController({createLocationUseCase, findNearbyLocationsUseCase,});
const httpServer = http.createServer(app);

const io = initSocketServer(httpServer, { corsOrigin: '*' });

const reviewRepository = new ReviewMongoRepository();
const notificationGateway = new SocketNotificationAdapter(io);
const createReviewUseCase = new CreateReviewUseCase({ reviewRepository,notificationGateway,});
const reviewController = new ReviewController(createReviewUseCase);

app.post('/api/reviews', (req, res) => reviewController.create(req, res));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {console.log(`Servidor rodando em http://localhost:${PORT}`);
console.log(`Socket.io aceitando conexoes em ws://localhost:${PORT}`);});

app.use(makeHealthRouter());

app.use('/api/locations', makeLocationRouter(locationController));

app.use('/uploads', express.static('uploads'));

app.use('/api/uploads', makeUploadRouter(uploadController));

app.use(express.json());

module.exports = app;